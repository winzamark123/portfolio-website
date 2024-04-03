import { motion } from 'framer-motion';
import Image from 'next/image';

import type { ProjectItem } from '../../Projects';

const HackDavisDisplayMotion = {
  rest: {
    x: 40,
    y: 50,
    scale: 1.5,
    transition: { duration: 1, delay: 0.5 },
  },
  hover: {
    x: 0,
    y: 0,
    scale: 1,
  },
};

const HackDavisWindowMotion = {
  rest: {
    y: 100,
    transition: { duration: 1, delay: 0.5 },
  },
  hover: {
    y: 20,
    x: -20,
  },
};

const JustSayinDisplayMotion = {
  rest: {
    transition: { duration: 1, delay: 0.5 },
  },
  hover: {
    y: 0,
  },
};
const JustSayinWindowMotion = {
  rest: {
    y: 50,
    x: 100,
    rotate: -30,
    transition: { duration: 1, delay: 0.5 },
  },
  hover: {
    y: 60,
    x: 0,
    rotate: 0,
  },
};

const SmallWindowMotion = {
  rest: {
    transition: { duration: 1, delay: 0.5 },
  },
  hover: {
    y: 0,
  },
};
const SmallDisplayMotion = {
  rest: {
    transition: { duration: 1, delay: 0.5 },
    scale: 1,
    opacity: 1,
    y: 0,
  },
  hover: {
    y: 50,
    opacity: 0,
  },
};

export function HackDavisProjectDisplay(project: ProjectItem) {
  return (
    <motion.main
      className="relative h-fit overflow-hidden rounded-tl-lg"
      variants={HackDavisWindowMotion}
    >
      <div className="absolute z-10 flex h-6 w-full gap-1 rounded-2xl">
        <div className="flex w-full gap-2 rounded-2xl p-2 ">
          <span className="block size-2 rounded-full border bg-red-400 dark:border-white/10"></span>
          <span className="block size-2 rounded-full border bg-yellow-400 dark:border-white/10"></span>
          <span className="block size-2 rounded-full border bg-green-400 dark:border-white/10"></span>
        </div>
      </div>
      <motion.div
        className="z-0 flex h-half-screen"
        variants={HackDavisDisplayMotion}
      >
        {project && project.contentImage && (
          <Image
            src={project.contentImage}
            alt={project.title}
            className="z-0"
          />
        )}
      </motion.div>
    </motion.main>
  );
}
export function JustSayinProjectDisplay(project: ProjectItem) {
  return (
    <motion.main
      className="relative overflow-hidden rounded-tl-lg"
      variants={JustSayinWindowMotion}
    >
      <motion.div className="z-0 flex" variants={JustSayinDisplayMotion}>
        {project && project.contentImage && (
          <Image src={project.contentImage} alt={project.title} />
        )}
      </motion.div>
    </motion.main>
  );
}
export function SmallProjectDisplay(project: ProjectItem) {
  return (
    <motion.main
      className="relative overflow-hidden rounded-tl-lg "
      variants={SmallWindowMotion}
    >
      <motion.div className="z-0 flex" variants={SmallDisplayMotion}>
        {project && project.contentImage && (
          <Image src={project.contentImage} alt={project.title} />
        )}
      </motion.div>
    </motion.main>
  );
}
