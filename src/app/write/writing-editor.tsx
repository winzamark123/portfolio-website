'use client';

import {
  MDXEditor,
  type MDXEditorMethods,
  type JsxEditorProps,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  markdownShortcutPlugin,
  jsxPlugin,
  toolbarPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertCodeBlock,
  InsertTable,
  Separator,
  insertJsx$,
  usePublisher,
  useMdastNodeUpdater,
  useLexicalNodeRemove,
  realmPlugin,
  addComposerChild$,
} from '@mdxeditor/editor';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_HIGH,
  DROP_COMMAND,
  DRAGOVER_COMMAND,
} from 'lexical';
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Ref,
} from 'react';
import { MagazineImage } from '@/components/ui/magazine-layout';
import { Button } from '@/components/ui/button';
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/writing/schema';
import '@mdxeditor/editor/style.css';
import './writing.css';

type Upload = { file: File; state: 'uploading' | 'failed'; error?: string };
const UploadContext = createContext<{
  uploads: Record<string, Upload>;
  upload: (input: { src: string; file: File }) => void;
  draftId: string;
  readOnly: boolean;
} | null>(null);

function useUploads() {
  const context = useContext(UploadContext);
  if (!context) throw new Error('Image controls need the writing editor.');
  return context;
}

function useInsertImages() {
  const insert = usePublisher(insertJsx$);
  const { draftId, upload, readOnly } = useUploads();
  return (files: File[]) => {
    if (readOnly) return;
    for (const file of files) {
      const src = `/api/write/images/${draftId}/${crypto.randomUUID()}.webp`;
      insert({ name: 'MagazineImage', kind: 'flow', props: { src, alt: '' } });
      upload({ src, file });
    }
  };
}

function ImageEvents() {
  const [editor] = useLexicalComposerContext();
  const insert = useInsertImages();
  const insertRef = useRef(insert);
  insertRef.current = insert;
  useEffect(() => {
    const paste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files ?? []);
      if (!files.length) return;
      event.preventDefault();
      event.stopPropagation();
      insertRef.current(files);
    };
    // the standard image plugin consumes file-only pastes before other commands
    const removePaste = editor.registerRootListener((root, previous) => {
      previous?.removeEventListener('paste', paste, true);
      root?.addEventListener('paste', paste, true);
    });
    const removeDragOver = editor.registerCommand(
      DRAGOVER_COMMAND,
      (event) => {
        if (!event.dataTransfer?.types.includes('Files')) return false;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
    const removeDrop = editor.registerCommand(
      DROP_COMMAND,
      (event) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (!files.length) return false;
        event.preventDefault();
        let range: Range | null = null;
        if (document.caretPositionFromPoint) {
          const caret = document.caretPositionFromPoint(
            event.clientX,
            event.clientY
          );
          if (caret) {
            range = document.createRange();
            range.setStart(caret.offsetNode, caret.offset);
            range.collapse(true);
          }
        } else if (document.caretRangeFromPoint) {
          range = document.caretRangeFromPoint(event.clientX, event.clientY);
        }
        if (range && editor.getRootElement()?.contains(range.startContainer)) {
          const selection = $createRangeSelection();
          selection.applyDOMRange(range);
          $setSelection(selection);
        }
        // insert the image node before starting the upload so later typing cannot move it
        queueMicrotask(() => insertRef.current(files));
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
    return () => {
      removePaste();
      removeDragOver();
      removeDrop();
    };
  }, [editor]);
  return null;
}

const imageEventsPlugin = realmPlugin({
  init(realm) {
    realm.pub(addComposerChild$, ImageEvents);
  },
});

function UploadButton() {
  const input = useRef<HTMLInputElement>(null);
  const insert = useInsertImages();
  const { readOnly } = useUploads();
  return (
    <>
      <button
        type="button"
        className="writer-image-button"
        disabled={readOnly}
        onClick={() => input.current?.click()}
      >
        Add image
      </button>
      <input
        ref={input}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        multiple
        className="sr-only"
        aria-label="Upload images"
        disabled={readOnly}
        onChange={(event) => {
          insert(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
      />
    </>
  );
}

function ImageEditor({ mdastNode }: JsxEditorProps) {
  const update = useMdastNodeUpdater<JsxEditorProps['mdastNode']>();
  const remove = useLexicalNodeRemove();
  const { uploads, upload, readOnly } = useUploads();
  const id = useId();
  const [broken, setBroken] = useState(false);
  const values = Object.fromEntries(
    mdastNode.attributes.flatMap((attribute) =>
      attribute.type === 'mdxJsxAttribute' &&
      typeof attribute.value === 'string'
        ? [[attribute.name, attribute.value]]
        : []
    )
  );
  const src = values.src ?? '';
  const pending = uploads[src];
  const fields = [
    { name: 'alt', label: 'Alternative text' },
    { name: 'caption', label: 'Caption' },
    { name: 'creditHref', label: 'Credit URL' },
    { name: 'creditLabel', label: 'Credit label' },
  ];
  function change({ name, value }: { name: string; value: string }) {
    const attributes = mdastNode.attributes.filter(
      (attr) => attr.type !== 'mdxJsxAttribute' || attr.name !== name
    );
    if (value || name === 'alt')
      attributes.push({ type: 'mdxJsxAttribute', name, value });
    update({ attributes });
  }
  return (
    <div className="writer-image my-6 border p-4" contentEditable={false}>
      {pending ? (
        <div role="status" className="p-6 text-sm">
          {pending.state === 'uploading' ? 'Uploading image…' : pending.error}
          {pending.state === 'failed' && (
            <Button
              variant="outline"
              className="ml-3"
              disabled={readOnly}
              onClick={() => upload({ src, file: pending.file })}
            >
              Retry upload
            </Button>
          )}
        </div>
      ) : broken ? (
        <p role="alert">
          This image is unavailable. Remove it and upload it again.
        </p>
      ) : (
        <MagazineImage
          src={src}
          alt={values.alt ?? ''}
          caption={values.caption}
          creditHref={values.creditHref}
          creditLabel={values.creditLabel}
          onImageError={() => setBroken(true)}
        />
      )}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer">Image details</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <label
              key={field.name}
              htmlFor={`${id}-${field.name}`}
              className="grid gap-1"
            >
              {field.label}
              <input
                id={`${id}-${field.name}`}
                value={values[field.name] ?? ''}
                disabled={readOnly}
                onChange={(event) =>
                  change({ name: field.name, value: event.target.value })
                }
                className="writer-input"
              />
            </label>
          ))}
        </div>
      </details>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3"
        disabled={readOnly}
        onClick={remove}
      >
        Remove image
      </Button>
    </div>
  );
}

export default function WritingEditor({
  initialMarkdown,
  draftId,
  onChange,
  onError,
  onUploadsChange,
  readOnly,
  editorRef,
}: {
  initialMarkdown: string;
  draftId: string;
  onChange: (markdown: string) => void;
  onError: (message: string) => void;
  onUploadsChange: (count: number) => void;
  readOnly: boolean;
  editorRef: Ref<MDXEditorMethods>;
}) {
  const [uploads, setUploads] = useState<Record<string, Upload>>({});
  useEffect(
    () => onUploadsChange(Object.keys(uploads).length),
    [uploads, onUploadsChange]
  );
  async function upload({ src, file }: { src: string; file: File }) {
    setUploads((current) => ({
      ...current,
      [src]: { file, state: 'uploading' },
    }));
    try {
      if (!IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES)
        throw new Error(
          'Choose a PNG, JPEG, or WebP image smaller than 4 MiB.'
        );
      const response = await fetch(src, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!response.ok)
        throw new Error(
          response.status === 401
            ? 'Sign in again, then retry the upload.'
            : 'The image could not be uploaded. Check its size and format, then retry.'
        );
      setUploads((current) => {
        const next = { ...current };
        delete next[src];
        return next;
      });
    } catch (error) {
      setUploads((current) =>
        current[src]
          ? {
              ...current,
              [src]: {
                file,
                state: 'failed',
                error:
                  error instanceof Error ? error.message : 'Upload failed.',
              },
            }
          : current
      );
    }
  }
  const plugins = useMemo(
    () => [
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      imagePlugin({ disableImageResize: true }),
      tablePlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
      codeMirrorPlugin({
        codeBlockLanguages: {
          txt: 'Plain text',
          js: 'JavaScript',
          ts: 'TypeScript',
          tsx: 'TSX',
          css: 'CSS',
          html: 'HTML',
          json: 'JSON',
          bash: 'Shell',
          python: 'Python',
        },
      }),
      jsxPlugin({
        allowFragment: false,
        jsxComponentDescriptors: [
          {
            name: 'MagazineImage',
            kind: 'flow',
            hasChildren: false,
            props: ['src', 'alt', 'caption', 'creditHref', 'creditLabel'].map(
              (name) => ({ name, type: 'string' })
            ),
            Editor: ImageEditor,
          },
        ],
      }),
      imageEventsPlugin(),
      diffSourcePlugin({ viewMode: 'rich-text' }),
      markdownShortcutPlugin(),
      toolbarPlugin({
        toolbarContents: () => (
          <DiffSourceToggleWrapper>
            <UndoRedo />
            <Separator />
            <BoldItalicUnderlineToggles />
            <BlockTypeSelect />
            <ListsToggle />
            <CreateLink />
            <UploadButton />
            <InsertCodeBlock />
            <InsertTable />
          </DiffSourceToggleWrapper>
        ),
      }),
    ],
    []
  );
  return (
    <UploadContext.Provider value={{ uploads, upload, draftId, readOnly }}>
      <MDXEditor
        ref={editorRef}
        markdown={initialMarkdown}
        readOnly={readOnly}
        plugins={plugins}
        contentEditableClassName="writer-prose prose prose-sm max-w-none"
        onChange={(markdown, initialNormalize) => {
          if (!initialNormalize) {
            onError('');
            setUploads((current) =>
              Object.fromEntries(
                Object.entries(current).filter(([src]) =>
                  markdown.includes(src)
                )
              )
            );
            onChange(markdown);
          }
        }}
        onError={({ error }) => onError(error)}
      />
    </UploadContext.Provider>
  );
}
