# --------------------------------------------------
# Stage 1 — install dependencies
# --------------------------------------------------
    FROM node:18-alpine AS deps
    WORKDIR /app
    
    # Скопировать только package.json и lockfile для кеширования
    COPY package.json package-lock.json ./
    
    # Устанавливаем все зависимости (dev + prod), чтобы можно было собрать приложение
    RUN npm ci
    
    # --------------------------------------------------
    # Stage 2 — build the Next.js app
    # --------------------------------------------------
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    # Подтягиваем node_modules из предыдущего шага
    COPY --from=deps /app/node_modules ./node_modules
    
    # Копируем весь исходный код проекта
    COPY . .
    
    # Собираем Next.js в standalone (или обычный) режим
    RUN npm run build
    
    # --------------------------------------------------
    # Stage 3 — production image
    # --------------------------------------------------
    FROM node:18-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    # Копируем артефакты сборки
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/node_modules ./node_modules
    
    # Открываем порт для Next.js
    EXPOSE 3000
    
    # Запуск production-сервера через npm script
    # Предполагается, что в package.json есть:
    # "scripts": {
    #   "start": "next start -p 3000"
    # }
    CMD ["npm", "run", "start"]