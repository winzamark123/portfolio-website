import { z } from 'zod';
import { readJson, withWriter } from '@/lib/writing/http';
import { previewDocument } from '@/lib/writing/publishing';
import { contentSchema } from '@/lib/writing/schema';

export async function POST(request: Request) {
  return withWriter({
    request,
    action: async () => {
      const { markdown } = z
        .object({ markdown: contentSchema.shape.markdown })
        .parse(await readJson({ request }));
      return Response.json(await previewDocument({ markdown }));
    },
  });
}
