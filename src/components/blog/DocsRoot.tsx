'use client';

import { useState } from 'react';
import { ChevronDown, Minus } from 'lucide-react';

interface IProps {
  children: React.ReactNode;
}

interface MenuItem {
  label: string;
  href: string;
}

// Example menu items - customize as needed
const SideMenu: MenuItem[] = [
  { label: 'Introduction', href: '#introduction' },
  { label: 'Getting Started', href: '#getting-started' },
  { label: 'Examples', href: '#examples' },
];

const MenuButton = (item: MenuItem) => {
  return (
    <a
      href={item.href}
      className="rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {item.label}
    </a>
  );
};

const DocsRoot: React.FC<IProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  });

  return (
    <div className="flex w-full justify-center px-4">
      <div className="flex w-full flex-col md:flex-row">
        {isMobile && (
          <button
            className="flex items-center justify-between rounded border border-gray-300 px-4 py-2 dark:border-gray-700"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            Menu
            {isOpen ? (
              <Minus className="ml-2 h-5 w-5" />
            ) : (
              <ChevronDown className="ml-2 h-5 w-5" />
            )}
          </button>
        )}

        {(isOpen || !isMobile) && (
          <div className="flex w-full flex-col gap-1 md:fixed md:w-56">
            {SideMenu.map((m) => (
              <div
                key={m.label}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                {MenuButton(m)}
              </div>
            ))}
          </div>
        )}

        <div
          id="mdx-content"
          className="mt-4 w-full overflow-y-auto pb-20 md:ml-56 md:mt-0 md:max-w-3xl"
        >
          {children}
        </div>
        <div className="w-56" />
      </div>
    </div>
  );
};

export default DocsRoot;
