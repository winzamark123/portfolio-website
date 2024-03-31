import { FileJson } from 'lucide-react';

export default function EditorTop() {
  return (
    <main className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-1/4 items-center justify-center gap-1 bg-neutral-800 text-xs">
        <FileJson className="h-4 w-4" />
        <span>index.js</span>
      </div>
      <div className="h-full w-3/4 bg-neutral-900"></div>
    </main>
  );
}
