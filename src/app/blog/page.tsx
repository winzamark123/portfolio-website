import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

interface BlogPost {
  title: string;
  content: string;
  slug: string;
  [key: string]: any; // For any additional frontmatter fields
}

export default async function BlogPage() {
  // Update the directory path to public/blog
  const blogDirectory = path.join(process.cwd(), 'public', 'blog');
  const files = fs.readdirSync(blogDirectory);

  const blogs: BlogPost[] = await Promise.all(
    files
      .filter((file) => file.endsWith('.md'))
      .map(async (file) => {
        const filePath = path.join(blogDirectory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        return {
          ...(data as { title: string }),
          content: await marked(content),
          slug: file.replace('.md', ''),
        };
      })
  );

  return (
    <main className="container mx-auto px-4 py-8">
      {blogs.map((blog, index) => (
        <article key={index} className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">{blog.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
      ))}
    </main>
  );
}
