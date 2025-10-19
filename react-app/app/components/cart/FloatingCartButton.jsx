import React, { useState, useEffect } from 'react';
import './FloatingCartButton.css';

const FloatingCartButton = ({ onCartToggle }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const cartItems = JSON.parse(cart);
        setCartItems(cartItems);
        
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
        
        setIsVisible(cartItems.length > 0);
      } else {
        setCartItems([]);
        setTotalPrice(0);
        setIsVisible(false);
      }
    };

    // Обновляем при загрузке
    updateCart();

    // Слушаем изменения в localStorage
    window.addEventListener('storage', updateCart);
    window.addEventListener('cartUpdated', updateCart);

    return () => {
      window.removeEventListener('storage', updateCart);
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <button 
      className="floating-cart-button"
      onClick={onCartToggle}
    >
      <div className="floating-cart-content">
        <span className="floating-cart-price">{totalPrice.toLocaleString()} ₽</span>
      </div>
    </button>
  );
};

export default FloatingCartButton;
