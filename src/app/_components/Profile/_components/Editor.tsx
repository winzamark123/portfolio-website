import EditorNav from './_components/EditorNav';
import EditorTop from './_components/EditorTop';
import EditorContent from './_components/EditorContent';
import EditorFooter from './_components/EditorFooter';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function Editor() {
  return (
    <main className="h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg ">
        <ResizablePanel defaultSize={25} minSize={20} className="">
          <EditorNav />
        </ResizablePanel>
        <ResizableHandle withHandle={true} direction="horizontal" />
        <ResizablePanel minSize={55}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={10} maxSize={15}>
              <EditorTop />
            </ResizablePanel>
            <ResizableHandle withHandle={true} direction="vertical" />
            <ResizablePanel defaultSize={80}>
              <EditorContent />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel maxSize={15}>
              <EditorFooter />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
