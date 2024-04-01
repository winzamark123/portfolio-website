'use client';
import { motion } from 'framer-motion';

import ProjectContent from './_utils/ProjectContent';
import ProjectLogo from './_utils/ProjectLogo';
import ProjectDisplay from './_utils/ProjectDisplay';

import type { ProjectItem } from '../Projects';

export default function JustSayinProject(project: ProjectItem) {
  return (
    <motion.main
      className="relative col-span-full overflow-hidden rounded-xl border border-white pl-5 transition-colors duration-300 ease-in-out hover:bg-rose-900 lg:col-span-6"
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      <div className="grid sm:grid-cols-2">
        <div className="absolute right-5 top-5 flex aspect-square size-12">
          <ProjectLogo {...project} />
        </div>
        <ProjectContent {...project} />
        <ProjectDisplay {...project} />
      </div>
    </motion.main>
  );
}
