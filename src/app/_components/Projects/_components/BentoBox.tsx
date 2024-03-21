import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

import { ProjectItem } from '../Projects';

type ProjectListProps = {
  ProjectList: ProjectItem[];
};

export default function BentoBox({ ProjectList }: ProjectListProps) {
  return (
    <main className="h-full w-full justify-normal border border-white">
      <div className="h-full w-full bg-purple-500 p-20">
        {ProjectList.map((project) => (
          <Card key={project.title}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{project.description}</p>
            </CardContent>
            <CardFooter>
              <p>{project.github_repo}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
