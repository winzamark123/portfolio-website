import { MagazineLayout } from '@/components/ui/magazine-layout';
import type { ReactNode } from 'react';

export function BlogArticle({
  title,
  date,
  tags,
  columns,
  children,
}: {
  title: string;
  date: string;
  tags: string[];
  columns: 2 | 3 | 4;
  children: ReactNode;
}) {
  return (
    <article className="prose prose-sm max-w-none dark:prose-invert">
      <h2 className="mb-2 font-lora text-xl font-bold">{title}</h2>
      <p className="mb-4 text-gray-500">
        {date
          ? new Date(`${date.slice(0, 10)}T12:00:00Z`).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
              }
            )
          : 'Publication date will be set when you publish'}
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-gray-200 px-2 py-1 dark:bg-gray-800"
          >
            #{tag}
          </span>
        ))}
      </div>
      <MagazineLayout columns={columns} gap="lg">
        {children}
      </MagazineLayout>
    </article>
  );
}
