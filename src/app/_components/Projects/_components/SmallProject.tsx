'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { SmallProjectContent } from './_utils/ProjectContent';
import ProjectLogo from './_utils/ProjectLogo';
import { SmallProjectDisplay } from './_utils/ProjectDisplay';

import type { ProjectItem } from '../Projects';

export default function DavisPNGProject(project: ProjectItem) {
  return (
    <motion.main initial="rest" animate="rest" whileHover="hover">
      <Link href={project.url}>
        <div className="flex flex-col gap-3 p-5 pt-20">
          <div className="absolute top-5 flex aspect-square size-12">
            <ProjectLogo {...project} />
          </div>
          <SmallProjectContent {...project} />
          <div className="">
            <SmallProjectDisplay {...project} />
          </div>
        </div>
      </Link>
    </motion.main>
  );
}
