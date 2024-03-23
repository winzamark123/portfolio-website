import { ArrowBigDownDash } from 'lucide-react';

export default function Landing() {
  return (
    <main className="flex h-full w-full flex-col">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h1 className="text-7xl">Software</h1>
          <h1 className="text-7xl">Engineer</h1>
        </div>
        <p className="mt-10 flex justify-center">
          {'</'}Full-Stack Developer, CS Grad 2025{'>'}
        </p>
        <h1 className="mt-32 flex justify-end text-7xl">WIN CHENG</h1>
        <div className="flex w-full flex-col items-center justify-center">
          <ArrowBigDownDash size={50} className="m-auto" />
          <p>SCROLL</p>
        </div>
      </div>
    </main>
  );
}
