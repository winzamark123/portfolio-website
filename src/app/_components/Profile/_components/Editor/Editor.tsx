import EditorNav from './_components/EditorNav';
import EditorTop from './_components/EditorTop';
import EditorContent from './_components/EditorContent';
import EditorFooter from './_components/EditorFooter';

export default function Editor() {
  return (
    <div className="h-full min-h-[50vh] w-full text-white">
      <div className="flex h-full rounded-lg ">
        <div className="w-1/4">
          <EditorNav />
        </div>
        <div className="flex w-3/4 flex-col">
          <div className="h-[10%]">
            <EditorTop />
          </div>
          <div className="h-[75%]">
            <EditorContent />
          </div>
          <div className="h-[15%]">
            <EditorFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
