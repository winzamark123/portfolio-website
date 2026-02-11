import type { MDXComponents } from 'mdx/types';
import {
  MagazineImage,
  MagazineLayout,
  MagazineBlock,
  MagazineHeading,
} from '@/components/ui/magazine-layout';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="font-lora text-lg font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-md font-lora font-semibold">{children}</h3>
    ),
    p: ({ children }) => <p className="my-4">{children}</p>,
    ul: ({ children }) => <ul className="my-4">{children}</ul>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-500 underline hover:text-blue-600"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic text-[#EF89A5]">{children}</em>,
    img: (props) => (
      <img
        {...props}
        className="mix-blend-multiply dark:mix-blend-normal"
        alt={props.alt}
      />
    ),
    ...components,
    MagazineImage,
    MagazineLayout,
    MagazineBlock,
    MagazineHeading,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  };
}
