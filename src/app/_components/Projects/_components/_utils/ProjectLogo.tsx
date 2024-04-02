import Image from 'next/image';
import type { ProjectItem } from '../../Projects';

export default function ProjectLogo(project: ProjectItem) {
  return (
    <main>
      {project.logo && (
        <Image
          src={project.logo}
          alt={project.title}
          layout="fill"
          objectFit="contain"
        />
      )}
    </main>
  );
}
