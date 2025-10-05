import { Github, Linkedin, Mail, FilePenLine, Twitter } from 'lucide-react';

export const SocialProps = [
  {
    icon: (
      <Github className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all" />
    ),
    url: 'https://github.com/winzamark123',
    description: 'Github',
  },
  {
    icon: (
      <Linkedin className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all" />
    ),
    url: 'https://www.linkedin.com/in/teeranade-cheng/',
    description: 'LinkedIn',
  },
  {
    icon: (
      <Mail className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all" />
    ),
    url: 'mailto:teeranadecheng@gmail.com',
    description: 'Mail',
  },
  {
    icon: (
      <FilePenLine className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all" />
    ),
    url: 'https://drive.google.com/drive/folders/1GgfgmE1ILgwvrgGc5d81xA4FyihqIFUn?usp=sharing',
    description: 'Resume',
  },
  {
    icon: (
      <Twitter className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all" />
    ),
    url: 'https://x.com/winzamark12',
    description: 'Twitter',
  },
];

export const NavItems = [
  {
    id: 'experience',
    label: 'experience',
  },
  {
    id: 'projects',
    label: 'projects',
  },
  {
    id: 'blog',
    label: 'blog',
  },
];

export const ExperienceProps = [
  {
    company: 'JigsawStack',
    position: 'Founding Engineer',
    description:
      'Building small langauge models (SLMs) for developer use cases',
    date: 'Jun 2025 - Current',
    // icon: JigsawStack_logo,
    url: 'https://jigsawstack.com/',
    location: 'San Francisco, CA',
  },
  {
    company: 'Bustem',
    position: 'Frontend Software Engineer',
    description:
      'Founding team at a startup reinforcing brand protection for over 8000+ e-commerce brands',
    date: 'Jan 2025 - Current',
    // icon: Bustem_logo,
    url: 'https://bustem.com/',
    location: 'San Francisco, CA',
  },
  {
    company: 'AggieWorks',
    position: 'Full-Stack Software Engineer',
    description:
      'Led the development of a local business engagement platform \
      enabling 35k+ students to discover deals, \
      increasing engagement with local businesses',
    date: 'Sep 2024 - Jan 2025',
    // icon: AggieWorks_logo,
    url: 'https://aggieworks.org/',
    location: 'Davis, CA',
  },
  {
    company: 'Rhombus',
    position: 'Software Engineer Intern',
    description:
      'Built a user interface for frontend web admin console to highlight \
      camera visual environment through computer vision and machine learning',
    date: 'Jun 2024 - Sep 2024',
    // icon: Rhombus_logo,
    url: 'https://www.rhombus.com/',
    location: 'Sacramento, CA',
  },
  {
    company: 'HackDavis',
    position: 'Techincal Product Manager',
    description:
      'Deployed a website and judging app for a 1000+ person hackathon. \
      with 275k+ visitors, 8300 unique visitors at peak month',
    date: 'Sep 2023 - Current',
    // icon: HackDavis_logo,
    url: 'https://2024.hackdavis.io/',
    location: 'Davis, CA',
  },
  {
    company: 'Kebloom',
    position: 'Software Engineer Intern',
    description:
      'Developed a mobile application attracting over 300+ active early users',
    date: 'Jun 2023 - Aug 2023',
    // icon: Kebloom,
    url: 'https://www.kebloom.com/',
    location: 'San Francisco, CA',
  },
];

export const ProjectList = [
  {
    title: 'OS Deep Research Framework',
    description:
      'An open source deep research framework for LLMs. \
    Fully customizable, modular, and easy to use. ',
    github_repo: 'https://github.com/JigsawStack/deep-research',
    contentImage_url: '/projects/Camoora/ipad.png',
    tech_tags: [
      'TYPESCRIPT',
      'Next.js',
      'TailwindCSS',
      'MongoDB',
      'POSTGRESQL',
      'tRPC',
      'AWS S3',
    ],
  },
  {
    title: 'caMOOra',
    description:
      'A website marketplcae which matches student-photographers. \
    with clients. Focused on providing a platform for students. ',
    github_repo: 'https://github.com/winzamark123/caMOOra',
    url: 'https://camoora.io/',
    contentImage_url: '/projects/Camoora/ipad.png',
    tech_tags: [
      'TYPESCRIPT',
      'Next.js',
      'TailwindCSS',
      'MongoDB',
      'POSTGRESQL',
      'tRPC',
      'AWS S3',
    ],
  },
  {
    title: 'JUSTSAYIN',
    description:
      'Mobile application displaying daily quotes from your favorite authors on your lock screen widget',
    github_repo: 'https://github.com/winzamark123/JustSayin',
    url: 'https://apps.apple.com/us/app/justsayinapp/id6502377306',
    contentImage_url: '/projects/JustSayin/iphone.png',
    tech_tags: [
      'React Native',
      'SWIFT',
      'TYPESCRIPT',
      'FIREBASE',
      'AWS',
      'JEST',
      'EXPO',
    ],
  },
];
