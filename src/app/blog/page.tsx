import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';
import DocsRoot from '@/components/blog/DocsRoot';

interface BlogPost {
  title: string;
  content: string;
  slug: string;
  date: string;
  tags: string[];
  [key: string]: any; // For any additional frontmatter fields
}

// Custom components for MDX
const components: MDXComponents = {
  h1: (props) => (
    <h1
      {...props}
      className="text-4xl font-bold text-emerald-500 dark:text-emerald-500"
    />
  ),
  h2: (props) => (
    <h2 {...props} className="text-xl text-orange-500 dark:text-orange-500" />
  ),
  h3: (props) => <h3 {...props} className="text-lg font-semibold" />,
  p: (props) => <p {...props} className="my-4 text-base" />,
  a: (props) => (
    <a
      {...props}
      className="text-blue-500 underline hover:text-blue-600"
      target="_blank"
      rel="noopener noreferrer"
    />
  ),
  strong: (props) => <strong {...props} className="font-bold text-[#89DDEC]" />,
  em: (props) => <em {...props} className="italic text-[#EF89A5]" />,
  img: (props) => (
    <div className="relative my-4 h-[400px] w-full">
      <Image
        src={props.src || ''}
        alt={props.alt || 'Blog image'}
        fill
        className="object-contain"
      />
    </div>
  ),
  // Add your custom React components here
  DocsRoot,
};

// Convert Obsidian image syntax to MDX format
function convertObsidianImageLinks(content: string): string {
  return content.replace(/!\[\[(.*?)\]\]/g, (_, filename) => {
    return `![${filename}](/blog/ImageDump/${filename})`;
  });
}

export default async function BlogPage() {
  // Path to the blog directory
  const blogDirectory = path.join(process.cwd(), 'public', 'blog');
  const files = fs.readdirSync(blogDirectory);

  // Read and process all MDX files
  const blogs: BlogPost[] = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
      .map(async (file) => {
        const filePath = path.join(blogDirectory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        // Process the content to handle Obsidian image syntax
        const processedContent = convertObsidianImageLinks(content);

        // Extract slug by removing extension and converting spaces to hyphens
        const slug = file
          .replace(/\.(mdx|md)$/, '')
          .toLowerCase()
          .replace(/\s+/g, '-');

        return {
          ...(data as { title: string; date: string; tags: string[] }),
          content: processedContent,
          slug,
        };
      })
  );

  // Sort blogs by date in descending order (most recent first)
  const sortedBlogs = blogs.sort((a, b) => {
    const parseDate = (dateStr: string) => {
      if (!dateStr) {
        console.warn('Missing date:', dateStr);
        return new Date(0);
      }
      // Handle both YYYY-MM-DD and full ISO date strings
      const date = new Date(dateStr);
      if (Number.isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateStr);
        return new Date(0);
      }
      return date;
    };

    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);

    return dateB.getTime() - dateA.getTime();
  });

  // Render the blog page
  return (
    <main className="container flex flex-col items-center justify-center px-1/10 py-8">
      {sortedBlogs.map((blog, index) => (
        <article key={index} className="mb-8 border-b border-gray-200 pb-8">
          <p className="mb-4 text-gray-500">
            {new Date(blog.date).toLocaleDateString()}
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {blog.tags?.map((tag, i) => (
              <span
                key={i}
                className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="prose max-w-none dark:prose-invert">
            <MDXRemote source={blog.content} components={components} />
          </div>
        </article>
      ))}
    </main>
  );
}
