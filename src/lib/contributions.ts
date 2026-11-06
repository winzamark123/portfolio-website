import 'server-only';
import { z } from 'zod';

const GITHUB_USER = 'winzamark123';

const daySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  count: z.number().int().nonnegative(),
  level: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
  ]),
});

const responseSchema = z.object({ contributions: z.array(daySchema) });

export type ContributionDay = z.infer<typeof daySchema>;

function weekday({ date }: ContributionDay) {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

// columns of sunday-first weeks, like the github graph. the last week is partial
export async function getContributionWeeks() {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;
    const { contributions } = responseSchema.parse(await response.json());
    const firstSunday = contributions.findIndex((day) => weekday(day) === 0);
    const days = contributions.slice(firstSunday);
    const weeks: ContributionDay[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    return weeks;
  } catch {
    return null;
  }
}
