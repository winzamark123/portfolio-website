import Link from 'next/link';

export default function Blog_Tag() {
  return (
    <main className="absolute right-0 top-0 flex w-28 flex-col items-center justify-center p-2 sm:w-32 md:w-36 lg:w-40 lg:p-4">
      <Link className="w-full" href="/blog">
        <div className="group relative flex w-full flex-col gap-1 overflow-hidden p-1 sm:gap-2 sm:p-2">
          <hr className="custom-dashed z-20" />
          <div className="flex items-center justify-center">
            <h3 className="relative z-10 text-xs italic sm:text-sm md:text-base lg:text-lg">
              BLOG
            </h3>
          </div>
          <hr className="custom-dashed z-20" />
          <div
            className="absolute inset-0 -z-0 translate-x-[100%] rounded-l-xl bg-emerald-300
          bg-opacity-50 transition-transform duration-300 ease-in-out group-hover:translate-x-0"
          ></div>
        </div>
      </Link>
    </main>
  );
}
