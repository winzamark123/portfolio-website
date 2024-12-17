export default function Component_Header({ title }: { title: string }) {
  return (
    <main className="flex w-full flex-col items-center justify-between gap-4 p-4 sm:flex-row">
      <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </main>
  );
}
