import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

type ExperienceProp = {
  company: string;
  position: string;
  description: string;
  date: string;
};

const ExperienceProps: ExperienceProp[] = [
  {
    company: 'Rhombus',
    position: 'Software Engineer Intern',
    description: 'Description',
    date: 'August 2024 - Current',
  },
  {
    company: 'HackDavis',
    position: 'Technical Director',
    description: 'Description',
    date: 'September 2023 - Current',
  },
  {
    company: 'Kebloom',
    position: 'Software Engineer Intern',
    description: 'Description',
    date: 'June 2023 - August 2023',
  },
  {
    company: 'Google Developer Student Club',
    position: 'Technical Lead',
    description: 'Description',
    date: 'January 2023 - June 2023',
  },
  {
    company: 'TASA',
    position: 'Web Developer',
    description: 'Description',
    date: 'September 2022 - September 2023',
  },
];
export default function Experience() {
  return (
    <main className="flex w-full flex-col ">
      <div className="flex w-full flex-col items-center">
        <h2 className="text-5xl text-emerald-600">
          {'</'}Experience{'>'}
        </h2>
      </div>
      <div className="flex w-full flex-col">
        {ExperienceProps.map((experience, index) => (
          <Card key={experience.company} className="w-96">
            <CardHeader>
              <CardTitle>{experience.company}</CardTitle>
              <CardDescription>{experience.position}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{experience.description}</p>
            </CardContent>
            <CardFooter>
              <p>{experience.date}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
