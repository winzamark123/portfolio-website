import type { ContributionDay } from '@/lib/contributions';

const OPACITY = [0.1, 0.3, 0.5, 0.75, 1];
const CELL = 10;
const PITCH = 13;

interface ContributionGraphProps {
  weeks: ContributionDay[][];
}

// svg scales with the container so the grid always spans the content width
export function ContributionGraph({ weeks }: ContributionGraphProps) {
  const width = weeks.length * PITCH - (PITCH - CELL);
  const height = 7 * PITCH - (PITCH - CELL);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="github contributions over the last year"
      className="w-full py-2 text-foreground"
    >
      {weeks.map((week, column) =>
        week.map((day, row) => (
          <rect
            key={day.date}
            x={column * PITCH}
            y={row * PITCH}
            width={CELL}
            height={CELL}
            rx={2}
            fill="currentColor"
            fillOpacity={OPACITY[day.level]}
          >
            <title>{`${day.date}: ${day.count}`}</title>
          </rect>
        ))
      )}
    </svg>
  );
}
