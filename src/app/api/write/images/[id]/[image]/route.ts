import sharp from 'sharp';
import { idSchema, MAX_IMAGE_BYTES } from '@/lib/writing/schema';
import { readBody, withWriter, WritingError } from '@/lib/writing/http';
import { readDraft, readObject, storeImage } from '@/lib/writing/storage';

export const dynamic = 'force-dynamic';

function imageKey({ id, image }: { id: string; image: string }) {
  return `images/${idSchema.parse(id)}/${idSchema.parse(image.replace(/\.webp$/, ''))}.webp`;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string; image: string } }
) {
  return withWriter({
    request,
    action: async () => {
      const object = await readObject({ key: imageKey(params) });
      const bytes = await object.Body?.transformToByteArray();
      if (!bytes) throw new WritingError('The image was not found.', 404);
      return new Response(new Uint8Array(bytes), {
        headers: {
          'Content-Type': 'image/webp',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; image: string } }
) {
  return withWriter({
    request,
    action: async () => {
      const key = imageKey(params);
      await readDraft({ id: params.id });
      if (
        !['image/png', 'image/jpeg', 'image/webp'].includes(
          request.headers.get('content-type') ?? ''
        )
      ) {
        throw new WritingError('Choose a PNG, JPEG, or WebP image.');
      }
      const input = await readBody({ request, limit: MAX_IMAGE_BYTES });
      let body: Buffer;
      try {
        const image = sharp(input, { limitInputPixels: 20_000_000 });
        const metadata = await image.metadata();
        if (
          !metadata.format ||
          !['png', 'jpeg', 'webp'].includes(metadata.format) ||
          (metadata.pages ?? 1) > 1
        )
          throw new Error('Unsupported image');
        body = await image
          .rotate()
          .resize({
            width: 2400,
            height: 2400,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 85 })
          .toBuffer();
      } catch {
        throw new WritingError(
          'This image could not be read. Use a still PNG, JPEG, or WebP under 20 megapixels.'
        );
      }
      await storeImage({ key, body });
      return Response.json({
        src: `/api/write/images/${params.id}/${params.image}`,
      });
    },
  });
}
