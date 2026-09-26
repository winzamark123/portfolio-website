'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { z } from 'zod';
import { BlogArticle } from '@/components/blog/blog-article';
import { useMDXComponents } from '@/mdx-components';
import type { DraftContent } from '@/lib/writing/schema';
import { writingRequest } from './client-api';

const MDXRemote = lazy(() =>
  import('next-mdx-remote').then((module) => ({ default: module.MDXRemote }))
);
const previewSchema = z.object({
  compiledSource: z.string(),
  scope: z.record(z.unknown()),
  frontmatter: z.record(z.unknown()),
});

export function WritingPreview({ content }: { content: DraftContent }) {
  const [source, setSource] = useState<z.infer<typeof previewSchema> | null>(
    null
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState(false);
  const components = useMDXComponents({});
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
          <input
            type="checkbox"
            checked={mobile}
            onChange={(event) => setMobile(event.target.checked)}
          />
          Single-column preview
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
      <div
        className={
          mobile
            ? 'mx-auto max-w-sm [&_article>div:last-child]:![column-count:1]'
            : ''
        }
      >
        <BlogArticle {...content} title={content.title || 'Untitled'}>
          <Suspense fallback={<p>Loading preview…</p>}>
            {source && <MDXRemote {...source} components={components} />}
          </Suspense>
        </BlogArticle>
      </div>
    </section>
  );
}
