import { z } from 'zod';
import { readJson, withWriter } from '@/lib/writing/http';
import { createDraft, listDrafts } from '@/lib/writing/storage';
import { draftListSchema, slugSchema } from '@/lib/writing/schema';
import { importPost } from '@/lib/writing/publishing';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return withWriter({
    request,
    action: async () =>
      Response.json(draftListSchema.parse(await listDrafts())),
  });
}

export async function POST(request: Request) {
  return withWriter({
    request,
    action: async () => {
      const { slug } = z
        .object({ slug: slugSchema.optional() })
        .parse(await readJson({ request }));
      return Response.json(
        slug ? await importPost({ slug }) : await createDraft({})
      );
    },
  });
}
