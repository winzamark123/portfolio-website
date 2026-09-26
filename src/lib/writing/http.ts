import 'server-only';
import { z } from 'zod';
import { writerSession } from './auth';
import { MAX_DOCUMENT_BYTES } from './schema';

export class WritingError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

export async function readBody({
  request,
  limit = MAX_DOCUMENT_BYTES * 2,
}: {
  request: Request;
  limit?: number;
}) {
  const reader = request.body?.getReader();
  if (!reader) throw new WritingError('A request body is required.');
  const chunks: Uint8Array[] = [];
  let length = 0;
  let chunk = await reader.read();
  while (!chunk.done) {
    const value = chunk.value;
    length += value.byteLength;
    if (length > limit) {
      await reader.cancel();
      throw new WritingError('This upload or document is too large.', 413);
    }
    chunks.push(value);
    chunk = await reader.read();
  }
  return Buffer.concat(chunks);
}

export async function readJson({ request }: { request: Request }) {
  try {
    const value: unknown = JSON.parse(
      (await readBody({ request })).toString('utf8')
    );
    return value;
  } catch (error) {
    if (error instanceof WritingError) throw error;
    throw new WritingError('The request is not valid JSON.');
  }
}

export async function withWriter({
  request,
  action,
}: {
  request: Request;
  action: () => Promise<Response>;
}) {
  try {
    if (!(await writerSession())) {
      throw new WritingError(
        'Sign in again to continue. Your local copy is safe.',
        401
      );
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      const origin = request.headers.get('origin');
      if (
        !origin ||
        origin !== new URL(process.env.NEXTAUTH_URL ?? '').origin
      ) {
        throw new WritingError('The request origin is not allowed.', 403);
      }
    }
    const response = await action();
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  } catch (error) {
    const status =
      error instanceof WritingError
        ? error.status
        : error instanceof z.ZodError
          ? 400
          : 502;
    const message =
      error instanceof WritingError
        ? error.message
        : error instanceof z.ZodError
          ? 'Some fields are invalid. Check the title, URL, date, and tags.'
          : 'The writing service could not complete the request. Please retry.';
    if (status === 502)
      console.error(
        'Writing request failed:',
        error instanceof Error ? error.name : 'Unknown error'
      );
    return Response.json(
      { error: message },
      { status, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }
}
