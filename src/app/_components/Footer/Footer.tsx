export default function Footer() {
  const LineClass = 'flex-grow list-none h-0.5 bg-gray-500';
  return (
    <main className="flex h-third-screen w-full flex-col justify-center p-5">
      <div className="flex items-center justify-center ">
        <li className={LineClass} />
        <div className="flex flex-col items-center justify-center p-5 text-3xl font-semibold">
          <span>WIN CHENG'S</span>
          <span>PORTFOLIO</span>
        </div>
        <li className={LineClass} />
      </div>
      <div className="flex items-center justify-center text-emerald-400">
        <span>Lets Get in Touch!</span>
      </div>
    </main>
  );
}
