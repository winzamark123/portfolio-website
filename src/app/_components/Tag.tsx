interface TagProps {
  TagProp: string;
  numberProp?: number;
}

export default function Tag({ TagProp, numberProp = 0 }: TagProps) {
  return (
    <main className="f-full w-full bg-transparent">
      <div className="flex h-full items-center justify-end">
        {Array.from({ length: numberProp }).map((_, index) => (
          <div key={index} className="flex">
            <p className="text-2xl text-gray-600">{TagProp}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
