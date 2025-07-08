'use client';
import Link from 'next/link';
import { ModeToggle } from './_components/ModeToggle';
import { Github, Linkedin, Mail, FilePenLine } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    url: 'https://drive.google.com/drive/folders/1GgfgmE1ILgwvrgGc5d81xA4FyihqIFUn?usp=sharing',
    description: 'Resume',
  },
];

export default function Nav() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [topRightPosition, setTopRightPosition] = useState({ x: 0, y: 0 });
  const [pathVariation, setPathVariation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      // Add slight random variation when cursor moves for sloppy effect
      setPathVariation(Math.random() * 10 - 5);
    };

    const updateTopRightPosition = () => {
      setTopRightPosition({
        x: window.innerWidth - 100,
        y: 80,
      });
    };

    // Add mouse move listener
    document.addEventListener('mousemove', handleMouseMove);

    // Update top right position on mount and resize
    updateTopRightPosition();
    window.addEventListener('resize', updateTopRightPosition);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateTopRightPosition);
    };
  }, []);

  // Calculate curve control point with sloppy variations
  const midX = (cursorPosition.x + topRightPosition.x) / 2;
  const midY = (cursorPosition.y + topRightPosition.y) / 2;

  // Calculate perpendicular offset for the curve
  const dx = topRightPosition.x - cursorPosition.x;
  const dy = topRightPosition.y - cursorPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Create a curve that's more pronounced for longer distances
  const curveOffset = Math.min(distance * 0.3, 150);

  // Perpendicular vector for the curve with random variation
  const perpX = (-dy / distance) * curveOffset;
  const perpY = (dx / distance) * curveOffset;

  // Add random wobble for sloppy effect
  const wobbleX = Math.sin(Date.now() * 0.001) * 3 + pathVariation;
  const wobbleY = Math.cos(Date.now() * 0.0015) * 2 + pathVariation * 0.5;

  const controlX = midX + perpX + wobbleX;
  const controlY = midY + perpY + wobbleY;

  // Create SVG path with multiple segments for more hand-drawn feel
  const segment1X =
    cursorPosition.x +
    (controlX - cursorPosition.x) * 0.3 +
    Math.sin(Date.now() * 0.002) * 2;
  const segment1Y =
    cursorPosition.y +
    (controlY - cursorPosition.y) * 0.3 +
    Math.cos(Date.now() * 0.002) * 1.5;

  const segment2X =
    cursorPosition.x +
    (controlX - cursorPosition.x) * 0.7 +
    Math.sin(Date.now() * 0.0025) * 1.5;
  const segment2Y =
    cursorPosition.y +
    (controlY - cursorPosition.y) * 0.7 +
    Math.cos(Date.now() * 0.0025) * 2;

  const pathData = `M ${cursorPosition.x} ${cursorPosition.y} 
                    Q ${segment1X} ${segment1Y} ${midX + wobbleX * 0.5} ${midY + wobbleY * 0.5}
                    Q ${segment2X} ${segment2Y} ${topRightPosition.x} ${topRightPosition.y}`;

  // Calculate text position (on the curve, slightly offset)
  const textX = midX + perpX * 0.5 + wobbleX * 0.3;
  const textY = midY + perpY * 0.5 + wobbleY * 0.3;

  // Generate irregular dash pattern for sloppy effect
  const irregularDashes = [
    8 + Math.sin(Date.now() * 0.001) * 2,
    4 + Math.cos(Date.now() * 0.0015) * 1,
    6 + Math.sin(Date.now() * 0.002) * 1.5,
    5 + Math.cos(Date.now() * 0.0018) * 1,
    9 + Math.sin(Date.now() * 0.0012) * 2,
    3 + Math.cos(Date.now() * 0.0022) * 0.8,
  ].join(',');

  return (
    <>
      {/* SVG Overlay for the sloppy curved dotted arrow */}
      <svg
        className="pointer-events-none fixed inset-0 z-40 h-full w-full"
        style={{ zIndex: 40 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="14"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
          >
            {/* Simple line arrowhead - two lines forming > shape */}
            <line
              x1="2"
              y1="2"
              x2="10"
              y2="6"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="2"
              y1="10"
              x2="10"
              y2="6"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </marker>
        </defs>

        {/* Sloppy curved dotted line from cursor to top right corner */}
        <path
          d={pathData}
          stroke="#059669"
          strokeWidth={3.5 + Math.sin(Date.now() * 0.003) * 0.8}
          strokeDasharray={irregularDashes}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          markerEnd="url(#arrowhead)"
          className="opacity-85"
          style={{
            filter: 'blur(0.3px)',
          }}
        />

        {/* Text along the curve with slight wobble */}
        <text
          x={textX}
          y={textY - 12}
          fill="white"
          fontSize="24"
          fontWeight="bold"
          textAnchor="middle"
          className="pointer-events-none font-mono"
          style={{
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))',
            transform: `rotate(${Math.sin(Date.now() * 0.001) * 2}deg)`,
          }}
        >
          read the blog bro PLS
        </text>
      </svg>

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
    </>
  );
}
