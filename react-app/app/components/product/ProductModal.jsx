import React, { useState } from 'react';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, product, storeName, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    // Добавляем товар в корзину с выбранным количеством
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, new Event('click'));
    }
    onClose();
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия */}
        <button className="product-modal-close" onClick={onClose}>
          ×
        </button>

        {/* Изображение товара */}
        <div className="product-modal-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Информация о товаре */}
        <div className="product-modal-info">
          <h2 className="product-modal-title">{product.name}</h2>
          <p className="product-modal-store">Магазин: {storeName}</p>
          <p className="product-modal-category">Категория: {product.category}</p>
          
          {/* Описание товара */}
          <div className="product-modal-description">
            <h3>Описание</h3>
            <p>
              Качественный продукт от проверенного производителя. 
              Идеально подходит для ежедневного использования. 
              Свежий и вкусный товар, который понравится всей семье.
            </p>
          </div>

          {/* Характеристики */}
          <div className="product-modal-specs">
            <h3>Характеристики</h3>
            <ul>
              <li>Вес: 500г</li>
              <li>Срок годности: 7 дней</li>
              <li>Условия хранения: в холодильнике</li>
              <li>Страна производства: Россия</li>
            </ul>
          </div>

          {/* Цена и количество */}
          <div className="product-modal-price-section">
            <div className="product-modal-price">
              <span className="price-label">Цена за штуку:</span>
              <span className="price-value">{product.price} ₽</span>
            </div>
            
            <div className="product-modal-quantity">
              <span className="quantity-label">Количество:</span>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn quantity-btn--minus"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn quantity-btn--plus"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99}
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-modal-total">
              <span className="total-label">Итого:</span>
              <span className="total-value">{totalPrice} ₽</span>
            </div>
          </div>

          {/* Кнопка добавления в корзину */}
          <button className="product-modal-add-btn" onClick={handleAddToCart}>
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
