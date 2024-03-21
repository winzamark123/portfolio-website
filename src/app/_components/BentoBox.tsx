import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
type Project = {
  title: string;
  description: string;
  github_repo: string;
  url?: string;
};

const Projects: [Project] = [
  {
    title: 'JustSayin',
    description: 'Project 1 Description',
    github_repo: '',
  },
  {
    title: 'HackDavis Website',
    description:
      'Created a website for HackDavis 2024 to promote the event \
    and provide information for attendees. The website had a traffic \
    of 275,560 hits per month. With 8,300 unique visitors',
    github_repo: '',
    url: 'https://hackdavis.io/',
  },
  {
    title: 'LStore Database',
    description:
      'Implemented a Lineage-based Data Store (LStore) \
    which combines real-time processing of transactional and \
    analytical workloads ran with concurrency using update-friendly lineage-based storage architecture',
    github_repo: '',
  },
  {
    title: 'DavisPNG',
    description:
      'A website marketplcae which matches student-photographers. \
    with clients. Focused on providing a platform for students. ',
    github_repo: 'https://github.com/winzamark123/DavisPNG_Frontend',
    url: 'https://davispng.com/',
  },
];

export default function BentoBox() {
  return (
    <main className="h-full w-full justify-normal border border-white">
      <div className="h-full w-full bg-purple-500 p-20">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
