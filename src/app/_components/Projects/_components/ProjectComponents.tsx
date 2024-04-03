'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

import ProjectLogo from './_utils/ProjectLogo';
import type { ProjectItem } from '../Projects';

import {
  HackDavisProjectContent,
  JustSayinProjectContent,
  SmallProjectContent,
  LStoreProjectContent,
} from './_utils/ProjectContent';
import {
  HackDavisProjectDisplay,
  JustSayinProjectDisplay,
  SmallProjectDisplay,
  LStoreProjectDisplay,
} from './_utils/ProjectDisplay';

export function HackDavisProject(project: ProjectItem) {
  return (
    <motion.main initial="rest" animate="rest" whileHover="hover">
      <Link href="https://hackdavis.io/">
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

export function JustSayinProject(project: ProjectItem) {
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

export function SmallProject(project: ProjectItem) {
  return (
    <motion.main initial="rest" animate="rest" whileHover="hover">
      <Link href={project.url}>
        <div className="flex flex-col gap-3 p-5 pt-20">
          <div className="absolute top-5 flex aspect-square size-12">
            <ProjectLogo {...project} />
          </div>
          <SmallProjectContent {...project} />
          <SmallProjectDisplay {...project} />
        </div>
      </Link>
    </motion.main>
  );
}

export function LStoreProject(project: ProjectItem) {
  return (
    <motion.main initial="rest" animate="rest" whileHover="hover">
      <Link href={project.url}>
        <div className="flex flex-col gap-3 p-5 pt-20">
          <div className="absolute top-5 flex aspect-square size-12">
            <ProjectLogo {...project} />
          </div>
          <LStoreProjectContent {...project} />
          <LStoreProjectDisplay {...project} />
        </div>
      </Link>
    </motion.main>
  );
}
