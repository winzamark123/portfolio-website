import { z } from 'zod';
import { readJson, withWriter } from '@/lib/writing/http';
import { refreshPublishedPost } from '@/lib/writing/publishing';
import { idSchema } from '@/lib/writing/schema';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withWriter({
    request,
    action: async () => {
      const { etag } = z
        .object({ etag: z.string().min(1) })
        .parse(await readJson({ request }));
      return Response.json(
        await refreshPublishedPost({ id: idSchema.parse(params.id), etag })
      );
    },
  });
}
