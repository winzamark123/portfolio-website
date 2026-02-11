'use client';
import { MagazineLayout } from '@/components/ui/magazine-layout';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  SocialProps,
  NavItems,
  ExperienceProps,
  ProjectList,
  NuggetList,
} from './const';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useMDXComponents } from '@/mdx-components';
import type { BlogPost } from '../page';
import { Spinner } from '../../components/ui/spinner';
import { Apple, Github, Link2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

// lazy import avoids next-mdx-remote SSR side effects that break Suspense hydration
const LazyMDXRemote = lazy(() =>
  import('next-mdx-remote').then((mod) => ({ default: mod.MDXRemote }))
);

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const fadeTransition = { duration: 0.2, ease: 'easeInOut' };

type ViewMode = 'human' | 'machine';
type MachineStatus = 'loading' | 'ready' | 'error';

const viewVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const viewTransition = { duration: 0.25, ease: 'easeInOut' };

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('human');
  const [machineContent, setMachineContent] = useState('');
  const [machineStatus, setMachineStatus] = useState<MachineStatus>('loading');
  const isMachine = viewMode === 'machine';

  useEffect(() => {
    const loadMachineContent = async () => {
      setMachineStatus('loading');
      try {
        const response = await fetch('/llms.txt');
        if (!response.ok) {
          setMachineStatus('error');
          return;
        }

        const text = await response.text();
        const trimmed = text.trim();

        if (trimmed.length === 0) {
          setMachineStatus('error');
          return;
        }

        setMachineContent(trimmed);
        setMachineStatus('ready');
      } catch {
        setMachineStatus('error');
      }
    };

    loadMachineContent();
  }, []);

  useEffect(() => {
    setActiveTab(tabFromUrl);

    // If on blog tab and post slug is in URL, select that blog
    if (tabFromUrl === 'blogs' && postSlugFromUrl) {
      const blog = blogs.find((b) => b.slug === postSlugFromUrl);
      if (blog) {
        setSelectedBlog(blog);
      }
    } else if (tabFromUrl !== 'blogs') {
      // Reset selected blog when changing to other tabs
      setSelectedBlog(null);
    } else if (!postSlugFromUrl) {
      // No post in URL but on blog tab, reset selection
      setSelectedBlog(null);
    }
  }, [tabFromUrl, postSlugFromUrl, blogs]);

  const handleTabChange = ({ tab }: { tab: string }) => {
    setActiveTab(tab);
    setSelectedBlog(null);
    router.push(`/?tab=${tab}`);
  };

  const handleSelectBlog = ({ blog }: { blog: BlogPost }) => {
    setSelectedBlog(blog);
    router.push(`/?tab=blogs&post=${blog.slug}`);
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
    router.push('/?tab=blogs');
  };

  const handleReturnHome = () => {
    handleTabChange({ tab: 'experience' });
  };

  return (
    <main className="flex h-full w-full max-w-7xl flex-col items-center p-4 pb-24">
      <div className="w-full">
        <AnimatePresence mode="wait">
          {viewMode === 'human' ? (
            <motion.div
              key="human"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={viewTransition}
              className="flex w-full flex-col items-center"
            >
              <div className="flex w-full items-start justify-start pt-14">
                {landing({ onReturnHome: handleReturnHome })}
              </div>
              <div className="flex w-full flex-col items-center gap-4">
                {works_nav({ activeTab, onTabChange: handleTabChange })}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    variants={fadeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={fadeTransition}
                    className="w-full"
                  >
                    {activeTab === 'experience' && experience()}
                    {activeTab === 'projects' && <Projects />}
                    {activeTab === 'blogs' && (
                      <Blog
                        blogs={blogs}
                        selectedBlog={selectedBlog}
                        handleSelectBlog={handleSelectBlog}
                        handleBackToList={handleBackToList}
                      />
                    )}
                    {activeTab === 'nuggets' && <Nuggets />}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {activeTab === 'projects' && (
                    <motion.div
                      key="github-chart"
                      variants={fadeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={fadeTransition}
                      className="flex w-full flex-col"
                    >
                      {!imageLoaded && (
                        <div className="flex justify-center">
                          <Spinner />
                        </div>
                      )}
                      <Image
                        src="https://ghchart.rshah.org/winzamark123"
                        alt="Win's Github chart"
                        className="w-full py-2"
                        width={800}
                        height={200}
                        onLoadingComplete={() => setImageLoaded(true)}
                        style={{ display: imageLoaded ? 'block' : 'none' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="machine"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={viewTransition}
              className="flex w-full justify-center pt-14"
            >
              <MachineView content={machineContent} status={machineStatus} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-3 border border-foreground/15 bg-background/80 px-4 py-2 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={() => setViewMode('human')}
            aria-pressed={!isMachine}
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${
              isMachine ? 'text-foreground/50' : 'text-foreground'
            }`}
          >
            human
          </button>
          <Switch
            checked={isMachine}
            onCheckedChange={(checked: boolean) =>
              setViewMode(checked ? 'machine' : 'human')
            }
            aria-label="toggle machine view"
          />
          <button
            type="button"
            onClick={() => setViewMode('machine')}
            aria-pressed={isMachine}
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${
              isMachine ? 'text-foreground' : 'text-foreground/50'
            }`}
          >
            machine
          </button>
        </div>
      </div>
    </main>
  );
}

const landing = ({ onReturnHome }: { onReturnHome: () => void }) => {
  return (
    <div className="flex w-fit flex-col gap-4 overflow-hidden">
      <div className="flex flex-col gap-2">
        <h1 className="font-lora text-3xl">
          <button
            type="button"
            onClick={onReturnHome}
            className="text-left hover:underline hover:underline-offset-[3px]"
          >
            {content.title}
          </button>
        </h1>
        <p className="text-sm">{content.description}</p>
      </div>
      {social()}
      <div className="h-1 w-2/3 bg-foreground/80" />
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

const works_nav = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: ({ tab }: { tab: string }) => void;
}) => {
  return (
    <div className="flex flex-row gap-4 py-4 md:gap-8">
      {NavItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onTabChange({ tab: item.id })}
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
  return (
    <MagazineLayout columns={3} gap="lg">
      {ProjectList.map((project) => (
        <div
          key={project.title}
          className="mb-6 flex break-inside-avoid flex-col"
        >
          <div className="flex items-center gap-2 md:gap-4">
            <h2 className="font-lora text-lg font-bold">{project.title}</h2>
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
          <p className="text-justify text-sm leading-relaxed">
            {project.description}
          </p>
        </div>
      ))}
    </MagazineLayout>
  );
};

const Nuggets = () => {
  return (
    <MagazineLayout columns={4} gap="lg">
      {NuggetList.map((nugget) => (
        <div
          key={nugget.quote}
          className="mb-6 flex break-inside-avoid flex-col"
        >
          <p className="text-sm leading-relaxed">{nugget.quote}</p>
          {nugget.author && (
            <p className="mt-2 self-end text-sm font-bold italic">
              - {nugget.author}
            </p>
          )}
        </div>
      ))}
    </MagazineLayout>
  );
};

const InferenceDefinition = () => {
  return (
    <div className="flex w-full">
      <div className="w-fit">
        <h2 className="font-lora text-2xl italic">inference</h2>
        <div className="flex items-center gap-4 text-sm">
          <span>/ˈin-fə-rən(t)s/</span>
          <span className="italic">Noun</span>
        </div>
        <div className="mt-4 flex flex-col gap-2 rounded border-gray-300">
          <ol className="list-inside list-decimal space-y-1 text-sm">
            <li>a conclusion reached on the basis of evidence and reasoning</li>
            <li>the process of deriving logical conclusions</li>
          </ol>
          <span className="text-sm font-bold italic">
            this section showcases my inference over the years. how i "infer"
            the world
          </span>
        </div>
      </div>
    </div>
  );
};

interface MachineViewProps {
  content: string;
  status: MachineStatus;
}

const MachineView = ({ content, status }: MachineViewProps) => {
  return (
    <section className="w-full max-w-5xl font-mono">
      <div className="space-y-3">
        {status === 'loading' && (
          <p className="text-sm leading-relaxed text-foreground/70">
            loading machine view...
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm leading-relaxed text-foreground/70">
            unable to load /llms.txt
          </p>
        )}
        {status === 'ready' && (
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {content}
          </pre>
        )}
      </div>
    </section>
  );
};

interface BlogProps {
  blogs: BlogPost[];
  selectedBlog: BlogPost | null;
  handleSelectBlog: ({ blog }: { blog: BlogPost }) => void;
  handleBackToList: () => void;
}

const Blog = ({
  blogs,
  selectedBlog,
  handleSelectBlog,
  handleBackToList,
}: BlogProps) => {
  const mdxComponents = useMDXComponents({});

  return (
    <AnimatePresence mode="wait">
      {selectedBlog ? (
        <motion.div
          key={selectedBlog.slug}
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={fadeTransition}
          className="w-full"
        >
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
            <p className="mb-4 text-gray-500">
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
                  className="rounded bg-gray-200 px-2 py-1 dark:bg-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <MagazineLayout columns={selectedBlog.columns} gap="lg">
              <Suspense fallback={<Spinner />}>
                <LazyMDXRemote {...selectedBlog.content} components={mdxComponents} />
              </Suspense>
            </MagazineLayout>
          </article>
        </motion.div>
      ) : (
        <motion.div
          key="blog-list"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={fadeTransition}
          className="flex w-full flex-col gap-6"
        >
          <InferenceDefinition />
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {blogs.map((blog) => (
              <button
                key={blog.slug}
                type="button"
                onClick={() => handleSelectBlog({ blog })}
                className="flex flex-col gap-2 border-2 border-black p-3 text-left hover:border-emerald-500 md:p-4"
              >
                <h2 className="font-lora text-lg font-bold">{blog.title}</h2>
                <p className="text-gray-500">
                  {new Date(blog.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
