import { FileJson } from 'lucide-react';

export default function EditorTop() {
  return (
    <main className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-1/4 items-center justify-center gap-1 bg-neutral-800 text-xs md:text-sm">
        <FileJson className="h-4 w-4 md:h-5 md:w-5" />
        <span className="hidden sm:inline">index.js</span>
      </div>
      <div className="h-full w-3/4 bg-neutral-900"></div>
    </main>
  );
}
