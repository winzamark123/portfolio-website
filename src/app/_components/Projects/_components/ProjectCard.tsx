interface ProjectCardProps {
  span: string;
  hoverColor: string;
  children: React.ReactNode;
}

export default function ProjectCard({
  span,
  hoverColor,
  children,
}: ProjectCardProps) {
  return (
    <main
      className={`relative col-span-full overflow-hidden rounded-xl
              bg-gray-600 pl-5 text-white transition-colors duration-300
                ease-in-out hover:cursor-pointer hover:${hoverColor}
              dark:border-gray-800 dark:bg-gray-900 dark:hover:${hoverColor}
                lg:col-span-${span}`}
    >
      {children}
    </main>
  );
}
