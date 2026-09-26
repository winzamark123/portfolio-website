import 'server-only';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { writingConfig } from './config';
import { WritingError } from './http';
import { draftSchema, type Draft, type DraftContent } from './schema';

let client: S3Client | undefined;

function storage() {
  if (client) return client;
  const config = writingConfig();
  client = new S3Client({
    region: 'auto',
    endpoint: config.R2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.R2_ACCESS_KEY_ID,
      secretAccessKey: config.R2_SECRET_ACCESS_KEY,
    },
  });
  return client;
}

export async function readObject({ key }: { key: string }) {
  try {
    return await storage().send(
      new GetObjectCommand({
        Bucket: writingConfig().R2_PRIVATE_BUCKET,
        Key: key,
      })
    );
  } catch (error) {
    if (
      error instanceof S3ServiceException &&
      error.$metadata.httpStatusCode === 404
    ) {
      throw new WritingError('This draft or image was not found.', 404);
    }
    throw error;
  }
}

export async function readDraft({ id }: { id: string }) {
  const object = await readObject({ key: `drafts/${id}.json` });
  const text = await object.Body?.transformToString();
  if (!text || !object.ETag) throw new Error('Invalid draft response');
  return { draft: draftSchema.parse(JSON.parse(text)), etag: object.ETag };
}

export async function writeDraft({
  draft,
  etag,
}: {
  draft: Draft;
  etag?: string;
}) {
  const config = writingConfig();
  const body = JSON.stringify(draftSchema.parse(draft));
  // snapshots are immutable; a failed conditional save must not erase recovery history
  await storage().send(
    new PutObjectCommand({
      Bucket: config.R2_PRIVATE_BUCKET,
      Key: `history/${draft.id}/${draft.updatedAt}-${randomUUID()}.json`,
      Body: body,
      ContentType: 'application/json',
    })
  );
  try {
    const result = await storage().send(
      new PutObjectCommand({
        Bucket: config.R2_PRIVATE_BUCKET,
        Key: `drafts/${draft.id}.json`,
        Body: body,
        ContentType: 'application/json',
        ...(etag ? { IfMatch: etag } : { IfNoneMatch: '*' }),
      })
    );
    if (!result.ETag) throw new Error('Missing draft ETag');
    return { draft, etag: result.ETag };
  } catch (error) {
    if (
      error instanceof S3ServiceException &&
      error.$metadata.httpStatusCode === 412
    ) {
      throw new WritingError(
        'This draft changed in another tab. Reload the saved version or export your local copy.',
        409
      );
    }
    throw error;
  }
}

export async function createDraft({
  content,
  publication = null,
}: {
  content?: DraftContent;
  publication?: Omit<NonNullable<Draft['publication']>, 'revision'> | null;
}) {
  const now = new Date().toISOString();
  const revision = randomUUID();
  return writeDraft({
    draft: {
      title: 'Untitled',
      slug: '',
      date: '',
      tags: [],
      columns: 2,
      markdown: '',
      ...content,
      id: randomUUID(),
      revision,
      createdAt: now,
      updatedAt: now,
      publication: publication ? { ...publication, revision } : null,
    },
  });
}

export async function listDrafts() {
  const ids: string[] = [];
  let token: string | undefined;
  do {
    const result = await storage().send(
      new ListObjectsV2Command({
        Bucket: writingConfig().R2_PRIVATE_BUCKET,
        Prefix: 'drafts/',
        ContinuationToken: token,
      })
    );
    for (const object of result.Contents ?? []) {
      const id = object.Key?.match(/^drafts\/([a-f0-9-]+)\.json$/)?.[1];
      if (id) ids.push(id);
    }
    token = result.NextContinuationToken;
  } while (token);
  const drafts = await Promise.all(
    ids.map(async (id) => (await readDraft({ id })).draft)
  );
  return drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveDraft({
  id,
  content,
  etag,
}: {
  id: string;
  content: DraftContent;
  etag: string;
}) {
  const saved = await readDraft({ id });
  if (saved.etag !== etag)
    throw new WritingError(
      'This draft changed in another tab. Reload the saved version or export your local copy.',
      409
    );
  if (saved.draft.publication && content.slug !== saved.draft.slug) {
    throw new WritingError('The URL of a published post cannot be changed.');
  }
  return writeDraft({
    etag,
    draft: {
      ...saved.draft,
      ...content,
      revision: randomUUID(),
      updatedAt: new Date().toISOString(),
    },
  });
}

export async function storeImage({ key, body }: { key: string; body: Buffer }) {
  try {
    await storage().send(
      new PutObjectCommand({
        Bucket: writingConfig().R2_PRIVATE_BUCKET,
        Key: key,
        Body: body,
        ContentType: 'image/webp',
        IfNoneMatch: '*',
      })
    );
  } catch (error) {
    // retries after a lost response must not overwrite an already stored image
    if (
      !(
        error instanceof S3ServiceException &&
        error.$metadata.httpStatusCode === 412
      )
    )
      throw error;
  }
}

export async function publishImage({ key }: { key: string }) {
  const config = writingConfig();
  try {
    await storage().send(
      new CopyObjectCommand({
        Bucket: config.R2_PUBLIC_BUCKET,
        Key: key,
        CopySource: `${config.R2_PRIVATE_BUCKET}/${key}`,
        MetadataDirective: 'REPLACE',
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );
  } catch (error) {
    if (
      error instanceof S3ServiceException &&
      error.$metadata.httpStatusCode === 404
    ) {
      throw new WritingError(
        'An image upload is missing. Remove it or upload it again before publishing.',
        404
      );
    }
    throw error;
  }
  return `${config.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
}
