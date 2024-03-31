import Image from 'next/image';
import profile_pic from '@public/profile_pic.png';
import { ArrowLeftSquare } from 'lucide-react';

export default function Myself() {
  return (
    <main className="grid grid-cols-5 grid-rows-10 gap-4">
      <div className="relative col-span-4 row-span-9">
        <Image
          src={profile_pic}
          alt="profile_pic"
          fill
          objectFit="cover"
          className="rounded-2xl"
        />
      </div>
      <div className="col-span-1 row-span-10 flex items-center rounded-2xl border bg-emerald-600">
        <span className="mt-56 -rotate-90 transform font-bold text-black">
          https://github.com/winzamark123
        </span>
      </div>
      <div className="col-span-4 row-start-10">
        <div className="flex gap-3">
          <ArrowLeftSquare className="h-6 w-6" />
          <span>Try Playing Around!</span>
        </div>
      </div>
    </main>
  );
}
