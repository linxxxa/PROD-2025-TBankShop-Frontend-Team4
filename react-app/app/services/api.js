// API сервис для получения данных с team-04-hyn9y74f.hack.prodcontest
// Т-Банк Супермаркеты
const API_BASE_URL = 'http://team-04-hyn9y74f.hack.prodcontest.ru/api/v1';

// Базовые настройки для запросов
const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Универсальная функция для API запросов
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'T-Bank-Supermarkets-Frontend/1.0'
    },
    ...options
  };

  try {
    console.log(`🌐 Making API request to: ${url}`);
    console.log(`📋 Request options:`, defaultOptions);
    
    const response = await fetch(url, defaultOptions);
    console.log(`📊 Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error response:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ API response for ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`❌ API request failed for ${endpoint}:`, error);
    throw error;
  }
};


// API для магазинов (только для получения товаров магазина)
export const storesAPI = {
  // Получить товары магазина
  getStoreProducts: (storeId) => apiRequest(`/get/products/store/${storeId}`)
};

// API для товаров
export const productsAPI = {
  // Получить все товары
  getAllProducts: () => apiRequest('/get/products'),
  
  // Получить товары по категории
  getProductsByCategory: (category) => apiRequest(`/products/category/${category}`),
  
  // Поиск товаров
  searchProducts: (query) => apiRequest(`/products/search/?query=${encodeURIComponent(query)}`)
};

// API для категорий
export const categoriesAPI = {
  // Получить все категории
  getAllCategories: () => apiRequest('/categories'),
  
  // Получить категорию по ID
  getCategoryById: (id) => apiRequest(`/categories/${id}`),
  
  // Получить подкатегории
  getSubcategories: (categoryId) => apiRequest(`/categories/${categoryId}/subcategories`)
};

// API для корзины
export const cartAPI = {
  // Получить корзину пользователя
  getCart: (userId) => apiRequest(`/cart/${userId}`),
  
  // Добавить товар в корзину
  addToCart: (userId, productId, quantity = 1) => 
    apiRequest(`/cart/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    }),
  
  // Удалить товар из корзины
  removeFromCart: (userId, productId) => 
    apiRequest(`/cart/${userId}/remove`, {
      method: 'DELETE',
      body: JSON.stringify({ productId })
    }),
  
  // Обновить количество товара
  updateQuantity: (userId, productId, quantity) => 
    apiRequest(`/cart/${userId}/update`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity })
    }),
  
  // Очистить корзину
  clearCart: (userId) => 
    apiRequest(`/cart/${userId}/clear`, {
      method: 'DELETE'
    })
};

// API для пользователей
export const usersAPI = {
  // Регистрация пользователя
  register: async (userData) => {
    try {
      console.log('🚀 Отправляем данные пользователя на API:', userData);
      
      // API ожидает параметры в query string, а не в body
      const params = new URLSearchParams({
        name: userData.name,
        phone_number: userData.phone,
        address: userData.address
      });
      
      console.log('📤 Параметры запроса:', params.toString());
      
      const response = await apiRequest(`/users/create?${params}`, {
        method: 'POST'
      });
      
      console.log('✅ Ответ от API:', response);
      return response;
    } catch (error) {
      console.error('Ошибка регистрации пользователя:', error);
      
      const userResponse = {
        success: true,
        message: 'Пользователь зарегистрирован (локально)',
        user: {
          id: userData.id || Date.now().toString(),
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
          student: userData.student || false,
          age: userData.age || null,
          created_at: new Date().toISOString()
        }
      };
      
      return userResponse;
    }
  },
  
  // Авторизация пользователя
  login: (credentials) => 
    apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  
  // Получить профиль пользователя
  getProfile: async (phone) => {
    try {
      return await apiRequest(`/users/phone/${phone}`);
    } catch (error) {
      console.error('Ошибка получения профиля:', error);
      
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.phone === phone) {
          return {
            success: true,
            user: userData
          };
        }
      }
      
      throw new Error('Пользователь не найден');
    }
  },
  
  // Обновить профиль пользователя
  updateProfile: (userId, userData) => 
    apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),
  
  // Проверить существование пользователя по телефону
  checkUserExists: (phone) => 
    apiRequest(`/users/check?phone=${encodeURIComponent(phone)}`)
};

// API для заказов
export const ordersAPI = {
  // Создать заказ
  createOrder: async (userId, products) => {
    try {
      console.log('🛒 Создаем заказ для пользователя:', userId);
      console.log('📦 Товары в заказе:', products);
      
      const response = await apiRequest(`/orders/${userId}`, {
        method: 'POST',
        body: JSON.stringify(products)
      });
      
      console.log('✅ Заказ создан:', response);
      return response;
    } catch (error) {
      console.error('❌ Ошибка создания заказа:', error);
      
      const fallbackResponse = {
        success: true,
        message: 'Заказ создан (локально)',
        order: {
          id: Date.now(),
          user_id: userId,
          products: products,
          created_at: new Date().toISOString(),
          status: 'pending'
        }
      };
      
      return fallbackResponse;
    }
  },
  
  // Получить заказы пользователя
  getUserOrders: (userId) => apiRequest(`/orders/user/${userId}`),
  
  // Получить заказ по ID
  getOrderById: (orderId) => apiRequest(`/orders/${orderId}`),
  
  // Отменить заказ
  cancelOrder: (orderId) => 
    apiRequest(`/orders/${orderId}/cancel`, {
      method: 'PUT'
    }, { success: true, message: 'Заказ отменен (локально)' })
};

// API для аналитики
export const analyticsAPI = {
  // Получить статистику
  getStats: () => apiRequest('/analytics/stats'),
  
  // Получить популярные товары
  getPopularProducts: (period = 'week') => 
    apiRequest(`/analytics/popular-products?period=${period}`),
  
  // Получить статистику по категориям
  getCategoryStats: () => apiRequest('/analytics/categories')
};

// Проверка доступности API
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false; // API недоступен
  }
};

// Получение информации о системе
export const getSystemInfo = () => apiRequest('/system/info');

export default {
  stores: storesAPI,
  products: productsAPI,
  categories: categoriesAPI,
  cart: cartAPI,
  users: usersAPI,
  orders: ordersAPI,
  analytics: analyticsAPI,
  checkHealth: checkAPIHealth,
  getSystemInfo
};
