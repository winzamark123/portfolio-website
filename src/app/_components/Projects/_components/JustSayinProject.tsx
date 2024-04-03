'use client';
import { motion } from 'framer-motion';

import { JustSayinProjectContent } from './_utils/ProjectContent';
import ProjectLogo from './_utils/ProjectLogo';
import { JustSayinProjectDisplay } from './_utils/ProjectDisplay';

import type { ProjectItem } from '../Projects';

export default function JustSayinProject(project: ProjectItem) {
  return (
    <motion.main initial="rest" animate="rest" whileHover="hover">
      <div className="flex flex-col p-5 pb-0 pt-20">
        <div className="absolute right-5 top-5 flex aspect-square size-12">
          <ProjectLogo {...project} />
        </div>
        <div className="">
          <JustSayinProjectContent {...project} />
        </div>
        <JustSayinProjectDisplay {...project} />
      </div>
    </motion.main>
  );
}
