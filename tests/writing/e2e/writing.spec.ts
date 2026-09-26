import { test, expect, type BrowserContext } from '@playwright/test';
import { encode } from 'next-auth/jwt';
import { z } from 'zod';
import sharp from 'sharp';
import { readFileSync, readdirSync } from 'node:fs';
import { visit } from 'unist-util-visit';
import {
  documentImages,
  parseDocument,
  parsePost,
} from '../../../src/lib/writing/content';

const origin = 'http://127.0.0.1:3100';
async function signIn(context: BrowserContext, sub = '1234') {
  const token = await encode({
    secret: 'isolated-writing-test-secret-not-for-production',
    token: { sub, name: 'Test writer', email: 'writer@example.com' },
    maxAge: 3600,
  });
  await context.addCookies([
    {
      name: 'next-auth.session-token',
      value: token,
      url: origin,
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}
const inspectionSchema = z.object({
  head: z.string(),
  objects: z.array(z.string()),
  files: z.array(z.object({ path: z.string(), content: z.string() })),
});

test.beforeEach(async ({ request }) => {
  await request.post('http://127.0.0.1:4100/control', {
    data: { reset: true },
  });
});

test('anonymous and non-owner sessions cannot access writing endpoints', async ({
  page,
  request,
  context,
}) => {
  await page.goto('/write');
  await expect(
    page.getByRole('button', { name: 'Sign in with GitHub' })
  ).toBeVisible();
  for (const path of [
    'drafts',
    'drafts/00000000-0000-4000-8000-000000000000',
    'images/00000000-0000-4000-8000-000000000000/00000000-0000-4000-8000-000000000000.webp',
    'drafts/00000000-0000-4000-8000-000000000000/publish',
  ]) {
    expect((await request.get(`/api/write/${path}`)).status()).toBe(401);
  }
  expect(
    (
      await request.post('/api/write/preview', {
        data: { markdown: 'private' },
      })
    ).status()
  ).toBe(401);
  await signIn(context, '9999');
  expect((await context.request.get('/api/write/drafts')).status()).toBe(401);
  await signIn(context);
  expect(
    (
      await context.request.post('/api/write/drafts', {
        headers: { Origin: 'https://evil.example' },
        data: {},
      })
    ).status()
  ).toBe(403);
});

test('writes, previews, saves, uploads, publishes, and keeps later edits private', async ({
  page,
  context,
  request,
}) => {
  await signIn(context);
  await page.goto('/write');
  await page.getByRole('button', { name: 'New post' }).click();
  await expect(page.getByLabel('Title', { exact: true })).toBeVisible();
  await page
    .getByLabel('Title', { exact: true })
    .fill('A browser-written post');
  const editor = page.getByRole('textbox', {
    name: 'editable markdown',
    exact: true,
  });
  await editor.click();
  await editor.pressSequentially(
    'A thought with **bold words** and _emphasis_.',
    { delay: 15 }
  );
  await expect(editor.locator('strong')).toHaveText('bold words');
  await expect(editor.locator('em')).toHaveText('emphasis');
  await page.getByText('Post settings', { exact: false }).click();
  await page.getByLabel('Publication date', { exact: true }).fill('2026-09-25');
  await page.getByLabel('Columns', { exact: true }).selectOption('3');
  await page.getByLabel('Tags', { exact: true }).fill('writing, testing');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: /^Saved$/ })
  ).toBeVisible();

  const image = await sharp({
    create: { width: 40, height: 30, channels: 3, background: '#14865c' },
  })
    .png()
    .toBuffer();
  await editor.click();
  await editor.press('ControlOrMeta+End');
  await editor.press('Enter');
  await page
    .getByLabel('Upload images', { exact: true })
    .setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: image });
  await expect(editor.locator('img')).toBeVisible();
  await editor.getByText('Image details', { exact: true }).click();
  await editor
    .getByLabel('Alternative text', { exact: true })
    .fill('A green test photo');
  await editor.getByLabel('Caption', { exact: true }).fill('An inline photo');
  await editor
    .getByLabel('Credit URL', { exact: true })
    .fill('https://example.com/photo');
  await editor.getByLabel('Credit URL', { exact: true }).fill('');
  await expect(
    editor.getByRole('img', { name: 'A green test photo' })
  ).toBeVisible();
  const privateSrc = await editor.getByRole('img').getAttribute('src');
  expect(privateSrc).toMatch(/^\/api\/write\/images\//);
  expect((await request.get(privateSrc ?? '')).status()).toBe(401);
  const imageResponse = await context.request.get(privateSrc ?? '');
  expect(imageResponse.status()).toBe(200);
  expect(imageResponse.headers()['cache-control']).toContain('no-store');

  await page.getByRole('button', { name: 'Show live preview' }).click();
  const preview = page.getByRole('region', { name: 'Article preview' });
  await expect(preview.locator('strong')).toHaveText('bold words');
  await expect(
    preview.getByRole('img', { name: 'A green test photo' })
  ).toBeVisible();
  await expect(preview.getByText('#writing', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: /^Saved$/ })
  ).toBeVisible();
  const draftUrl = page.url();
  await page.reload();
  await expect(page.getByLabel('Title', { exact: true })).toHaveValue(
    'A browser-written post'
  );
  await expect(
    page
      .getByRole('textbox', { name: 'editable markdown', exact: true })
      .locator('strong')
  ).toHaveText('bold words');

  const before = inspectionSchema.parse(
    await (await request.get('http://127.0.0.1:4100/inspect')).json()
  );
  expect(
    before.files.some(
      (file) => file.path === 'public/blog/a-browser-written-post.mdx'
    )
  ).toBe(false);
  expect(before.objects.some((key) => key.startsWith('public/'))).toBe(false);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await expect(page.getByText('The submitted revision is live.')).toBeVisible();
  const published = inspectionSchema.parse(
    await (await request.get('http://127.0.0.1:4100/inspect')).json()
  );
  const post = published.files.find(
    (file) => file.path === 'public/blog/a-browser-written-post.mdx'
  );
  expect(post?.content).toContain('bold words');
  expect(post?.content).toContain('A green test photo');
  expect(post?.content).not.toContain('/api/write/');
  expect(
    published.files.find((file) => file.path === 'public/llms.txt')?.content
  ).toContain('Blog: A browser-written post');
  expect(
    published.objects.some((key) => key.startsWith('public/images/'))
  ).toBe(true);

  await page.getByLabel('Title', { exact: true }).fill('Still a private title');
  await expect(
    page.getByRole('status').filter({ hasText: /^Saved$/ })
  ).toBeVisible();
  const afterEdit = inspectionSchema.parse(
    await (await request.get('http://127.0.0.1:4100/inspect')).json()
  );
  expect(afterEdit.head).toBe(published.head);
  await expect(
    page.getByText('Your draft has unpublished changes.')
  ).toBeVisible();
  await page.getByText('Post settings', { exact: false }).click();
  await expect(page.getByLabel('Post URL', { exact: true })).toBeDisabled();
  expect(page.url()).toBe(draftUrl);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export MDX' }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    'a-browser-written-post.mdx'
  );
});

test('recovers interrupted saves and rejects stale writes from a second tab', async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto('/write');
  await page.getByRole('button', { name: 'New post' }).click();
  await page.getByLabel('Title', { exact: true }).fill('Saved title');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: /^Saved$/ })
  ).toBeVisible();
  await page.route('**/api/write/drafts/*', (route) =>
    route.request().method() === 'PUT' ? route.abort() : route.continue()
  );
  await page.getByLabel('Title', { exact: true }).fill('Recovered title');
  await expect(
    page.getByRole('status').filter({ hasText: /^Could not save$/ })
  ).toBeVisible();
  await page.unrouteAll();
  page.once('dialog', (dialog) => dialog.accept());
  await page.reload();
  await expect(
    page.getByRole('region', { name: 'Draft recovery' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Restore local copy' }).click();
  await expect(page.getByLabel('Title', { exact: true })).toHaveValue(
    'Recovered title'
  );
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: /^Saved$/ })
  ).toBeVisible();
  const other = await context.newPage();
  await other.goto(page.url());
  await expect(other.getByLabel('Title', { exact: true })).toHaveValue(
    'Recovered title'
  );
  await page.getByLabel('Title', { exact: true }).fill('Newer tab');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: /^Saved$/ })
  ).toBeVisible();
  await other.getByLabel('Title', { exact: true }).fill('Stale tab');
  await other.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(
    other.getByRole('status').filter({ hasText: /^Save conflict$/ })
  ).toBeVisible();
  await expect(
    other.getByRole('button', { name: 'Publish', exact: true })
  ).toBeDisabled();
});

test('keeps dropped images at their insertion point and accepts clipboard images', async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto('/write');
  await page.getByRole('button', { name: 'New post' }).click();
  await page.getByLabel('Title', { exact: true }).fill('Image placement');
  const editor = page.getByRole('textbox', {
    name: 'editable markdown',
    exact: true,
  });
  await editor.click();
  await editor.pressSequentially('Before');
  await editor.press('Enter');
  await editor.press('Enter');
  await editor.pressSequentially('After');
  const image = await sharp({
    create: { width: 40, height: 30, channels: 3, background: '#14865c' },
  })
    .png()
    .toBuffer();
  const transfer = await page.evaluateHandle((bytes) => {
    const data = new DataTransfer();
    data.items.add(
      new File([new Uint8Array(bytes)], 'image.png', { type: 'image/png' })
    );
    return data;
  }, Array.from(image));
  let releaseUpload = () => {};
  const uploadGate = new Promise<void>((resolve) => {
    releaseUpload = resolve;
  });
  await page.route('**/api/write/images/**', async (route) => {
    if (route.request().method() === 'PUT') await uploadGate;
    await route.continue();
  });
  const blank = editor.locator('p').nth(1);
  const box = await blank.boundingBox();
  if (!box) throw new Error('Drop target is missing');
  await blank.dispatchEvent('dragover', { dataTransfer: transfer });
  await blank.dispatchEvent('drop', {
    dataTransfer: transfer,
    clientX: box.x + 5,
    clientY: box.y + box.height / 2,
  });
  await expect(editor.getByText('Uploading image…')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Publish', exact: true })
  ).toBeDisabled();
  const after = editor.locator('p').filter({ hasText: 'After' });
  await after.click();
  await after.press('End');
  await after.pressSequentially(' while uploading');
  releaseUpload();
  await expect(editor.locator('img')).toBeVisible();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: /^Saved$/ })
  ).toBeVisible();
  const id = page.url().split('/').pop();
  const saved = z
    .object({ draft: z.object({ markdown: z.string() }) })
    .parse(await (await context.request.get(`/api/write/drafts/${id}`)).json());
  expect(saved.draft.markdown.indexOf('<MagazineImage')).toBeGreaterThan(
    saved.draft.markdown.indexOf('Before')
  );
  expect(saved.draft.markdown.indexOf('<MagazineImage')).toBeLessThan(
    saved.draft.markdown.indexOf('After')
  );
  await after.click();
  await editor.evaluate((element, bytes) => {
    const clipboard = new DataTransfer();
    clipboard.items.add(
      new File([new Uint8Array(bytes)], 'clipboard.png', { type: 'image/png' })
    );
    element.dispatchEvent(
      new ClipboardEvent('paste', {
        clipboardData: clipboard,
        bubbles: true,
        cancelable: true,
      })
    );
  }, Array.from(image));
  await expect(editor.locator('img')).toHaveCount(2);
  await transfer.dispose();
});

test('rejects unsafe previews and invalid images through authenticated endpoints', async ({
  context,
}) => {
  await signIn(context);
  const headers = { Origin: origin };
  const created = z
    .object({ draft: z.object({ id: z.string() }) })
    .parse(
      await (
        await context.request.post('/api/write/drafts', { headers, data: {} })
      ).json()
    );
  const imagePath = `/api/write/images/${created.draft.id}/00000000-0000-4000-8000-000000000000.webp`;
  expect(
    (
      await context.request.put(imagePath, {
        headers: { ...headers, 'Content-Type': 'image/svg+xml' },
        data: '<svg />',
      })
    ).status()
  ).toBe(400);
  expect(
    (
      await context.request.put(imagePath, {
        headers: { ...headers, 'Content-Type': 'image/png' },
        data: 'not an image',
      })
    ).status()
  ).toBe(400);
  expect(
    (
      await context.request.post('/api/write/preview', {
        headers,
        data: { markdown: '{process.env.NEXTAUTH_SECRET}' },
      })
    ).status()
  ).toBe(400);
});

test('opens all existing posts without losing their text or image URLs', async ({
  page,
  context,
}) => {
  await signIn(context);
  const filenames = readdirSync('public/blog').filter((filename) =>
    /\.mdx?$/.test(filename)
  );
  function text(markdown: string) {
    const values: string[] = [];
    visit(parseDocument({ markdown }), (node) => {
      if (
        node.type === 'text' ||
        node.type === 'code' ||
        node.type === 'inlineCode'
      )
        values.push(node.value);
    });
    return values.join(' ').replace(/\s+/g, ' ').trim();
  }
  for (const filename of filenames) {
    const post = parsePost({
      source: readFileSync(`public/blog/${filename}`, 'utf8'),
      filename,
    });
    const response = await context.request.post('/api/write/drafts', {
      headers: { Origin: origin },
      data: { slug: post.slug },
    });
    expect(response.ok()).toBe(true);
    const saved = z
      .object({ draft: z.object({ id: z.string() }) })
      .parse(await response.json());
    await page.goto(`/write/${saved.draft.id}`);
    await expect(
      page.getByRole('textbox', { name: 'editable markdown', exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(/The editor could not read this content/)
    ).toHaveCount(0);
    const editor = page.getByRole('textbox', {
      name: 'editable markdown',
      exact: true,
    });
    await editor.evaluate((element) => {
      element.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    });
    await page.keyboard.press('Enter');
    await page.keyboard.type('Roundtrip marker.');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(
      page.getByRole('status').filter({ hasText: /^Saved$/ })
    ).toBeVisible();
    const roundtrip = z
      .object({ draft: z.object({ markdown: z.string() }) })
      .parse(
        await (
          await context.request.get(`/api/write/drafts/${saved.draft.id}`)
        ).json()
      );
    const markdown = roundtrip.draft.markdown;
    expect(text(markdown), filename).toBe(
      `${text(post.markdown)} Roundtrip marker.`
    );
    expect(documentImages({ markdown }), filename).toEqual(
      documentImages({ markdown: post.markdown })
    );
  }
});

test('retries failed image uploads without moving or duplicating the image', async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto('/write');
  await page.getByRole('button', { name: 'New post' }).click();
  const editor = page.getByRole('textbox', {
    name: 'editable markdown',
    exact: true,
  });
  await editor.click();
  await editor.pressSequentially('An image follows.');
  let failed = false;
  await page.route('**/api/write/images/**', (route) => {
    if (route.request().method() === 'PUT' && !failed) {
      failed = true;
      return route.abort();
    }
    return route.continue();
  });
  const image = await sharp({
    create: { width: 10, height: 10, channels: 3, background: '#14865c' },
  })
    .png()
    .toBuffer();
  await page
    .getByLabel('Upload images', { exact: true })
    .setInputFiles({ name: 'image.png', mimeType: 'image/png', buffer: image });
  await expect(
    page.getByRole('button', { name: 'Retry upload' })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Publish', exact: true })
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Retry upload' }).click();
  await expect(editor.locator('img')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Publish', exact: true })
  ).toBeEnabled();
});

test('hydrates the writer without runtime errors', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await signIn(context);
  await page.goto('/write');
  await page.getByRole('button', { name: 'New post' }).click();
  await expect(
    page.getByRole('textbox', { name: 'editable markdown', exact: true })
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('textbox', { name: 'editable markdown', exact: true })
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('keeps the public blog and machine view working', async ({
  page,
  request,
}) => {
  await page.goto('/?tab=blogs&post=2026-01-09-note_to_self_for_2026');
  await expect(
    page.getByRole('heading', { name: 'Note to self for 2026', exact: true })
  ).toBeVisible();
  await page.getByRole('switch', { name: 'toggle machine view' }).click();
  await expect(page.locator('pre')).toContainText(
    'Blog: Note to self for 2026'
  );
  const response = await request.get('/llms.txt');
  expect(response.status()).toBe(200);
  expect((await response.text()).match(/^Blog: /gm)).toHaveLength(12);
});

test('loads existing MDX images and works on a narrow viewport', async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/write');
  await page
    .getByRole('button', { name: 'Edit Note to self for 2026' })
    .click();
  await expect(page.getByLabel('Title', { exact: true })).toHaveValue(
    'Note to self for 2026'
  );
  const editor = page.getByRole('textbox', {
    name: 'editable markdown',
    exact: true,
  });
  await expect(editor.getByText('Image details')).toBeVisible();
  await expect(page.locator('main').getByRole('alert')).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
  await page.getByRole('button', { name: 'Show live preview' }).click();
  await expect(
    page
      .getByRole('region', { name: 'Article preview' })
      .getByRole('heading', { name: 'Note to self for 2026' })
  ).toBeVisible();
});
