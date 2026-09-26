import matter from 'gray-matter';
import type { DraftContent } from './schema';

export function serializePost({
  content,
  id,
  revision,
}: {
  content: DraftContent;
  id?: string;
  revision?: string;
}) {
  return matter.stringify(content.markdown, {
    type: 'Blog Post',
    title: content.title.trim(),
    date: content.date,
    tags: content.tags,
    columns: content.columns,
    ...(id ? { writerId: id, writerRevision: revision } : {}),
  });
}
