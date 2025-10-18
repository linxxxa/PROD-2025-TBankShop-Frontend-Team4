import React, { useState } from 'react';
import './Cart.css';

const Cart = () => {
  // Состояние корзины (пока пустая для демонстрации)
  const [cartItems, setCartItems] = useState([]);

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="cart-sidebar">
      <h2 className="cart-title">Корзина</h2>
      
      <div className="cart-content">
        {isCartEmpty ? (
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
        ) : (
          <div className="cart-items">
            {/* Здесь будут отображаться товары */}
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <span>{item.name}</span>
                <span>{item.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="cart-footer">
        <button 
          className={`cart-button ${isCartEmpty ? 'cart-button--empty' : 'cart-button--filled'}`}
          disabled={isCartEmpty}
        >
          {isCartEmpty ? 'Добавьте товары в корзину' : 'Заказать'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
