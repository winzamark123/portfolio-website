interface TagProps {
  TagProp: string;
  numberProp?: number;
}

export default function Tag({ TagProp, numberProp = 0 }: TagProps) {
  return (
    <main className="h-full w-full bg-transparent">
      <div className="flex h-full flex-wrap items-center justify-end gap-2">
        {Array.from({ length: numberProp }).map((_, index) => (
          <div key={index} className="flex">
            <p className="text-sm text-gray-600 sm:text-base md:text-lg lg:text-2xl">
              {TagProp}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
