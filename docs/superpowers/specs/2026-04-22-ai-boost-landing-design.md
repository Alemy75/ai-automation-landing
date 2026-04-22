# AI Boost — Landing Page Design Spec

**Date:** 2026-04-22  
**Status:** Approved  
**Project dir:** `/Users/max/Documents/git-personal/ai-automation-landing`

---

## 1. Обзор проекта

Лендинг для продажи услуг AI-автоматизации под брендом **AI Boost**. Целевая аудитория — малый и средний бизнес (МСБ). Главная цель страницы — генерация заявок через форму и Telegram.

---

## 2. Бренд и стиль

| Параметр | Значение |
|---|---|
| Название | AI Boost |
| Визуальное направление | Dark Tech / Футуристик |
| Основной цвет | Индиго `#6366f1` |
| Акцентный цвет | Изумрудный `#10b981` |
| Фон | `#0a0a14` → `#0f0f1e` (градиент) |
| Иконки | Lucide Icons |
| Типографика | System UI / Inter |
| Анимации | CSS transitions + GSAP ScrollTrigger |

---

## 3. Технологический стек

| Слой | Технология |
|---|---|
| Фреймворк | Astro 5 (SSG — Static Site Generation) |
| CSS | Tailwind CSS v4 |
| Иконки | `lucide-astro` |
| TypeScript | Да, строгий режим |
| Форма | Resend (email API) |
| Деплой | Vercel (free tier) |
| Анимации | GSAP + ScrollTrigger |

### Почему Astro 5?
- Генерирует чистый статический HTML — поисковики индексируют без JS
- Core Web Vitals ~100/100 Lighthouse из коробки
- Zero JS по умолчанию (только там где нужно)
- Встроенная поддержка sitemap, robots.txt

---

## 4. SEO-стратегия

### Технический SEO
- `<title>` и `<meta description>` уникальные для страницы
- Open Graph теги (og:title, og:description, og:image)
- Twitter Card теги
- JSON-LD Schema.org разметка: `Organization`, `WebSite`, `Service`, `FAQPage`
- `sitemap.xml` — генерируется автоматически Astro
- `robots.txt`
- Canonical URL
- Семантические HTML-теги: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`
- Правильная иерархия заголовков: `h1` → `h2` → `h3`
- Alt-тексты для всех изображений
- Preload для критических ресурсов (шрифты, hero-изображение)

### Контентный SEO
- Целевые ключевые слова в заголовках: «AI-автоматизация», «разработка CRM», «веб-приложения для бизнеса», «автоматизация процессов»
- FAQ-секция с разметкой `FAQPage` schema — SEO-трафик по вопросам
- Скорость загрузки: оптимизация изображений через Astro Image

---

## 5. Структура страницы

```
/
├── Header (sticky navbar)
├── Hero
├── Services (4 карточки)
├── How It Works (4 шага)
├── Cases / Portfolio (заглушки → реальные кейсы)
├── Why AI Boost (4 УТП)
├── AI vs Team (таблица сравнения)
├── FAQ (аккордеон, ~6 вопросов)
├── Contact (форма + Telegram-кнопка)
└── Footer
```

### Детали секций

**Header**
- Логотип: `AI BOOST` (индиго + изумрудный)
- Навигация: Услуги, Кейсы, FAQ, кнопка «Связаться»
- Sticky при скролле, backdrop-blur фон
- Мобильное меню: бургер

**Hero**
- `<h1>`: «Автоматизируйте бизнес с AI Boost»
- Подзаголовок с ключевыми словами
- 2 CTA: «Обсудить проект» (primary) + «Посмотреть кейсы» (outline)
- Счётчики: 50+ проектов, 3 года, 40+ клиентов (анимированные)
- Фоновые глоу-пятна (CSS radial-gradient)
- Декоративная CSS-сетка (псевдоэлемент с `background-image: linear-gradient` grid-паттерном)

**Services**
- 4 карточки в сетке 2×2: Сайты и лендинги, CRM-системы, Веб-приложения, Админ-панели
- Lucide иконки: `globe`, `bot`, `layout-dashboard`, `settings-2`
- Hover-эффект: подсветка border

**How It Works**
- 4 шага с нумерованными кружками и соединяющей линией
- Шаги: Анализ → Прототип → Разработка → Запуск

**Cases / Portfolio**
- 2–3 карточки (заглушки со скриншотами)
- Тэг категории + метрика результата
- Кнопка «Все проекты» (ведёт на этот же якорь пока нет отдельной страницы)

**Why AI Boost**
- 4 преимущества в сетке 2×2 с `check-circle` иконками

**AI vs Team**
- Таблица 3 колонки × 5 строк
- Параметры: Стоимость, Срок запуска, Скорость, Риски, Поддержка
- AI Boost колонка — зелёная, Штатная команда — красная
- Итоговый тезис: «Экспертиза целой команды по цене одного junior-разработчика»

**FAQ**
- Аккордеон с 6 вопросами
- JSON-LD FAQPage разметка
- Вопросы: цена, сроки, нужны ли технические знания, гарантии, поддержка после запуска, что нужно для старта

**Contact**
- Форма: имя, email, описание задачи
- Отправка через Resend API (Astro API route)
- Кнопка Telegram (ссылка `https://t.me/YOUR_USERNAME`)
- Текст: «Ответим в течение 1 часа в рабочее время»

**Footer**
- Логотип + копирайт
- Ссылки навигации
- Социальные сети / Telegram

---

## 6. Структура файлов Astro

```
src/
├── components/
│   ├── Header.astro
│   ├── Hero.astro
│   ├── Services.astro
│   ├── HowItWorks.astro
│   ├── Cases.astro
│   ├── WhyUs.astro
│   ├── AIvsTeam.astro
│   ├── FAQ.astro
│   ├── Contact.astro
│   └── Footer.astro
├── layouts/
│   └── Layout.astro          ← SEO head, global styles
├── pages/
│   ├── index.astro            ← собирает все компоненты
│   └── api/
│       └── contact.ts         ← Resend API route
├── styles/
│   └── global.css             ← Tailwind directives, CSS vars
└── data/
    ├── services.ts
    ├── cases.ts
    └── faq.ts
public/
├── robots.txt
├── og-image.jpg
└── favicon.svg
astro.config.mjs
# Tailwind v4: конфиг через CSS (@theme в global.css), JS-файл не нужен
```

---

## 7. Контактная форма (Resend)

- **Astro API route:** `POST /api/contact`
- Валидация: имя (обязательно), email (валидный формат), сообщение (обязательно)
- При успехе: письмо через Resend на адрес владельца
- При ошибке: пользователь видит сообщение об ошибке
- Переменные окружения: `RESEND_API_KEY`, `CONTACT_EMAIL`
- Telegram-кнопка: прямая ссылка `https://t.me/USERNAME` (заглушка → заменить)

---

## 8. Анимации

- Hero: fade-in + slide-up при загрузке (CSS)
- Счётчики: count-up анимация (Intersection Observer)
- Секции: reveal при скролле (GSAP ScrollTrigger)
- Карточки услуг: hover scale + border glow
- FAQ аккордеон: smooth height transition (CSS)
- Таблица сравнения: построчное появление при скролле

---

## 9. Мобильная версия

- Breakpoints: Tailwind стандарт (sm: 640, md: 768, lg: 1024)
- Карточки услуг: 2 колонки на мобиле, 4 на desktop
- Таблица сравнения: горизонтальный скролл на мобиле
- Header: бургер-меню с анимированным drawer
- Hero: кнопки стекаются вертикально на мобиле

---

## 10. Деплой (SSH / VPS)

### Стек на сервере
- ОС: Ubuntu 22.04+
- Web-сервер: Nginx (reverse proxy)
- Runtime: Node.js 20 LTS
- Process manager: PM2
- SSL: Certbot (Let's Encrypt)
- Astro adapter: `@astrojs/node` (hybrid mode — статика + API route для формы)

> **Почему не чистый SSG?**  
> Форма `/api/contact` требует серверного рантайма (Resend API). Hybrid mode: все страницы — статический HTML, только `/api/*` — Node.js.

---

### Настройка сервера (однократно)

```bash
# 1. Node.js 20 через nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20

# 2. PM2
npm install -g pm2

# 3. Nginx
sudo apt update && sudo apt install -y nginx

# 4. Certbot
sudo apt install -y certbot python3-certbot-nginx
```

---

### Nginx-конфиг

Файл: `/etc/nginx/sites-available/ai-boost`

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Gzip
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    # Кэш статики
    location ~* \.(js|css|png|jpg|svg|woff2|ico)$ {
        proxy_pass http://127.0.0.1:4321;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:4321;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ai-boost /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### PM2 ecosystem-файл

Файл: `ecosystem.config.cjs` в корне проекта (не коммитить `.env`):

```js
module.exports = {
  apps: [{
    name: 'ai-boost',
    script: './dist/server/entry.mjs',
    env: {
      HOST: '127.0.0.1',
      PORT: 4321,
      NODE_ENV: 'production',
    }
  }]
}
```

---

### Deploy-скрипт

Файл: `deploy.sh` в корне проекта:

```bash
#!/bin/bash
set -e

SERVER="user@your-server-ip"
APP_DIR="/var/www/ai-boost"

echo "→ Сборка..."
npm run build

echo "→ Заливка на сервер..."
rsync -avz --delete \
  dist/ \
  package.json \
  package-lock.json \
  ecosystem.config.cjs \
  "$SERVER:$APP_DIR/"

echo "→ Установка зависимостей и перезапуск..."
ssh "$SERVER" "cd $APP_DIR && npm ci --omit=dev && pm2 reload ecosystem.config.cjs --update-env"

echo "✓ Деплой завершён"
```

```bash
chmod +x deploy.sh
```

---

### Переменные окружения на сервере

Файл `/var/www/ai-boost/.env` (создать вручную один раз):

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=your@email.com
```

PM2 подхватывает `.env` автоматически (или передать через `env` в `ecosystem.config.cjs`).

---

### Первый запуск на сервере

```bash
ssh user@your-server-ip
cd /var/www/ai-boost
npm ci --omit=dev
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # автозапуск после ребута
```

---

### Рабочий деплой (каждый раз)

```bash
./deploy.sh
```

---

### Структура на сервере

```
/var/www/ai-boost/
├── dist/               ← артефакт сборки (rsync)
│   ├── client/         ← статика (HTML, CSS, JS)
│   └── server/
│       └── entry.mjs   ← Node.js сервер
├── .env                ← секреты (создать вручную)
├── ecosystem.config.cjs
├── package.json
└── package-lock.json
```

---

### Checklist деплоя

- [ ] Node.js 20 + PM2 + Nginx установлены на сервере
- [ ] `/var/www/ai-boost/.env` создан с реальными ключами
- [ ] Nginx-конфиг активирован и SSL получен
- [ ] `SERVER` и `APP_DIR` в `deploy.sh` заменены на реальные
- [ ] `ecosystem.config.cjs` не содержит секретов в репозитории
- [ ] `./deploy.sh` выполнен успешно
- [ ] PM2 сохранён: `pm2 save && pm2 startup`
