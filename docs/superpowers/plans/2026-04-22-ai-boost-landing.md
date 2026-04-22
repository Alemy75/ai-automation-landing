# AI Boost Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready AI-automation landing page for AI Boost — Dark Tech aesthetic, perfect SEO, SSH-deployed on a VPS with PM2 + Nginx.

**Architecture:** Astro 5 in `hybrid` output mode — all pages generate as static HTML at build time; `/api/contact` runs as a live Node.js endpoint via `@astrojs/node`. Nginx is reverse proxy, PM2 manages the process. All UI components are `.astro` files; interactivity uses vanilla `<script>` tags inside components with no framework overhead.

**Tech Stack:** Astro 5 · Tailwind CSS v4 · TypeScript (strict) · lucide-astro · GSAP + ScrollTrigger · Resend API · @astrojs/node · @astrojs/sitemap · Vitest · Playwright · PM2 · Nginx

---

## File Map

```
/
├── src/
│   ├── components/
│   │   ├── Header.astro          sticky nav + mobile burger
│   │   ├── Hero.astro            h1, CTAs, stats, glow bg
│   │   ├── Services.astro        4-card grid
│   │   ├── HowItWorks.astro      4-step timeline
│   │   ├── Cases.astro           portfolio cards (placeholders)
│   │   ├── WhyUs.astro           4 benefit cards
│   │   ├── AIvsTeam.astro        comparison table
│   │   ├── FAQ.astro             accordion + FAQPage JSON-LD
│   │   ├── Contact.astro         form + Telegram CTA
│   │   └── Footer.astro          links + copyright
│   ├── layouts/
│   │   └── Layout.astro          SEO <head>, JSON-LD schemas
│   ├── lib/
│   │   └── contact-validator.ts  pure validation logic (unit-tested)
│   ├── pages/
│   │   ├── index.astro           assembles all components
│   │   └── api/
│   │       └── contact.ts        POST handler — Resend
│   ├── data/
│   │   ├── services.ts
│   │   ├── cases.ts
│   │   └── faq.ts
│   └── styles/
│       └── global.css            @import tailwindcss + @theme
├── tests/
│   ├── unit/
│   │   └── contact-validator.test.ts
│   └── e2e/
│       └── landing.spec.ts
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── og-image.jpg              (placeholder — replace before launch)
├── astro.config.mjs
├── ecosystem.config.cjs          PM2 config
├── deploy.sh                     rsync deploy script
├── .env.example
├── vitest.config.ts
└── playwright.config.ts
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `astro.config.mjs`
- Create: `vitest.config.ts`
- Create: `.env.example`
- Create: `.gitignore`

- [ ] **Step 1: Инициализировать Astro проект**

```bash
npm create astro@latest .
```
В диалоге выбрать:
- Template: **A few best practices** (или `minimal`)
- TypeScript: **Yes** → **Strict**
- Install dependencies: **Yes**
- Initialize git: **No** (добавим позже)

- [ ] **Step 2: Установить зависимости**

```bash
npm install @astrojs/node @astrojs/sitemap
npm install tailwindcss @tailwindcss/vite
npm install lucide-astro
npm install gsap
npm install resend
npm install --save-dev vitest @vitest/coverage-v8
npm install --save-dev @playwright/test
npx playwright install chromium
```

- [ ] **Step 3: Записать `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://yourdomain.com', // заменить перед деплоем
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Записать `vitest.config.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
});
```

- [ ] **Step 5: Записать `.env.example`**

```env
# .env.example
RESEND_API_KEY=re_your_key_here
CONTACT_EMAIL=your@email.com
```

- [ ] **Step 6: Обновить `.gitignore`**

Убедиться, что в `.gitignore` есть:
```
dist/
node_modules/
.env
.env.local
.superpowers/
```

- [ ] **Step 7: Записать `playwright.config.ts`**

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

- [ ] **Step 8: Проверить что проект стартует**

```bash
npm run dev
```
Ожидаемый вывод: `Local: http://localhost:4321/` без ошибок.

- [ ] **Step 9: Коммит**

```bash
git init
git add astro.config.mjs vitest.config.ts playwright.config.ts .env.example .gitignore package.json package-lock.json tsconfig.json
git commit -m "chore: init Astro 5 project with Tailwind v4, GSAP, Resend, testing"
```

---

## Task 2: Глобальные стили и Tailwind v4

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Создать `src/styles/global.css`**

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Brand colors */
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-primary-light: #818cf8;
  --color-accent: #10b981;
  --color-accent-dark: #059669;
  --color-accent-light: #34d399;
  --color-violet: #8b5cf6;

  /* Backgrounds */
  --color-bg: #0a0a14;
  --color-bg-deep: #080810;
  --color-bg-surface: #0d0d1a;
  --color-bg-card: #111827;

  /* Text */
  --color-text: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;

  /* Font */
  --font-sans: 'Inter', system-ui, sans-serif;
}

/* Base */
:root { color-scheme: dark; }

html { scroll-behavior: smooth; }

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-bg); }
::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 3px;
}

/* Focus */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Section anchor offset (for sticky header) */
section[id] {
  scroll-margin-top: 72px;
}

/* Glow effect utility */
.glow-primary {
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.3);
}
.glow-accent {
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.2);
}

/* CSS grid overlay for Hero */
.bg-grid {
  background-image:
    linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Reveal animation base (used by GSAP) */
.reveal {
  opacity: 0;
  transform: translateY(24px);
}
```

- [ ] **Step 2: Удалить дефолтные стили Astro**

Удалить файл `src/styles/global.css` если он уже существует с другим содержимым (перезапишет наш шаг 1).
Удалить любой `<style>` из `src/pages/index.astro` который создал Astro по умолчанию.

- [ ] **Step 3: Коммит**

```bash
git add src/styles/global.css
git commit -m "style: add Tailwind v4 theme with Dark Tech color palette"
```

---

## Task 3: Layout.astro — SEO head

**Files:**
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Создать `src/layouts/Layout.astro`**

```astro
---
// src/layouts/Layout.astro
import '../styles/global.css';

export interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = 'AI Boost — AI-автоматизация для бизнеса',
  description = 'Разрабатываем сайты, CRM-системы, веб-приложения и автоматизируем процессы бизнеса с помощью AI. Быстро, фиксированная цена, запуск от 2 недель.',
  ogImage = '/og-image.jpg',
} = Astro.props;

const canonicalUrl = Astro.url.href;
const siteUrl = import.meta.env.SITE ?? 'https://yourdomain.com';

const orgSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AI Boost",
  "url": siteUrl,
  "description": description,
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Russian"
  }
});

const webSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AI Boost",
  "url": siteUrl
});
---

<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0a0a14" />

    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={`${siteUrl}${ogImage}`} />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:site_name" content="AI Boost" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />

    <!-- JSON-LD -->
    <script type="application/ld+json" set:html={orgSchema} />
    <script type="application/ld+json" set:html={webSchema} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Проверить `astro check`**

```bash
npx astro check
```
Ожидаемый вывод: `0 errors` (предупреждения о пустом `<slot />` допустимы).

- [ ] **Step 3: Коммит**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add Layout with full SEO head, OG tags, JSON-LD schemas"
```

---

## Task 4: Слой данных (TypeScript)

**Files:**
- Create: `src/data/services.ts`
- Create: `src/data/cases.ts`
- Create: `src/data/faq.ts`

- [ ] **Step 1: Создать `src/data/services.ts`**

```ts
// src/data/services.ts
export interface Service {
  id: string;
  icon: string;         // имя иконки Lucide
  title: string;
  description: string;
  accent: 'primary' | 'accent' | 'violet';
}

export const services: Service[] = [
  {
    id: 'websites',
    icon: 'Globe',
    title: 'Сайты и лендинги',
    description: 'Быстрые, SEO-оптимизированные сайты, которые продают',
    accent: 'primary',
  },
  {
    id: 'crm',
    icon: 'Bot',
    title: 'CRM-системы',
    description: 'Управление клиентами и сделками под ваш бизнес',
    accent: 'accent',
  },
  {
    id: 'webapps',
    icon: 'LayoutDashboard',
    title: 'Веб-приложения',
    description: 'Автоматизация рутинных задач и бизнес-процессов',
    accent: 'violet',
  },
  {
    id: 'admin',
    icon: 'Settings2',
    title: 'Админ-панели',
    description: 'Удобное управление данными и операциями бизнеса',
    accent: 'accent',
  },
];
```

- [ ] **Step 2: Создать `src/data/cases.ts`**

```ts
// src/data/cases.ts
export interface Case {
  id: string;
  title: string;
  category: string;
  metric: string;
  metricLabel: string;
  gradient: string;    // CSS gradient для placeholder-фото
}

export const cases: Case[] = [
  {
    id: 'construction-crm',
    title: 'CRM для строительной компании',
    category: 'CRM-система',
    metric: '+40%',
    metricLabel: 'эффективность менеджеров',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(16,185,129,0.3))',
  },
  {
    id: 'warehouse-automation',
    title: 'Автоматизация склада',
    category: 'Веб-приложение',
    metric: '−60%',
    metricLabel: 'времени на учёт товаров',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(99,102,241,0.3))',
  },
  {
    id: 'beauty-booking',
    title: 'Платформа записи для салона красоты',
    category: 'Лендинг + Система',
    metric: '+85%',
    metricLabel: 'онлайн-записей',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(99,102,241,0.3))',
  },
];
```

- [ ] **Step 3: Создать `src/data/faq.ts`**

```ts
// src/data/faq.ts
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: 'cost',
    question: 'Сколько стоит разработка?',
    answer: 'Стоимость зависит от проекта: лендинг — от 50 000 ₽, CRM-система — от 150 000 ₽, веб-приложение — от 200 000 ₽. Цена фиксируется в договоре до начала работ — никаких скрытых доплат.',
  },
  {
    id: 'timeline',
    question: 'Как долго длится разработка?',
    answer: 'Лендинг — 1–2 недели, CRM или веб-приложение — 4–8 недель. Первый рабочий прототип показываем уже через 5–7 дней после старта.',
  },
  {
    id: 'no-tech',
    question: 'Нужны ли технические знания с моей стороны?',
    answer: 'Нет. Вам нужно только объяснить задачу и бизнес-процессы — техническую часть берём на себя полностью. Мы говорим на языке бизнеса, не кода.',
  },
  {
    id: 'guarantee',
    question: 'Какие гарантии вы даёте?',
    answer: 'Работаем по договору с фиксированными сроками и ценой. После сдачи проекта — 3 месяца бесплатной гарантийной поддержки. Если что-то идёт не так, исправляем за свой счёт.',
  },
  {
    id: 'support',
    question: 'Что происходит после запуска проекта?',
    answer: 'Обучаем вас и команду работе с системой, передаём все доступы и исходники. Предлагаем тарифы на поддержку и развитие. Мы в Telegram — всегда на связи.',
  },
  {
    id: 'start',
    question: 'Что нужно, чтобы начать?',
    answer: 'Просто напишите нам — расскажите о задаче в свободной форме. Мы проведём бесплатный брифинг (30–60 мин), разберёмся в деталях и предложим решение с оценкой стоимости.',
  },
];
```

- [ ] **Step 4: Проверить типы**

```bash
npx astro check
```
Ожидаемый вывод: `0 errors`.

- [ ] **Step 5: Коммит**

```bash
git add src/data/
git commit -m "feat: add typed data layer — services, cases, FAQ"
```

---

## Task 5: Валидатор формы (TDD)

**Files:**
- Create: `src/lib/contact-validator.ts`
- Create: `tests/unit/contact-validator.test.ts`

- [ ] **Step 1: Написать падающие тесты**

```ts
// tests/unit/contact-validator.test.ts
import { describe, it, expect } from 'vitest';
import { validateContactForm } from '../../src/lib/contact-validator';

describe('validateContactForm', () => {
  it('returns valid for correct data', () => {
    const result = validateContactForm({
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      message: 'Хочу обсудить проект',
    });
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('rejects empty name', () => {
    const result = validateContactForm({ name: '', email: 'a@b.com', message: 'text' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Имя обязательно');
  });

  it('rejects whitespace-only name', () => {
    const result = validateContactForm({ name: '   ', email: 'a@b.com', message: 'text' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Имя обязательно');
  });

  it('rejects invalid email', () => {
    const result = validateContactForm({ name: 'Ivan', email: 'not-an-email', message: 'text' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Укажите корректный email');
  });

  it('rejects empty email', () => {
    const result = validateContactForm({ name: 'Ivan', email: '', message: 'text' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Укажите корректный email');
  });

  it('rejects empty message', () => {
    const result = validateContactForm({ name: 'Ivan', email: 'a@b.com', message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Сообщение обязательно');
  });

  it('rejects non-object input', () => {
    const result = validateContactForm(null);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Некорректный запрос');
  });

  it('rejects missing fields', () => {
    const result = validateContactForm({});
    expect(result.valid).toBe(false);
  });
});
```

- [ ] **Step 2: Запустить тесты — убедиться что они падают**

```bash
npx vitest run
```
Ожидаемый вывод: ошибка `Cannot find module '../../src/lib/contact-validator'`.

- [ ] **Step 3: Реализовать валидатор**

```ts
// src/lib/contact-validator.ts
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateContactForm(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Некорректный запрос' };
  }

  const { name, email, message } = data as Record<string, unknown>;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Имя обязательно' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return { valid: false, error: 'Укажите корректный email' };
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return { valid: false, error: 'Сообщение обязательно' };
  }

  return { valid: true };
}
```

- [ ] **Step 4: Запустить тесты — убедиться что все проходят**

```bash
npx vitest run
```
Ожидаемый вывод: `8 passed`.

- [ ] **Step 5: Коммит**

```bash
git add src/lib/contact-validator.ts tests/unit/contact-validator.test.ts
git commit -m "feat: add contact form validator with unit tests"
```

---

## Task 6: Header.astro

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Создать `src/components/Header.astro`**

```astro
---
// src/components/Header.astro
---

<header
  id="site-header"
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
  style="background: transparent;"
>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 md:h-18">

      <!-- Logo -->
      <a href="/" class="flex items-center gap-1 text-xl font-black tracking-wider shrink-0">
        <span style="color: var(--color-primary);">AI</span>
        <span style="color: var(--color-accent);">BOOST</span>
      </a>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-8">
        <a href="#services" class="text-sm transition-colors" style="color: var(--color-text-secondary);"
          onmouseover="this.style.color='var(--color-text)'"
          onmouseout="this.style.color='var(--color-text-secondary)'">Услуги</a>
        <a href="#cases" class="text-sm transition-colors" style="color: var(--color-text-secondary);"
          onmouseover="this.style.color='var(--color-text)'"
          onmouseout="this.style.color='var(--color-text-secondary)'">Кейсы</a>
        <a href="#faq" class="text-sm transition-colors" style="color: var(--color-text-secondary);"
          onmouseover="this.style.color='var(--color-text)'"
          onmouseout="this.style.color='var(--color-text-secondary)'">FAQ</a>
        <a
          href="#contact"
          class="text-sm font-medium px-4 py-2 rounded-lg border transition-all duration-200"
          style="border-color: var(--color-primary); color: var(--color-primary-light); background: rgba(99,102,241,0.08);"
          onmouseover="this.style.background='rgba(99,102,241,0.18)'"
          onmouseout="this.style.background='rgba(99,102,241,0.08)'"
        >
          Связаться
        </a>
      </nav>

      <!-- Mobile burger -->
      <button
        id="burger-btn"
        aria-label="Открыть меню"
        aria-expanded="false"
        class="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg"
        style="color: var(--color-text-secondary);"
      >
        <span id="burger-line-1" class="block w-6 h-0.5 rounded transition-all duration-300" style="background: currentColor;"></span>
        <span id="burger-line-2" class="block w-6 h-0.5 rounded transition-all duration-300" style="background: currentColor;"></span>
        <span id="burger-line-3" class="block w-4 h-0.5 rounded transition-all duration-300" style="background: currentColor;"></span>
      </button>

    </div>
  </div>
</header>

<!-- Mobile menu drawer -->
<div
  id="mobile-menu"
  class="fixed inset-0 z-40 md:hidden pointer-events-none"
  aria-hidden="true"
>
  <!-- Backdrop -->
  <div
    id="menu-backdrop"
    class="absolute inset-0 opacity-0 transition-opacity duration-300"
    style="background: rgba(0,0,0,0.7);"
  ></div>

  <!-- Drawer -->
  <nav
    id="menu-drawer"
    class="absolute top-0 right-0 h-full w-72 flex flex-col pt-20 px-6 gap-2 translate-x-full transition-transform duration-300"
    style="background: var(--color-bg-surface); border-left: 1px solid rgba(99,102,241,0.2);"
  >
    <a href="#services" class="menu-link py-3 text-lg font-medium border-b" style="color: var(--color-text); border-color: rgba(255,255,255,0.06);">Услуги</a>
    <a href="#cases" class="menu-link py-3 text-lg font-medium border-b" style="color: var(--color-text); border-color: rgba(255,255,255,0.06);">Кейсы</a>
    <a href="#faq" class="menu-link py-3 text-lg font-medium border-b" style="color: var(--color-text); border-color: rgba(255,255,255,0.06);">FAQ</a>
    <a
      href="#contact"
      class="menu-link mt-4 text-center py-3 rounded-lg font-semibold"
      style="background: var(--color-primary); color: white;"
    >
      Связаться
    </a>
  </nav>
</div>

<script>
  const header = document.getElementById('site-header')!;
  const burgerBtn = document.getElementById('burger-btn')!;
  const mobileMenu = document.getElementById('mobile-menu')!;
  const backdrop = document.getElementById('menu-backdrop')!;
  const drawer = document.getElementById('menu-drawer')!;
  const line1 = document.getElementById('burger-line-1')!;
  const line2 = document.getElementById('burger-line-2')!;
  const line3 = document.getElementById('burger-line-3')!;
  let menuOpen = false;

  // Sticky header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.background = 'rgba(10, 10, 20, 0.92)';
      header.style.backdropFilter = 'blur(12px)';
      header.style.borderBottom = '1px solid rgba(99,102,241,0.15)';
    } else {
      header.style.background = 'transparent';
      header.style.backdropFilter = '';
      header.style.borderBottom = '';
    }
  });

  // Toggle mobile menu
  function toggleMenu(open: boolean) {
    menuOpen = open;
    burgerBtn.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));

    if (open) {
      mobileMenu.classList.remove('pointer-events-none');
      backdrop.style.opacity = '1';
      drawer.style.transform = 'translateX(0)';
      // Animate burger → X
      line1.style.transform = 'translateY(8px) rotate(45deg)';
      line2.style.opacity = '0';
      line3.style.transform = 'translateY(-8px) rotate(-45deg)';
      line3.style.width = '24px';
    } else {
      mobileMenu.classList.add('pointer-events-none');
      backdrop.style.opacity = '0';
      drawer.style.transform = 'translateX(100%)';
      line1.style.transform = '';
      line2.style.opacity = '1';
      line3.style.transform = '';
      line3.style.width = '16px';
    }
  }

  burgerBtn.addEventListener('click', () => toggleMenu(!menuOpen));
  backdrop.addEventListener('click', () => toggleMenu(false));

  // Close on nav link click
  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
</script>
```

- [ ] **Step 2: Проверить**

```bash
npx astro check
```
Ожидаемый вывод: `0 errors`.

- [ ] **Step 3: Коммит**

```bash
git add src/components/Header.astro
git commit -m "feat: add sticky Header with mobile burger menu"
```

---

## Task 7: Hero.astro

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Создать `src/components/Hero.astro`**

```astro
---
// src/components/Hero.astro
---

<section
  id="hero"
  class="relative min-h-screen flex items-center overflow-hidden pt-16"
  style="background: linear-gradient(160deg, var(--color-bg) 0%, #0f0f1e 60%, #0a1628 100%);"
>
  <!-- CSS grid overlay -->
  <div class="absolute inset-0 bg-grid opacity-40 pointer-events-none"></div>

  <!-- Glow blobs -->
  <div class="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
    style="background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%); filter: blur(40px);"></div>
  <div class="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
    style="background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%); filter: blur(40px);"></div>

  <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
    <div class="max-w-3xl">

      <!-- Badge -->
      <div class="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border text-xs font-medium tracking-widest uppercase hero-badge"
        style="border-color: rgba(99,102,241,0.4); color: var(--color-primary-light); background: rgba(99,102,241,0.08);">
        <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: var(--color-primary);"></span>
        AI-Автоматизация бизнеса
      </div>

      <!-- H1 -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 hero-title">
        Автоматизируйте<br />
        бизнес с
        <span class="inline-block" style="background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          AI Boost
        </span>
      </h1>

      <!-- Subheading -->
      <p class="text-lg md:text-xl mb-10 max-w-xl leading-relaxed hero-subtitle"
        style="color: var(--color-text-secondary);">
        Разрабатываем сайты, CRM-системы, веб-приложения<br class="hidden md:block" />
        и автоматизируем процессы вашего бизнеса
      </p>

      <!-- CTAs -->
      <div class="flex flex-col sm:flex-row gap-4 mb-16 hero-ctas">
        <a
          href="#contact"
          class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); box-shadow: 0 0 30px rgba(99,102,241,0.3);"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          Обсудить проект
        </a>
        <a
          href="#cases"
          class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
          style="border: 1px solid rgba(99,102,241,0.4); color: var(--color-primary-light); background: rgba(99,102,241,0.06);"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
          Посмотреть кейсы
        </a>
      </div>

      <!-- Stats -->
      <div class="flex flex-wrap gap-10 hero-stats">
        <div>
          <div class="text-3xl font-black" style="color: var(--color-text);">
            <span class="counter" data-target="50">0</span>+
          </div>
          <div class="text-sm mt-1" style="color: var(--color-text-muted);">проектов</div>
        </div>
        <div>
          <div class="text-3xl font-black" style="color: var(--color-text);">
            <span class="counter" data-target="3">0</span> года
          </div>
          <div class="text-sm mt-1" style="color: var(--color-text-muted);">опыта</div>
        </div>
        <div>
          <div class="text-3xl font-black" style="color: var(--color-text);">
            <span class="counter" data-target="40">0</span>+
          </div>
          <div class="text-sm mt-1" style="color: var(--color-text-muted);">клиентов</div>
        </div>
      </div>

    </div>
  </div>
</section>

<script>
  // Counter animation on intersection
  const counters = document.querySelectorAll<HTMLElement>('.counter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      const target = parseInt(el.dataset.target ?? '0', 10);
      const duration = 1500;
      const start = performance.now();

      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = String(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = String(target);
      };

      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
</script>
```

- [ ] **Step 2: Коммит**

```bash
git add src/components/Hero.astro
git commit -m "feat: add Hero section with animated counters and glow bg"
```

---

## Task 8: Services.astro

**Files:**
- Create: `src/components/Services.astro`

- [ ] **Step 1: Создать `src/components/Services.astro`**

```astro
---
// src/components/Services.astro
import { Globe, Bot, LayoutDashboard, Settings2 } from 'lucide-astro';
import { services } from '../data/services';

const iconMap: Record<string, any> = { Globe, Bot, LayoutDashboard, Settings2 };

const accentColors: Record<string, string> = {
  primary: 'rgba(99,102,241,0.2)',
  accent: 'rgba(16,185,129,0.2)',
  violet: 'rgba(139,92,246,0.2)',
};
const borderColors: Record<string, string> = {
  primary: 'rgba(99,102,241,0.25)',
  accent: 'rgba(16,185,129,0.25)',
  violet: 'rgba(139,92,246,0.25)',
};
const iconColors: Record<string, string> = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
  violet: 'var(--color-violet)',
};
---

<section id="services" class="py-24" style="background: var(--color-bg-surface);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Heading -->
    <div class="mb-14 reveal">
      <p class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--color-primary);">Услуги</p>
      <h2 class="text-3xl sm:text-4xl font-black" style="color: var(--color-text);">Что мы разрабатываем</h2>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map(service => {
        const IconComponent = iconMap[service.icon];
        return (
          <div
            class="reveal group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={`background: var(--color-bg-card); border: 1px solid ${borderColors[service.accent]};`}
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={`background: ${accentColors[service.accent]};`}
            >
              <IconComponent size={22} style={`color: ${iconColors[service.accent]};`} />
            </div>
            <h3 class="text-base font-bold mb-2" style="color: var(--color-text);">{service.title}</h3>
            <p class="text-sm leading-relaxed" style="color: var(--color-text-muted);">{service.description}</p>
          </div>
        );
      })}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Коммит**

```bash
git add src/components/Services.astro
git commit -m "feat: add Services section with 4 cards and Lucide icons"
```

---

## Task 9: HowItWorks.astro

**Files:**
- Create: `src/components/HowItWorks.astro`

- [ ] **Step 1: Создать `src/components/HowItWorks.astro`**

```astro
---
// src/components/HowItWorks.astro
const steps = [
  { n: '01', title: 'Анализ и брифинг', desc: 'Изучаем бизнес, задачи, конкурентов. Определяем точку А и точку Б.', accent: 'primary' },
  { n: '02', title: 'Прототип и дизайн', desc: 'Показываем макет ещё до старта разработки. Утверждаете — начинаем.', accent: 'primary' },
  { n: '03', title: 'Разработка', desc: 'Спринты по 1–2 недели с регулярными показами. Всегда в курсе прогресса.', accent: 'primary' },
  { n: '04', title: 'Запуск и поддержка', desc: 'Деплой, обучение команды, передача доступов. Остаёмся на связи.', accent: 'accent' },
];
---

<section id="how-it-works" class="py-24" style="background: var(--color-bg-deep);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    <div class="mb-14 reveal">
      <p class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--color-accent);">Процесс</p>
      <h2 class="text-3xl sm:text-4xl font-black" style="color: var(--color-text);">Как мы работаем</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, i) => (
        <div class="reveal relative">
          <!-- Connector line (desktop) -->
          {i < steps.length - 1 && (
            <div class="hidden lg:block absolute top-6 left-full w-full h-px z-0"
              style="background: linear-gradient(90deg, rgba(99,102,241,0.4), transparent); width: calc(100% - 24px); left: calc(100% - 12px);"></div>
          )}

          <div class="relative z-10 p-6 rounded-2xl h-full"
            style="background: var(--color-bg-card); border: 1px solid rgba(255,255,255,0.06);">

            <!-- Step number -->
            <div class="text-4xl font-black mb-4 leading-none"
              style={`background: linear-gradient(135deg, var(--color-${step.accent}), transparent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`}>
              {step.n}
            </div>

            <h3 class="text-base font-bold mb-2" style="color: var(--color-text);">{step.title}</h3>
            <p class="text-sm leading-relaxed" style="color: var(--color-text-muted);">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Коммит**

```bash
git add src/components/HowItWorks.astro
git commit -m "feat: add HowItWorks 4-step timeline section"
```

---

## Task 10: Cases.astro

**Files:**
- Create: `src/components/Cases.astro`

- [ ] **Step 1: Создать `src/components/Cases.astro`**

```astro
---
// src/components/Cases.astro
import { cases } from '../data/cases';
import { TrendingUp } from 'lucide-astro';
---

<section id="cases" class="py-24" style="background: var(--color-bg-surface);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    <div class="mb-14 reveal">
      <p class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--color-primary);">Портфолио</p>
      <h2 class="text-3xl sm:text-4xl font-black" style="color: var(--color-text);">Реализованные проекты</h2>
      <p class="mt-3 text-base" style="color: var(--color-text-secondary);">Реальные задачи — реальные результаты</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cases.map(c => (
        <div class="reveal group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
          style="background: var(--color-bg-card); border: 1px solid rgba(255,255,255,0.07);">

          <!-- Screenshot placeholder -->
          <div class="h-44 flex items-center justify-center relative overflow-hidden"
            style={`background: ${c.gradient};`}>
            <div class="text-center">
              <div class="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                style="background: rgba(255,255,255,0.1);">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
              <p class="text-xs" style="color: rgba(255,255,255,0.4);">Скриншот проекта</p>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <span class="inline-block text-xs font-medium px-2 py-1 rounded-md mb-3"
              style="background: rgba(99,102,241,0.15); color: var(--color-primary-light);">
              {c.category}
            </span>
            <h3 class="text-base font-bold mb-2" style="color: var(--color-text);">{c.title}</h3>
            <div class="flex items-center gap-1.5 text-sm font-semibold" style="color: var(--color-accent);">
              <TrendingUp size={14} />
              <span>{c.metric} {c.metricLabel}</span>
            </div>
          </div>

        </div>
      ))}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Коммит**

```bash
git add src/components/Cases.astro
git commit -m "feat: add Cases portfolio section with 3 placeholder cards"
```

---

## Task 11: WhyUs.astro

**Files:**
- Create: `src/components/WhyUs.astro`

- [ ] **Step 1: Создать `src/components/WhyUs.astro`**

```astro
---
// src/components/WhyUs.astro
const benefits = [
  { icon: 'cpu', title: 'AI в каждом проекте', desc: 'Используем AI-инструменты на каждом этапе — от дизайна до тестирования. Это ×3–5 быстрее стандартной разработки.', accent: 'primary' },
  { icon: 'zap', title: 'Запуск от 2 недель', desc: 'Первый рабочий прототип — уже через 5–7 дней. Короткие спринты, быстрая обратная связь.', accent: 'accent' },
  { icon: 'shield-check', title: 'Фиксированная цена', desc: 'Стоимость и сроки фиксируются в договоре до начала работ. Без сюрпризов в конце.', accent: 'primary' },
  { icon: 'headphones', title: 'Поддержка 24/7', desc: 'После запуска не исчезаем. 3 месяца гарантийного сопровождения, Telegram всегда открыт.', accent: 'accent' },
];

// Inline SVG paths for icons
const svgPaths: Record<string, string> = {
  'cpu': '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
  'zap': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'headphones': '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
};

const accentBg: Record<string, string> = {
  primary: 'rgba(99,102,241,0.12)',
  accent: 'rgba(16,185,129,0.12)',
};
const iconColor: Record<string, string> = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
};
const borderColor: Record<string, string> = {
  primary: 'rgba(99,102,241,0.2)',
  accent: 'rgba(16,185,129,0.2)',
};
---

<section id="why-us" class="py-24" style="background: var(--color-bg-deep);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    <div class="mb-14 reveal">
      <p class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--color-accent);">Преимущества</p>
      <h2 class="text-3xl sm:text-4xl font-black" style="color: var(--color-text);">Почему AI Boost?</h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {benefits.map(b => (
        <div class="reveal p-6 rounded-2xl flex gap-5"
          style={`background: var(--color-bg-card); border: 1px solid ${borderColor[b.accent]};`}>
          <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={`background: ${accentBg[b.accent]};`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke={iconColor[b.accent]} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              set:html={svgPaths[b.icon]} />
          </div>
          <div>
            <h3 class="text-base font-bold mb-1" style="color: var(--color-text);">{b.title}</h3>
            <p class="text-sm leading-relaxed" style="color: var(--color-text-muted);">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Коммит**

```bash
git add src/components/WhyUs.astro
git commit -m "feat: add WhyUs section with 4 benefit cards"
```

---

## Task 12: AIvsTeam.astro

**Files:**
- Create: `src/components/AIvsTeam.astro`

- [ ] **Step 1: Создать `src/components/AIvsTeam.astro`**

```astro
---
// src/components/AIvsTeam.astro
const rows = [
  {
    label: 'Стоимость',
    iconPath: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
    us: { value: 'от 50 000 ₽', sub: 'фиксированно', good: true },
    them: { value: 'от 500 000 ₽', sub: '+ налоги + офис', good: false },
  },
  {
    label: 'Срок запуска',
    iconPath: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    us: { value: '2–4 недели', sub: 'первый результат', good: true },
    them: { value: '2–6 месяцев', sub: 'найм + онбординг', good: false },
  },
  {
    label: 'Скорость разработки',
    iconPath: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    us: { value: '×3–5 быстрее', sub: 'за счёт AI-инструментов', good: true },
    them: { value: 'Стандартная', sub: 'человеческий темп', good: null },
  },
  {
    label: 'Риски',
    iconPath: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    us: { value: 'Минимальные', sub: 'фикс. цена, договор', good: true },
    them: { value: 'Высокие', sub: 'увольнения, текучка', good: false },
  },
  {
    label: 'Поддержка',
    iconPath: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    us: { value: '24/7 Telegram', sub: 'всегда на связи', good: true },
    them: { value: 'Рабочие часы', sub: 'отпуска, больничные', good: null },
  },
];
---

<section id="ai-vs-team" class="py-24" style="background: var(--color-bg-surface);">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

    <div class="mb-14 reveal">
      <p class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--color-primary);">Сравнение</p>
      <h2 class="text-3xl sm:text-4xl font-black" style="color: var(--color-text);">
        AI-разработка vs<br />Штатная команда
      </h2>
      <p class="mt-3 text-base" style="color: var(--color-text-secondary);">Почему малый бизнес выбирает нас</p>
    </div>

    <!-- Table -->
    <div class="reveal rounded-2xl overflow-hidden" style="border: 1px solid rgba(255,255,255,0.07);">

      <!-- Header -->
      <div class="grid grid-cols-3" style="background: var(--color-bg-card);">
        <div class="p-4 border-r" style="border-color: rgba(255,255,255,0.06);"></div>
        <div class="p-4 text-center border-r" style="border-color: rgba(255,255,255,0.06);">
          <div class="text-sm font-bold" style="color: var(--color-primary-light);">AI Boost</div>
        </div>
        <div class="p-4 text-center">
          <div class="text-sm font-bold" style="color: var(--color-text-muted);">Штатная команда</div>
        </div>
      </div>

      <!-- Rows -->
      {rows.map((row, i) => (
        <div class="grid grid-cols-3 border-t" style="border-color: rgba(255,255,255,0.06); background: var(--color-bg-card);">

          <!-- Label -->
          <div class="p-4 flex items-center gap-3 border-r" style="border-color: rgba(255,255,255,0.06); background: var(--color-bg-deep);">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              set:html={row.iconPath} />
            <span class="text-xs font-medium" style="color: var(--color-text-secondary);">{row.label}</span>
          </div>

          <!-- Us -->
          <div class="p-4 text-center border-r" style="border-color: rgba(255,255,255,0.06);">
            <div class="text-sm font-bold" style={`color: ${row.us.good ? 'var(--color-accent)' : 'var(--color-text-muted)'};`}>
              {row.us.value}
            </div>
            <div class="text-xs mt-0.5" style="color: var(--color-text-muted);">{row.us.sub}</div>
          </div>

          <!-- Them -->
          <div class="p-4 text-center">
            <div class="text-sm font-bold" style={`color: ${row.them.good === false ? '#ef4444' : row.them.good === true ? 'var(--color-accent)' : 'var(--color-text-muted)'};`}>
              {row.them.value}
            </div>
            <div class="text-xs mt-0.5" style="color: var(--color-text-muted);">{row.them.sub}</div>
          </div>

        </div>
      ))}
    </div>

    <!-- Callout -->
    <div class="reveal mt-6 flex items-start gap-3 p-4 rounded-xl"
      style="background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2);">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
        <path d="M9 18h6"/><path d="M10 22h4"/>
      </svg>
      <p class="text-sm leading-relaxed" style="color: var(--color-primary-light);">
        <strong>Итог:</strong> Вы получаете экспертизу целой команды (дизайнер, разработчик, менеджер, QA) по цене одного junior-разработчика.
      </p>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Коммит**

```bash
git add src/components/AIvsTeam.astro
git commit -m "feat: add AIvsTeam comparison table section"
```

---

## Task 13: FAQ.astro

**Files:**
- Create: `src/components/FAQ.astro`

- [ ] **Step 1: Создать `src/components/FAQ.astro`**

```astro
---
// src/components/FAQ.astro
import { faqItems } from '../data/faq';

const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
});
---

<section id="faq" class="py-24" style="background: var(--color-bg-deep);">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

    <div class="mb-14 reveal">
      <p class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--color-primary);">FAQ</p>
      <h2 class="text-3xl sm:text-4xl font-black" style="color: var(--color-text);">Частые вопросы</h2>
    </div>

    <div class="flex flex-col gap-3">
      {faqItems.map(item => (
        <div
          class="reveal faq-item rounded-xl overflow-hidden"
          style="background: var(--color-bg-card); border: 1px solid rgba(255,255,255,0.07);"
        >
          <button
            class="faq-trigger w-full flex items-center justify-between gap-4 p-5 text-left"
            aria-expanded="false"
            data-faq-id={item.id}
          >
            <span class="text-sm font-semibold" style="color: var(--color-text);">{item.question}</span>
            <svg
              class="faq-icon shrink-0 transition-transform duration-300"
              xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
          </button>
          <div class="faq-body overflow-hidden" style="max-height: 0; transition: max-height 0.35s ease;">
            <p class="px-5 pb-5 text-sm leading-relaxed" style="color: var(--color-text-secondary);">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

<!-- FAQPage JSON-LD -->
<script type="application/ld+json" set:html={faqSchema} />

<script>
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item')!;
      const body = item.querySelector('.faq-body') as HTMLElement;
      const icon = trigger.querySelector('.faq-icon') as SVGElement;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-trigger[aria-expanded="true"]').forEach(other => {
        if (other === trigger) return;
        other.setAttribute('aria-expanded', 'false');
        const otherBody = other.closest('.faq-item')!.querySelector('.faq-body') as HTMLElement;
        const otherIcon = other.querySelector('.faq-icon') as SVGElement;
        otherBody.style.maxHeight = '0';
        otherIcon.style.transform = '';
      });

      // Toggle current
      trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      body.style.maxHeight = isOpen ? '0' : `${body.scrollHeight}px`;
      icon.style.transform = isOpen ? '' : 'rotate(45deg)';
    });
  });
</script>
```

- [ ] **Step 2: Коммит**

```bash
git add src/components/FAQ.astro
git commit -m "feat: add FAQ accordion with FAQPage JSON-LD schema"
```

---

## Task 14: API route — /api/contact.ts

**Files:**
- Create: `src/pages/api/contact.ts`

- [ ] **Step 1: Создать `.env` для локальной разработки**

```bash
cp .env.example .env
# Отредактировать .env — добавить реальный RESEND_API_KEY и CONTACT_EMAIL
```

- [ ] **Step 2: Создать `src/pages/api/contact.ts`**

```ts
// src/pages/api/contact.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { validateContactForm } from '../../lib/contact-validator';

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Некорректный формат запроса' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const validation = validateContactForm(body);
  if (!validation.valid) {
    return new Response(
      JSON.stringify({ error: validation.error }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { name, email, message } = body as { name: string; email: string; message: string };

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'AI Boost <noreply@yourdomain.com>',
      to: import.meta.env.CONTACT_EMAIL,
      subject: `Новая заявка с сайта — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #6366f1;">Новая заявка с сайта AI Boost</h2>
          <table>
            <tr><td><strong>Имя:</strong></td><td>${name}</td></tr>
            <tr><td><strong>Email:</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
          </table>
          <h3>Сообщение:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
      replyTo: email,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[contact API] Resend error:', err);
    return new Response(
      JSON.stringify({ error: 'Ошибка отправки. Попробуйте позже или напишите напрямую в Telegram.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

- [ ] **Step 3: Коммит**

```bash
git add src/pages/api/contact.ts
git commit -m "feat: add /api/contact POST route with Resend integration"
```

---

## Task 15: Contact.astro

**Files:**
- Create: `src/components/Contact.astro`

- [ ] **Step 1: Создать `src/components/Contact.astro`**

```astro
---
// src/components/Contact.astro
const TELEGRAM_URL = 'https://t.me/YOUR_USERNAME'; // заменить перед деплоем
---

<section id="contact" class="py-24" style="background: var(--color-bg-surface);">
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

    <div class="mb-10 reveal">
      <p class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--color-accent);">Контакты</p>
      <h2 class="text-3xl sm:text-4xl font-black mb-3" style="color: var(--color-text);">Обсудим ваш проект</h2>
      <p class="text-base" style="color: var(--color-text-secondary);">Ответим в течение 1 часа в рабочее время</p>
    </div>

    <div class="reveal rounded-2xl p-8" style="background: var(--color-bg-card); border: 1px solid rgba(99,102,241,0.2);">

      <!-- Success / Error messages -->
      <div id="form-success" class="hidden mb-6 p-4 rounded-xl text-sm"
        style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: var(--color-accent);">
        Заявка отправлена! Мы свяжемся с вами в ближайшее время.
      </div>
      <div id="form-error" class="hidden mb-6 p-4 rounded-xl text-sm"
        style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171;">
      </div>

      <form id="contact-form" class="flex flex-col gap-5" novalidate>

        <div>
          <label for="name" class="block text-xs font-medium mb-1.5" style="color: var(--color-text-secondary);">Ваше имя</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Иван Иванов"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
            style="background: var(--color-bg-deep); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text);"
            onfocus="this.style.borderColor='var(--color-primary)'"
            onblur="this.style.borderColor='rgba(255,255,255,0.1)'"
          />
        </div>

        <div>
          <label for="email" class="block text-xs font-medium mb-1.5" style="color: var(--color-text-secondary);">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="ivan@company.ru"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
            style="background: var(--color-bg-deep); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text);"
            onfocus="this.style.borderColor='var(--color-primary)'"
            onblur="this.style.borderColor='rgba(255,255,255,0.1)'"
          />
        </div>

        <div>
          <label for="message" class="block text-xs font-medium mb-1.5" style="color: var(--color-text-secondary);">Опишите задачу</label>
          <textarea
            id="message"
            name="message"
            required
            rows="4"
            placeholder="Расскажите о вашем бизнесе и что хотите автоматизировать..."
            class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
            style="background: var(--color-bg-deep); border: 1px solid rgba(255,255,255,0.1); color: var(--color-text);"
            onfocus="this.style.borderColor='var(--color-primary)'"
            onblur="this.style.borderColor='rgba(255,255,255,0.1)'"
          ></textarea>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            id="submit-btn"
            class="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            <span id="submit-text">Отправить заявку</span>
          </button>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02]"
            style="background: #0f9548;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
            Telegram
          </a>
        </div>

      </form>
    </div>

  </div>
</section>

<script>
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

    submitBtn.disabled = true;
    submitText.textContent = 'Отправляем...';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok) {
        form.reset();
        successEl.classList.remove('hidden');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        errorEl.textContent = json.error ?? 'Произошла ошибка. Попробуйте ещё раз.';
        errorEl.classList.remove('hidden');
      }
    } catch {
      errorEl.textContent = 'Ошибка соединения. Проверьте интернет или напишите в Telegram.';
      errorEl.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Отправить заявку';
    }
  });
</script>
```

- [ ] **Step 2: Коммит**

```bash
git add src/components/Contact.astro
git commit -m "feat: add Contact form with Resend fetch + Telegram CTA"
```

---

## Task 16: Footer.astro

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Создать `src/components/Footer.astro`**

```astro
---
// src/components/Footer.astro
const year = new Date().getFullYear();
const nav = [
  { label: 'Услуги', href: '#services' },
  { label: 'Кейсы', href: '#cases' },
  { label: 'Почему мы', href: '#why-us' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Контакты', href: '#contact' },
];
---

<footer style="background: var(--color-bg-deep); border-top: 1px solid rgba(255,255,255,0.06);">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

      <!-- Logo + tagline -->
      <div>
        <a href="/" class="text-2xl font-black tracking-wider">
          <span style="color: var(--color-primary);">AI</span>
          <span style="color: var(--color-accent);">BOOST</span>
        </a>
        <p class="mt-2 text-sm" style="color: var(--color-text-muted);">
          AI-автоматизация для малого и среднего бизнеса
        </p>
      </div>

      <!-- Nav links -->
      <nav class="flex flex-wrap gap-x-6 gap-y-2">
        {nav.map(item => (
          <a href={item.href}
            class="text-sm transition-colors"
            style="color: var(--color-text-muted);"
            onmouseover="this.style.color='var(--color-text)'"
            onmouseout="this.style.color='var(--color-text-muted)'">
            {item.label}
          </a>
        ))}
      </nav>

    </div>

    <!-- Bottom bar -->
    <div class="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
      style="border-top: 1px solid rgba(255,255,255,0.06);">
      <p class="text-xs" style="color: var(--color-text-muted);">
        © {year} AI Boost. Все права защищены.
      </p>
      <p class="text-xs" style="color: var(--color-text-muted);">
        Разработано с AI ⚡
      </p>
    </div>

  </div>
</footer>
```

- [ ] **Step 2: Коммит**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer with nav links and copyright"
```

---

## Task 17: index.astro — Сборка страницы

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Обновить `src/pages/index.astro`**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import Services from '../components/Services.astro';
import HowItWorks from '../components/HowItWorks.astro';
import Cases from '../components/Cases.astro';
import WhyUs from '../components/WhyUs.astro';
import AIvsTeam from '../components/AIvsTeam.astro';
import FAQ from '../components/FAQ.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---

<Layout>
  <Header />
  <main>
    <Hero />
    <Services />
    <HowItWorks />
    <Cases />
    <WhyUs />
    <AIvsTeam />
    <FAQ />
    <Contact />
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Проверить сборку**

```bash
npx astro check && npm run build
```
Ожидаемый вывод: `0 errors`, папка `dist/` создана, в ней `dist/client/` и `dist/server/`.

- [ ] **Step 3: Запустить dev и визуально проверить страницу**

```bash
npm run dev
```
Открыть http://localhost:4321 — должна загрузиться полная страница со всеми секциями.

- [ ] **Step 4: Коммит**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble full landing page in index.astro"
```

---

## Task 18: GSAP Scroll Animations

**Files:**
- Create: `src/components/ScrollAnimations.astro`
- Modify: `src/layouts/Layout.astro` — добавить `<ScrollAnimations />`

- [ ] **Step 1: Создать `src/components/ScrollAnimations.astro`**

```astro
---
// src/components/ScrollAnimations.astro
// Загружаем GSAP только на клиенте — не влияет на SSG/SEO
---

<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  // Reveal all .reveal elements on scroll
  const revealEls = document.querySelectorAll<HTMLElement>('.reveal');
  revealEls.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        }
      }
    );
  });

  // Hero elements animate in immediately
  const heroSequence = [
    { selector: '.hero-badge', delay: 0 },
    { selector: '.hero-title', delay: 0.15 },
    { selector: '.hero-subtitle', delay: 0.3 },
    { selector: '.hero-ctas', delay: 0.45 },
    { selector: '.hero-stats', delay: 0.6 },
  ];

  heroSequence.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.remove('reveal'); // prevent double-animation
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay }
    );
  });
</script>
```

- [ ] **Step 2: Добавить `<ScrollAnimations />` в `Layout.astro`**

В `src/layouts/Layout.astro` добавить после строки `import '../styles/global.css';`:

```astro
---
import '../styles/global.css';
import ScrollAnimations from '../components/ScrollAnimations.astro';
// ... rest of imports
---
```

И в `<body>` перед `<slot />`:

```astro
<body>
  <slot />
  <ScrollAnimations />
</body>
```

- [ ] **Step 3: Проверить анимации в браузере**

```bash
npm run dev
```
При скролле каждый `.reveal` элемент должен плавно появляться снизу. Herо-элементы — анимируются при загрузке.

- [ ] **Step 4: Коммит**

```bash
git add src/components/ScrollAnimations.astro src/layouts/Layout.astro
git commit -m "feat: add GSAP scroll reveal animations and hero entrance"
```

---

## Task 19: Public assets

**Files:**
- Create: `public/robots.txt`
- Create: `public/favicon.svg`
- Create: `public/og-image.jpg` (placeholder)

- [ ] **Step 1: Создать `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap-index.xml
```

- [ ] **Step 2: Создать `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#0a0a14"/>
  <text x="4" y="24" font-family="system-ui,sans-serif" font-weight="900" font-size="22" fill="#6366f1">AI</text>
</svg>
```

- [ ] **Step 3: Создать placeholder для OG-image**

```bash
# Создаём минимальный placeholder (1200×630) — заменить перед деплоем
# Простой способ — сделать скриншот лендинга через браузер и сохранить как public/og-image.jpg
# Или использовать любой онлайн OG image generator
echo "OG image placeholder — replace with real screenshot (1200x630px)" > public/og-image-TODO.txt
```

- [ ] **Step 4: Коммит**

```bash
git add public/robots.txt public/favicon.svg public/og-image-TODO.txt
git commit -m "feat: add robots.txt, favicon, og-image placeholder"
```

---

## Task 20: Playwright E2E тесты

**Files:**
- Create: `tests/e2e/landing.spec.ts`

- [ ] **Step 1: Написать E2E тесты**

```ts
// tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/AI Boost/);
  });

  test('h1 contains AI Boost branding', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('AI Boost');
  });

  test('all nav links are present', async ({ page }) => {
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'Услуги' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Кейсы' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'FAQ' })).toBeVisible();
  });

  test('services section has 4 cards', async ({ page }) => {
    const section = page.locator('#services');
    await section.scrollIntoViewIfNeeded();
    const cards = section.locator('[class*="rounded-2xl"]');
    await expect(cards).toHaveCount(4);
  });

  test('FAQ accordion opens and closes', async ({ page }) => {
    const faqSection = page.locator('#faq');
    await faqSection.scrollIntoViewIfNeeded();

    const firstTrigger = faqSection.locator('.faq-trigger').first();
    const firstBody = faqSection.locator('.faq-item').first().locator('.faq-body');

    // Initially closed
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('contact form shows error for empty submission', async ({ page }) => {
    const section = page.locator('#contact');
    await section.scrollIntoViewIfNeeded();

    // Fill only name, leave email and message empty
    await page.fill('#name', 'Тест');
    await page.click('#submit-btn');

    // HTML5 validation should prevent submission or our handler returns error
    // Check form is still visible (not replaced with success)
    await expect(page.locator('#form-success')).toHaveClass(/hidden/);
  });

  test('mobile burger menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const burger = page.locator('#burger-btn');
    const drawer = page.locator('#menu-drawer');

    await expect(burger).toBeVisible();
    await burger.click();
    await expect(drawer).toHaveCSS('transform', /matrix/);

    // Close via backdrop
    await page.locator('#menu-backdrop').click();
    await expect(drawer).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 288, 0)'); // translateX(100%) ≈ 288px on 375px viewport
  });

  test('comparison table is visible', async ({ page }) => {
    await page.locator('#ai-vs-team').scrollIntoViewIfNeeded();
    await expect(page.locator('#ai-vs-team')).toBeVisible();
    await expect(page.locator('#ai-vs-team table, #ai-vs-team .grid').first()).toBeVisible();
  });
});
```

- [ ] **Step 2: Запустить тесты**

```bash
npx playwright test
```
Ожидаемый вывод: все тесты проходят. Если тест на мобильное меню нестабильный из-за CSS transform значений — упростить до проверки `aria-expanded`.

- [ ] **Step 3: Коммит**

```bash
git add tests/e2e/landing.spec.ts
git commit -m "test: add Playwright E2E tests for landing page"
```

---

## Task 21: Deploy файлы

**Files:**
- Create: `ecosystem.config.cjs`
- Create: `deploy.sh`

- [ ] **Step 1: Создать `ecosystem.config.cjs`**

```js
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'ai-boost',
      script: './dist/server/entry.mjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        HOST: '127.0.0.1',
        PORT: 4321,
        NODE_ENV: 'production',
      },
    },
  ],
};
```

- [ ] **Step 2: Создать `deploy.sh`**

```bash
#!/bin/bash
# deploy.sh — локальная сборка + rsync на сервер + перезапуск PM2
set -e

# === НАСТРОЙТЕ ЭТИ ПЕРЕМЕННЫЕ ===
SERVER="user@your-server-ip"
APP_DIR="/var/www/ai-boost"
# =================================

echo "▶ Проверка .env..."
if [ ! -f .env ]; then
  echo "Ошибка: файл .env не найден. Скопируйте .env.example и заполните."
  exit 1
fi

echo "▶ Сборка Astro..."
npm run build

echo "▶ Заливка на сервер ($SERVER:$APP_DIR)..."
rsync -avz --delete \
  --exclude='.env' \
  --exclude='node_modules' \
  --exclude='.git' \
  dist/ \
  package.json \
  package-lock.json \
  ecosystem.config.cjs \
  "$SERVER:$APP_DIR/"

echo "▶ Установка prod-зависимостей на сервере..."
ssh "$SERVER" "cd $APP_DIR && npm ci --omit=dev"

echo "▶ Перезапуск PM2..."
ssh "$SERVER" "cd $APP_DIR && pm2 reload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs"

echo "✅ Деплой завершён успешно"
```

- [ ] **Step 3: Сделать скрипт исполняемым**

```bash
chmod +x deploy.sh
```

- [ ] **Step 4: Добавить скрипт сборки в `package.json`**

Убедиться, что в `package.json` есть:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 5: Финальный прогон всех тестов**

```bash
npm test && npx playwright test
```
Ожидаемый вывод: unit tests `8 passed`, E2E tests `6 passed`.

- [ ] **Step 6: Финальный коммит**

```bash
git add ecosystem.config.cjs deploy.sh package.json
git commit -m "feat: add PM2 ecosystem config and rsync deploy script"
```

---

## Checklist перед деплоем

- [ ] Заменить `yourdomain.com` на реальный домен в `astro.config.mjs`, `Layout.astro`, `contact.ts`, `robots.txt`
- [ ] Заменить `https://t.me/YOUR_USERNAME` в `Contact.astro` на реальную ссылку
- [ ] Создать `/var/www/ai-boost/.env` на сервере с реальными `RESEND_API_KEY` и `CONTACT_EMAIL`
- [ ] Заменить `user@your-server-ip` и `APP_DIR` в `deploy.sh`
- [ ] Сделать первый запуск на сервере: `pm2 start ecosystem.config.cjs && pm2 save && pm2 startup`
- [ ] Настроить Nginx конфиг (см. `docs/superpowers/specs/2026-04-22-ai-boost-landing-design.md` → раздел 10)
- [ ] Получить SSL: `sudo certbot --nginx -d yourdomain.com`
- [ ] Заменить `public/og-image.jpg` на реальный скриншот (1200×630)
- [ ] Заменить числа в Hero (`50+`, `3 года`, `40+`) на реальные
- [ ] Заменить кейсы-заглушки на реальные проекты в `src/data/cases.ts`
