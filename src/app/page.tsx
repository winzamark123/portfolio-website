export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex border border-white w-10 h-10"></div>
      <div className="flex border border-blue-500 w-10 h-10"></div>
      <div className="flex border border-spacing-20 border-blue-800 w-32 h-96"></div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {'Button'}
      </button>
    </main>
  );
}
