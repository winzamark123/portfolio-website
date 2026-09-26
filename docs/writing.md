# Writing on the portfolio

The `/write` page supports owner-only GitHub sign-in, private drafts, autosave, local recovery, MDX export, image uploads, a live article preview, and explicit Git-based publishing. The portfolio stays on Next.js and Vercel. R2 stores drafts and images; no database is required.

## Setup

The writer fails closed when configuration is missing. The public portfolio does not need these credentials to build or run.

### 1. Create a GitHub App

Create an app under GitHub Settings → Developer settings → GitHub Apps. Use separate apps for production and local development if you need different callback URLs.

- Homepage: the site's URL.
- User authorization callback: `https://www.wincheng.fyi/api/auth/callback/github` for production, or `http://localhost:3000/api/auth/callback/github` locally.
- Disable webhooks; this app does not receive GitHub webhooks.
- Repository permissions: **Contents: read and write**, **Commit statuses: read**. Metadata read is implicit.
- Account permission: **Email addresses: read** for the GitHub provider.
- Install it on **only** this repository.
- Generate a client secret and an app private key.

Record the App ID, Client ID, Client secret, private key, and installation ID. The installation ID is in the URL when configuring the installed app. `GITHUB_APP_PRIVATE_KEY` accepts a PEM with actual newlines or escaped `\n` characters.

`WRITER_GITHUB_ID` is the owner's numeric GitHub user ID, not a username or email. The example contains this portfolio owner's ID. Sign-in checks it, and existing sessions are checked against it again on every authenticated request.

The app makes content commits using `WRITER_COMMIT_NAME` and `WRITER_COMMIT_EMAIL`. Use an email verified on the owner's GitHub account, including a GitHub noreply address if preferred. The owner must have access to the connected Vercel project. This avoids deployment failures caused by an unrecognized commit author.

Publishing updates `WRITER_BRANCH` without force-pushing. Set it to the Vercel production branch. If branch protections require pull requests or prohibit app pushes, give this narrowly installed app permission to perform the intended content workflow, or keep publishing disabled until you choose a compatible policy. The application will not bypass protections.

### 2. Create two R2 buckets

Create separate buckets for private writing data and public image copies.

**Private bucket** (`R2_PRIVATE_BUCKET`):

- Do not attach a public domain.
- Do not enable `r2.dev` public access.
- Stores `drafts/{id}.json`, immutable `history/{id}/...json` snapshots, and `images/{draftId}/{imageId}.webp` uploads.

**Public bucket** (`R2_PUBLIC_BUCKET`):

- Connect a production custom domain, such as `images.wincheng.fyi`.
- Set `R2_PUBLIC_URL` to that domain's HTTPS origin, without a trailing slash.
- Contains only image copies promoted during an explicit publish action.
- Published images use immutable URLs and long-lived cache headers.

Create an R2 API token with Object Read & Write access to these two buckets only. Configure the account's S3 endpoint, access key ID, and secret access key. Uploads go through the authenticated Next.js API, so browser-to-R2 CORS rules are not required.

Each upload accepts a still PNG, JPEG, or WebP up to **4 MiB** and **20 megapixels**. The server decodes, auto-rotates, strips metadata, resizes to fit within 2400 × 2400 pixels, and stores WebP. SVG, animated images, and arbitrary attachments are not accepted. The upload limit stays below Vercel's function request-body limit.

### 3. Configure the environment

Copy `.env.example` to `.env.local` for development. Generate a unique `NEXTAUTH_SECRET` of at least 32 characters, for example with `openssl rand -base64 32`.

For production, add the variables as secrets/environment settings in Vercel. Set `NEXTAUTH_URL=https://www.wincheng.fyi`. This is both the trusted origin for write requests and the canonical URL used for published links and `llms.txt`.

For local development, use a sandbox repository and separate R2 buckets. Do not publish from a localhost configuration into the production repository, because generated post links use `NEXTAUTH_URL`.

Do not use the isolated test credentials in a deployed environment. Do not add production credentials to untrusted preview deployments. A preview deployment needs its own correctly configured OAuth callback if you want to sign in there.

`WRITER_VERCEL_CONTEXT` identifies the GitHub commit status for this specific Vercel project. It defaults to `Vercel`. If GitHub shows a project-specific context such as `Vercel – portfolio-website`, copy that exact context into the variable. Other status checks cannot mark a post live.

`GITHUB_API_URL` defaults to `https://api.github.com`; the local service fixture overrides it. Normal deployments should leave it unset.

### 4. Verify the live integration

These steps require the owner's live credentials and are **not** covered by the isolated test services:

1. Open `/write` and sign in with the owner's GitHub account. Confirm another account is denied.
2. Create a draft, type text, save, and reopen it. Check that neither the Git repository nor the public blog changed.
3. Upload an image. Confirm its `/api/write/images/...` URL returns 401 in a signed-out browser.
4. Publish a deliberately public test post. Publishing makes its text public in Git history and makes its images public in R2.
5. Confirm one commit updates the post and `public/llms.txt`, Vercel deploys it, and the writer reports the deployment's status.
6. Open the public post and the machine view toggle. Verify the new metadata appears in `/llms.txt`.
7. Edit and save the published post without publishing. Confirm readers still see the previous version.

If a commit does not deploy, check the Vercel Git integration, production branch, commit author, build filters, and deployment quota. Retrying Publish on the same saved revision does not create duplicate commits. If a build failed, retry that deployment in Vercel; creating duplicate commits is not a deployment recovery mechanism.

## Writing behavior

- New posts open immediately with an Untitled title, no tags, two columns, and an unset publication date.
- Title, tags, date, and columns stay editable. The URL follows the title until customized and is fixed after first publication.
- The editor supports Markdown shortcuts, source mode, headings, lists, links, quotes, code blocks, tables, and images.
- Dropping images uses the drop location; pasting uses the text cursor. A document node is inserted before upload starts so subsequent typing cannot move it. Failed uploads can be retried or removed.
- `MagazineImage` components have fields for alternative text, caption, credit URL, and credit label.
- The writing surface stays single-column. The optional live preview uses the same `BlogArticle`, `MagazineLayout`, and MDX components as the public site. A single-column preview approximates a narrow reading layout.
- Autosave runs after a 1.5-second pause. Save and `Cmd/Ctrl+S` save immediately.
- Drafts use conditional R2 writes with ETags. A stale tab cannot overwrite a newer saved version.
- Browser recovery is offered after interrupted saves. It never silently replaces the server version. Local storage is a recovery aid, not an offline synchronization system or a backup. Use a trusted device: recovery copies are not encrypted, and signing out does not erase an unsaved local copy.
- Publishing selects one saved revision. Later saves stay private until Publish changes is used.
- Existing posts retain their filenames and URLs. MDX is normalized on editing, so whitespace and Markdown marker styles can change. Legacy Obsidian embeds remain text; this editor does not add an Excalidraw renderer.

## Publication safety and recovery

The server validates authored MDX before previewing or publishing. JavaScript expressions, imports, spread properties, event handlers, unsupported components, and unsafe URL protocols are rejected. Code fences remain literal text. Supported HTML formatting and `MagazineImage` use an explicit attribute allowlist.

Publishing reads the current Git tree, checks that the target file has not changed outside the editor, and updates the post and machine-view metadata in one commit. Unrelated repository changes are preserved. A non-fast-forward update is rejected rather than forced. If the published file was edited outside the writer, export any work you want to keep and choose **Reload published version**. This refreshes the working copy and its Git baseline after confirmation; earlier saved drafts remain in private history.

The published frontmatter includes `writerId` and `writerRevision`. These are non-secret identifiers used to recognize an already committed revision after a partial failure. Retrying publication can recover draft status without writing the post again.

R2 and GitHub do not share a transaction. Image promotion happens before the content commit. If publishing fails after image promotion, those image copies can already be public even though the post is not live. Retrying uses the same image keys. Never include confidential material in a publish attempt.

Published Git content and public images cannot be made private merely by removing links. This version has no delete/unpublish interface. To remove a post, remove its published file and update `llms.txt` through the existing repository workflow; Git history, old deployments, caches, and downloaded copies can still retain it.

Recovery snapshots are stored in the private bucket under `history/{draftId}/`. Failed conditional saves can also leave snapshots there, preserving both versions. Download a snapshot to recover its `markdown` and metadata. There is no automatic history deletion; optionally configure an R2 lifecycle rule for **only** the history prefix after choosing a retention period. Do not apply such a rule to current drafts or images.

Export MDX downloads text and metadata, not an image archive. Private image URLs in draft exports still require sign-in. Back up the private bucket and published images separately if you need a full portable archive.

## Tests

Use Node.js 22 or newer for the installed test tooling and pnpm 9 (the repository's CI package-manager version).

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
```

`pnpm test` checks all existing posts, MDX validation, metadata, conditional saves, publication, retries, conflicts, image promotion, and deployment status. It uses local HTTP fixtures that implement the S3 and GitHub operations used by the writer.

`pnpm test:e2e` launches the real Next.js application on `127.0.0.1:3100` and isolated services on `127.0.0.1:4100`. It uses encrypted NextAuth test sessions; there is no application authentication bypass or test-only API route. It never writes to a live Git repository or R2 account.

If Chromium is already installed, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chromium pnpm test:e2e` uses it. After `pnpm build`, `WRITING_TEST_PRODUCTION=1 pnpm test:e2e` exercises the production build. Stop any existing fixture server first so the production run does not reuse a development server.

The tests do not verify the GitHub OAuth consent flow, real R2 permissions, public-domain configuration, or Vercel deployment delivery. Use the live checklist above after configuring credentials.
