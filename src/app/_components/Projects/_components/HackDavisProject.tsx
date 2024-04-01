'use client';
import { motion } from 'framer-motion';

import ProjectContent from './_utils/ProjectContent';
import ProjectLogo from './_utils/ProjectLogo';
import ProjectDisplay from './_utils/ProjectDisplay';

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
        <ProjectDisplay {...project} />
      </div>
    </motion.main>
  );
}
