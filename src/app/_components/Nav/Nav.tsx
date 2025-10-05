'use client';
import Link from 'next/link';
import { ModeToggle } from './_components/ModeToggle';
import { Github, Linkedin, Mail, FilePenLine, Twitter } from 'lucide-react';
import { SocialProps} from '../const';

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
          target="_blank"
          rel="noopener noreferrer"
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
