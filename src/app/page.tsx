import Projects from './_components/Projects/Projects';
import Landing from './_components/Landing/Landing';
import Profile from './_components/Profile/Profile';
import Experience from './_components/Experience/Experience';
import Tag from './_components/Tag';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-1/10 pt-1/20">
      <div className="flex h-screen-4/5 w-full border border-white">
        <Landing />
      </div>
      <div className="flex h-half-screen w-full border border-purple-400">
        <Profile />
      </div>
      <div className="flex h-36 w-full">
        <Tag TagProp="</Code,Coffee,Repeat>" numberProp={3} />
      </div>
      <div className="flex h-fit w-full border border-white">
        <Experience />
      </div>
      <div className="flex h-fit w-full border border-white">
        <Projects />
      </div>
    </main>
  );
}
