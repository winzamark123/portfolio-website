import {
  siReact,
  siNextdotjs,
  siNodedotjs,
  siMongodb,
  siTypescript,
  siPython,
  siCplusplus,
  siFlask,
  siPostgresql,
} from 'simple-icons';

import type { SimpleIcon } from 'simple-icons';

type contentItem = {
  icon: SimpleIcon;
  description: string;
};

const contentFrameworks: contentItem[] = [
  {
    icon: siNextdotjs,
    description: 'NextJS',
  },
  {
    icon: siReact,
    description: 'React',
  },
  {
    icon: siNodedotjs,
    description: 'NodeJS',
  },
  {
    icon: siFlask,
    description: 'Flask',
  },
];

const contentLanguages: contentItem[] = [
  {
    icon: siTypescript,
    description: 'Typescript',
  },
  {
    icon: siCplusplus,
    description: 'C++',
  },
  {
    icon: siPython,
    description: 'Python',
  },
];

const contentDatabases: contentItem[] = [
  {
    icon: siMongodb,
    description: 'MongoDB',
  },
  {
    icon: siPostgresql,
    description: 'PostgreSQL',
  },
];

function contentDisplay(title: string, contentType: contentItem[]) {
  return (
    <div className="flex flex-col gap-1">
      <span>{title}</span>
      <div className="flex gap-5 ">
        {contentType.map((item, index) => (
          <div key={index} className="group hover:text-emerald-600">
            <svg
              className="w-15 h-10"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={item.icon.path} />
            </svg>
            <span className="absolute ml-5 hidden w-max rounded-md bg-black px-2 py-2 text-sm text-white group-hover:block">
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EditorContent() {
  return (
    <main className="flex h-full flex-col gap-3 bg-neutral-900 p-6">
      <span className="">
        Hi my name is Win Cheng, Software Engineer. I am a full stack developer
        with experiences in the following:
      </span>
      <div className="flex flex-col gap-4">
        <div className="">
          {contentDisplay('Frameworks:', contentFrameworks)}
        </div>
        <div className="">{contentDisplay('Languages:', contentLanguages)}</div>
        <div className="">{contentDisplay('Databases:', contentDatabases)}</div>
      </div>
    </main>
  );
}
