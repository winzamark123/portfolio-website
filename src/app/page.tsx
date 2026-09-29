import fs from 'node:fs';
import path from 'node:path';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import { parsePost } from '@/lib/writing/content';
import { Suspense } from 'react';
import HomeClient from './_components/home-client';

export const dynamic = 'force-dynamic';

export type BlogPost = Awaited<ReturnType<typeof getBlogPosts>>[number];

async function getBlogPosts() {
  const blogDirectory = path.join(process.cwd(), 'public', 'blog');
  const files = fs.readdirSync(blogDirectory);

  const blogsPromises = files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(async (file) => {
      const filePath = path.join(blogDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const post = parsePost({ source: fileContent, filename: file });
      const mdxSource = await serialize(post.markdown, {
        mdxOptions: { remarkPlugins: [remarkGfm] },
      });

      return {
        title: post.title || 'Untitled',
        slug: post.slug,
        date: post.date,
        tags: post.tags,
        columns: post.columns,
        content: mdxSource,
      };
    });

  const blogs = await Promise.all(blogsPromises);

  // Sort blogs by date in descending order
  return blogs.sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB.getTime() - dateA.getTime();
  });
}

let blogPosts: ReturnType<typeof getBlogPosts> | undefined;

export default async function Home() {
  // published files only change with a new deployment
  const blogs = await (
    process.env.NODE_ENV === 'production'
      ? (blogPosts ??= getBlogPosts())
      : getBlogPosts()
  ).catch((error: unknown) => {
    blogPosts = undefined;
    throw error;
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient blogs={blogs} />
    </Suspense>
  );
}
