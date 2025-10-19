# 🐳 Docker Setup для React приложения

## Быстрый старт

### 1. Сборка и запуск
```bash
# Автоматическая сборка и запуск
./docker-build.sh

# Или вручную
docker-compose up --build
```

### 2. Доступ к приложению
- **Локально:** http://localhost
- **В сети:** http://your-server-ip

## Команды Docker

### Основные команды
```bash
# Сборка образа
docker-compose build

# Запуск в фоне
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f

# Перезапуск
docker-compose restart
```

### Управление контейнерами
```bash
# Список контейнеров
docker ps

# Вход в контейнер
docker exec -it react-app-frontend sh

# Удаление контейнера
docker rm react-app-frontend

# Удаление образа
docker rmi react-app-frontend
```

## Структура Docker

### Dockerfile
- **Multi-stage build** для оптимизации размера
- **Node.js 18 Alpine** для сборки
- **Nginx Alpine** для продакшена
- **Gzip сжатие** для статических файлов

### Nginx конфигурация
- **SPA routing** поддержка
- **Кэширование** статических ресурсов
- **Безопасность** заголовки
- **Gzip сжатие**

## Переменные окружения

```bash
# В docker-compose.yml
environment:
  - NODE_ENV=production
```

## Мониторинг

### Логи
```bash
# Все логи
docker-compose logs

# Логи конкретного сервиса
docker-compose logs frontend

# Следить за логами в реальном времени
docker-compose logs -f frontend
```

### Статистика
```bash
# Использование ресурсов
docker stats

# Информация о контейнере
docker inspect react-app-frontend
```

## Troubleshooting

### Проблемы с портами
```bash
# Проверить занятые порты
netstat -tulpn | grep :80

# Остановить процесс на порту 80
sudo lsof -ti:80 | xargs kill -9
```

### Проблемы с сборкой
```bash
# Очистить кэш Docker
docker system prune -a

# Пересобрать без кэша
docker-compose build --no-cache
```

### Проблемы с правами
```bash
# Дать права на выполнение скрипта
chmod +x docker-build.sh
```

## Production Deployment

### Для продакшена
1. Обновите `nginx.conf` для вашего домена
2. Настройте SSL сертификаты
3. Используйте внешний volume для логов
4. Настройте мониторинг

### Пример для продакшена
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "443:443"
    volumes:
      - ./logs:/var/log/nginx
    environment:
      - NODE_ENV=production
```
