import Myself from './_components/Myself';
import Editor from './_components/Editor/Editor';

export default function Profile() {
  return (
    <main className="flex h-full w-full flex-col gap-4 lg:flex-row">
      <div className="flex w-full lg:w-2/3">
        <Editor />
      </div>
      <div className="flex w-full lg:w-1/3">
        <Myself />
      </div>
    </main>
  );
}
