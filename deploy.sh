#!/bin/bash
# deploy.sh — build locally, rsync to server, restart PM2
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
