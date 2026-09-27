'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { draftListSchema, savedDraftSchema } from '@/lib/writing/schema';
import { writingRequest } from './client-api';
import type { z } from 'zod';

export function WritingDashboard({
  posts,
}: {
  posts: { title: string; slug: string }[];
}) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<z.infer<typeof draftListSchema>>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    writingRequest({ path: 'drafts', schema: draftListSchema })
      .then(setDrafts)
      .catch((error: Error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  async function openDraft({ slug }: { slug?: string }) {
    setBusy(true);
    setError('');
    try {
      const saved = await writingRequest({
        path: 'drafts',
        method: 'POST',
        body: { slug },
        schema: savedDraftSchema,
      });
      router.push(`/write/${saved.draft.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Could not open the draft.'
      );
      setBusy(false);
    }
  }

  return (
    <main className="w-full max-w-4xl px-5 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <Link href="/" className="text-sm underline">
          ← portfolio
        </Link>
        <Button
          variant="ghost"
          onClick={() => void signOut({ callbackUrl: '/write' })}
        >
          Sign out
        </Button>
      </header>
      <div className="my-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-lora text-3xl">Your writing</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Drafts stay private until you publish.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => void openDraft({})}
        >
          New post
        </Button>
      </div>
      {error && (
        <p role="alert" className="mb-6 border border-red-700 p-4 text-sm">
          {error}{' '}
          <button
            className="underline"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </p>
      )}
      <section aria-labelledby="drafts-heading">
        <h2 id="drafts-heading" className="mb-4 font-lora text-xl font-bold">
          Drafts and revisions
        </h2>
        {loading ? (
          <p role="status">Loading your drafts…</p>
        ) : drafts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No drafts yet. Choose New post to start writing.
          </p>
        ) : (
          <ul className="divide-y border-y">
            {drafts.map((draft) => (
              <li key={draft.id}>
                <Link
                  className="flex flex-wrap items-center justify-between gap-3 py-5 hover:underline"
                  href={`/write/${draft.id}`}
                >
                  <span>{draft.title || 'Untitled'}</span>
                  <span className="text-xs text-muted-foreground">
                    {!draft.publication
                      ? 'Draft'
                      : draft.publication.revision === draft.revision
                        ? 'Submitted for publication'
                        : 'Unpublished changes'}{' '}
                    · {new Date(draft.updatedAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section aria-labelledby="published-heading" className="mt-12">
        <h2 id="published-heading" className="mb-3 font-lora text-xl font-bold">
          Published posts
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Opening a post creates a private working copy. Readers won’t see
          changes until you publish them.
        </p>
        <ul className="divide-y border-y">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="flex items-center justify-between gap-4 py-4"
            >
              <span className="text-sm">{post.title}</span>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => void openDraft({ slug: post.slug })}
                aria-label={`Edit ${post.title}`}
              >
                Edit
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
