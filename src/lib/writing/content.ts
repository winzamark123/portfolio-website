import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { z } from 'zod';
import { contentSchema, postSlug, type DraftContent } from './schema';

const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkStringify);
const allowedAttributes = new Map([
  ['MagazineImage', ['src', 'alt', 'caption', 'creditHref', 'creditLabel']],
  ['a', ['href', 'title', 'target', 'rel']],
  ['img', ['src', 'alt', 'title', 'width', 'height']],
  ...[
    'p',
    'br',
    'hr',
    'strong',
    'em',
    'u',
    's',
    'sup',
    'sub',
    'code',
    'pre',
    'blockquote',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ].map((tag): [string, string[]] => [tag, []]),
]);

export function safeUrl({
  value,
  image = false,
}: {
  value: string;
  image?: boolean;
}) {
  if (
    Array.from(value).some(
      (character) => character.charCodeAt(0) <= 32 || character === '\\'
    )
  )
    return false;
  if (/^\/(?!\/)/.test(value)) return true;
  if (!image && value.startsWith('#')) return true;
  try {
    const url = new URL(value);
    return ['https:', 'http:', ...(!image ? ['mailto:'] : [])].includes(
      url.protocol
    );
  } catch {
    return false;
  }
}

export function parseDocument({ markdown }: { markdown: string }) {
  const tree = processor.parse(markdown);
  visit(tree, (node) => {
    if (
      ['mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression', 'html'].includes(
        node.type
      )
    ) {
      throw new Error(
        'JavaScript, imports, and raw HTML are not allowed in posts.'
      );
    }
    if (
      node.type === 'link' ||
      node.type === 'image' ||
      node.type === 'definition'
    ) {
      if (!safeUrl({ value: node.url, image: node.type === 'image' }))
        throw new Error('A link or image uses an unsupported URL.');
    }
    if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement')
      return;
    const allowed = node.name ? allowedAttributes.get(node.name) : undefined;
    if (!allowed)
      throw new Error(
        'Only supported formatting and MagazineImage components are allowed.'
      );
    for (const attribute of node.attributes) {
      if (
        attribute.type !== 'mdxJsxAttribute' ||
        !allowed.includes(attribute.name) ||
        typeof attribute.value !== 'string'
      ) {
        throw new Error(
          'Only supported text attributes are allowed. JavaScript expressions are not supported.'
        );
      }
      if (
        ['src', 'href', 'creditHref'].includes(attribute.name) &&
        !safeUrl({ value: attribute.value, image: attribute.name === 'src' })
      ) {
        throw new Error('A link or image uses an unsupported URL.');
      }
    }
  });
  return tree;
}

export function normalizeDocument({ markdown }: { markdown: string }) {
  return processor.stringify(parseDocument({ markdown }));
}

export function documentImages({ markdown }: { markdown: string }) {
  const urls = new Set<string>();
  visit(parseDocument({ markdown }), (node) => {
    if (node.type === 'image') urls.add(node.url);
    if (
      node.type === 'mdxJsxFlowElement' ||
      node.type === 'mdxJsxTextElement'
    ) {
      for (const attr of node.attributes) {
        if (
          attr.type === 'mdxJsxAttribute' &&
          ['src', 'creditHref'].includes(attr.name) &&
          typeof attr.value === 'string'
        )
          urls.add(attr.value);
      }
    }
  });
  return Array.from(urls);
}

export function replaceImageUrls({
  markdown,
  urls,
}: {
  markdown: string;
  urls: Map<string, string>;
}) {
  const tree = parseDocument({ markdown });
  visit(tree, (node) => {
    if (node.type === 'image') node.url = urls.get(node.url) ?? node.url;
    if (
      node.type === 'mdxJsxFlowElement' ||
      node.type === 'mdxJsxTextElement'
    ) {
      for (const attr of node.attributes) {
        if (
          attr.type === 'mdxJsxAttribute' &&
          ['src', 'creditHref'].includes(attr.name) &&
          typeof attr.value === 'string'
        ) {
          attr.value = urls.get(attr.value) ?? attr.value;
        }
      }
    }
  });
  return processor.stringify(tree);
}

export function parsePost({
  source,
  filename,
}: {
  source: string;
  filename: string;
}) {
  const { data, content } = matter(source);
  const metadata = z
    .object({
      title: z.string(),
      date: z.preprocess(
        (value) =>
          value instanceof Date ? value.toISOString().slice(0, 10) : value,
        z.string()
      ),
      tags: z.array(z.string()).default([]),
      columns: contentSchema.shape.columns.default(2),
      writerId: z.string().optional(),
      writerRevision: z.string().optional(),
    })
    .parse(data);
  return {
    ...contentSchema.parse({
      ...metadata,
      slug: postSlug({ filename }),
      markdown: content,
    }),
    writerId: metadata.writerId,
    writerRevision: metadata.writerRevision,
  };
}

export function updateMachineBlogs({
  current,
  posts,
  siteUrl,
}: {
  current: string;
  posts: DraftContent[];
  siteUrl: string;
}) {
  const start = current.indexOf('\nBlog: ');
  const prefix = (start < 0 ? current : current.slice(0, start)).trimEnd();
  const entries = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) =>
      [
        `Blog: ${post.title.replace(/[\r\n]/g, ' ')}`,
        `Date: ${post.date}`,
        `Tags: ${post.tags.map((tag) => tag.replace(/[\r\n]/g, ' ')).join(', ')}`,
        `URL: ${siteUrl.replace(/\/$/, '')}/?tab=blogs&post=${post.slug}`,
      ].join('\n')
    );
  return `${prefix}\n\n${entries.join('\n\n')}\n`;
}
