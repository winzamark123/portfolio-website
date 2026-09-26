import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import {
  documentImages,
  normalizeDocument,
  parseDocument,
  parsePost,
  replaceImageUrls,
  safeUrl,
  updateMachineBlogs,
} from '../../src/lib/writing/content';
import { contentSchema, postSlug, slugify } from '../../src/lib/writing/schema';
import { serializePost } from '../../src/lib/writing/post-format';

const filenames = readdirSync('public/blog').filter((name) =>
  /\.mdx?$/.test(name)
);

describe('existing posts', () => {
  it.each(filenames)(
    'preserves %s through repeated parsing and serialization',
    (filename) => {
      const original = parsePost({
        source: readFileSync(`public/blog/${filename}`, 'utf8'),
        filename,
      });
      const normalized = normalizeDocument({ markdown: original.markdown });
      expect(normalizeDocument({ markdown: normalized })).toBe(normalized);
      expect(documentImages({ markdown: normalized })).toEqual(
        documentImages({ markdown: original.markdown })
      );
      const roundtrip = parsePost({
        source: serializePost({
          content: { ...original, markdown: normalized },
        }),
        filename,
      });
      expect(roundtrip.title).toBe(original.title);
      expect(roundtrip.date).toBe(original.date);
      expect(roundtrip.tags).toEqual(original.tags);
      expect(roundtrip.columns).toBe(original.columns);
      expect(roundtrip.slug).toBe(original.slug);
    }
  );
});

describe('safe authoring', () => {
  it.each([
    '{globalThis.alert(1)}',
    'import Dangerous from "./danger"\n\n# Hi',
    '<script>alert(1)</script>',
    '<MagazineImage src="https://example.com/a.png" onError="alert(1)" />',
    '<MagazineImage src={process.env.SECRET} />',
    '<MagazineImage {...props} />',
    '[bad](javascript:alert%281%29)',
    '<a href="javascript:alert(1)">bad</a>',
    '<iframe src="https://example.com" />',
    '![](//example.com/image.png)',
  ])('rejects executable or unsupported input: %s', (markdown) => {
    expect(() => parseDocument({ markdown })).toThrow();
  });

  it('keeps code examples literal', () => {
    expect(() =>
      parseDocument({ markdown: '```js\nalert(1);\n```\n\n`{some.code}`' })
    ).not.toThrow();
  });

  it('replaces image URLs without replacing text or losing credits', () => {
    const src = '/api/write/images/a/b.webp';
    const result = replaceImageUrls({
      markdown: `<MagazineImage src="${src}" alt="a bird" caption="Photo" creditHref="${src}" creditLabel="Win" />\n\n${src}`,
      urls: new Map([[src, 'https://images.example.com/b.webp']]),
    });
    expect(result).toContain('src="https://images.example.com/b.webp"');
    expect(result).toContain('creditHref="https://images.example.com/b.webp"');
    expect(result).toContain('caption="Photo"');
    expect(result).toContain(src);
  });

  it('validates dates and preserves existing URL rules', () => {
    const content = {
      title: 'Example',
      date: '2026-02-30',
      tags: [],
      columns: 2,
      slug: 'example',
      markdown: 'Hi',
    };
    expect(contentSchema.safeParse(content).success).toBe(false);
    expect(
      contentSchema.safeParse({ ...content, date: '2026-02-28' }).success
    ).toBe(true);
    expect(postSlug({ filename: '2026-01-09 Note_to_self_for_2026.mdx' })).toBe(
      '2026-01-09-note_to_self_for_2026'
    );
    expect(slugify({ title: 'A new thought!' })).toBe('a-new-thought');
    expect(safeUrl({ value: '/\\evil.test' })).toBe(false);
  });

  it('updates only blog metadata in the machine view', () => {
    const current = readFileSync('public/llms.txt', 'utf8');
    const posts = filenames.map((filename) =>
      parsePost({
        source: readFileSync(`public/blog/${filename}`, 'utf8'),
        filename,
      })
    );
    const next = updateMachineBlogs({
      current,
      posts,
      siteUrl: 'https://www.wincheng.fyi',
    });
    expect(next.split('\nBlog: ')[0]).toBe(current.split('\nBlog: ')[0]);
    expect(next.match(/^Blog: /gm)).toHaveLength(12);
    expect(next).toContain(
      'URL: https://www.wincheng.fyi/?tab=blogs&post=2026-01-09-note_to_self_for_2026'
    );
    expect(next).not.toContain('<MagazineImage');
  });
});
