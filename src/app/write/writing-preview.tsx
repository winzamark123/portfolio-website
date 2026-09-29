'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { z } from 'zod';
import { BlogArticle } from '@/components/blog/blog-article';
import { contentSchema, type DraftContent } from '@/lib/writing/schema';
import { writingRequest } from './client-api';

const BlogContent = dynamic(() => import('@/components/blog/blog-content'), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
});
const previewSchema = z.object({
  compiledSource: z.string(),
  scope: z.record(z.unknown()),
  frontmatter: z.record(z.unknown()),
});

export function WritingPreview({
  content,
  disabled,
  onColumnsChange,
}: {
  content: DraftContent;
  disabled: boolean;
  onColumnsChange: (columns: DraftContent['columns']) => void;
}) {
  const [source, setSource] = useState<z.infer<typeof previewSchema> | null>(
    null
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const timeout = setTimeout(() => {
      writingRequest({
        path: 'preview',
        method: 'POST',
        body: { markdown: content.markdown },
        schema: previewSchema,
        signal: controller.signal,
      })
        .then((next) => {
          setSource(next);
          setError('');
        })
        .catch((error: Error) => {
          if (!controller.signal.aborted) {
            setError(error.message);
            setSource(null);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 350);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [content.markdown]);
  return (
    <section aria-label="Article preview" className="border-t pt-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <h2 className="font-lora text-xl font-bold">Preview</h2>
        <label className="flex items-center gap-2">
          Columns
          <select
            aria-label="Columns"
            className="writer-input"
            value={content.columns}
            disabled={disabled}
            onChange={(event) =>
              onColumnsChange(
                contentSchema.shape.columns.parse(Number(event.target.value))
              )
            }
          >
            {[2, 3, 4].map((columns) => (
              <option key={columns} value={columns}>
                {columns}
              </option>
            ))}
          </select>
        </label>
        <span role="status" className="text-xs text-muted-foreground">
          {loading
            ? 'Updating preview…'
            : error
              ? 'Preview unavailable'
              : 'Preview is up to date'}
        </span>
      </div>
      {error && (
        <p role="alert" className="mb-4 border border-red-700 p-3 text-sm">
          {error}
        </p>
      )}
      <BlogArticle {...content} title={content.title || 'Untitled'}>
        {source && <BlogContent content={source} />}
      </BlogArticle>
    </section>
  );
}
