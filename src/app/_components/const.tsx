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
    id: 'blogs',
    label: 'blogs',
  },
];

export const ExperienceProps = [
  {
    company: 'JigsawStack',
    position: 'founding engineer',
    description:
      'building small langauge models (SLMs) for developer use cases',
    date: 'Jun 2025 - Current',
    // icon: JigsawStack_logo,
    url: 'https://jigsawstack.com/',
    location: 'San Francisco, CA',
  },
  {
    company: 'Bustem',
    position: 'frontend software engineer',
    description:
      'founding team at a startup reinforcing brand protection for over 8000+ e-commerce brands',
    date: 'Jan 2025 - Current',
    // icon: Bustem_logo,
    url: 'https://bustem.com/',
    location: 'San Francisco, CA',
  },
  {
    company: 'AggieWorks',
    position: 'full-stack software engineer',
    description:
      'led the development of a local business engagement platform \
      enabling 35k+ students to discover deals, \
      increasing engagement with local businesses',
    date: 'Sep 2024 - Jan 2025',
    // icon: AggieWorks_logo,
    url: 'https://aggieworks.org/',
    location: 'Davis, CA',
  },
  {
    company: 'Rhombus',
    position: 'software engineer intern',
    description:
      'built a user interface for frontend web admin console to highlight \
      camera visual environment through computer vision and machine learning',
    date: 'Jun 2024 - Sep 2024',
    // icon: Rhombus_logo,
    url: 'https://www.rhombus.com/',
    location: 'Sacramento, CA',
  },
  {
    company: 'HackDavis',
    position: 'techincal product manager',
    description:
      'deployed a website and judging app for a 1000+ person hackathon. \
      with 275k+ visitors, 8300 unique visitors at peak month',
    date: 'Sep 2023 - Current',
    // icon: HackDavis_logo,
    url: 'https://2024.hackdavis.io/',
    location: 'Davis, CA',
  },
  {
    company: 'Kebloom',
    position: 'software engineer intern',
    description:
      'developed a mobile application attracting over 300+ active early users',
    date: 'Jun 2023 - Aug 2023',
    // icon: Kebloom,
    url: 'https://www.kebloom.com/',
    location: 'San Francisco, CA',
  },
];

export const ProjectList = [
  {
    title: 'decaf',
    description: 'your filtered dose of daily news.',
    github_repo: 'https://github.com/winzamark123/decaf',
    url: 'https://www.decafo.co/',
  },
  {
    title: 'open canvas',
    description:
      'bringing AI to your favorite whiteboard. An infinite canvas that allows you to generate code, text, and images with the help of AI. It supports a variety of tools and features to help you brainstorm and create.',
    github_repo: 'https://github.com/winzamark123/open-canvas',
    url: 'https://www.opencanvas.studio/',
  },
  {
    title: 'os deep research',
    description:
      'an open source deep research framework for LLMs. fully customizable, modular, and easy to use. It allows you to run deep research tasks on any topic, generating comprehensive reports and insights using the latest AI models.',
    github_repo: 'https://github.com/JigsawStack/deep-research',
    tech_tags: ['typescript', 'ai sdk'],
  },
  {
    title: 'caMOOra',
    description:
      'a website marketplace which matches student-photographers with clients. focused on providing a platform for students to showcase their work and get hired. It features a robust booking system, portfolio management, and secure payments.',
    github_repo: 'https://github.com/winzamark123/caMOOra',
    url: 'https://camoora.io/',
  },
  {
    title: 'justsayin',
    description:
      "mobile application displaying daily quotes from your favorite authors on your lock screen widget. Start your day with inspiration and wisdom from the world's greatest minds, delivered right to your phone.",
    github_repo: 'https://github.com/winzamark123/JustSayin',
    apple_url: 'https://apps.apple.com/us/app/justsayinapp/id6502377306',
  },
];
