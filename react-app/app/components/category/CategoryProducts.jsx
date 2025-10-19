import React, { useState } from 'react';
import ProductModal from '../product/ProductModal';
import './CategoryProducts.css';

const CategoryProducts = ({ category, products, loading, error }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Названия категорий
  const categoryNames = {
    'dairy': 'Молочные продукты',
    'fruits': 'Фрукты',
    'bread': 'Хлеб',
    'meat': 'Мясо',
    'grains': 'Крупы',
    'frozen': 'Заморозка',
    'vegetables': 'Овощи'
  };

  // Обработчик клика на товар
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  // Закрытие модального окна
  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  // Добавление товара в корзину
  const handleAddToCart = (product, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      const updatedCart = currentCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const newItem = {
        ...product,
        quantity: 1,
        storeName: product.storeName || 'Неизвестный магазин'
      };
      const updatedCart = [...currentCart, newItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    // Уведомляем другие компоненты
    window.dispatchEvent(new Event('cartUpdated'));
    
  };

  if (loading) {
    return (
      <div className="category-products">
        <div className="category-header">
          <h2 className="category-title">{categoryNames[category] || category}</h2>
        </div>
        <div className="loading-message">
          <p>Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-products">
        <div className="category-header">
          <h2 className="category-title">{categoryNames[category] || category}</h2>
        </div>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-products">
      <div className="category-header">
        <h2 className="category-title">{categoryNames[category] || category}</h2>
        <p className="category-subtitle">Товары из всех магазинов</p>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <div className="no-products__icon">📦</div>
          <h3 className="no-products__title">Нет товаров</h3>
          <p className="no-products__message">
            В категории "{categoryNames[category] || category}" пока нет товаров
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div 
                className="product-card__image"
                onClick={() => handleProductClick(product)}
              >
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-card__content">
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__store">{product.storeName || 'Неизвестный магазин'}</p>
                <div className="product-card__price">{product.price} ₽</div>
                <button 
                  className="product-card__add-btn"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно товара */}
      {isProductModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseProductModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default CategoryProducts;
