'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import { Button } from '@/components/ui/button';
import {
  contentSchema,
  draftContent,
  publicationStatusSchema,
  savedDraftSchema,
  slugify,
  type DraftContent,
  type SavedDraft,
} from '@/lib/writing/schema';
import { serializePost } from '@/lib/writing/post-format';
import { writingRequest, WritingRequestError } from './client-api';
import { WritingPreview } from './writing-preview';
import './writing.css';

const WritingEditor = dynamic(() => import('./writing-editor'), {
  ssr: false,
  loading: () => (
    <p role="status" className="py-12">
      Loading the editor…
    </p>
  ),
});
const recoverySchema = z.object({
  content: contentSchema,
  etag: z.string(),
  savedAt: z.string(),
});
type SaveState = 'saved' | 'unsaved' | 'saving' | 'error' | 'conflict';

function sameContent(a: DraftContent, b: DraftContent) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function exportDraft({ content }: { content: DraftContent }) {
  const blob = new Blob([serializePost({ content })], {
    type: 'text/markdown;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${content.slug || 'draft'}.mdx`;
  link.click();
  URL.revokeObjectURL(url);
}

export function WritingWorkspace({ id }: { id: string }) {
  const [saved, setSaved] = useState<SavedDraft | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    writingRequest({
      path: `drafts/${id}`,
      schema: savedDraftSchema,
      signal: controller.signal,
    })
      .then(setSaved)
      .catch((error: Error) => {
        if (!controller.signal.aborted) setError(error.message);
      });
    return () => controller.abort();
  }, [id]);
  if (!saved)
    return (
      <main className="w-full max-w-4xl p-8">
        <Link href="/write" className="underline">
          ← all writing
        </Link>
        <p role={error ? 'alert' : 'status'} className="mt-8">
          {error || 'Loading your draft…'}
        </p>
        {error && (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        )}
      </main>
    );
  return <DraftWorkspace initial={saved} />;
}

function DraftWorkspace({ initial }: { initial: SavedDraft }) {
  const id = initial.draft.id;
  const storageKey = `writing-recovery:${id}`;
  const [saved, setSaved] = useState(initial);
  const savedRef = useRef(initial);
  const [content, setContent] = useState(() =>
    draftContent({ draft: initial.draft })
  );
  const contentRef = useRef(content);
  const [tags, setTags] = useState(content.tags.join(', '));
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [error, setError] = useState('');
  const [editorError, setEditorError] = useState('');
  const [recovery, setRecovery] = useState<z.infer<
    typeof recoverySchema
  > | null>(null);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [preview, setPreview] = useState(false);
  const [deployment, setDeployment] = useState<z.infer<
    typeof publicationStatusSchema
  > | null>(null);
  const [deploymentError, setDeploymentError] = useState('');
  const editor = useRef<MDXEditorMethods | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const attachEditor = useCallback((instance: MDXEditorMethods | null) => {
    editor.current = instance;
    setEditorReady(Boolean(instance));
  }, []);
  const saving = useRef<Promise<SavedDraft> | null>(null);
  const dirty = !sameContent(content, draftContent({ draft: saved.draft }));

  useEffect(() => {
    try {
      const value = localStorage.getItem(storageKey);
      if (value) {
        const local = recoverySchema.safeParse(JSON.parse(value));
        if (
          local.success &&
          !sameContent(local.data.content, contentRef.current)
        )
          setRecovery(local.data);
      }
    } catch {
      setStorageError(
        'Local recovery is unavailable in this browser. Keep an exported copy until your draft is saved.'
      );
    }
    setRecoveryReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!recoveryReady || recovery) return;
    try {
      if (dirty)
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            content,
            etag: saved.etag,
            savedAt: new Date().toISOString(),
          })
        );
      else localStorage.removeItem(storageKey);
      setStorageError('');
    } catch {
      setStorageError(
        'The browser could not store a recovery copy. Export your draft if saving is unavailable.'
      );
    }
  }, [content, dirty, recovery, recoveryReady, saved.etag, storageKey]);

  const save = useCallback(() => {
    if (saving.current) return saving.current;
    const before = savedRef.current;
    const snapshot = contentSchema.parse(contentRef.current);
    if (sameContent(snapshot, draftContent({ draft: before.draft })))
      return Promise.resolve(before);
    setSaveState('saving');
    setError('');
    const pending = writingRequest({
      path: `drafts/${id}`,
      method: 'PUT',
      body: { content: snapshot, etag: before.etag },
      schema: savedDraftSchema,
    })
      .then((next) => {
        savedRef.current = next;
        setSaved(next);
        setSaveState(
          sameContent(contentRef.current, snapshot) ? 'saved' : 'unsaved'
        );
        return next;
      })
      .catch((error: unknown) => {
        setSaveState(
          error instanceof WritingRequestError && error.status === 409
            ? 'conflict'
            : 'error'
        );
        setError(
          error instanceof Error
            ? error.message
            : 'Could not save. Your local copy has been kept.'
        );
        throw error;
      })
      .finally(() => {
        saving.current = null;
      });
    saving.current = pending;
    return pending;
  }, [id]);

  useEffect(() => {
    if (
      saveState !== 'unsaved' ||
      editorError ||
      recovery ||
      !contentSchema.safeParse(content).success
    )
      return;
    const timeout = setTimeout(() => void save().catch(() => {}), 1500);
    return () => clearTimeout(timeout);
  }, [content, editorError, recovery, save, saveState]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty || uploads || publishing) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (
          !editorError &&
          !recovery &&
          saveState !== 'conflict' &&
          contentSchema.safeParse(contentRef.current).success
        )
          void save().catch(() => {});
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('keydown', shortcut);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('keydown', shortcut);
    };
  }, [dirty, editorError, publishing, recovery, save, saveState, uploads]);

  const refreshDeployment = useCallback(async () => {
    try {
      setDeployment(
        await writingRequest({
          path: `drafts/${id}/publish`,
          schema: publicationStatusSchema,
        })
      );
      setDeploymentError('');
    } catch {
      setDeploymentError(
        'Could not check deployment status. Your publication commit is saved.'
      );
    }
  }, [id]);

  const publicationCommit = saved.draft.publication?.commitSha;
  useEffect(() => {
    if (!publicationCommit) return;
    void refreshDeployment();
    const interval = setInterval(() => {
      if (!document.hidden) void refreshDeployment();
    }, 10_000);
    return () => clearInterval(interval);
  }, [refreshDeployment, publicationCommit]);

  function change(next: DraftContent) {
    contentRef.current = next;
    setContent(next);
    setSaveState((state) => (state === 'conflict' ? state : 'unsaved'));
  }

  async function publish() {
    if (
      !window.confirm(
        'Publish this saved revision? Its text and images will become public, including in Git history. Vercel will deploy it in the background.'
      )
    )
      return;
    setPublishing(true);
    setError('');
    try {
      let latest = await save();
      while (
        !sameContent(contentRef.current, draftContent({ draft: latest.draft }))
      )
        latest = await save();
      const next = await writingRequest({
        path: `drafts/${id}/publish`,
        method: 'POST',
        body: { etag: latest.etag },
        schema: savedDraftSchema,
      });
      savedRef.current = next;
      setSaved(next);
      const nextContent = draftContent({ draft: next.draft });
      contentRef.current = nextContent;
      setContent(nextContent);
      setSaveState('saved');
      setDeployment({
        state: 'pending',
        url: `/?tab=blogs&post=${next.draft.slug}`,
      });
      void refreshDeployment();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Publishing failed. Your draft is still saved.'
      );
    } finally {
      setPublishing(false);
    }
  }

  async function reloadPublished() {
    if (
      !window.confirm(
        'Replace this working draft with the current published file? Export any unsaved work first. Previous saved versions remain in private recovery history.'
      )
    )
      return;
    setPublishing(true);
    try {
      await saving.current;
      const next = await writingRequest({
        path: `drafts/${id}/refresh`,
        method: 'POST',
        body: { etag: savedRef.current.etag },
        schema: savedDraftSchema,
      });
      const nextContent = draftContent({ draft: next.draft });
      savedRef.current = next;
      contentRef.current = nextContent;
      setSaved(next);
      setContent(nextContent);
      setTags(nextContent.tags.join(', '));
      editor.current?.setMarkdown(nextContent.markdown);
      setSaveState('saved');
      setError('');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Could not reload the published version.'
      );
    } finally {
      setPublishing(false);
    }
  }

  function restoreLocal() {
    if (!recovery) return;
    if (
      recovery.etag !== savedRef.current.etag &&
      !window.confirm(
        'The server has a newer saved version. Use this local copy as your working version instead? Export it first if you want to keep both.'
      )
    )
      return;
    change(recovery.content);
    setTags(recovery.content.tags.join(', '));
    editor.current?.setMarkdown(recovery.content.markdown);
    setRecovery(null);
  }

  const valid = contentSchema.safeParse(content).success;
  const disabled = publishing || Boolean(recovery);
  const stateLabels: Record<SaveState, string> = {
    saved: 'Saved',
    unsaved: 'Unsaved changes',
    saving: 'Saving…',
    error: 'Could not save',
    conflict: 'Save conflict',
  };
  return (
    <main className="w-full max-w-6xl px-4 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b pb-5">
        <Link
          href="/write"
          className="text-sm underline"
          onClick={(event) => {
            if (
              (dirty || uploads || publishing) &&
              !window.confirm(
                'Leave this draft? Unsaved text is kept in this browser, but unfinished image uploads may need to be repeated.'
              )
            )
              event.preventDefault();
          }}
        >
          ← all writing
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span role="status" className="mr-2 text-xs text-muted-foreground">
            {stateLabels[saveState]}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportDraft({ content })}
          >
            Export MDX
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={
              disabled ||
              !valid ||
              Boolean(editorError) ||
              saveState === 'conflict'
            }
            onClick={() => void save().catch(() => {})}
          >
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={
              disabled ||
              !valid ||
              Boolean(editorError) ||
              uploads > 0 ||
              saveState === 'conflict'
            }
            onClick={() => void publish()}
          >
            {publishing
              ? 'Publishing…'
              : saved.draft.publication
                ? 'Publish changes'
                : 'Publish'}
          </Button>
        </div>
      </header>
      {(error || editorError || storageError || !valid) && (
        <div
          role="alert"
          className="my-5 space-y-2 border border-red-700 p-4 text-sm"
        >
          {error && <p>{error}</p>}
          {editorError && (
            <p>
              The editor could not read this content: {editorError}. Use source
              mode to correct it before saving.
            </p>
          )}
          {storageError && <p>{storageError}</p>}
          {!valid && (
            <p>Check the date, URL, title length, and tags before saving.</p>
          )}
          {saveState === 'conflict' && (
            <p>
              Export your local copy before{' '}
              <button
                className="underline"
                onClick={() => window.location.reload()}
              >
                reloading the saved version
              </button>
              .
            </p>
          )}
          {error.includes('Sign in') && (
            <a
              href="/write"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Sign in in a new tab
            </a>
          )}
        </div>
      )}
      {recovery && (
        <section
          aria-label="Draft recovery"
          className="my-5 border p-4 text-sm"
        >
          <p>
            A local recovery copy from{' '}
            {new Date(recovery.savedAt).toLocaleString()} differs from the saved
            draft.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!editorReady}
              onClick={restoreLocal}
            >
              Restore local copy
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => exportDraft({ content: recovery.content })}
            >
              Export local copy
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (
                  window.confirm(
                    'Discard the local recovery copy and keep the server version?'
                  )
                )
                  setRecovery(null);
              }}
            >
              Keep saved version
            </Button>
          </div>
        </section>
      )}
      {saved.draft.publication && (
        <section
          aria-label="Publication status"
          className="my-5 border p-4 text-sm"
        >
          <p>
            {deployment?.state === 'success'
              ? 'The submitted revision is live.'
              : deployment?.state === 'failure'
                ? 'Deployment failed. Your publication commit is saved; retry the deployment in Vercel.'
                : deployment?.state === 'pending'
                  ? 'The submitted revision is deploying. Readers still see the previous version.'
                  : 'The publication commit is saved. Waiting for Vercel to report its status.'}
          </p>
          {saved.draft.publication.revision !== saved.draft.revision && (
            <p className="mt-2">Your draft has unpublished changes.</p>
          )}
          {deploymentError && <p role="alert">{deploymentError}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              className="underline"
              href={`/?tab=blogs&post=${saved.draft.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View public post
            </a>
            <button
              className="underline"
              onClick={() => void refreshDeployment()}
            >
              Refresh status
            </button>
            <button
              className="underline disabled:opacity-50"
              disabled={disabled || !editorReady || uploads > 0}
              onClick={() => void reloadPublished()}
            >
              Reload published version
            </button>
          </div>
        </section>
      )}
      <label
        className="mt-8 block text-xs text-muted-foreground"
        htmlFor="post-title"
      >
        Title
      </label>
      <input
        id="post-title"
        aria-label="Title"
        className="my-3 w-full border-0 bg-transparent font-lora text-3xl font-bold outline-offset-4"
        value={content.title}
        disabled={disabled}
        maxLength={200}
        onChange={(event) => {
          const title = event.target.value;
          const automaticSlug =
            !saved.draft.publication &&
            (!content.slug ||
              content.slug === slugify({ title: content.title }));
          change({
            ...content,
            title,
            slug: automaticSlug ? slugify({ title }) : content.slug,
          });
        }}
      />
      <details className="my-5 border-y py-4 text-sm">
        <summary className="cursor-pointer">
          Post settings · {content.columns} columns · {content.tags.length} tags
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1">
            Publication date
            <input
              type="date"
              aria-label="Publication date"
              className="writer-input"
              value={content.date}
              disabled={disabled}
              onChange={(event) =>
                change({ ...content, date: event.target.value })
              }
            />
            <span className="text-xs text-muted-foreground">
              Leave blank to use the date you first publish.
            </span>
          </label>
          <label className="grid gap-1">
            Columns
            <select
              aria-label="Columns"
              className="writer-input"
              value={content.columns}
              disabled={disabled}
              onChange={(event) =>
                change({
                  ...content,
                  columns: contentSchema.shape.columns.parse(
                    Number(event.target.value)
                  ),
                })
              }
            >
              {[2, 3, 4].map((columns) => (
                <option key={columns} value={columns}>
                  {columns}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">
              Small screens always use one column.
            </span>
          </label>
          <label className="grid gap-1">
            Tags
            <input
              aria-label="Tags"
              className="writer-input"
              value={tags}
              disabled={disabled}
              onChange={(event) => {
                setTags(event.target.value);
                change({
                  ...content,
                  tags: Array.from(
                    new Set(
                      event.target.value
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                    )
                  ),
                });
              }}
            />
            <span className="text-xs text-muted-foreground">
              Separate tags with commas.
            </span>
          </label>
          <label className="grid gap-1">
            Post URL
            <input
              aria-label="Post URL"
              className="writer-input"
              value={content.slug}
              disabled={disabled || Boolean(saved.draft.publication)}
              onChange={(event) =>
                change({ ...content, slug: event.target.value })
              }
            />
            <span className="text-xs text-muted-foreground">
              Fixed after the first publication so links keep working.
            </span>
          </label>
        </div>
      </details>
      <div className="writer-editor mx-auto max-w-3xl">
        <WritingEditor
          editorRef={attachEditor}
          initialMarkdown={initial.draft.markdown}
          draftId={id}
          readOnly={disabled}
          onChange={(markdown) => change({ ...contentRef.current, markdown })}
          onError={setEditorError}
          onUploadsChange={setUploads}
        />
      </div>
      <div className="my-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>Drafts are private. Changes save after a pause.</p>
        <Button
          size="sm"
          variant="outline"
          aria-expanded={preview}
          onClick={() => setPreview(!preview)}
        >
          {preview ? 'Hide preview' : 'Show live preview'}
        </Button>
      </div>
      {preview && <WritingPreview content={content} />}
    </main>
  );
}
