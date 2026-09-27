import 'server-only';
import { z } from 'zod';

const serviceUrl = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return (
      url.protocol === 'https:' ||
      (url.protocol === 'http:' &&
        ['localhost', '127.0.0.1'].includes(url.hostname))
    );
  });

const configurationSchema = z.object({
  NEXTAUTH_URL: serviceUrl,
  NEXTAUTH_SECRET: z.string().min(32),
  WRITER_GITHUB_ID: z.string().regex(/^\d+$/),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GITHUB_APP_ID: z.string().regex(/^\d+$/),
  GITHUB_APP_PRIVATE_KEY: z.string().min(1),
  GITHUB_INSTALLATION_ID: z.string().regex(/^\d+$/),
  WRITER_REPOSITORY: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
  WRITER_BRANCH: z.string().min(1).default('main'),
  WRITER_COMMIT_NAME: z.string().min(1),
  WRITER_COMMIT_EMAIL: z.string().email(),
  WRITER_VERCEL_CONTEXT: z.string().min(1).default('Vercel'),
  GITHUB_API_URL: serviceUrl.default('https://api.github.com'),
  R2_ENDPOINT: serviceUrl,
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_PRIVATE_BUCKET: z.string().min(1),
  R2_PUBLIC_BUCKET: z.string().min(1),
  R2_PUBLIC_URL: serviceUrl,
});

export function writingConfigured() {
  return configurationSchema.safeParse(process.env).success;
}

export function writingConfig() {
  const result = configurationSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error('Writing is not configured. See docs/writing.md.');
  }
  if (result.data.R2_PRIVATE_BUCKET === result.data.R2_PUBLIC_BUCKET) {
    throw new Error('Drafts and public images must use separate buckets.');
  }
  return result.data;
}
