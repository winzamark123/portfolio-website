// import Projects from './_components/Projects/Projects';
import Landing from './_components/Landing/Landing';
import Profile from './_components/Profile/Profile';
import Experience from './_components/Experience/Experience';
import Tag from './_components/Tag';
import Project from './_components/Projects/Project';
import Blog_Tag from './_components/Blog_Tag/Blog_Tag';
export default function Home() {
  return (
    <main className="w-full overflow-hidden pt-8 sm:p-1/10">
      <Blog_Tag />
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
        <Project />
      </div>
    </main>
  );
}
