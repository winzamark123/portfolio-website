import { ModeToggle } from './ModeToggle';
import Link from 'next/link';
import { Instagram, Github } from 'lucide-react';

type NavLink = {
  name: string;
  path: string;
};

type SocialProp = {
  icon: React.ReactNode;
  url: string;
};

const SocialProps: SocialProp[] = [
  {
    icon: (
      <Github className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all" />
    ),
    url: '',
  },
  {
    icon: (
      <Instagram className="h-[2rem] w-[2rem] rotate-0 scale-100 transition-all" />
    ),
    url: '',
  },
];

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Experience', path: '/experience' },
  { name: 'Projects', path: '/projects' },
];

export default function Nav() {
  return (
    <nav className="fixed flex h-4/5 flex-col justify-center rounded-xl border border-black align-middle dark:border-white">
      {navLinks.map((link) => (
        <Link key={link.path} href={link.path} className="">
          {link.name}
        </Link>
      ))}
      {SocialProps.map((social, index) => (
        <Link
          key={index}
          href={social.url}
          className="flex flex-col justify-center border border-white align-middle"
        >
          {social.icon}
        </Link>
      ))}
      <ModeToggle />
    </nav>
  );
}
