import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { startServiceFixture } from './service-fixture';
import {
  createDraft,
  listDrafts,
  readDraft,
  saveDraft,
  storeImage,
} from '../../src/lib/writing/storage';
import {
  importPost,
  previewDocument,
  publishDraft,
  refreshPublishedPost,
} from '../../src/lib/writing/publishing';
import { deploymentStatus } from '../../src/lib/writing/github';
import { draftContent } from '../../src/lib/writing/schema';

let fixture: Awaited<ReturnType<typeof startServiceFixture>>;
beforeAll(async () => {
  fixture = await startServiceFixture();
  Object.assign(process.env, fixture.env);
});
afterAll(async () => fixture.close());
beforeEach(() => fixture.reset());

async function newPost() {
  return createDraft({
    content: {
      title: 'A new thought',
      slug: 'a-new-thought',
      date: '',
      tags: ['writing'],
      columns: 3,
      markdown: 'A paragraph with **bold text**.',
    },
  });
}

function publishedFile(path: string) {
  const commit = fixture.commits.get(fixture.head);
  const file = fixture.trees
    .get(commit?.tree.sha ?? '')
    ?.find((file) => file.path === path);
  return fixture.blobs.get(file?.sha ?? '');
}

describe('private drafts and publication', () => {
  it('saves drafts and snapshots without changing Git or public objects', async () => {
    const head = fixture.head;
    const saved = await newPost();
    const next = await saveDraft({
      id: saved.draft.id,
      etag: saved.etag,
      content: {
        ...draftContent({ draft: saved.draft }),
        markdown: 'A private revision.',
      },
    });
    expect((await readDraft({ id: saved.draft.id })).draft.markdown).toBe(
      'A private revision.'
    );
    expect(next.etag).not.toBe(saved.etag);
    expect(await listDrafts()).toHaveLength(1);
    expect(
      Array.from(fixture.objects.keys()).filter((key) =>
        key.startsWith('private/history/')
      )
    ).toHaveLength(2);
    expect(
      Array.from(fixture.objects.keys()).some((key) =>
        key.startsWith('public/')
      )
    ).toBe(false);
    expect(fixture.head).toBe(head);
  });

  it('rejects stale saves and does not lose the newest text', async () => {
    const saved = await newPost();
    const input = {
      id: saved.draft.id,
      etag: saved.etag,
      content: draftContent({ draft: saved.draft }),
    };
    await saveDraft({
      ...input,
      content: { ...input.content, markdown: 'Newer text' },
    });
    await expect(
      saveDraft({
        ...input,
        content: { ...input.content, markdown: 'Stale text' },
      })
    ).rejects.toMatchObject({ status: 409 });
    expect((await readDraft({ id: saved.draft.id })).draft.markdown).toBe(
      'Newer text'
    );
  });

  it('publishes one atomic content commit, promotes images, and updates llms.txt', async () => {
    const first = await newPost();
    const image = randomUUID();
    const key = `images/${first.draft.id}/${image}.webp`;
    await storeImage({ key, body: Buffer.from('fixture-image') });
    const saved = await saveDraft({
      id: first.draft.id,
      etag: first.etag,
      content: {
        ...draftContent({ draft: first.draft }),
        markdown: `Hello\n\n<MagazineImage src="/api/write/${key}" alt="a bird" caption="A caption" />`,
      },
    });
    const result = await publishDraft({ id: saved.draft.id, etag: saved.etag });
    const post = publishedFile('public/blog/a-new-thought.mdx');
    expect(post).toContain(`${fixture.origin}/public/${key}`);
    expect(post).not.toContain('/api/write/');
    expect(fixture.objects.has(`public/${key}`)).toBe(true);
    expect(publishedFile('public/llms.txt')).toContain('Blog: A new thought');
    expect(publishedFile('public/llms.txt')?.match(/^Blog: /gm)).toHaveLength(
      13
    );
    expect(result.draft.publication?.revision).toBe(saved.draft.revision);
    expect(result.draft.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(
      await deploymentStatus({ sha: fixture.head, slug: result.draft.slug })
    ).toMatchObject({ state: 'success' });
  });

  it('does not create duplicate commits when retrying the same revision', async () => {
    const saved = await newPost();
    const published = await publishDraft({
      id: saved.draft.id,
      etag: saved.etag,
    });
    const count = fixture.commits.size;
    const repeated = await publishDraft({
      id: saved.draft.id,
      etag: published.etag,
    });
    expect(repeated.draft.publication?.commitSha).toBe(
      published.draft.publication?.commitSha
    );
    expect(fixture.commits.size).toBe(count);
  });

  it('recovers a committed publication after its R2 status write fails', async () => {
    const saved = await newPost();
    fixture.failDraftWrites();
    await expect(
      publishDraft({ id: saved.draft.id, etag: saved.etag })
    ).rejects.toBeDefined();
    expect(publishedFile('public/blog/a-new-thought.mdx')).toContain(
      'A new thought'
    );
    expect(
      (await readDraft({ id: saved.draft.id })).draft.publication
    ).toBeNull();
    const commits = fixture.commits.size;
    const recovered = await publishDraft({
      id: saved.draft.id,
      etag: saved.etag,
    });
    expect(recovered.draft.publication?.commitSha).toBe(fixture.head);
    expect(fixture.commits.size).toBe(commits);
  });

  it('keeps changes to a published post private until publishing again', async () => {
    const saved = await newPost();
    const published = await publishDraft({
      id: saved.draft.id,
      etag: saved.etag,
    });
    const next = await saveDraft({
      id: saved.draft.id,
      etag: published.etag,
      content: {
        ...draftContent({ draft: published.draft }),
        markdown: 'Private changes',
      },
    });
    expect(publishedFile('public/blog/a-new-thought.mdx')).not.toContain(
      'Private changes'
    );
    expect(next.draft.revision).not.toBe(next.draft.publication?.revision);
    await expect(
      saveDraft({
        id: saved.draft.id,
        etag: next.etag,
        content: {
          ...draftContent({ draft: next.draft }),
          slug: 'changed-url',
        },
      })
    ).rejects.toThrow('cannot be changed');
    await publishDraft({ id: saved.draft.id, etag: next.etag });
    expect(publishedFile('public/blog/a-new-thought.mdx')).toContain(
      'Private changes'
    );
  });

  it('preserves existing filenames and prevents external edits from being overwritten', async () => {
    const first = await importPost({
      slug: '2026-01-09-note_to_self_for_2026',
    });
    const again = await importPost({ slug: first.draft.slug });
    expect(again.draft.id).toBe(first.draft.id);
    expect(first.draft.publication?.path).toBe(
      'public/blog/2026-01-09 Note_to_self_for_2026.mdx'
    );
    const changed = await saveDraft({
      id: first.draft.id,
      etag: first.etag,
      content: {
        ...draftContent({ draft: first.draft }),
        title: 'An edited title',
      },
    });
    const tree = fixture.trees.get(
      fixture.commits.get(fixture.head)?.tree.sha ?? ''
    );
    const file = tree?.find(
      (item) => item.path === first.draft.publication?.path
    );
    if (!file) throw new Error('Fixture post missing');
    const nextSha = 'a'.repeat(40);
    fixture.blobs.set(
      nextSha,
      `${fixture.blobs.get(file.sha)}\nAn external edit.\n`
    );
    file.sha = nextSha;
    await expect(
      publishDraft({ id: first.draft.id, etag: changed.etag })
    ).rejects.toMatchObject({ status: 409 });
    const refreshed = await refreshPublishedPost({
      id: first.draft.id,
      etag: changed.etag,
    });
    expect(refreshed.draft.markdown).toContain('An external edit.');
    expect(refreshed.draft.publication?.fileSha).toBe(nextSha);
    expect(refreshed.draft.revision).toBe(
      refreshed.draft.publication?.revision
    );
  });

  it('does not mark a refused Git update as published', async () => {
    const saved = await newPost();
    fixture.failRef();
    await expect(
      publishDraft({ id: saved.draft.id, etag: saved.etag })
    ).rejects.toMatchObject({ status: 409 });
    expect(
      (await readDraft({ id: saved.draft.id })).draft.publication
    ).toBeNull();
    expect(publishedFile('public/blog/a-new-thought.mdx')).toBeUndefined();
    await expect(
      publishDraft({ id: saved.draft.id, etag: saved.etag })
    ).resolves.toBeDefined();
  });

  it('rejects missing uploads and executable MDX before a content commit', async () => {
    const saved = await newPost();
    const next = await saveDraft({
      id: saved.draft.id,
      etag: saved.etag,
      content: {
        ...draftContent({ draft: saved.draft }),
        markdown: `![](/api/write/images/${saved.draft.id}/${randomUUID()}.webp)`,
      },
    });
    await expect(
      publishDraft({ id: next.draft.id, etag: next.etag })
    ).rejects.toMatchObject({ status: 404 });
    await expect(
      previewDocument({ markdown: '{process.env.SECRET}' })
    ).rejects.toMatchObject({ status: 400 });
    expect(fixture.commits.size).toBe(1);
  });

  it('reports failed and unknown deployment status without claiming the post is live', async () => {
    fixture.setStatus('failure');
    expect(
      await deploymentStatus({ sha: fixture.head, slug: 'example' })
    ).toMatchObject({ state: 'failure' });
    fixture.setStatus('unknown');
    expect(
      await deploymentStatus({ sha: fixture.head, slug: 'example' })
    ).toMatchObject({ state: 'unknown' });
  });
});
