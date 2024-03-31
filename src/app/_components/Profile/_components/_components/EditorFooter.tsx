import { GitBranch } from 'lucide-react';

type footerItem = {
  icon?: React.ReactNode;
  description: string;
};

const footerItems: footerItem[] = [
  {
    description: '-- Normal --',
  },
  {
    description: 'Line 5:36',
  },
  {
    description: 'UTF8',
  },
  {
    description: '2 spaces',
  },
  {
    icon: <GitBranch className="h-4 w-4" />,
    description: 'main',
  },
];
export default function EditorFooter() {
  return (
    <main className="flex h-full items-center justify-end gap-3 bg-neutral-800 p-6 text-xs font-extralight text-gray-500">
      {footerItems.map((item, index) => (
        <div key={index} className="flex items-center ">
          {item.icon}
          <span>{item.description}</span>
        </div>
      ))}
    </main>
  );
}
