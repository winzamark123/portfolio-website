import Image from 'next/image';
import profile_pic from '@public/profile_pic.png';

export default function Myself() {
  return (
    <main className="grid grid-cols-5 grid-rows-6 gap-4">
      <div className="relative col-span-4 row-span-5 border border-white">
        <Image src={profile_pic} alt="profile_pic" />
      </div>
      <div className="col-span-1 row-span-6 flex items-start rounded-2xl border bg-emerald-600">
        <p className="rotate-90 py-10">https://github.com/winzamark123</p>
      </div>
      <div className="col-span-4 row-start-6 border border-purple-500">
        <div className="flex"></div>
      </div>
    </main>
  );
}
