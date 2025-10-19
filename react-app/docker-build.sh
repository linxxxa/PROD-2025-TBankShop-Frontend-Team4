#!/bin/bash

echo "🐳 Сборка Docker образа для React приложения..."

# Остановка и удаление существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Удаление старых образов
echo "🗑️ Удаление старых образов..."
docker image prune -f

# Сборка нового образа
echo "🔨 Сборка нового образа..."
docker-compose build --no-cache

# Запуск контейнера
echo "🚀 Запуск контейнера..."
docker-compose up -d

# Проверка статуса
echo "✅ Проверка статуса..."
docker-compose ps

echo "🌐 Приложение доступно по адресу: http://localhost"
echo "📊 Логи: docker-compose logs -f"
