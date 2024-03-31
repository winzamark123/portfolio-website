import {
  GitBranch,
  FileJson,
  Folder,
  Search,
  Blocks,
  Settings,
  ChevronRight,
} from 'lucide-react';

type editorItem = {
  icon: React.ReactNode;
  description: string;
};

const editorItems: editorItem[] = [
  {
    icon: <Folder className="h-6 w-6" />,
    description: 'Folder',
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    description: 'Branch',
  },
  {
    icon: <Search className="h-6 w-6" />,
    description: 'Search',
  },
  {
    icon: <Blocks className="h-6 w-6" />,
    description: 'Blocks',
  },
  {
    icon: <Settings className="h-6 w-6" />,
    description: 'Settings',
  },
];

export default function EditorNav() {
  return (
    <main className="flex h-full flex-col items-center bg-neutral-700">
      <div className="flex h-10 w-full items-center justify-start gap-3 px-4">
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-full bg-red-600"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
          <div className="h-3 w-3 rounded-full bg-green-600"></div>
        </div>
        <span className="text-sm">Editor</span>
      </div>
      <div className="flex gap-2 p-4">
        {editorItems.map((item, index) => (
          <div key={index} className="hover:text-emerald-500">
            {item.icon}
          </div>
        ))}
      </div>
      <div className="flex w-full items-start justify-start gap-2 px-6 font-semibold">
        <span>About_Me</span>
      </div>
      <div className="my-2 flex w-full flex-col gap-2 px-6">
        <div className="flex w-full">
          <ChevronRight className="h-6 w-6" />
          <div className="flex items-center justify-center gap-2 text-sm">
            <Folder className="h-6 w-6" />
            <span>Win_Cheng</span>
          </div>
        </div>
        <div className="mx-6 flex items-center gap-2 text-sm">
          <FileJson className="h-6 w-6" />
          <span>index.js</span>
        </div>
      </div>
    </main>
  );
}
