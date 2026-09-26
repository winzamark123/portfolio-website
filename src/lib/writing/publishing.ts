import 'server-only';
import { randomUUID } from 'node:crypto';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import { writingConfig } from './config';
import {
  commitFiles,
  fileCommit,
  readGitFile,
  repositorySnapshot,
} from './github';
import { WritingError } from './http';
import {
  createDraft,
  listDrafts,
  publishImage,
  readDraft,
  writeDraft,
} from './storage';
import {
  documentImages,
  normalizeDocument,
  parsePost,
  replaceImageUrls,
  updateMachineBlogs,
} from './content';
import { contentSchema, postSlug, slugify, type Draft } from './schema';
import { serializePost } from './post-format';

export async function previewDocument({ markdown }: { markdown: string }) {
  try {
    const safeMarkdown = normalizeDocument({ markdown });
    return await serialize(safeMarkdown, {
      mdxOptions: { remarkPlugins: [remarkGfm] },
    });
  } catch (error) {
    throw new WritingError(
      error instanceof Error
        ? error.message
        : 'This document cannot be previewed.'
    );
  }
}

export async function importPost({ slug }: { slug: string }) {
  const drafts = await listDrafts();
  const existing = drafts.find(
    (draft) => draft.slug === slug && draft.publication
  );
  if (existing) return readDraft({ id: existing.id });
  const snapshot = await repositorySnapshot();
  for (const file of snapshot.files.filter(
    (item) =>
      /^public\/blog\/[^/]+\.mdx?$/.test(item.path) &&
      postSlug({ filename: item.path.slice('public/blog/'.length) }) === slug
  )) {
    const filename = file.path.slice('public/blog/'.length);
    const post = parsePost({
      source: await readGitFile({ sha: file.sha }),
      filename,
    });
    await previewDocument({ markdown: post.markdown });
    return createDraft({
      content: contentSchema.parse(post),
      publication: {
        path: file.path,
        fileSha: file.sha,
        commitSha: await fileCommit({ path: file.path }),
        publishedAt: new Date().toISOString(),
      },
    });
  }
  throw new WritingError('The published post was not found.', 404);
}

export async function refreshPublishedPost({
  id,
  etag,
}: {
  id: string;
  etag: string;
}) {
  const saved = await readDraft({ id });
  if (!saved.draft.publication || saved.etag !== etag)
    throw new WritingError(
      'Save or reload the draft before replacing it with the published version.',
      409
    );
  const snapshot = await repositorySnapshot();
  const file = snapshot.files.find(
    (item) => item.path === saved.draft.publication?.path
  );
  if (!file)
    throw new WritingError('The published file no longer exists.', 404);
  const post = parsePost({
    source: await readGitFile({ sha: file.sha }),
    filename: file.path.slice('public/blog/'.length),
  });
  await previewDocument({ markdown: post.markdown });
  const revision = randomUUID();
  return writeDraft({
    etag,
    draft: {
      ...saved.draft,
      ...contentSchema.parse(post),
      revision,
      updatedAt: new Date().toISOString(),
      publication: {
        path: file.path,
        fileSha: file.sha,
        commitSha: await fileCommit({ path: file.path }),
        revision,
        publishedAt: new Date().toISOString(),
      },
    },
  });
}

async function recordPublication({
  id,
  publication,
  slug,
  date,
}: {
  id: string;
  publication: NonNullable<Draft['publication']>;
  slug: string;
  date: string;
}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const latest = await readDraft({ id });
    try {
      return await writeDraft({
        etag: latest.etag,
        draft: {
          ...latest.draft,
          slug,
          date: latest.draft.date || date,
          publication,
        },
      });
    } catch (error) {
      if (!(error instanceof WritingError && error.status === 409)) throw error;
    }
  }
  throw new WritingError(
    'The post was committed, but its draft status could not be saved. Retry publishing to recover it.',
    409
  );
}

export async function publishDraft({ id, etag }: { id: string; etag: string }) {
  const saved = await readDraft({ id });
  if (saved.etag !== etag)
    throw new WritingError(
      'The draft changed. Save or reload before publishing.',
      409
    );
  const draft = saved.draft;
  const content = contentSchema.parse({
    ...draft,
    title: draft.title.trim(),
    slug: draft.slug || slugify({ title: draft.title }),
    date: draft.date || new Date().toISOString().slice(0, 10),
  });
  if (
    !content.title ||
    content.title === 'Untitled' ||
    !content.slug ||
    !content.markdown.trim()
  ) {
    throw new WritingError(
      'Add a title, URL, and some content before publishing.'
    );
  }
  await previewDocument({ markdown: content.markdown });
  const snapshot = await repositorySnapshot();
  const path = draft.publication?.path ?? `public/blog/${content.slug}.mdx`;
  const posts = await Promise.all(
    snapshot.files
      .filter((file) => /^public\/blog\/[^/]+\.mdx?$/.test(file.path))
      .map(async (file) => ({
        ...file,
        post: parsePost({
          source: await readGitFile({ sha: file.sha }),
          filename: file.path.slice('public/blog/'.length),
        }),
      }))
  );
  const current = posts.find((file) => file.path === path);
  const sameRevision =
    current?.post.writerId === id &&
    current.post.writerRevision === draft.revision;
  if (sameRevision) {
    return recordPublication({
      id,
      slug: content.slug,
      date: current.post.date,
      publication: {
        path,
        fileSha: current.sha,
        commitSha: await fileCommit({ path }),
        revision: draft.revision,
        publishedAt: new Date().toISOString(),
      },
    });
  }
  if (
    (current?.sha ?? null) !== (draft.publication?.fileSha ?? null) ||
    posts.some((file) => file.path !== path && file.post.slug === content.slug)
  ) {
    throw new WritingError(
      'This URL already exists or the published file changed outside the editor. Choose Reload published version to get the latest post, or use a different URL for a new post.',
      409
    );
  }
  const urls = new Map(
    await Promise.all(
      documentImages({ markdown: content.markdown })
        .filter((src) => src.startsWith('/api/write/'))
        .map(async (src) => {
          const image = src.match(
            /^\/api\/write\/images\/([a-f0-9-]+)\/([a-f0-9-]+)\.webp$/
          );
          if (image?.[1] !== id)
            throw new WritingError(
              'A private image does not belong to this draft.'
            );
          const key = `images/${id}/${image[2]}.webp`;
          return [src, await publishImage({ key })] as const;
        })
    )
  );
  content.markdown = replaceImageUrls({ markdown: content.markdown, urls });
  await previewDocument({ markdown: content.markdown });
  const machine = snapshot.files.find(
    (file) => file.path === 'public/llms.txt'
  );
  if (!machine) throw new Error('The machine view file is missing');
  const llms = updateMachineBlogs({
    current: await readGitFile({ sha: machine.sha }),
    posts: [
      ...posts.filter((file) => file.path !== path).map((file) => file.post),
      content,
    ],
    siteUrl: new URL(writingConfig().NEXTAUTH_URL).origin,
  });
  const commit = await commitFiles({
    parent: snapshot.commitSha,
    treeSha: snapshot.treeSha,
    message: `content: publish ${content.title}\n\nWriter-ID: ${id}\nWriter-Revision: ${draft.revision}`,
    files: [
      {
        path,
        content: serializePost({ content, id, revision: draft.revision }),
      },
      { path: 'public/llms.txt', content: llms },
    ],
  });
  const file = commit.files.find((item) => item.path === path);
  if (!file) throw new Error('The publication commit is missing its post');
  return recordPublication({
    id,
    slug: content.slug,
    date: content.date,
    publication: {
      path,
      fileSha: file.sha,
      commitSha: commit.commitSha,
      revision: draft.revision,
      publishedAt: new Date().toISOString(),
    },
  });
}
