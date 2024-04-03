'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { HackDavisProjectContent } from './_utils/ProjectContent';
import ProjectLogo from './_utils/ProjectLogo';
import { HackDavisProjectDisplay } from './_utils/ProjectDisplay';

import type { ProjectItem } from '../Projects';

export default function HackDavisProject(project: ProjectItem) {
  return (
    <motion.main initial="rest" animate="rest" whileHover="hover">
      <Link href="https://davispng.com/">
        <div className="grid sm:grid-cols-2">
          <div className="absolute top-5 flex aspect-square size-12">
            <ProjectLogo {...project} />
          </div>
          <HackDavisProjectContent {...project} />
          <HackDavisProjectDisplay {...project} />
        </div>
      </Link>
    </motion.main>
  );
}
