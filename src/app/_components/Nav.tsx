import { ModeToggle } from './ModeToggle';
import Link from 'next/link';

interface NavLink {
  name: string;
  path: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Experience', path: '/experience' },
  { name: 'Projects', path: '/projects' },
];

export default function Nav() {
  return (
    <nav className="fixed m-5 flex h-4/5 flex-col justify-center rounded-xl border border-black dark:border-white">
      <ModeToggle />
      {navLinks.map((link) => (
        <Link key={link.path} href={link.path} className="">
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
