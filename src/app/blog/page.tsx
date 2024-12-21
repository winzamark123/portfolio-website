import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

interface PostData {
  title: string;
  content: string;
  slug: string;
}
export default async function Page() {
  // Read markdown files from the blog directory
  const postsDirectory = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDirectory);

  const posts: PostData[] = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(postsDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        ...(data as { title: string }),
        content: marked(content),
        slug: file.replace('.md', ''),
      };
    });

  return (
    <main className="container mx-auto px-4 py-8">
      {posts.map((post, index) => (
        <article key={index} className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      ))}
    </main>
  );
}
