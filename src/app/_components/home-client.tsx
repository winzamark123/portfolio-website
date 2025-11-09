'use client';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { SocialProps, NavItems, ExperienceProps, ProjectList } from './const';
import { useState, useEffect } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { useMDXComponents } from '@/mdx-components';
import type { BlogPost } from '../page';
import { Spinner } from '../../components/ui/spinner';
import { Apple, Github, Link2 } from 'lucide-react';

const content = {
  title: "hey, i'm Win",
  description: "i'm a full-stack engineer based in San Francisco",
};

interface HomeClientProps {
  blogs: BlogPost[];
}

export default function HomeClient({ blogs }: HomeClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = searchParams.get('tab') || 'experience';
  const postSlugFromUrl = searchParams.get('post');
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    setActiveTab(tabFromUrl);

    // If on blog tab and post slug is in URL, select that blog
    if (tabFromUrl === 'blog' && postSlugFromUrl) {
      const blog = blogs.find((b) => b.slug === postSlugFromUrl);
      if (blog) {
        setSelectedBlog(blog);
      }
    } else if (tabFromUrl !== 'blog') {
      // Reset selected blog when changing to other tabs
      setSelectedBlog(null);
    } else if (!postSlugFromUrl) {
      // No post in URL but on blog tab, reset selection
      setSelectedBlog(null);
    }
  }, [tabFromUrl, postSlugFromUrl, blogs]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedBlog(null);
    router.push(`/?tab=${tab}`);
  };

  const handleSelectBlog = (blog: BlogPost) => {
    setSelectedBlog(blog);
    router.push(`/?tab=blog&post=${blog.slug}`);
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
    router.push('/?tab=blog');
  };

  return (
    <main className="flex h-screen max-h-screen w-screen flex-col items-center overflow-hidden md:flex-row">
      <div className="flex w-full items-center justify-center border p-6 pt-20 md:h-full md:w-1/2">
        {landing()}
      </div>
      <div className="flex w-full flex-col items-center gap-4 overflow-y-auto px-6 pb-6 md:w-1/2 md:overflow-visible md:px-10 md:py-32 ">
        {works_nav(activeTab, handleTabChange)}
        <div className="mt-2 max-h-[65vh] w-full overflow-y-scroll sm:mt-0 sm:max-h-96">
          {activeTab === 'experience' && experience()}
          {activeTab === 'projects' && <Projects />}
          {activeTab === 'blog' &&
            Blog(blogs, selectedBlog, handleSelectBlog, handleBackToList)}
        </div>
      </div>
    </main>
  );
}

const landing = () => {
  return (
    <div className="flex w-fit flex-col gap-4 overflow-hidden">
      <div className="flex flex-col gap-2">
        <h1 className="font-lora text-3xl">{content.title}</h1>
        <p className="text-sm">{content.description}</p>
      </div>
      {social()}
    </div>
  );
};

const social = () => {
  return (
    <div className="flex items-center gap-4">
      {SocialProps.map((social) => (
        <Link
          key={social.url}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center"
        >
          <div className="hover:text-emerald-500">{social.icon}</div>
        </Link>
      ))}
    </div>
  );
};

const works_nav = (activeTab: string, setActiveTab: (tab: string) => void) => {
  return (
    <div className="flex flex-row gap-4 md:gap-8">
      {NavItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setActiveTab(item.id)}
          className={`text-sm hover:underline hover:underline-offset-[3px] ${
            activeTab === item.id ? 'underline underline-offset-[3px]' : ''
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

const experience = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      {ExperienceProps.map((experience) => (
        <div key={experience.company} className="flex flex-col gap-2">
          <h2 className="text-md font-lora font-bold">{experience.company}</h2>
          <div className="flex w-full flex-col">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <p className="text-sm italic">{experience.position}</p>
              <p className="text-xs">{experience.location}</p>
            </div>

            <p className="text-sm">{experience.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Projects = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      {!imageLoaded && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      <img
        src="https://ghchart.rshah.org/winzamark123"
        alt="Win's Github chart"
        className="w-full py-2"
        width={800}
        height={200}
        onLoad={() => setImageLoaded(true)}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />

      {/* <div className="grid grid-cols-1 sm:grid-cols-2"> */}
      <div className="flex flex-wrap">
        {ProjectList.map((project) => (
          <div key={project.title} className="flex flex-col gap-2 p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <h2 className="text-md font-lora font-bold">{project.title}</h2>
              <div className="flex gap-2">
                {project.github_repo && (
                  <Link href={project.github_repo} target="_blank">
                    <Github className="h-4 w-4" />
                  </Link>
                )}
                {project.apple_url && (
                  <Link href={project.apple_url} target="_blank">
                    <Apple className="h-4 w-4" />
                  </Link>
                )}
                {project.url && (
                  <Link href={project.url} target="_blank">
                    <Link2 className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
            <p className="text-sm">{project.description}</p>

            {/* <p className="text-sm">{project.tech_tags.join(', ')}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

const Blog = (
  blogs: BlogPost[],
  selectedBlog: BlogPost | null,
  handleSelectBlog: (blog: BlogPost) => void,
  handleBackToList: () => void
) => {
  const mdxComponents = useMDXComponents({});

  // If a blog is selected, show its content
  if (selectedBlog) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={handleBackToList}
          className="mb-4 text-xs hover:underline"
        >
          ← back to all posts
        </button>
        <article className="prose prose-sm max-w-none dark:prose-invert">
          <h2 className="mb-2 font-lora text-xl font-bold">
            {selectedBlog.title}
          </h2>
          <p className="mb-4 text-xs text-gray-500">
            {new Date(selectedBlog.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedBlog.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
          <MDXRemote {...selectedBlog.content} components={mdxComponents} />
        </article>
      </div>
    );
  }

  // Otherwise, show the list of blogs
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {blogs.map((blog) => (
        <button
          key={blog.slug}
          type="button"
          onClick={() => handleSelectBlog(blog)}
          className="flex flex-col gap-2 border-2 border-black p-3 text-left hover:border-emerald-500 md:p-4"
        >
          <h2 className="text-md font-lora font-bold">{blog.title}</h2>
          <p className="text-xs text-gray-500">
            {new Date(blog.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </button>
      ))}
    </div>
  );
};
