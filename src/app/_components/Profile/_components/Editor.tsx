import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function Editor() {
  return (
    <main className="h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg ">
        <ResizablePanel defaultSize={30} className="border border-white">
          <div className="flex h-[20px] items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              defaultSize={10}
              className="border border-purple-500"
            >
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-full w-1/4 bg-gray-700"></div>
                <div className="h-full w-3/4 bg-gray-900"></div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
