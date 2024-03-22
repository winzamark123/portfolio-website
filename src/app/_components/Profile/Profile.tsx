import Myself from './_components/Myself';
export default function Profile() {
  return (
    <main className="flex h-full w-full">
      <div className="flex w-2/3 border border-white"></div>
      <div className="flex w-1/3">
        <Myself />
      </div>
    </main>
  );
}
