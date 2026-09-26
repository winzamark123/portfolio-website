import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { writerSession } from '@/lib/writing/auth';
import { idSchema } from '@/lib/writing/schema';
import { WritingWorkspace } from '../writing-workspace';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Draft — Win Cheng',
  robots: { index: false, follow: false },
};

export default async function DraftPage({
  params,
}: {
  params: { id: string };
}) {
  if (!(await writerSession())) redirect('/write');
  if (!idSchema.safeParse(params.id).success) notFound();
  return <WritingWorkspace id={params.id} />;
}
