'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useMDXComponents } from '@/mdx-components';

export default function BlogContent({
  content,
}: {
  content: MDXRemoteSerializeResult;
}) {
  return <MDXRemote {...content} components={useMDXComponents({})} />;
}
