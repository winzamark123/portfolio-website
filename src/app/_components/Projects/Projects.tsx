import BentoBox from './_components/BentoBox';

export type ProjectItem = {
  title: string;
  description: string;
  github_repo: string;
  url?: string;
  colSpan: number;
};

const ProjectList: ProjectItem[] = [
  {
    title: 'JustSayin',
    description:
      'Mobile application displaying daily quotes from your favorite authors on your lock screen widget',
    github_repo: 'https://github.com/winzamark123/JustSayin',
    colSpan: 3,
  },
  {
    title: 'HackDavis Website',
    description:
      'Created a website for HackDavis 2024 to promote the event \
    and provide information for attendees. The website had a traffic \
    of 275,560 hits per month. With 8,300 unique visitors',
    github_repo: '',
    colSpan: 3,
    url: 'https://hackdavis.io/',
  },
  {
    title: 'LStore Database',
    description:
      'Implemented a Lineage-based Data Store (LStore) \
    which combines real-time processing of transactional and \
    analytical workloads ran with concurrency using update-friendly lineage-based storage architecture',
    github_repo: '',
    colSpan: 3,
  },
  {
    title: 'DavisPNG',
    description:
      'A website marketplcae which matches student-photographers. \
    with clients. Focused on providing a platform for students. ',
    github_repo: 'https://github.com/winzamark123/DavisPNG_Frontend',
    colSpan: 2,
    url: 'https://davispng.com/',
  },
];

export default function Projects() {
  return (
    <main>
      <h1>Projects</h1>
      <BentoBox ProjectList={ProjectList} />
    </main>
  );
}
