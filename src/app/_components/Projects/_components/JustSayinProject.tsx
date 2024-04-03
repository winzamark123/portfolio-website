'use client';
import { motion } from 'framer-motion';

import { JustSayinProjectContent } from './_utils/ProjectContent';
import ProjectLogo from './_utils/ProjectLogo';
import { JustSayinProjectDisplay } from './_utils/ProjectDisplay';
import Link from 'next/link';

import type { ProjectItem } from '../Projects';

export default function JustSayinProject(project: ProjectItem) {
  return (
    <motion.main initial="rest" animate="rest" whileHover="hover">
      <Link href="https://github.com/winzamark123/JustSayin">
        <div className="flex flex-col px-5 pt-20">
          <div className="absolute right-5 top-5 flex aspect-square size-12">
            <ProjectLogo {...project} />
          </div>
          <div className="">
            <JustSayinProjectContent {...project} />
          </div>
          <JustSayinProjectDisplay {...project} />
        </div>
      </Link>
    </motion.main>
  );
}
