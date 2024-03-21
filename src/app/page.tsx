import BentoBox from './_components/BentoBox';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <div className="flex h-10 w-10 border border-white"></div>
      <div className="flex h-10 w-10 border border-blue-500"></div>
      <div className="flex h-96 w-32 border-spacing-20 border border-blue-800"></div>
      <div className="flex h-96 w-full border border-blue-950">
        <BentoBox />
      </div>
    </main>
  );
}
