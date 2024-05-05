import Projects from './_components/Projects/Projects';
import Landing from './_components/Landing/Landing';
import Profile from './_components/Profile/Profile';
import Experience from './_components/Experience/Experience';
import Tag from './_components/Tag';
export default function Home() {
  return (
    <main className="min-h-screen max-w-screen-2xl p-1/10 pt-1/20">
      <div className="flex h-screen-4/5 w-full ">
        <Landing />
      </div>
      <div className="flex h-half-screen w-full">
        <Profile />
      </div>
      <div className="flex h-36 w-full">
        <Tag TagProp="</Code,Coffee,Repeat>" numberProp={3} />
      </div>
      <div className="flex h-fit w-full py-8">
        <Experience />
      </div>
      <div className="flex h-fit w-full ">
        <Projects />
      </div>
    </main>
  );
}
