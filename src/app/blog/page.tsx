import fs from 'node:fs';
import path from 'node:path';
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

// Add this function to convert Obsidian image syntax to HTML
function convertObsidianImageLinks(content: string): string {
  // Replace ![[filename]] with custom HTML that we can target later
  return content.replace(/!\[\[(.*?)\]\]/g, (_, filename) => {
    // Don't split the filename, keep it intact including extension
    return `<obsidian-image src="blog/ImageDump/${filename}"></obsidian-image>`;
  });
}

// Add this function to style quoted text
function styleQuotedText(html: string): string {
  // This regex uses a negative lookahead to avoid matching quotes within HTML tags
  // It will only match standalone quotes in text content
  return html.replace(/("([^"]+)")/g, (match, fullQuote, _) => {
    // Check if this quote is inside an HTML tag attribute
    // Count < and > characters before this position
    const beforeMatch = html.substring(0, html.indexOf(match));
    const openTags = (beforeMatch.match(/</g) || []).length;
    const closeTags = (beforeMatch.match(/>/g) || []).length;

    // If we have equal numbers of < and >, we're outside of tags
    if (openTags === closeTags) {
      return `<span class="quoted-text">${fullQuote}</span>`;
    }

    // Otherwise, we're inside a tag, so return the original
    return match;
  });
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

        // Process the content to handle Obsidian image syntax
        const processedContent = convertObsidianImageLinks(content);

        // First convert markdown to HTML
        const htmlContent = await marked(processedContent);

        // Then apply quote styling to the HTML (after markdown has been processed)
        const styledContent = styleQuotedText(htmlContent);

        // Extract slug by removing .md and converting spaces to hyphens
        const slug = file.replace('.md', '').toLowerCase().replace(/\s+/g, '-');

        return {
          ...(data as { title: string; date: string; tags: string[] }),
          content: styledContent,
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
          {/* <h2 className="mb-2 text-xl font-bold">{blog.title}</h2> */}
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
          <div
            className="prose max-w-none dark:prose-invert prose-h1:text-4xl 
            prose-h2:text-xl prose-h2:text-orange-500 prose-h3:text-lg 
            prose-p:text-base prose-a:text-blue-500 prose-a:underline
            prose-strong:text-[#89DDEC] prose-em:text-[#EF89A5]
            dark:prose-h1:text-emerald-500 dark:prose-h2:text-orange-500
            [&_.quoted-text]:font-medium [&_.quoted-text]:italic [&_.quoted-text]:text-[#FF6B6B]
            "
            dangerouslySetInnerHTML={{
              __html: blog.content.replace(
                /<obsidian-image src="([^"]+)"><\/obsidian-image>/g,
                (_, src) => `
                  <div class="relative w-full h-[400px] my-4">
                    <img
                      src="${src}"
                      alt="Blog image"
                      class="object-contain w-full h-full"
                    />
                  </div>
                `
              ),
            }}
          />
        </article>
      ))}
    </main>
  );
}
