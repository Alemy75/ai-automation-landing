# Перенос дизайна AI Boost в Astro + Tailwind

Инструкция для Claude Code — перенести готовый дизайн из `index.html` в существующий Astro + Tailwind проект.

---

## 📎 Промпт для Claude

> Привет. У меня есть готовый дизайн лендинга в одном HTML-файле (`index.html`) — визуально финальный. Перенеси его в мой Astro + Tailwind проект, разбив на компоненты. Следуй инструкции из `HANDOFF_TO_ASTRO.md` строго по шагам. Ничего не упрощай визуально — сохрани типографику, отступы, hover-эффекты, формы и анимации 1:1.

---

## 🎨 Дизайн-токены (`tailwind.config.mjs`)

```js
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#F5F2EC',
        ink:     '#0F0F10',
        'ink-2': '#2A2A2C',
        muted:   '#6B6B6F',
        line:    '#DCD6C9',
        lime:    '#D6FF3A',
        'lime-2':'#C2E83B',
        orange:  '#FF5722',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: { 'tightest': '-0.04em' },
    },
  },
}
```

## 🔤 Шрифты (в `Layout.astro`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

В глобальном CSS:

```css
body {
  font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  background: #F5F2EC;
  color: #0F0F10;
  -webkit-font-smoothing: antialiased;
}
```

---

## 📁 Структура компонентов

```
src/
├── pages/index.astro                 # собирает все секции
├── components/
│   ├── Nav.astro
│   ├── Hero.astro                    # word-by-word анимация + lime sweep
│   ├── Marquee.astro
│   ├── Services.astro                # сетка 3×2 с border-grid
│   ├── Process.astro                 # list с lime gradient hover
│   ├── Cases.astro                   # 4 карточки с spotlight на курсор
│   ├── Why.astro                     # border-grid 4×2, lime на hover
│   ├── Compare.astro
│   ├── Faq.astro                     # accordion
│   ├── CtaFinal.astro                # контакты + форма
│   ├── ContactForm.astro             # FormSubmit.co
│   ├── Footer.astro
│   └── ui/
│       ├── Button.astro              # btn-primary / btn-ghost + shimmer
│       ├── SectionHead.astro         # eyebrow + title
│       └── Counter.astro             # IntersectionObserver + easing
└── scripts/
    ├── reveal.ts                     # scroll-reveal
    ├── magnetic.ts                   # magnetic buttons
    ├── spotlight.ts                  # cursor spotlight
    └── case-tilt.ts                  # подсветка карточек кейсов
```

---

## 🧩 Ключевые моменты

### Hero
- Размер: `clamp(56px, 11.5vw, 184px)`, `line-height: 0.92`
- «за вас» — лаймовая плашка через `::before` с `skewX(-4deg)` + `limeSweep` анимация на 0.9s
- «24/7» — `-webkit-text-stroke: 2px #0F0F10`, `color: transparent`, `font-style: italic`, `letter-spacing: 0.04em`, `padding-right: 0.08em` (иначе слэш налезает на 7)
- Каждое слово: `wordIn` анимация с staggered delay

### Счётчики (`Counter.astro`)

```astro
---
const { to, suffix = '' } = Astro.props;
---
<span class="counter" data-to={to}>0</span>{suffix}
<script>
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      const to = parseInt(el.dataset.to!, 10);
      const t0 = performance.now();
      function tick(t: number) {
        const p = Math.min(1, (t - t0) / 1400);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.counter').forEach(el => io.observe(el));
</script>
```

### Форма обратной связи (`ContactForm.astro`)

Работает через **FormSubmit.co** (бесплатный сервис, не нужен бэкенд).

```astro
<form action="https://formsubmit.co/is.alemy@yandex.ru" method="POST" id="contact-form">
  <input type="hidden" name="_subject" value="Новая заявка с лендинга AI Boost">
  <input type="hidden" name="_captcha" value="false">
  <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
  <!-- поля name, contact, business, task -->
  <!-- checkbox согласия + submit -->
</form>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(form.action, {
      method: 'POST', body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    // показать .form-success при успехе
  });
</script>
```

**Активация формы:**
1. Залить на прод
2. Отправить первую тестовую заявку
3. FormSubmit.co пришлёт письмо с кнопкой **Activate** на is.alemy@yandex.ru
4. После активации заявки начнут приходить автоматически

### Marquee

```css
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.marquee-track { animation: marquee 40s linear infinite; }
```

Дубль контента внутри track'а для бесшовной петли.

### Case spotlight (карточки кейсов)

```js
document.querySelectorAll('.case').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty('--mx', mx + '%');
    card.style.setProperty('--my', my + '%');
    card.style.transform = 'translateY(-4px)';
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
  });
});
```

`::before` c `radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(214,255,58,0.18), transparent 50%)`.

### CTA h2 с градиентом

`em` с `background-clip:text` обрезает descender у `?` — **обязательно** добавь:
```css
.cta-final h2 { line-height: 1.05; padding-bottom: 0.2em; }
.cta-final h2 em {
  display: inline-block;
  padding: 0.1em 0.15em 0.3em;
  margin: -0.1em -0.15em -0.3em;
}
```

### FAQ

Toggle через класс `.open` на `.faq-item`. Анимация `max-height` 0 → 400px.

### Accessibility

```css
@media (prefers-reduced-motion:reduce){
  *, *::before, *::after{
    animation-duration:0.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:0.01ms !important;
  }
}
```

---

## ✅ Чеклист

- [ ] Токены в `tailwind.config.mjs`
- [ ] Google Fonts в Layout
- [ ] 12 компонентов по структуре
- [ ] Counter с IntersectionObserver
- [ ] Marquee animation в global.css
- [ ] Faq accordion logic
- [ ] ContactForm + FormSubmit.co activation
- [ ] Magnetic buttons + cursor spotlight + case tilt скрипты
- [ ] Hero: точный padding-right на `.outline` (24/7)
- [ ] CTA h2: padding-bottom для descender
- [ ] `prefers-reduced-motion` rule
- [ ] `astro build` без ошибок

---

## 📞 Текущие контакты (уже вшиты в `index.html`)

- **Telegram:** https://t.me/boost_by_ai
- **Телефон:** +7 (922) 264-59-56
- **Email:** is.alemy@yandex.ru
- **Form action:** `https://formsubmit.co/is.alemy@yandex.ru`

## 🔑 Что важно не потерять

1. **Типографика** — `clamp()` значения для hero и section-title
2. **Grid на services/why** — border-паттерн через `border-left/top` на контейнере + `border-right/bottom` на детях
3. **Акцентный лайм** — только на 1–2 местах на экране одновременно
4. **JetBrains Mono** — только для eyebrow / номеров / служебных подписей
5. **`white-space: nowrap`** на nav-ссылках
6. **`line-height: 0.92`** на hero-title, **`1.05`** на CTA h2
7. **`padding-right: 0.08em` на `.outline`** (24/7)
8. **Descender fix** у CTA em с градиентом
