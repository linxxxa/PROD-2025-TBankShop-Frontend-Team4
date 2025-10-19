import React, { useState, useEffect } from 'react';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const cartItems = JSON.parse(cart);
        setCartItems(cartItems);
        
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
      } else {
        setCartItems([]);
        setTotalPrice(0);
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

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // Удаляем товар из корзины
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // Обновляем количество
      const updatedCart = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    // Уведомляем другие компоненты
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Уведомляем другие компоненты
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleOrder = () => {
    // Логика заказа
    console.log('Заказ оформлен:', cartItems);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal__header">
          <h2 className="cart-modal__title">Корзина</h2>
          <button className="cart-modal__close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="cart-modal__content">
          {cartItems.length === 0 ? (
            <div className="cart-modal__empty">
              <div className="cart-modal__empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 8h12l1 8H5l1-8z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 6h8l-1 2H9l-1-2z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 2h4l1 4h-6l1-4z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <h3 className="cart-modal__empty-title">Корзина пуста</h3>
              <p className="cart-modal__empty-message">Добавьте товары из магазинов</p>
            </div>
          ) : (
            <>
              <div className="cart-modal__items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-modal__item">
                    <div className="cart-modal__item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-modal__item-info">
                      <h4 className="cart-modal__item-name">{item.name}</h4>
                      <p className="cart-modal__item-price">{item.price.toLocaleString()} ₽</p>
                    </div>
                    <div className="cart-modal__item-controls">
                      <button 
                        className="cart-modal__quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="cart-modal__quantity">{item.quantity}</span>
                      <button 
                        className="cart-modal__quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button 
                        className="cart-modal__remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-modal__total">
                <div className="cart-modal__total-info">
                  <span className="cart-modal__total-label">Итого:</span>
                  <span className="cart-modal__total-price">{totalPrice.toLocaleString()} ₽</span>
                </div>
                <button className="cart-modal__order-btn" onClick={handleOrder}>
                  Заказать
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
