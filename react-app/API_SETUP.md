# 🔧 Настройка API для Т-Банк Супермаркеты

## 📡 Доступные эндпоинты API

### **Базовый URL**
```
http://team-04-hyn9y74f.hack.prodcontest.ru/api/v1
```

### **Магазины**
- `GET /get/shops` - Получить все магазины
- `GET /get/shops/{shop_id}` - Получить магазин по ID
- `GET /get/available_shops/{user_id}` - Получить доступные магазины для пользователя

### **Товары**
- `GET /get/products` - Получить все товары
- `GET /get/products/store/{store}` - Получить товары магазина
- `GET /products/category/{category}` - Получить товары по категории
- `GET /products/search/?query={query}` - Поиск товаров
- `GET /products/user/{user_id}` - Получить товары пользователя

### **Пользователи**
- `POST /users/create` - Создать пользователя
- `GET /users/phone/{phone_number}` - Получить пользователя по телефону
- `GET /users` - Получить всех пользователей
- `PUT /users/{user_id}/address` - Обновить адрес пользователя

### **Заказы**
- `POST /orders/{user_id}` - Создать заказ
- `GET /get/orders` - Получить все заказы
- `GET /orders/user/{user_id}` - Получить заказы пользователя

## 🛠️ Конфигурация

### **1. API Base URL**
```javascript
const API_BASE_URL = 'http://team-04-hyn9y74f.hack.prodcontest.ru/api/v1';
```

### **2. Прокси настройки (rsbuild.config.mjs)**
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://team-04-hyn9y74f.hack.prodcontest.ru',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    }
  }
}
```

### **3. Структура данных**

#### **Магазин**
```json
{
  "id": 1,
  "name": "ВкусВилл",
  "address": "ул. Примерная, 1",
  "maximum_delivery_distance": 5.0
}
```

#### **Товар**
```json
{
  "id": 1,
  "name": "Молоко 3.2%",
  "price": 89.0,
  "description": "Свежее молоко",
  "which_store": "ВкусВилл",
  "s3_picture": "https://example.com/image.jpg",
  "categories": "dairy"
}
```

#### **Пользователь**
```json
{
  "id": 1,
  "name": "Иван Иванов",
  "phone_number": "+79001234567",
  "address": "ул. Примерная, 10"
}
```

## 🔄 Fallback механизм

API автоматически использует fallback данные при недоступности сервера:

1. **Попытка запроса к API**
2. **При ошибке - использование локальных данных**
3. **Логирование ошибок в консоль**

## 🧪 Тестирование API

### **Проверка доступности**
```bash
curl http://team-04-hyn9y74f.hack.prodcontest.ru/api/v1/get/products
```

### **Документация Swagger**
```
http://team-04-hyn9y74f.hack.prodcontest.ru/docs
```

## 📝 Примеры использования

### **Получение всех магазинов**
```javascript
import { storesAPI } from './services/api';

const stores = await storesAPI.getAllStores();
```

### **Получение товаров по категории**
```javascript
import { productsAPI } from './services/api';

const dairyProducts = await productsAPI.getProductsByCategory('dairy');
```

### **Регистрация пользователя**
```javascript
import { usersAPI } from './services/api';

const userData = {
  name: 'Иван Иванов',
  phone: '+79001234567',
  address: 'ул. Примерная, 10'
};

const result = await usersAPI.register(userData);
```

## ⚠️ Важные замечания

1. **HTTP вместо HTTPS** - API работает по HTTP
2. **Fallback данные** - всегда доступны локальные данные
3. **Обработка ошибок** - все ошибки логируются
4. **Прокси настройки** - для разработки используется прокси

## 🚀 Запуск с API

```bash
cd react-app
npm run dev
```

Приложение автоматически будет использовать API с fallback на локальные данные.
