# Agent Notes

Keep `public/llms.txt` in sync with site content. Update it whenever content changes in:

- `src/app/_components/const.tsx` (about, social, experience, projects, nuggets)
- `public/blog/*.mdx` (blogs)
- `src/app/_components/home-client.tsx` (hero copy, inference intro)

The machine view toggle reads `/llms.txt`, so verify it loads after updates.
