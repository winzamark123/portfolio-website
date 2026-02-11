# Agent Notes

Keep `public/llms.txt` in sync with site content. Update it whenever content changes in:

- `src/app/_components/const.tsx` (about, social, experience, projects, nuggets)
- `public/blog/*.mdx` (blogs)
- `src/app/_components/home-client.tsx` (hero copy, inference intro)

The machine view toggle reads `/llms.txt`, so verify it loads after updates.

## llms.txt Blog Format

Blogs are listed at the bottom of `llms.txt` with metadata only (no content). Each blog entry follows this structure:

```
Blog: {title}
Date: {YYYY-MM-DD}
Tags: {comma-separated tags}
URL: https://www.wincheng.fyi/?tab=blogs&post={slug}
```

The slug is derived from the blog's MDX filename: strip the `.mdx` extension, lowercase everything, and replace spaces with hyphens. For example, `2026-01-09 Note_to_self_for_2026.mdx` becomes `2026-01-09-note_to_self_for_2026`.
