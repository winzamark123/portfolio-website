import { z } from 'zod';
import { readJson, withWriter, WritingError } from '@/lib/writing/http';
import { publishDraft } from '@/lib/writing/publishing';
import { readDraft } from '@/lib/writing/storage';
import { deploymentStatus } from '@/lib/writing/github';
import { idSchema } from '@/lib/writing/schema';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
        await publishDraft({ id: idSchema.parse(params.id), etag })
      );
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withWriter({
    request,
    action: async () => {
      const { draft } = await readDraft({ id: idSchema.parse(params.id) });
      if (!draft.publication)
        throw new WritingError('This post has not been published.', 404);
      return Response.json(
        await deploymentStatus({
          sha: draft.publication.commitSha,
          slug: draft.slug,
        })
      );
    },
  });
}
