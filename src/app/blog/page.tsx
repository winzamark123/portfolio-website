import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

interface BlogPost {
  title: string;
  content: string;
  slug: string;
  date: string;
  tags: string[];
  [key: string]: any; // For any additional frontmatter fields
}

export default async function BlogPage() {
  // Path to the blog directory
  const blogDirectory = path.join(process.cwd(), 'public', 'blog');
  const files = fs.readdirSync(blogDirectory);

  // Read and process all Markdown files
  const blogs: BlogPost[] = await Promise.all(
    files
      .filter((file) => file.endsWith('.md'))
      .map(async (file) => {
        const filePath = path.join(blogDirectory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        return {
          ...(data as { title: string; date: string; tags: string[] }),
          content: await marked(content),
          slug: file.replace('.md', ''),
        };
      })
  );

  // Sort blogs by date in descending order
  const sortedBlogs = blogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Render the blog page
  return (
    <main className="container flex flex-col items-center justify-center px-1/10 py-8">
      {sortedBlogs.map((blog, index) => (
        <article key={index} className="mb-8 border-b border-gray-200 pb-8">
          {/* <h2 className="mb-2 text-2xl font-bold">{blog.title}</h2> */}
          <p className="mb-4 text-gray-500">
            {new Date(blog.date).toLocaleDateString()}
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {blog.tags?.map((tag, i) => (
              <span
                key={i}
                className="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div
            className="prose max-w-none dark:prose-invert prose-h1:text-5xl 
            prose-h2:text-2xl prose-h3:text-xl prose-p:text-lg 
            prose-a:text-blue-500 prose-a:underline dark:prose-h1:text-emerald-500"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      ))}
    </main>
  );
}
