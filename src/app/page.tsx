import Projects from './_components/Projects/Projects';
import Landing from './_components/Landing/Landing';
import Profile from './_components/Profile/Profile';
import Experience from './_components/Experience/Experience';
import Tag from './_components/Tag';
import New_Projects from './_components/New_Projects/New_Project';
export default function Home() {
  return (
    <main className="w-full overflow-hidden border border-white pt-8 sm:p-1/10">
      <Landing />
      <div className="hidden sm:flex">
        <Profile />
      </div>
      <div className="flex h-36 w-full">
        <Tag TagProp="</Code,Coffee,Repeat>" numberProp={1} />
      </div>
      <div className="flex h-fit w-full py-8">
        <Experience />
      </div>
      <div className="flex h-fit w-full">
        <New_Projects />
      </div>
      <div className="flex h-fit w-full">
        <Projects />
      </div>
    </main>
  );
}
