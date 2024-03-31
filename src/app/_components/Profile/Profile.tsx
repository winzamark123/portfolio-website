import Myself from './_components/Myself';
import Editor from './_components/Editor';

export default function Profile() {
  return (
    <main className="flex h-full w-full gap-4">
      <div className="flex w-2/3 ">
        <Editor />
      </div>
      <div className="flex w-1/3">
        <Myself />
      </div>
    </main>
  );
}
