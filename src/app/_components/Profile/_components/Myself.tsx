import Image from 'next/image';
import profile_pic from '@public/profile_pic.png';

export default function Myself() {
  return (
    <main className="grid grid-cols-5 grid-rows-5 gap-4">
      <div className="col-span-4 border border-white">
        <Image src={profile_pic} alt="profile_pic" />
      </div>
      <div className="col-span-1 row-span-5 flex items-start rounded-2xl border bg-emerald-600">
        <p className="rotate-90 py-10">https://github.com/winzamark123</p>
      </div>
      <div className="col-span-4 row-start-5 border border-purple-500">
        <div className="flex"></div>
      </div>
    </main>
  );
}
