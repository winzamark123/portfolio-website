'use client';
import Rhombus_logo from '@public/experiences/Rhombus.svg';
import HackDavis_logo from '@public/experiences/HackDavis.svg';
import Kebloom from '@public/experiences/Kebloom.svg';
import Link from 'next/link';

import { motion } from 'framer-motion';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

type ExperienceProp = {
  company: string;
  position: string;
  description: string;
  date: string;
  icon: StaticImageData;
  url: string;
};

const ExperienceProps: ExperienceProp[] = [
  {
    company: 'AggieWorks',
    position: 'Software Engineer',
    description:
      'Led the development of a local business engagement platform \
      for 35k+ students based in React, TypeScript, and Go, \
      enabling students to discover deals, \
      increasing engagement with local businesses',
    date: 'Sep 2024 - Current',
    icon: Rhombus_logo,
    url: 'https://aggieworks.org/',
  },
  {
    company: 'Rhombus',
    position: 'Software Engineer Intern',
    description:
      'Built a user interface for frontend web admin console to highlight \
      camera visual environment through computer vision and machine learning \
        analysis using Flask, OpenCV, React, and Three.js',
    date: 'Jun 2024 - Sep 2024',
    icon: Rhombus_logo,
    url: 'https://www.rhombus.com/',
  },
  {
    company: 'HackDavis',
    position: 'Technical Director',
    description:
      'Deployed a website and judging app for a 1000+ person hackathon.',
    date: 'Sep 2023 - Current',
    icon: HackDavis_logo,
    url: 'https://2024.hackdavis.io/',
  },
  {
    company: 'Kebloom',
    position: 'Software Engineer Intern',
    description:
      'Developed a mobile application using React Native, attracting over 300+ active early users as measured by a 30%',
    date: 'Jun 2023 - Aug 2023',
    icon: Kebloom,
    url: 'https://www.kebloom.com/',
  },
];


export default function Experience() {
  return (
    <main className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center justify-between gap-4 p-4 sm:flex-row">
        <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
          Experience
        </h2>
      </div>
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex w-full flex-col gap-6 py-6 sm:py-8">
          {ExperienceProps.map((experience, index) => (
            <motion.div
              key={experience.company}
              className={`w-full sm:w-[90%] md:w-[80%] lg:w-[500px] ${
                index % 2 === 1 ? 'sm:ml-auto' : 'sm:mr-auto'
              }`}
            >
              <Link href={experience.url} target="_blank">

              <Card className="bg-slate-400 hover:bg-slate-700 dark:bg-sky-950 dark:hover:bg-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg sm:text-xl md:text-2xl">
                        {experience.company}
                      </CardTitle>
                      <Image
                        src={experience.icon}
                        alt={experience.company}
                        width={40}
                        height={40}
                        className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                      />
                    </div>
                    <CardDescription className="text-sm sm:text-base">
                      {experience.position}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base">
                      {experience.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs sm:text-sm">{experience.date}</p>
                  </CardFooter>
              </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
