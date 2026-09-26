'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function WritingSignIn({ configured }: { configured: boolean }) {
  return (
    <main className="w-full max-w-xl px-6 py-20">
      <Link href="/" className="text-sm underline">
        ← portfolio
      </Link>
      <h1 className="mt-10 font-lora text-3xl">A place to write.</h1>
      <p className="my-6 text-sm leading-relaxed">
        Private drafts, a live preview, and publishing when you’re ready. Only
        the owner’s GitHub account can sign in.
      </p>
      {configured ? (
        <>
          <Button
            variant="outline"
            onClick={() => void signIn('github', { callbackUrl: '/write' })}
          >
            Sign in with GitHub
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            If sign-in was declined, check that you used the owner’s account and
            try again.
          </p>
        </>
      ) : (
        <p role="status" className="border p-4 text-sm">
          Writing hasn’t been configured yet. Follow the setup in{' '}
          <code>docs/writing.md</code> to connect GitHub and R2.
        </p>
      )}
    </main>
  );
}
