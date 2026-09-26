import { readJson, withWriter } from '@/lib/writing/http';
import { readDraft, saveDraft } from '@/lib/writing/storage';
import { idSchema, saveRequestSchema } from '@/lib/writing/schema';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withWriter({
    request,
    action: async () =>
      Response.json(await readDraft({ id: idSchema.parse(params.id) })),
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withWriter({
    request,
    action: async () => {
      const input = saveRequestSchema.parse(await readJson({ request }));
      return Response.json(
        await saveDraft({ id: idSchema.parse(params.id), ...input })
      );
    },
  });
}
