'use client';
import { motion } from 'framer-motion';

import ProjectContent from './_utils/ProjectContent';
import ProjectLogo from './_utils/ProjectLogo';
import Image from 'next/image';

import type { ProjectItem } from '../Projects';

export default function HackDavisProject(project: ProjectItem) {
  return (
    <motion.main
      className="relative col-span-full overflow-hidden rounded-xl border border-gray-200 bg-white pl-5 transition-colors duration-300 ease-in-out hover:bg-cyan-900 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-cyan-900 lg:col-span-6"
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      <div className="grid sm:grid-cols-2">
        <ProjectLogo {...project} />
        <ProjectContent {...project} />
        <div className="relative h-fit overflow-hidden rounded-tl-lg border dark:border-white/10 dark:bg-white/5 sm:ml-6 sm:mt-auto">
          <div className="absolute left-3 top-2 flex gap-1">
            <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
            <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
            <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
          </div>
          <div className="h-half-screen">
            {project.contentImage && (
              <Image
                src={project.contentImage}
                alt={project.title}
                layout="fill"
                objectFit="contain"
              />
            )}
          </div>
        </div>
      </div>
    </motion.main>
  );
}
