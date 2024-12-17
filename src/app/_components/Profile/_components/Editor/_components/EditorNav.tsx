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
    icon: <Folder className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    description: 'Folder',
  },
  {
    icon: <GitBranch className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    description: 'Branch',
  },
  {
    icon: <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    description: 'Search',
  },
  {
    icon: <Blocks className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    description: 'Blocks',
  },
  {
    icon: <Settings className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    description: 'Settings',
  },
];

export default function EditorNav() {
  return (
    <main className="flex h-full flex-col flex-wrap items-center bg-neutral-700">
      <div className="flex h-8 w-full items-center justify-start gap-2 px-1 sm:h-9 sm:gap-3 sm:px-2 md:h-10 md:px-4">
        <div className="hidden gap-1 sm:flex">
          <div className="h-2 w-2 rounded-full bg-red-600 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-600 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"></div>
          <div className="h-2 w-2 rounded-full bg-green-600 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"></div>
        </div>
        <span className="text-xs sm:text-sm">Editor</span>
      </div>
      <div className="flex flex-col flex-wrap gap-2 p-1 sm:gap-3 sm:p-2 md:flex-row md:p-4">
        {editorItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 hover:text-emerald-500 sm:gap-2"
          >
            {item.icon}
            <span className="text-[10px] sm:text-xs md:hidden">
              {item.description}
            </span>
          </div>
        ))}
      </div>
      <div className="flex w-full items-start justify-start gap-1 sm:gap-2 sm:px-4">
        <span className=" text-xs font-semibold sm:text-sm md:text-base">
          About_Me
        </span>
      </div>
      <div className="my-1 flex w-full flex-col gap-1 px-2 sm:my-2 sm:gap-2 sm:px-3 md:px-6">
        <div className="flex w-full">
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          <div className="flex items-center gap-1 sm:gap-2">
            <Folder className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            <span className="text-xs sm:text-sm">Win_Cheng</span>
          </div>
        </div>
        <div className="mx-3 flex items-center gap-1 sm:mx-4 sm:gap-2 md:mx-6">
          <FileJson className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          <span className="text-xs sm:text-sm">index.js</span>
        </div>
      </div>
    </main>
  );
}
