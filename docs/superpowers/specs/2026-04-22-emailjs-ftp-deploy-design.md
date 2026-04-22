# EmailJS + FTP Deploy Design

**Date:** 2026-04-22  
**Project:** AI Boost Landing  
**Scope:** Replace Resend API with EmailJS (client-side), deploy to reg.ru via FTP through GitHub Actions

---

## Goal

Make the contact form work on static hosting (reg.ru) without a Node.js server by switching from Resend API to EmailJS browser SDK. Automate deployment via GitHub Actions FTP upload.

---

## Architecture

**Before:**
- Astro with conditional node adapter (VPS) / static (GitHub Pages)
- Form → POST `/api/contact` (Resend, server-side) → email
- On GitHub Pages: API stub, form non-functional, Telegram button only

**After:**
- Astro pure static output, no adapter
- Form → EmailJS browser SDK (client-side) → email
- Works on any static host including reg.ru
- Telegram button remains as secondary CTA

---

## Changes

### 1. Remove server-side email infrastructure

- Delete `src/pages/api/contact.ts` — no longer needed
- Remove `resend` npm package
- Remove `@astrojs/node` adapter and dependency

### 2. Install EmailJS

```bash
npm install @emailjs/browser
```

### 3. Update `astro.config.mjs`

Remove all `isGhPages` conditional logic. Final config:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://yourdomain.ru',  // real reg.ru domain
  output: 'static',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

### 4. Update `Contact.astro`

Replace `fetch('/api/contact')` block with EmailJS call. Keep all existing UI, validation, and error/success messages unchanged.

**Credentials used in script:**
```ts
import.meta.env.PUBLIC_EMAILJS_SERVICE_ID
import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID
import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY
```

**Form field name attributes** must match EmailJS template variables:
- `name="name"` → `{{from_name}}`
- `name="email"` → `{{from_email}}`
- `name="message"` → `{{message}}`

Client-side validation via existing `contact-validator.ts` runs before `emailjs.send()`.

### 5. EmailJS Template (manual setup in dashboard)

Create a new template in EmailJS dashboard with:

**Subject:** `Новая заявка с сайта — {{from_name}}`

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

**Reply-To:** `{{from_email}}`

Note the Template ID after saving — add it to GitHub Secrets.

### 6. GitHub Actions Workflow

Replace `.github/workflows/deploy.yml` with FTP deploy workflow:

```yaml
name: Deploy to reg.ru

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
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

### 7. GitHub Secrets to configure

| Secret | Value |
|--------|-------|
| `FTP_SERVER` | e.g. `ftp.yourdomain.ru` |
| `FTP_USERNAME` | FTP login from reg.ru panel |
| `FTP_PASSWORD` | FTP password from reg.ru panel |
| `PUBLIC_EMAILJS_SERVICE_ID` | From EmailJS dashboard |
| `PUBLIC_EMAILJS_TEMPLATE_ID` | From EmailJS dashboard (after creating template) |
| `PUBLIC_EMAILJS_PUBLIC_KEY` | From EmailJS Account → API Keys |

---

## Data Flow

```
User submits form
  → client-side validation (contact-validator.ts)
  → emailjs.sendForm(serviceId, templateId, formEl, publicKey)
  → EmailJS API (external, no server needed)
  → email delivered to configured address
  → success/error message shown to user
```

---

## Security

EmailJS Public Key, Service ID, and Template ID are intentionally client-side — EmailJS enforces security via **domain whitelist**. After setting up, add the reg.ru domain in EmailJS dashboard → Account → Security.

---

## Files Changed

| File | Action |
|------|--------|
| `src/pages/api/contact.ts` | Delete |
| `src/components/Contact.astro` | Update script block |
| `astro.config.mjs` | Simplify, remove node adapter |
| `package.json` | Add `@emailjs/browser`, remove `resend`, `@astrojs/node` |
| `.github/workflows/deploy.yml` | Replace with FTP deploy workflow |

---

## Out of Scope

- Changing form fields or UI design
- Adding spam protection (honeypot/captcha)
- Keeping GitHub Pages deploy active
