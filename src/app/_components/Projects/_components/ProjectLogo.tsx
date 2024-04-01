import Image from 'next/image';
import type { ProjectItem } from '../Projects';

export default function ProjectLogo(project: ProjectItem) {
  return (
    <main className="absolute top-5 flex aspect-square size-12 rounded-full before:absolute before:-inset-2 before:rounded-full">
      {project.logo && (
        <Image
          src={project.logo}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      )}
    </main>
  );
}
