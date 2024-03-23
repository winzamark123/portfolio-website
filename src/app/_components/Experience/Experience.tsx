import React from 'react';
import Rhombus_logo from '@public/logos/Rhombus.png';
import Rhombus_bg from '@public/logos/Rhombus_back_logo.png';
import HackDavis_logo from '@public/logos/HackDavis.svg';
import HackDavis_bg from '@public/logos/HackDavis_back_logo.png';
import Kebloom from '@public/logos/Kebloom.svg';
import Kebloom_bg from '@public/logos/Kebloom_back_logo.png';
import TASA from '@public/logos/TASA.png';
import TASA_bg from '@public/logos/TASA_back_logo.png';
import GDSC from '@public/logos/GDSC.svg';
import GDSC_bg from '@public/logos/GDSC_back_logo.png';

import Image from 'next/image';
import type { StaticImageData } from 'next/image';

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
  bg: StaticImageData;
};

const ExperienceProps: ExperienceProp[] = [
  {
    company: 'Rhombus',
    position: 'Software Engineer Intern',
    description: 'Description',
    date: 'August 2024 - Current',
    icon: Rhombus_logo,
    bg: Rhombus_bg,
  },
  {
    company: 'HackDavis',
    position: 'Technical Director',
    description: 'Description',
    date: 'September 2023 - Current',
    icon: HackDavis_logo,
    bg: HackDavis_bg,
  },
  {
    company: 'Kebloom',
    position: 'Software Engineer Intern',
    description: 'Description',
    date: 'June 2023 - August 2023',
    icon: Kebloom,
    bg: Kebloom_bg,
  },
  {
    company: 'Google Developer Student Club',
    position: 'Technical Lead',
    description: 'Description',
    date: 'January 2023 - June 2023',
    icon: GDSC,
    bg: GDSC_bg,
  },
  {
    company: 'TASA',
    position: 'Web Developer',
    description: 'Description',
    date: 'September 2022 - September 2023',
    icon: TASA,
    bg: TASA_bg,
  },
];

export default function Experience() {
  return (
    <main className="flex w-full flex-col ">
      <div className="flex w-full flex-col items-center">
        <h2 className="text-5xl text-emerald-600">
          {'</'}Experience{'>'}
        </h2>
      </div>
      <div className="flex w-full flex-col p-10">
        {ExperienceProps.map((experience, index) => (
          <Card
            key={experience.company}
            className={`w-96 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}
          >
            <CardHeader>
              <CardTitle>{experience.company}</CardTitle>
              <Image
                src={experience.icon}
                alt={experience.company}
                width={50}
                height={50}
              />
              <CardDescription>{experience.position}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{experience.description}</p>
            </CardContent>
            <CardFooter>
              <p>{experience.date}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
