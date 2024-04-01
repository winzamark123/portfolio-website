import Image from 'next/image';
import { motion } from 'framer-motion';
import Cow from '@public/projects/HackDavis/cow.svg';
import Duck from '@public/projects/HackDavis/duck.svg';
import Frog from '@public/projects/HackDavis/frog.svg';
import Rabbit from '@public/projects/HackDavis/rabbit.svg';

import type { ProjectItem } from '../../Projects';

const textMotion = {
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

const animalMotion = {
  rest: {
    y: 30,
  },
  hover: {
    y: 0,
  },
};

const titleMotion = {
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

export default function HackDavisProject(project: ProjectItem) {
  return (
    <main className="relative z-10 flex flex-col justify-end">
      <motion.div
        className="absolute top-1/4 flex flex-col items-center dark:text-white"
        variants={titleMotion}
      >
        <h1>{project.title}</h1>
        <span>{project.type}</span>
      </motion.div>
      <motion.div className="" variants={textMotion}>
        <span className="flex gap-2 text-lg font-medium text-gray-800 transition group-hover:text-purple-950 dark:text-white">
          {project.descriptionTitle}
        </span>
        <p className="text-gray-700 dark:text-gray-300">
          {project.description}
        </p>
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
