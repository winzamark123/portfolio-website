import BentoBox from './_components/BentoBox';

export type ProjectItem = {
  title: string;
  description: string;
  github_repo: string;
  url?: string;
};

const ProjectList: ProjectItem[] = [
  {
    title: 'JustSayin',
    description:
      'Mobile application displaying daily quotes from your favorite authors on your lock screen widget',
    github_repo: 'https://github.com/winzamark123/JustSayin',
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

export default function Projects() {
  return (
    <main>
      <BentoBox ProjectList={ProjectList} />
    </main>
  );
}
