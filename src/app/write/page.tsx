import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { writerSession } from '@/lib/writing/auth';
import { writingConfigured } from '@/lib/writing/config';
import { parsePost } from '@/lib/writing/content';
import { WritingDashboard } from './writing-dashboard';
import { WritingSignIn } from './writing-sign-in';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Write — Win Cheng',
  robots: { index: false, follow: false },
};

export default async function WritePage() {
  const configured = writingConfigured();
  if (!configured || !(await writerSession()))
    return <WritingSignIn configured={configured} />;
  const directory = path.join(process.cwd(), 'public/blog');
  const posts = fs
    .readdirSync(directory)
    .filter((name) => /\.mdx?$/.test(name))
    .map((filename) => {
      const post = parsePost({
        source: fs.readFileSync(path.join(directory, filename), 'utf8'),
        filename,
      });
      return { title: post.title, slug: post.slug };
    });
  return <WritingDashboard posts={posts} />;
}
