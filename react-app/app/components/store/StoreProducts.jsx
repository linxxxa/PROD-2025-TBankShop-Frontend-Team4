import { useState, useEffect } from 'react';
import './StoreProducts.css';
import ProductModal from '../product/ProductModal';
import { storesAPI, productsAPI } from '../../services/api';

const StoreProducts = ({ storeId, storeName }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOtherCategories, setShowOtherCategories] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Моковые данные продуктов (в реальном проекте будут приходить с бэка)

  const categories = [
    { id: 'all', name: 'Все товары' },
    { id: 'dairy', name: 'Молочные продукты' },
    { id: 'fruits', name: 'Фрукты' },
    { id: 'bread', name: 'Хлеб' },
    { id: 'meat', name: 'Мясо' }
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsData = await storesAPI.getStoreProducts(storeId);
        
        // Если API возвращает пустой массив, загружаем все товары и фильтруем по магазину
        if (productsData.length === 0) {
          console.log('Товары магазина пусты, загружаем все товары...');
          try {
            const allProducts = await productsAPI.getAllProducts();
            
            // Фильтруем товары по названию магазина
            const storeNames = {
              1: 'ВкусВилл',
              2: 'Пятерочка', 
              3: 'Перекресток',
              4: 'Лента'
            };
            
            const storeName = storeNames[storeId];
            const filteredProducts = allProducts.filter(product => 
              product.which_store === storeName
            );
            
            setProducts(filteredProducts);
            console.log('Товары отфильтрованы по магазину:', filteredProducts);
          } catch (fallbackError) {
            console.error('Ошибка загрузки всех товаров:', fallbackError);
            setProducts([]);
          }
        } else {
          setProducts(productsData);
          console.log('Товары загружены из API:', productsData);
        }
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        setError('Не удалось загрузить товары магазина.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [storeId]);


  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product, e) => {
    if (e) {
      e.stopPropagation(); // Останавливаем всплытие события
    }
    console.log('Добавлено в корзину:', product);
    
    // Получаем текущую корзину из localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Если товар уже есть, увеличиваем количество
      const updatedCart = currentCart.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // Если товара нет, добавляем новый
      const newItem = {
        ...product,
        quantity: 1,
        storeName: storeName
      };
      const updatedCart = [...currentCart, newItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    // Уведомляем другие компоненты об обновлении корзины
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Показываем уведомление
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
    // Обновляем URL для товара
    window.history.pushState({}, '', `?store=${storeId}&product=${product.id}`);
    console.log('Открыт товар:', product);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
    // Возвращаем URL обратно к магазину
    window.history.pushState({}, '', `?store=${storeId}`);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    // Если выбрана категория из "Других товаров", делаем её первой
    if (categoryId !== 'all') {
      // Перемещаем выбранную категорию в начало списка
      const updatedCategories = [
        categories.find(cat => cat.id === categoryId),
        ...categories.filter(cat => cat.id !== categoryId && cat.id !== 'all')
      ].filter(Boolean);
      
      // Обновляем состояние, чтобы перерендерить компонент
      setSelectedCategory(categoryId);
    }
  };

  const handleShowOtherCategories = () => {
    setShowOtherCategories(!showOtherCategories);
  };

  if (loading) {
    return (
      <div className="store-products">
        <div className="loading">
          <div className="loading__spinner"></div>
          <p>Загружаем ассортимент...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="store-products">
      <h1 className="store-products__title">{storeName}</h1>

      <div className="store-products__filters">
        {/* Показываем выбранную категорию первой */}
        {selectedCategory === 'all' ? (
          <button
            className={`filter-button ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('all')}
          >
            <span className="filter-name">Все товары</span>
          </button>
        ) : (
          <button
            className={`filter-button ${selectedCategory === selectedCategory ? 'active' : ''}`}
            onClick={() => handleCategoryClick(selectedCategory)}
          >
            <span className="filter-name">{categories.find(cat => cat.id === selectedCategory)?.name}</span>
          </button>
        )}
        
        {/* Кнопка "Другие товары" */}
        <button
          className="filter-button filter-button--others"
          onClick={handleShowOtherCategories}
        >
          <span className="filter-name">Другие товары</span>
          <span className="filter-arrow">{showOtherCategories ? '▼' : '▶'}</span>
        </button>
        
        {/* Остальные категории (показываются только при развернутом состоянии) */}
        {showOtherCategories && (
          <div className="other-categories">
            {categories.filter(cat => cat.id !== selectedCategory).map(category => (
              <button
                key={category.id}
                className={`filter-button filter-button--other ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="filter-name">{category.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="store-products__grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products__icon">📦</div>
            <h3 className="no-products__title">Нет товаров</h3>
            <p className="no-products__message">
              В этом магазине пока нет товаров в выбранной категории
            </p>
          </div>
        ) : (
          filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product)}
          >
            <div className="product-card__image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-card__content">
              <h3 className="product-card__name">{product.name}</h3>
              <p className="product-card__price">{product.price} ₽</p>
              <button 
                className="product-card__button"
                onClick={(e) => handleAddToCart(product, e)}
              >
                В корзину
              </button>
            </div>
          </div>
        ))
        )}
      </div>

      {/* Модальное окно товара */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        product={selectedProduct}
        storeName={storeName}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default StoreProducts;
