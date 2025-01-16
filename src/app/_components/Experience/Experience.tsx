'use client';
import Component_Header from '@/app/_components/Component_Header';
import Rhombus_logo from '@public/experiences/Rhombus.svg';
import HackDavis_logo from '@public/experiences/HackDavis.svg';
import Kebloom from '@public/experiences/Kebloom.svg';
import AggieWorks_logo from '@public/experiences/aggieworks_logo.jpeg';
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
import { TracingBeam } from '@/components/ui/tracing-beam';

type ExperienceProp = {
  company: string;
  position: string;
  description: string;
  date: string;
  icon: StaticImageData;
  url: string;
  location: string;
};

const ExperienceProps: ExperienceProp[] = [
  {
    company: 'AggieWorks',
    position: 'Software Engineer',
    description:
      'Led the development of a local business engagement platform \
      enabling 35k+ students to discover deals, \
      increasing engagement with local businesses',
    date: 'Sep 2024 - Current',
    icon: AggieWorks_logo,
    url: 'https://aggieworks.org/',
    location: 'Davis, CA',
  },
  {
    company: 'Rhombus',
    position: 'Software Engineer Intern',
    description:
      'Built a user interface for frontend web admin console to highlight \
      camera visual environment through computer vision and machine learning',
    date: 'Jun 2024 - Sep 2024',
    icon: Rhombus_logo,
    url: 'https://www.rhombus.com/',
    location: 'Sacramento, CA',
  },
  {
    company: 'HackDavis',
    position: 'Techincal Product Manager',
    description:
      'Deployed a website and judging app for a 1000+ person hackathon. \
      with 275k+ visitors, 8300 unique visitors at peak month',
    date: 'Sep 2023 - Current',
    icon: HackDavis_logo,
    url: 'https://2024.hackdavis.io/',
    location: 'Davis, CA',
  },
  {
    company: 'Kebloom',
    position: 'Software Engineer Intern',
    description:
      'Developed a mobile application attracting over 300+ active early users',
    date: 'Jun 2023 - Aug 2023',
    icon: Kebloom,
    url: 'https://www.kebloom.com/',
    location: 'San Francisco, CA',
  },
];

export default function Experience() {
  return (
    <main className="flex w-full flex-col">
      <Component_Header title="Experience" />
      <div className="w-full pl-8 sm:px-6 md:px-8 lg:px-10">
        <TracingBeam className="px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex w-full flex-col gap-6 py-6 sm:py-8">
            {ExperienceProps.map((experience) => (
              <motion.div key={experience.company} className={`w-full`}>
                <Link href={experience.url} target="_blank">
                  <Card className="hover:bg-slate-200 dark:bg-sky-950 dark:hover:bg-slate-700">
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
                          className="h-8 w-8 rounded-full sm:h-10 sm:w-10 md:h-12 md:w-12"
                        />
                      </div>
                      <CardDescription className="text-sm sm:text-base">
                        <i>{experience.position}</i>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base">
                        {experience.description
                          .split(/(\d+(?:\.\d+)?k?\+?)/)
                          .map((part, index) =>
                            /^\d+(?:\.\d+)?k?\+?$/.test(part) ? (
                              <span
                                key={index}
                                className="text-lg font-bold text-orange-500"
                              >
                                {part}
                              </span>
                            ) : (
                              part
                            )
                          )}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex w-full justify-between ">
                        <p className="text-xs sm:text-sm">
                          {experience.location}
                        </p>
                        <p className="text-xs sm:text-sm">{experience.date}</p>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TracingBeam>
      </div>
    </main>
  );
}
