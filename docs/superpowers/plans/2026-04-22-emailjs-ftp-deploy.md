# EmailJS + FTP Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace server-side Resend API with client-side EmailJS, simplify Astro config to pure static, and deploy to reg.ru via GitHub Actions FTP.

**Architecture:** Remove the Node.js server layer entirely — `@emailjs/browser` calls the EmailJS API directly from the browser using credentials baked into the static build via `PUBLIC_*` env vars. GitHub Actions builds the static site and uploads `dist/` to reg.ru FTP on every push to `master`.

**Tech Stack:** Astro 6 (static), `@emailjs/browser` npm package, `SamKirkland/FTP-Deploy-Action@v4.3.5`, GitHub Actions, reg.ru FTP.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/pages/api/contact.ts` | Delete | Server-side email endpoint — no longer needed |
| `src/components/Contact.astro` | Modify `<script>` block | Replace `fetch` → `emailjs.send`, add client-side validation |
| `astro.config.mjs` | Rewrite | Remove `isGhPages` logic and node adapter, pure static config |
| `package.json` | Modify | Remove `resend`, `@astrojs/node`; add `@emailjs/browser` |
| `.github/workflows/deploy.yml` | Rewrite | Replace GitHub Pages workflow with FTP deploy |

---

## Task 1: Remove server-side packages and delete API endpoint

**Files:**
- Delete: `src/pages/api/contact.ts`
- Modify: `package.json` (via npm commands)

- [ ] **Step 1: Uninstall server-side packages**

```bash
npm uninstall resend @astrojs/node
```

Expected output: updated `package.json` and `package-lock.json`, no errors.

- [ ] **Step 2: Install EmailJS browser SDK**

```bash
npm install @emailjs/browser
```

Expected: `@emailjs/browser` appears in `dependencies` in `package.json`.

- [ ] **Step 3: Delete the API endpoint**

Delete file `src/pages/api/contact.ts` entirely.

- [ ] **Step 4: Verify unit tests still pass**

```bash
npm test
```

Expected: 8/8 tests pass. The validator is unchanged, so all tests should pass.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git rm src/pages/api/contact.ts
git commit -m "feat: remove Resend/Node adapter, install emailjs-browser"
```

---

## Task 2: Simplify astro.config.mjs

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Replace the entire config file**

Replace `astro.config.mjs` with:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://yourdomain.ru',
  output: 'static',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

> Note: replace `yourdomain.ru` with the real reg.ru domain before going live.

- [ ] **Step 2: Verify build succeeds**

```bash
npm run build
```

Expected: no errors, `dist/` directory created. There should be no `dist/api/` folder.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: simplify astro config to pure static, remove GH Pages conditionals"
```

---

## Task 3: Update Contact.astro — replace fetch with EmailJS

**Files:**
- Modify: `src/components/Contact.astro` (only the `<script>` block, lines 74–118)

- [ ] **Step 1: Replace the `<script>` block**

Find the existing `<script>` block (starts at `<script>`, ends at `</script>`) and replace it entirely with:

```html
<script>
  import emailjs from '@emailjs/browser';
  import { validateContactForm } from '../lib/contact-validator';

  const form = document.getElementById('contact-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const submitText = document.getElementById('submit-text')!;
  const successEl = document.getElementById('form-success')!;
  const errorEl = document.getElementById('form-error')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    successEl.classList.add('hidden');
    errorEl.classList.add('hidden');

    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim(),
    };

    const validation = validateContactForm(data);
    if (!validation.valid) {
      errorEl.textContent = validation.error ?? 'Ошибка валидации';
      errorEl.classList.remove('hidden');
      return;
    }

    submitBtn.disabled = true;
    submitText.textContent = 'Отправляем...';

    try {
      await emailjs.send(
        import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
        import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
        { from_name: data.name, from_email: data.email, message: data.message },
        { publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY }
      );
      form.reset();
      successEl.classList.remove('hidden');
      successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      console.error('[EmailJS] Error:', err);
      errorEl.textContent = 'Ошибка отправки. Напишите нам в Telegram.';
      errorEl.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Отправить заявку';
    }
  });
</script>
```

> The template variables `from_name`, `from_email`, `message` must match your EmailJS template (see Task 4).

- [ ] **Step 2: Verify TypeScript check passes**

```bash
npm run check
```

Expected: no type errors.

- [ ] **Step 3: Build with dummy env vars to confirm bundling works**

```bash
PUBLIC_EMAILJS_SERVICE_ID=test PUBLIC_EMAILJS_TEMPLATE_ID=test PUBLIC_EMAILJS_PUBLIC_KEY=test npm run build
```

Expected: build succeeds, no `@emailjs/browser` import errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.astro
git commit -m "feat: replace Resend fetch with EmailJS client-side send"
```

---

## Task 4: Create EmailJS template (manual step)

**Files:** none (done in EmailJS web dashboard)

- [ ] **Step 1: Open EmailJS dashboard → Email Templates → Create New Template**

- [ ] **Step 2: Set template content**

**Subject:**
```
Новая заявка с сайта — {{from_name}}
```

**Body (HTML):**
```html
<div style="font-family: sans-serif; max-width: 600px;">
  <h2 style="color: #6366f1;">Новая заявка с сайта AI Boost</h2>
  <p><strong>Имя:</strong> {{from_name}}</p>
  <p><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>
  <h3>Сообщение:</h3>
  <p style="white-space: pre-wrap;">{{message}}</p>
</div>
```

**Reply To:** `{{from_email}}`

- [ ] **Step 3: Save the template and copy the Template ID**

It looks like `template_xxxxxxx`. You'll need it for GitHub Secrets.

- [ ] **Step 4: Add your domain to the EmailJS security whitelist**

In EmailJS dashboard → Account → Security → Allowed Origins: add your reg.ru domain (e.g. `https://yourdomain.ru`).

---

## Task 5: Replace GitHub Actions workflow with FTP deploy

**Files:**
- Rewrite: `.github/workflows/deploy.yml`

- [ ] **Step 1: Replace the workflow file**

Replace the entire content of `.github/workflows/deploy.yml` with:

```yaml
name: Deploy to reg.ru

on:
  push:
    branches: [master]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm

      - run: npm ci

      - run: npm run build
        env:
          PUBLIC_EMAILJS_SERVICE_ID: ${{ secrets.PUBLIC_EMAILJS_SERVICE_ID }}
          PUBLIC_EMAILJS_TEMPLATE_ID: ${{ secrets.PUBLIC_EMAILJS_TEMPLATE_ID }}
          PUBLIC_EMAILJS_PUBLIC_KEY: ${{ secrets.PUBLIC_EMAILJS_PUBLIC_KEY }}

      - name: Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/
```

> `server-dir` default is `/public_html/` — verify in your reg.ru panel under FTP settings.

- [ ] **Step 2: Add GitHub Secrets**

Go to GitHub repo → Settings → Secrets and variables → Actions → New repository secret. Add all 6:

| Secret name | Where to find it |
|-------------|-----------------|
| `FTP_SERVER` | reg.ru panel → Hosting → FTP (e.g. `ftp.yourdomain.ru`) |
| `FTP_USERNAME` | reg.ru panel → Hosting → FTP users |
| `FTP_PASSWORD` | reg.ru panel → Hosting → FTP users |
| `PUBLIC_EMAILJS_SERVICE_ID` | EmailJS dashboard → Email Services |
| `PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS dashboard → Email Templates (from Task 4) |
| `PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS dashboard → Account → API Keys |

- [ ] **Step 3: Commit the workflow**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: replace GH Pages workflow with reg.ru FTP deploy"
```

---

## Task 6: Push and verify deployment

- [ ] **Step 1: Push to master**

```bash
git push origin master
```

- [ ] **Step 2: Watch GitHub Actions**

Go to GitHub repo → Actions tab. The "Deploy to reg.ru" workflow should start automatically.

Expected: all steps green. The FTP step will show how many files were uploaded.

- [ ] **Step 3: Verify the deployed site**

Open your reg.ru domain in a browser. Check:
- Page loads correctly
- Contact form is visible
- Submit form with real data and confirm you receive the email

- [ ] **Step 4: Update memory with new status**

Update `docs/superpowers/specs/2026-04-22-ai-boost-landing-design.md` and project memory to reflect:
- EmailJS replaces Resend
- Deployed to reg.ru via FTP
- GitHub Pages workflow removed

---

## Summary of GitHub Secrets Required

| Secret | Example value |
|--------|--------------|
| `FTP_SERVER` | `ftp.yourdomain.ru` |
| `FTP_USERNAME` | `u1234567` |
| `FTP_PASSWORD` | `••••••••` |
| `PUBLIC_EMAILJS_SERVICE_ID` | `service_abc123` |
| `PUBLIC_EMAILJS_TEMPLATE_ID` | `template_xyz789` |
| `PUBLIC_EMAILJS_PUBLIC_KEY` | `AbCdEfGhIj1234567` |
