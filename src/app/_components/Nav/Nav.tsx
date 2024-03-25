'use client';
import Link from 'next/link';
import { ModeToggle } from './_components/ModeToggle';
import { Instagram, Github, Linkedin, Mail, FilePenLine } from 'lucide-react';

// type NavLink = {
//   name: string;
//   path: string;
// };

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
      <Instagram className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all" />
    ),
    url: '',
    description: 'Instagram',
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
    url: '',
    description: 'Resume',
  },
];

// const navLinks: NavLink[] = [
//   { name: 'Home', path: '/' },
//   { name: 'About', path: '/about' },
//   { name: 'Experience', path: '/experience' },
//   { name: 'Projects', path: '/projects' },
// ];

export default function Nav() {
  return (
    <nav className="fixed flex h-4/5 w-20 flex-col items-center justify-center gap-3">
      {SocialProps.map((social, index) => (
        <Link
          key={index}
          href={social.url}
          className="group relative flex flex-col items-center"
        >
          {social.icon}
          <span className="absolute left-full ml-2 hidden w-max rounded-md bg-black px-2 py-2 text-sm text-white group-hover:block">
            {social.description}
          </span>
        </Link>
      ))}
      <ModeToggle />
    </nav>
  );
}
