import React from 'react';
import Rhombus_logo from '@public/logos/Rhombus.svg';
import Rhombus_bg from '@public/logos/Rhombus_back_logo.png';
import HackDavis_logo from '@public/logos/HackDavis.svg';
import HackDavis_bg from '@public/logos/HackDavis_back_logo.png';
import Kebloom from '@public/logos/Kebloom.svg';
import Kebloom_bg from '@public/logos/Kebloom_back_logo.png';
import TASA from '@public/logos/TASA.svg';
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
    description: 'Incoming for Summer 2024',
    date: 'Aug 2024 - Current',
    icon: Rhombus_logo,
    bg: Rhombus_bg,
  },
  {
    company: 'HackDavis',
    position: 'Technical Director',
    description:
      'Produced a website and judging app for a 1000+ person hackathon.',
    date: 'Sep 2023 - Current',
    icon: HackDavis_logo,
    bg: HackDavis_bg,
  },
  {
    company: 'Kebloom',
    position: 'Software Engineer Intern',
    description:
      'Worked end-to-end on a mobile application and delivered to 30+ beta users.',
    date: 'Jun 2023 - Aug 2023',
    icon: Kebloom,
    bg: Kebloom_bg,
  },
  {
    company: 'Google Developer Student Club',
    position: 'Technical Lead',
    description:
      'Lead a team of 6, creating an image chat bot using OpenAI and Tesseract OCR.',
    date: 'Jan 2023 - Jun 2023',
    icon: GDSC,
    bg: GDSC_bg,
  },
  {
    company: 'TASA',
    position: 'Web Developer',
    description: 'Created a website for a 100+ person organization.',
    date: 'Sep 2022 - Sep 2023',
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
            style={
              {
                '--image-url': `url(${experience.bg.src})`,
              } as React.CSSProperties
            }
            className={`w-96 ${index % 2 === 1 ? 'ml-auto' : 'mr-auto'} bg-cover bg-no-repeat hover:bg-[image:var(--image-url)]`}
          >
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{experience.company}</CardTitle>
                <Image
                  src={experience.icon}
                  alt={experience.company}
                  width={50}
                  height={50}
                />
              </div>
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
