import { z } from 'zod';

export class WritingRequestError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export async function writingRequest<T>({
  path,
  schema,
  method = 'GET',
  body,
  signal,
}: {
  path: string;
  schema: z.ZodType<T>;
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
}) {
  const response = await fetch(`/api/write/${path}`, {
    method,
    headers:
      body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    cache: 'no-store',
  });
  const value: unknown = await response.json();
  if (!response.ok) {
    const error = z.object({ error: z.string() }).safeParse(value);
    throw new WritingRequestError(
      error.success ? error.data.error : 'The request failed. Please retry.',
      response.status
    );
  }
  return schema.parse(value);
}
