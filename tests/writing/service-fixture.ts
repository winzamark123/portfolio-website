import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import { createHash, generateKeyPairSync, randomUUID } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { z } from 'zod';

const sha = (value: string) => createHash('sha1').update(value).digest('hex');
const blobSha = (value: string) =>
  sha(`blob ${Buffer.byteLength(value)}\0${value}`);
const xml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('"', '&quot;');
type GitFile = { path: string; type: string; sha: string };

export async function startServiceFixture({
  port = 0,
}: { port?: number } = {}) {
  const objects = new Map<
    string,
    { body: Buffer; etag: string; contentType: string }
  >();
  const blobs = new Map<string, string>();
  const trees = new Map<string, GitFile[]>();
  const commits = new Map<
    string,
    { tree: { sha: string }; parents: string[]; message: string }
  >();
  const publications: { path: string; commit: string }[] = [];
  let head = '';
  let failNextRefUpdate = false;
  let failNextDraftWrite = 0;
  let status = 'success';

  function reset() {
    objects.clear();
    blobs.clear();
    trees.clear();
    commits.clear();
    publications.length = 0;
    failNextRefUpdate = false;
    failNextDraftWrite = 0;
    status = 'success';
    const files: GitFile[] = [];
    const paths = [
      ...readdirSync('public/blog')
        .filter((name) => /\.mdx?$/.test(name))
        .map((name) => `public/blog/${name}`),
      'public/llms.txt',
    ];
    for (const path of paths) {
      const content = readFileSync(path, 'utf8');
      const id = blobSha(content);
      blobs.set(id, content);
      files.push({ path, type: 'blob', sha: id });
    }
    const tree = sha(JSON.stringify(files));
    trees.set(tree, files);
    head = sha(`initial-${tree}`);
    commits.set(head, {
      tree: { sha: tree },
      parents: [],
      message: 'Initial fixture',
    });
    files.forEach((file) =>
      publications.push({ path: file.path, commit: head })
    );
  }
  reset();

  function json(response: ServerResponse, body: unknown, code = 200) {
    response.writeHead(code, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(body));
  }

  async function body(request: IncomingMessage) {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks);
  }

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const path = decodeURIComponent(url.pathname);
      if (path === '/health') return json(response, { ok: true });
      if (path === '/control' && request.method === 'POST') {
        const command = z
          .object({
            reset: z.boolean().optional(),
            failRef: z.boolean().optional(),
            failDraft: z.boolean().optional(),
            status: z.string().optional(),
          })
          .parse(JSON.parse((await body(request)).toString()));
        if (command.reset) reset();
        if (command.failRef) failNextRefUpdate = true;
        if (command.failDraft) failNextDraftWrite = 3;
        if (command.status) status = command.status;
        return json(response, { ok: true });
      }
      if (path === '/inspect') {
        const files = trees.get(commits.get(head)?.tree.sha ?? '') ?? [];
        return json(response, {
          head,
          objects: Array.from(objects.keys()),
          files: files.map((file) => ({
            path: file.path,
            content: blobs.get(file.sha),
          })),
          commits: commits.size,
        });
      }
      if (path.startsWith('/private/') || path.startsWith('/public/')) {
        const bucket = path.startsWith('/private/') ? 'private' : 'public';
        const key = path.slice(bucket.length + 2);
        const objectKey = `${bucket}/${key}`;
        if (request.method === 'GET' && url.searchParams.has('list-type')) {
          const prefix = url.searchParams.get('prefix') ?? '';
          const contents = Array.from(objects.entries())
            .filter(([name]) => name.startsWith(`${bucket}/${prefix}`))
            .map(
              ([name, object]) =>
                `<Contents><Key>${xml(name.slice(bucket.length + 1))}</Key><ETag>${xml(object.etag)}</ETag><Size>${object.body.length}</Size></Contents>`
            )
            .join('');
          response.setHeader('Content-Type', 'application/xml');
          return response.end(
            `<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><IsTruncated>false</IsTruncated>${contents}</ListBucketResult>`
          );
        }
        const existing = objects.get(objectKey);
        if (request.method === 'PUT') {
          if (failNextDraftWrite && key.startsWith('drafts/')) {
            failNextDraftWrite -= 1;
            response.writeHead(503);
            return response.end(
              '<Error><Code>ServiceUnavailable</Code></Error>'
            );
          }
          if (
            (request.headers['if-none-match'] === '*' && existing) ||
            (request.headers['if-match'] &&
              request.headers['if-match'] !== existing?.etag)
          ) {
            response.writeHead(412);
            return response.end(
              '<Error><Code>PreconditionFailed</Code></Error>'
            );
          }
          const copySource = request.headers['x-amz-copy-source'];
          const copied =
            typeof copySource === 'string'
              ? objects.get(decodeURIComponent(copySource).replace(/^\//, ''))
              : undefined;
          if (copySource && !copied) {
            response.writeHead(404);
            return response.end('<Error><Code>NoSuchKey</Code></Error>');
          }
          const value = copied?.body ?? (await body(request));
          const etag = `"${sha(value.toString('base64'))}"`;
          objects.set(objectKey, {
            body: value,
            etag,
            contentType: String(
              request.headers['content-type'] ?? 'application/octet-stream'
            ),
          });
          response.setHeader('ETag', etag);
          if (copySource) {
            response.setHeader('Content-Type', 'application/xml');
            return response.end(
              `<CopyObjectResult><ETag>${xml(etag)}</ETag></CopyObjectResult>`
            );
          }
          return response.end();
        }
        if (!existing) {
          response.writeHead(404);
          return response.end('<Error><Code>NoSuchKey</Code></Error>');
        }
        response.writeHead(200, {
          'Content-Type': existing.contentType,
          ETag: existing.etag,
          'Content-Length': existing.body.length,
        });
        return response.end(existing.body);
      }
      if (path === '/app/installations/1/access_tokens')
        return json(
          response,
          {
            token: 'fixture-installation-token',
            expires_at: new Date(Date.now() + 3600_000).toISOString(),
            permissions: {},
            repository_selection: 'selected',
          },
          201
        );
      if (!path.startsWith('/repos/fixture/portfolio/'))
        return json(response, { error: 'Unknown fixture path' }, 404);
      if (request.headers.authorization !== 'Bearer fixture-installation-token')
        return json(response, { error: 'Unauthorized' }, 401);
      const endpoint = path.slice('/repos/fixture/portfolio/'.length);
      if (endpoint === 'git/ref/heads/main')
        return json(response, { object: { sha: head } });
      if (endpoint.startsWith('git/commits/') && request.method === 'GET')
        return json(
          response,
          commits.get(endpoint.slice('git/commits/'.length))
        );
      if (endpoint.startsWith('git/trees/') && request.method === 'GET')
        return json(response, {
          truncated: false,
          tree: trees.get(endpoint.slice('git/trees/'.length)),
        });
      if (endpoint.startsWith('git/blobs/'))
        return json(response, {
          encoding: 'base64',
          content: Buffer.from(
            blobs.get(endpoint.slice('git/blobs/'.length)) ?? ''
          ).toString('base64'),
        });
      if (endpoint === 'git/trees' && request.method === 'POST') {
        const data = z
          .object({
            base_tree: z.string(),
            tree: z.array(z.object({ path: z.string(), content: z.string() })),
          })
          .parse(JSON.parse((await body(request)).toString()));
        const files = [...(trees.get(data.base_tree) ?? [])];
        for (const file of data.tree) {
          const id = blobSha(file.content);
          blobs.set(id, file.content);
          const existing = files.findIndex((item) => item.path === file.path);
          const item = { path: file.path, type: 'blob', sha: id };
          if (existing < 0) files.push(item);
          else files[existing] = item;
        }
        const id = sha(JSON.stringify(files));
        trees.set(id, files);
        return json(response, { sha: id, tree: files }, 201);
      }
      if (endpoint === 'git/commits' && request.method === 'POST') {
        const data = z
          .object({
            tree: z.string(),
            message: z.string(),
            parents: z.array(z.string()),
          })
          .parse(JSON.parse((await body(request)).toString()));
        const id = sha(JSON.stringify(data) + randomUUID());
        commits.set(id, {
          tree: { sha: data.tree },
          parents: data.parents,
          message: data.message,
        });
        return json(response, { sha: id }, 201);
      }
      if (endpoint === 'git/refs/heads/main' && request.method === 'PATCH') {
        const data = z
          .object({ sha: z.string(), force: z.literal(false) })
          .parse(JSON.parse((await body(request)).toString()));
        if (failNextRefUpdate) {
          failNextRefUpdate = false;
          return json(response, { error: 'Concurrent push' }, 422);
        }
        const commit = commits.get(data.sha);
        if (commit?.parents[0] !== head)
          return json(response, { error: 'Not a fast-forward' }, 422);
        const old = trees.get(commits.get(head)?.tree.sha ?? '') ?? [];
        for (const file of trees.get(commit.tree.sha) ?? [])
          if (old.find((item) => item.path === file.path)?.sha !== file.sha)
            publications.unshift({ path: file.path, commit: data.sha });
        head = data.sha;
        return json(response, { object: { sha: head } });
      }
      if (endpoint === 'commits')
        return json(response, [
          {
            sha:
              publications.find(
                (item) => item.path === url.searchParams.get('path')
              )?.commit ?? head,
          },
        ]);
      if (/^commits\/[a-f0-9]+\/status$/.test(endpoint))
        return json(response, {
          statuses:
            status === 'unknown' ? [] : [{ context: 'Vercel', state: status }],
        });
      return json(
        response,
        { error: `Unhandled fixture endpoint: ${endpoint}` },
        404
      );
    } catch (error) {
      console.error('Fixture request failed', error);
      json(response, { error: 'Fixture error' }, 500);
    }
  });
  await new Promise<void>((resolve) =>
    server.listen(port, '127.0.0.1', resolve)
  );
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Fixture failed to listen');
  const origin = `http://127.0.0.1:${address.port}`;
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' },
  });
  const env = {
    NEXTAUTH_URL: 'http://127.0.0.1:3100',
    NEXTAUTH_SECRET: 'isolated-writing-test-secret-not-for-production',
    WRITER_GITHUB_ID: '1234',
    GITHUB_CLIENT_ID: 'fixture',
    GITHUB_CLIENT_SECRET: 'fixture',
    GITHUB_APP_ID: '1',
    GITHUB_APP_PRIVATE_KEY: privateKey,
    GITHUB_INSTALLATION_ID: '1',
    WRITER_REPOSITORY: 'fixture/portfolio',
    WRITER_BRANCH: 'main',
    WRITER_COMMIT_NAME: 'Test writer',
    WRITER_COMMIT_EMAIL: 'writer@example.com',
    GITHUB_API_URL: origin,
    R2_ENDPOINT: origin,
    R2_ACCESS_KEY_ID: 'fixture',
    R2_SECRET_ACCESS_KEY: 'fixture',
    R2_PRIVATE_BUCKET: 'private',
    R2_PUBLIC_BUCKET: 'public',
    R2_PUBLIC_URL: `${origin}/public`,
  };
  return {
    origin,
    env,
    objects,
    blobs,
    trees,
    commits,
    get head() {
      return head;
    },
    reset,
    failRef() {
      failNextRefUpdate = true;
    },
    failDraftWrites() {
      failNextDraftWrite = 3;
    },
    setStatus(value: string) {
      status = value;
    },
    async close() {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      );
    },
  };
}
