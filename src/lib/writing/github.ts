import 'server-only';
import { createAppAuth } from '@octokit/auth-app';
import { request } from '@octokit/request';
import { z } from 'zod';
import { writingConfig } from './config';
import { WritingError } from './http';

let authenticate: ReturnType<typeof createAppAuth> | undefined;

const shaSchema = z.string().regex(/^[a-f0-9]{40}$/);
const treeSchema = z.object({
  truncated: z.boolean(),
  tree: z.array(
    z.object({ path: z.string(), type: z.string(), sha: shaSchema })
  ),
});

async function github({
  path,
  method = 'GET',
  body,
}: {
  path: string;
  method?: string;
  body?: unknown;
}) {
  const config = writingConfig();
  authenticate ??= createAppAuth({
    appId: config.GITHUB_APP_ID,
    privateKey: config.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
    installationId: Number(config.GITHUB_INSTALLATION_ID),
    request: request.defaults({ baseUrl: config.GITHUB_API_URL }),
  });
  const { token } = await authenticate({ type: 'installation' });
  const response = await fetch(
    `${config.GITHUB_API_URL}/repos/${config.WRITER_REPOSITORY}/${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
    }
  );
  if (!response.ok) {
    if (response.status === 409 || response.status === 422)
      throw new WritingError(
        'The repository changed while publishing. Retry to use the latest version.',
        409
      );
    throw new Error(`GitHub request failed (${response.status})`);
  }
  const value: unknown = await response.json();
  return value;
}

export async function repositorySnapshot() {
  const branch = encodeURIComponent(writingConfig().WRITER_BRANCH);
  const ref = z
    .object({ object: z.object({ sha: shaSchema }) })
    .parse(await github({ path: `git/ref/heads/${branch}` }));
  const commit = z
    .object({ tree: z.object({ sha: shaSchema }) })
    .parse(await github({ path: `git/commits/${ref.object.sha}` }));
  const tree = treeSchema.parse(
    await github({ path: `git/trees/${commit.tree.sha}?recursive=1` })
  );
  if (tree.truncated)
    throw new Error('The repository tree is too large to publish safely.');
  return {
    commitSha: ref.object.sha,
    treeSha: commit.tree.sha,
    files: tree.tree.filter((item) => item.type === 'blob'),
  };
}

export async function readGitFile({ sha }: { sha: string }) {
  const blob = z
    .object({ content: z.string(), encoding: z.literal('base64') })
    .parse(await github({ path: `git/blobs/${sha}` }));
  return Buffer.from(blob.content, 'base64').toString('utf8');
}

export async function commitFiles({
  parent,
  treeSha,
  files,
  message,
}: {
  parent: string;
  treeSha: string;
  files: { path: string; content: string }[];
  message: string;
}) {
  const tree = z.object({ sha: shaSchema, tree: treeSchema.shape.tree }).parse(
    await github({
      path: 'git/trees',
      method: 'POST',
      body: {
        base_tree: treeSha,
        tree: files.map((file) => ({ ...file, mode: '100644', type: 'blob' })),
      },
    })
  );
  const commit = z.object({ sha: shaSchema }).parse(
    await github({
      path: 'git/commits',
      method: 'POST',
      body: {
        message,
        tree: tree.sha,
        parents: [parent],
        author: {
          name: writingConfig().WRITER_COMMIT_NAME,
          email: writingConfig().WRITER_COMMIT_EMAIL,
        },
      },
    })
  );
  await github({
    path: `git/refs/heads/${encodeURIComponent(writingConfig().WRITER_BRANCH)}`,
    method: 'PATCH',
    body: { sha: commit.sha, force: false },
  });
  return { commitSha: commit.sha, files: tree.tree };
}

export async function fileCommit({ path }: { path: string }) {
  const commits = z.array(z.object({ sha: shaSchema })).parse(
    await github({
      path: `commits?sha=${encodeURIComponent(writingConfig().WRITER_BRANCH)}&path=${encodeURIComponent(path)}&per_page=1`,
    })
  );
  if (!commits[0]) throw new Error('No publication commit found');
  return commits[0].sha;
}

export async function deploymentStatus({
  sha,
  slug,
}: {
  sha: string;
  slug: string;
}) {
  const result = z
    .object({
      statuses: z.array(
        z.object({
          context: z.string(),
          state: z.enum(['pending', 'success', 'failure', 'error']),
        })
      ),
    })
    .parse(await github({ path: `commits/${sha}/status` }));
  const vercel = result.statuses.find(
    (status) => status.context === writingConfig().WRITER_VERCEL_CONTEXT
  );
  const state =
    vercel?.state === 'error' ? 'failure' : (vercel?.state ?? 'unknown');
  return {
    state,
    url: `${new URL(writingConfig().NEXTAUTH_URL).origin}/?tab=blogs&post=${slug}`,
  };
}
