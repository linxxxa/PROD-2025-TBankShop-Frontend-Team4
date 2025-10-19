# Структура базы данных для Т-Банк Супермаркеты
# API: https://team-04-hyn9y74f.hack.prodcontest

## Таблица users

### Поля:
- `id` (VARCHAR/STRING) - Уникальный идентификатор пользователя
- `name` (VARCHAR/STRING) - Имя пользователя
- `phone` (VARCHAR/STRING) - Номер телефона (уникальный)
- `address` (TEXT) - Адрес доставки
- `student` (BOOLEAN) - Является ли студентом
- `age` (INTEGER) - Возраст пользователя
- `created_at` (TIMESTAMP) - Дата создания записи
- `updated_at` (TIMESTAMP) - Дата последнего обновления

### SQL для создания таблицы:

```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    student BOOLEAN DEFAULT FALSE,
    age INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints для работы с пользователями

### POST /api/users/register
Регистрация нового пользователя

**Request Body:**
```json
{
  "id": "1234567890",
  "name": "Иван Иванов",
  "phone": "+7 (999) 123-45-67",
  "address": "ул. Пушкина, д. 10, кв. 5",
  "student": true,
  "age": 22,
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Пользователь успешно зарегистрирован",
  "user": {
    "id": "1234567890",
    "name": "Иван Иванов",
    "phone": "+7 (999) 123-45-67",
    "address": "ул. Пушкина, д. 10, кв. 5",
    "student": true,
    "age": 22,
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### GET /api/users/{phone}
Получение профиля пользователя по номеру телефона

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1234567890",
    "name": "Иван Иванов",
    "phone": "+7 (999) 123-45-67",
    "address": "ул. Пушкина, д. 10, кв. 5",
    "student": true,
    "age": 22,
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### GET /api/users/check?phone={phone}
Проверка существования пользователя

**Response:**
```json
{
  "exists": true,
  "user": {
    "id": "1234567890",
    "name": "Иван Иванов",
    "phone": "+7 (999) 123-45-67"
  }
}
```

## Примеры реализации на разных языках

### Node.js + Express + MySQL
```javascript
app.post('/api/users/register', async (req, res) => {
  try {
    const { id, name, phone, address, student, age } = req.body;
    
    const query = `
      INSERT INTO users (id, name, phone, address, student, age, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await db.execute(query, [id, name, phone, address, student, age]);
    
    res.json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      user: { id, name, phone, address, student, age }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Python + Flask + SQLite
```python
@app.route('/api/users/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO users (id, name, phone, address, student, age, created_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ''', (data['id'], data['name'], data['phone'], data['address'], 
              data['student'], data['age']))
        
        db.commit()
        
        return jsonify({
            'success': True,
            'message': 'Пользователь успешно зарегистрирован',
            'user': data
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
```

## Обработка ошибок

### Возможные ошибки:
- **400 Bad Request** - Неверные данные
- **409 Conflict** - Пользователь с таким телефоном уже существует
- **500 Internal Server Error** - Ошибка сервера

### Пример ответа с ошибкой:
```json
{
  "success": false,
  "error": "Пользователь с таким номером телефона уже существует",
  "code": "USER_EXISTS"
}
```
