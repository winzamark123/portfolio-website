'use client';
import Component_Header from '@/app/_components/Component_Header';
import Link from 'next/link';
import Image from 'next/image';

import { motion } from 'framer-motion';

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export type ProjectItem = {
  title: string;
  description: string;
  github_repo: string;
  url: string;
  contentImage_url: string;
  tech_tags: string[];
};

const ProjectList: ProjectItem[] = [
  {
    title: 'caMOOra',
    description:
      'A website marketplcae which matches student-photographers. \
    with clients. Focused on providing a platform for students. ',
    github_repo: 'https://github.com/winzamark123/caMOOra',
    url: 'https://camoora.io/',
    contentImage_url: '/projects/Camoora/ipad.png',
    tech_tags: [
      'TYPESCRIPT',
      'Next.js',
      'TailwindCSS',
      'MongoDB',
      'POSTGRESQL',
      'tRPC',
      'AWS S3',
    ],
  },
  {
    title: 'JUSTSAYIN',
    description:
      'Mobile application displaying daily quotes from your favorite authors on your lock screen widget',
    github_repo: 'https://github.com/winzamark123/JustSayin',
    url: 'https://apps.apple.com/us/app/justsayinapp/id6502377306',
    contentImage_url: '/projects/JustSayin/iphone.png',
    tech_tags: [
      'React Native',
      'SWIFT',
      'TYPESCRIPT',
      'FIREBASE',
      'AWS',
      'JEST',
      'EXPO',
    ],
  },
];

export default function Project() {
  return (
    <main className="flex w-full flex-col">
      <Component_Header title="Projects" />
      <div className="w-full px-4">
        <div className="grid grid-cols-1 gap-6">
          {ProjectList.map((project) => (
            <motion.div key={project.title} className="h-full">
              <Link href={project.url} target="_blank" className="h-full">
                <Card className="flex h-full flex-col p-4 hover:bg-slate-200 dark:bg-sky-950 dark:hover:bg-slate-700">
                  <div className="flex h-full flex-col lg:flex-row">
                    <div className="flex flex-1 flex-col">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg sm:text-xl md:text-2xl">
                            {project.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm sm:text-base">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex flex-wrap gap-2">
                          {project.tech_tags.map((tag, index) => (
                            <div
                              key={index}
                              className="rounded-full bg-gray-200 px-3 py-1 text-sm dark:bg-gray-800"
                            >
                              {tag.toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2">
                          <Link
                            href={project.github_repo}
                            target="_blank"
                            className="rounded-full bg-gray-800 p-2 hover:bg-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="30"
                              height="30"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                          </Link>
                        </div>
                      </CardFooter>
                    </div>
                    <div className="relative h-[200px] lg:mt-0 lg:h-full lg:w-1/2">
                      {project.contentImage_url && (
                        <Image
                          src={project.contentImage_url}
                          alt={project.title}
                          className="rounded-lg object-contain"
                          fill
                        />
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
