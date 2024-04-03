import Image from 'next/image';
import { motion } from 'framer-motion';
import Cow from '@public/projects/HackDavis/cow.svg';
import Duck from '@public/projects/HackDavis/duck.svg';
import Frog from '@public/projects/HackDavis/frog.svg';
import Rabbit from '@public/projects/HackDavis/rabbit.svg';

import type { ProjectItem } from '../../Projects';

const HackDavisText = {
  rest: {
    y: 100,
    opacity: 0,
    transition: { duration: 1, delay: 0.5 },
  },
  hover: {
    y: 0,
    opacity: 1,
  },
};
const HackDavisTitle = {
  rest: {
    y: 50,
    opacity: 1,
    transition: { duration: 1, delay: 0.5 },
  },
  hover: {
    y: 0,
    opacity: 0,
  },
};
const animalMotion = {
  rest: {
    y: 30,
  },
  hover: {
    y: 0,
  },
};

const JustSayinText = {
  rest: {
    x: 100,
    opacity: 0,
    transition: { duration: 1, delay: 0.5 },
  },
  hover: {
    x: 0,
    opacity: 1,
  },
};

const JustSayinTitle = {
  rest: {
    y: 50,
    opacity: 1,
    transition: { duration: 1, delay: 0.5 },
  },
  hover: {
    y: 0,
    opacity: 0,
  },
};

export function HackDavisProjectContent(project: ProjectItem) {
  return (
    <main className="relative z-10 flex flex-col justify-end px-5 text-white">
      <motion.div
        className="absolute top-1/4 flex flex-col items-center dark:text-white"
        variants={HackDavisTitle}
      >
        <h1>{project.title}</h1>
        <span>{project.type}</span>
      </motion.div>
      <motion.div className="" variants={HackDavisText}>
        <span className="flex gap-2 text-lg font-medium transition ">
          {project.descriptionTitle}
        </span>
        <p className="p-5 pl-0">{project.description}</p>
      </motion.div>
      <motion.div className="flex items-end" variants={animalMotion}>
        <Image src={Rabbit} alt="Rabbit" className="" />
        <Image src={Duck} alt="Duck" className="" />
        <Image src={Cow} alt="Cow" className="" />
        <Image src={Frog} alt="Frog" className="" />
      </motion.div>
    </main>
  );
}
export function JustSayinProjectContent(project: ProjectItem) {
  return (
    <main className="relative z-10 flex flex-col justify-end text-white ">
      <motion.div
        className="absolute top-1/4 flex flex-col items-center dark:text-white"
        variants={JustSayinTitle}
      >
        <h1>{project.title}</h1>
        <span>{project.type}</span>
      </motion.div>
      <motion.div className="" variants={JustSayinText}>
        <span className="flex gap-2 text-lg font-medium transition ">
          {project.descriptionTitle}
        </span>
        <p className="p-5 pl-0">{project.description}</p>
      </motion.div>
    </main>
  );
}
export function DavisPNGProjectContent(project: ProjectItem) {
  return (
    <main className="relative z-10 flex flex-col justify-end text-white ">
      <motion.div
        className="absolute top-1/4 flex flex-col items-center dark:text-white"
        variants={JustSayinTitle}
      >
        <h1>{project.title}</h1>
        <span>{project.type}</span>
      </motion.div>
      <motion.div className="" variants={JustSayinText}>
        <span className="flex gap-2 text-lg font-medium transition ">
          {project.descriptionTitle}
        </span>
        <p className="p-5 pl-0">{project.description}</p>
      </motion.div>
    </main>
  );
}
