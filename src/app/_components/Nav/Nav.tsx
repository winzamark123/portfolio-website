'use client';
import Link from 'next/link';
import { ModeToggle } from './_components/ModeToggle';
import { Github, Linkedin, Mail, FilePenLine } from 'lucide-react';

type SocialProp = {
  icon: React.ReactNode;
  url: string;
  description: string;
};

const SocialProps: SocialProp[] = [
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
    url: 'https://docs.google.com/document/d/1WWNdooIk2YlCr49ZJPqcb0zrWu8jOCbPXeNpzd6-dMo/edit?usp=sharing',
    description: 'Resume',
  },
];

export default function Nav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full flex-row items-center justify-around 
    gap-3 bg-white p-4 dark:bg-gray-900 sm:bottom-auto sm:h-4/5 
    sm:w-16 sm:flex-col sm:items-center sm:justify-center sm:bg-transparent sm:p-0 dark:sm:bg-transparent"
    >
      {SocialProps.map((social, index) => (
        <Link
          key={index}
          href={social.url}
          className="group relative flex flex-col items-center"
        >
          <div className="hover:text-emerald-500">{social.icon}</div>
          <span className="absolute bottom-full mb-2 hidden w-max rounded-md bg-black px-2 py-2 text-sm text-white group-hover:block sm:bottom-auto sm:left-full sm:mb-0 sm:ml-2">
            {social.description}
          </span>
        </Link>
      ))}
      <ModeToggle />
    </nav>
  );
}
