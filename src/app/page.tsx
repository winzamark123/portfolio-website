import Projects from './_components/Projects/Projects';
import Landing from './_components/Landing/Landing';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-1/10 pt-1/20">
      <div className="flex h-96 w-full border border-white">
        <Landing />
      </div>
      <div className="flex justify-normal p-2 pt-10"></div>
      <div className="flex h-96 w-full border border-blue-950">
        <Projects />
      </div>
    </main>
  );
}
