import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import {
  GitBranch,
  FileJson,
  Folder,
  Search,
  Blocks,
  Settings,
  ChevronDown,
  FolderClosed,
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

export default function Editor() {
  return (
    <main className="h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg ">
        <ResizablePanel defaultSize={30} className="border border-white">
          <div className="flex h-full flex-col items-center bg-neutral-800">
            <div className="flex h-10 w-full items-center justify-start gap-3 border border-white px-4">
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
            <div className="flex w-full flex-col border border-red-500">
              <ChevronRight className="h-6 w-6" />
              <div className="flex flex-row items-center justify-center gap-2 text-sm">
                <Folder className="h-6 w-6" />
                <span>Win_Cheng</span>
              </div>
              <div className="">
                <FileJson className="h-6 w-6" />
                <span>index.js</span>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={10} className="">
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex h-full w-1/4 items-center justify-center gap-1 bg-neutral-800 text-xs">
                  <FileJson className="h-4 w-4" />
                  <span>index.js</span>
                </div>
                <div className="h-full w-3/4 bg-neutral-900"></div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80} className="">
              <div className="flex h-full items-center justify-center bg-neutral-900 p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="">
              <div className="flex h-full items-center justify-end gap-3 bg-neutral-800 p-6 text-xs font-extralight text-gray-500">
                <span> Normal --</span>
                <span>Line 5:36</span>
                <span>UTF8</span>
                <span>2 spaces</span>
                <div className="flex">
                  <GitBranch className="h-4 w-4" />
                  <span>main</span>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
