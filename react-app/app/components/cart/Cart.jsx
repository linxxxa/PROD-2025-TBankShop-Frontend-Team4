import React, { useState, useEffect } from 'react';
import { cartAPI, ordersAPI } from '../../services/api';
import './Cart.css';

const Cart = ({ isVisible = true, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedStore, setSelectedStore] = useState('all');

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const stores = [...new Set(cartItems.map(item => item.storeName))];

  // Фильтруем товары по выбранному магазину
  const filteredItems = selectedStore === 'all' 
    ? cartItems 
    : cartItems.filter(item => item.storeName === selectedStore);

  // Подсчитываем общую сумму
  const totalSum = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Удаляем товар из корзины
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Изменяем количество товара
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Очищаем корзину
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Функция для создания заказа
  const handleOrder = async () => {
    try {
      // Получаем данные пользователя из localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        return;
      }

      const user = JSON.parse(userData);
      
      // Подготавливаем данные для заказа
      const orderProducts = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        store: item.storeName
      }));

      console.log('🛒 Создаем заказ:', {
        userId: user.id,
        products: orderProducts
      });

      // Отправляем заказ на сервер
      const orderResponse = await ordersAPI.createOrder(user.id, orderProducts);
      
      if (orderResponse.success || orderResponse.order) {
        
        // Очищаем корзину после успешного заказа
        clearCart();
      } else {
      }
      
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
    }
  };


  const isCartEmpty = cartItems.length === 0;

  return (
    <div className={`cart-sidebar ${!isVisible ? 'cart-sidebar--hidden' : ''}`}>
      <div className="cart-header">
        <h2 className="cart-title">Корзина</h2>
        {onClose && (
          <button className="cart-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      
      {isCartEmpty ? (
        <div className="cart-content">
          <div className="cart-empty">
            <div className="cart-empty-image">
              <img 
                src="https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9jZG4udGJhbmsucnUvc3RhdGljL3BhZ2VzL2ZpbGVzLzNmYzFiYzAzLWM3MTQtNDY4NC05OTg0LTdiMTU3ZmI5ZDkxZC5wbmc=" 
                alt="Т-Банк Супермаркеты" 
              />
            </div>
            <p>Корзина пуста</p>
            <p>Добавьте товары из каталога</p>
          </div>
        </div>
      ) : (
        <div className="cart-content">
          {/* Фильтр по магазинам */}
          <div className="cart-filters">
            <button
              className={`cart-filter-btn ${selectedStore === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedStore('all')}
            >
              Все магазины
            </button>
            {stores.map(store => (
              <button
                key={store}
                className={`cart-filter-btn ${selectedStore === store ? 'active' : ''}`}
                onClick={() => setSelectedStore(store)}
              >
                {store}
              </button>
            ))}
          </div>

          {/* Список товаров */}
          <div className="cart-items">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="cart-item"
              >
                <div className="cart-item__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item__content">
                  <h3 className="cart-item__name">{item.name}</h3>
                  <p className="cart-item__store">{item.storeName}</p>
                  <div className="cart-item__controls">
                    <button 
                      className="cart-item__btn cart-item__btn--minus"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity - 1);
                      }}
                    >
                      -
                    </button>
                    <span className="cart-item__quantity">{item.quantity}</span>
                    <button 
                      className="cart-item__btn cart-item__btn--plus"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity + 1);
                      }}
                    >
                      +
                    </button>
                    <button 
                      className="cart-item__btn cart-item__btn--remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <p className="cart-item__price">{item.price * item.quantity} ₽</p>
                </div>
              </div>
            ))}
          </div>

          {/* Итого */}
          {filteredItems.length > 0 && (
            <div className="cart-total">
              <div className="cart-total__info">
                <span className="cart-total__label">Итого:</span>
                <span className="cart-total__sum">{totalSum} ₽</span>
              </div>
              <button className="cart-order-btn" onClick={handleOrder}>
                Заказать
              </button>
            </div>
          )}

          {/* Кнопка очистки */}
          {cartItems.length > 0 && (
            <button className="cart-clear-btn" onClick={clearCart}>
              Очистить корзину
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default Cart;
