import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { Suspense } from 'react';
import HomeClient from './_components/home-client';

export const dynamic = 'force-dynamic';

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  columns: 2 | 3 | 4;
  content: any;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDirectory = path.join(process.cwd(), 'public', 'blog');
  const files = fs.readdirSync(blogDirectory);

  const blogsPromises = files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(async (file) => {
      const filePath = path.join(blogDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      const slug = file
        .replace(/\.(mdx|md)$/, '')
        .toLowerCase()
        .replace(/\s+/g, '-');

      // Serialize the MDX content
      const mdxSource = await serialize(content);

      return {
        title: data.title || 'Untitled',
        slug,
        date: data.date || '',
        tags: data.tags || [],
        columns: data.columns || 2,
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

export default async function Home() {
  const blogs = await getBlogPosts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient blogs={blogs} />
    </Suspense>
  );
}
