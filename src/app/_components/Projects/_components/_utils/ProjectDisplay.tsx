import { motion } from 'framer-motion';
import Image from 'next/image';

import type { ProjectItem } from '../../Projects';

const displayMotion = {
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

const windowMotion = {
  rest: {
    y: 100,
    transition: { duration: 1, delay: 0.5 },
  },
  hover: {
    y: 20,
    x: -20,
  },
};

export default function ProjectDisplay(project: ProjectItem) {
  return (
    <motion.main
      className="relative h-fit overflow-hidden rounded-tl-lg border dark:border-white/10 dark:bg-white/5"
      variants={windowMotion}
    >
      <div className="absolute z-10 flex h-6 w-full gap-1 rounded-tl-lg">
        <div className="flex gap-2 p-2">
          <span className="block size-2 rounded-full border bg-red-400 dark:border-white/10"></span>
          <span className="block size-2 rounded-full border bg-yellow-400 dark:border-white/10"></span>
          <span className="block size-2 rounded-full border bg-green-400 dark:border-white/10"></span>
        </div>
      </div>
      <motion.div className="z-0 flex h-half-screen" variants={displayMotion}>
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
