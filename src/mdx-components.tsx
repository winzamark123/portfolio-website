import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="font-lora text-lg font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-md font-lora font-semibold">{children}</h3>
    ),
    p: ({ children }) => <p className="my-4 text-xs">{children}</p>,
    ul: ({ children }) => <ul className="my-4 text-xs">{children}</ul>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-xs text-blue-500 underline hover:text-blue-600"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic text-[#EF89A5]">{children}</em>,
    img: ({ src, alt }) => (
      <div className="relative my-4 h-[400px] w-full">
        <Image
          src={src || ''}
          alt={alt || 'Blog image'}
          fill
          className="object-contain"
        />
      </div>
    ),
    ...components,
  };
}
