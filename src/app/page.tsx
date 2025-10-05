'use client';
// import Projects from './_components/Projects/Projects';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  SocialProps,
  NavItems,
  ExperienceProps,
  ProjectList,
} from './_components/const';
import { useState, useEffect } from 'react';

const content = {
  title: "hey, i'm Win",
  description: "i'm a full-stack engineer based in San Francisco",
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = searchParams.get('tab') || 'experience';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/?tab=${tab}`);
  };

  return (
    <main className="flex h-screen max-h-screen w-screen items-center overflow-hidden">
      <div className="flex h-full w-1/2 items-center justify-center p-10 sm:p-1/10">
        {landing()}
      </div>
      <div className="flex w-1/2 flex-col items-center gap-4 px-10 py-32">
        {works_nav(activeTab, handleTabChange)}
        <div className="max-h-96 overflow-y-auto">
          {activeTab === 'experience' && experience()}
          {activeTab === 'projects' && projects()}
        </div>
      </div>
    </main>
  );
}

const landing = () => {
  return (
    <div className="flex w-fit flex-col gap-4 overflow-hidden sm:-mt-10">
      <div className="">
        <h1 className="text-4xl">{content.title}</h1>
        <p className="text-sm">{content.description}</p>
      </div>
      {social()}
    </div>
  );
};

const social = () => {
  return (
    <div className="flex items-center gap-4">
      {SocialProps.map((social, index) => (
        <Link
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center"
        >
          <div className="hover:text-emerald-500">{social.icon}</div>
        </Link>
      ))}
    </div>
  );
};

const works_nav = (activeTab: string, setActiveTab: (tab: string) => void) => {
  return (
    <div className="flex flex-row gap-8">
      {NavItems.map((item, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(item.id)}
          className={`hover:underline hover:underline-offset-[3px] ${
            activeTab === item.id ? 'underline underline-offset-[3px]' : ''
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

const experience = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      {ExperienceProps.map((experience) => (
        <div key={experience.company} className="flex flex-col gap-2">
          <h2 className="font-lora text-xl font-bold">{experience.company}</h2>
          <div className="flex flex-col">
            <p className="text-sm">{experience.position}</p>
            <p className="text-sm">{experience.description}</p>
            <p className="text-sm">{experience.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const projects = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {ProjectList.map((project) => (
        <div
          key={project.title}
          className="flex w-32 flex-col gap-2 rounded-md border p-4"
        >
          <h2 className="font-lora text-lg font-bold">{project.title}</h2>
          {/* <p className="text-sm">{project.description}</p> */}
          {/* <p className="text-sm">{project.tech_tags.join(', ')}</p> */}
        </div>
      ))}
    </div>
  );
};
