# Т-Банк Супермаркеты - Хакатон

## 🔌 Настройка API

Приложение настроено для работы с API по адресу `team-04-hyn9y74f.hack.prodcontest`.

### API Endpoints:
- **Магазины**: `/api/stores`
- **Товары**: `/api/products`
- **Категории**: `/api/categories`
- **Корзина**: `/api/cart`
- **Пользователи**: `/api/users`
- **Заказы**: `/api/orders`

### Fallback режим:
Если API недоступен, приложение автоматически переключается на локальные данные.

## 🚀 Быстрое развертывание

### Необходимые файлы:
1. **private_key.pem** - SSH ключ (скачать из репозитория ресурсов)
2. **ssl/** - SSL сертификаты (скачать из репозитория ресурсов)

### Развертывание:

#### Вариант 1: Docker Compose (рекомендуется)
```bash
# 1. Убедитесь, что файлы на месте:
ls -la private_key.pem ssl/

# 2. Развертывание:
docker-compose -f docker-compose-hackathon.yml up -d
```

#### Вариант 2: GitHub Actions
```bash
# 1. Настройте secrets в GitHub:
# - SSH_PRIVATE_KEY (содержимое private_key.pem)
# - SSL_CERT, SSL_CHAIN, SSL_FULLCHAIN, SSL_PRIVKEY

# 2. Push в main ветку
git push origin main
```

#### Вариант 3: GitLab CI/CD
```bash
# 1. Настройте variables в GitLab:
# - SSH_PRIVATE_KEY (содержимое private_key.pem)
# - SSL_CERT, SSL_CHAIN, SSL_FULLCHAIN, SSL_PRIVKEY

# 2. Запустите пайплайн
```

## 📱 Доступ к приложению:
- **HTTP**: http://team-04-hyn9y74f.hack.prodcontest.ru
- **HTTPS**: https://team-04-hyn9y74f.hack.prodcontest.ru

## 🔧 Управление:
```bash
# Статус контейнеров
docker ps --filter name=tbank-supermarkets

# Логи приложения
docker logs tbank-supermarkets-hackathon

# Перезапуск
docker restart tbank-supermarkets-hackathon
```

## 📋 Структура проекта:
```
├── react-app/                    # React приложение
├── ssl/                          # SSL сертификаты
├── private_key.pem               # SSH ключ
├── docker-compose-hackathon.yml  # Docker Compose
├── .github/workflows/            # GitHub Actions
├── .gitlab-ci-hackathon.yml     # GitLab CI/CD
├── k8s-hackathon.yml            # Kubernetes
├── ansible-hackathon.yml        # Ansible
└── terraform-hackathon.yml      # Terraform
```
