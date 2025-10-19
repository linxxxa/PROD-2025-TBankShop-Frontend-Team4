import { useState, useEffect } from 'react';
import lentaImage from '../../images/lenta.png';
import perekImage from '../../images/perek.png';
import pyaterochkaImage from '../../images/pyaterochka.png';
import vvImage from '../../images/vv.png'; // Импорт каталога
import Catalog from '../catalog/Catalog';
import Cart from '../cart/Cart';
import StoreProducts from '../store/StoreProducts';
import CategoryProducts from '../category/CategoryProducts';
import { storesAPI, productsAPI } from '../../services/api';
import './Home.css'


const Home = ({ setShowBackButton, setOnBackClick, isCartVisible, setIsCartVisible }) => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentView, setCurrentView] = useState('stores'); // 'stores', 'products', 'category' или 'cart'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const localImages = {
    1: vvImage,
    2: pyaterochkaImage,
    3: perekImage,
    4: lentaImage
  };


  // Постоянные магазины (не загружаем с API)
  useEffect(() => {
    const staticStores = [
      {
        id: 1,
        name: "ВкусВилл",
        description: "Магазин продуктов для здорового питания",
        image: localImages[1],
        category: "healthy"
      },
      {
        id: 2,
        name: "Пятерочка", 
        description: "Доставка продуктов из магазина у дома",
        image: localImages[2],
        category: "supermarket"
      },
      {
        id: 3,
        name: "Перекресток",
        description: "Доставка из магазина и кафе Select",
        image: localImages[3],
        category: "supermarket"
      },
      {
        id: 4,
        name: "Лента",
        description: "Гипермаркет продуктов и товаров для дома", 
        image: localImages[4],
        category: "hypermarket"
      }
    ];
    
    setStores(staticStores);
    setLoading(false);
    setError(null);
    console.log('Магазины загружены (статические):', staticStores);
  }, []);

  // Обработчик клика на магазин
  const handleStoreClick = (store) => {
    console.log('🏪 Клик на магазин:', store);
    setSelectedStore(store);
    setCurrentView('products');
    // Показываем кнопку "Назад" в header
    setShowBackButton(true);
    setOnBackClick(() => handleBackToStores);
    // Обновляем URL
    window.history.pushState({}, '', `?store=${store.id}`);
    console.log('✅ Переход к товарам магазина:', store.name);
  };

  // Обработчик возврата к магазинам
  const handleBackToStores = () => {
    setSelectedStore(null);
    setSelectedCategory(null);
    setCurrentView('stores');
    // Скрываем кнопку "Назад" в header
    setShowBackButton(false);
    setOnBackClick(null);
    // Обновляем URL
    window.history.pushState({}, '', '/');
  };

  // Функция для показа корзины в центральном экране (для мобильных)
  const handleShowCart = () => {
    setCurrentView('cart');
    setShowBackButton(true);
    setOnBackClick(() => handleBackToStores);
  };

  // Обработчик клика на категорию
  const handleCategoryClick = async (category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      setCurrentView('category');
      
      // Показываем кнопку "Назад" в header
      setShowBackButton(true);
      setOnBackClick(() => handleBackToStores);
      
      // Загружаем товары по категории
      let products = await productsAPI.getProductsByCategory(category);
      
      // Если API возвращает пустой массив, загружаем все товары и фильтруем
      if (products.length === 0) {
        console.log('Товары категории пусты, загружаем все товары...');
        const allProducts = await productsAPI.getAllProducts();
        
        // Маппинг категорий
        const categoryMap = {
          'dairy': 'Молочные продукты',
          'fruits': 'Фрукты', 
          'bread': 'Хлеб',
          'meat': 'Мясо',
          'grains': 'Крупы',
          'frozen': 'Заморозка',
          'vegetables': 'Овощи'
        };
        
        const categoryName = categoryMap[category];
        products = allProducts.filter(product => 
          product.categories === categoryName
        );
        
        console.log('Товары отфильтрованы по категории:', products);
      }
      
      setCategoryProducts(products);
      
      // Обновляем URL
      window.history.pushState({}, '', `?category=${category}`);
    } catch (error) {
      console.error('Ошибка загрузки товаров по категории:', error);
      setError('Не удалось загрузить товары по категории');
    } finally {
      setLoading(false);
    }
  };

  // Проверяем URL при загрузке
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store');
    if (storeId) {
      const store = stores.find(s => s.id === parseInt(storeId));
      if (store) {
        setSelectedStore(store);
        setCurrentView('products');
        // Показываем кнопку "Назад" в header
        setShowBackButton(true);
        setOnBackClick(() => handleBackToStores);
      }
    }
  }, []);


  return (
    <div className="home-page">
      {/* Каталог слева */}
      <aside className="home-page__sidebar home-page__sidebar--left">
        <Catalog onCategoryClick={handleCategoryClick}/>
      </aside>
      
      {/* Основной контент */}
      <main className="home-page__main">
        {currentView === 'products' && selectedStore ? (
          <StoreProducts 
            storeId={selectedStore.id}
            storeName={selectedStore.name}
          />
        ) : currentView === 'category' && selectedCategory ? (
          <CategoryProducts 
            category={selectedCategory}
            products={categoryProducts}
            loading={loading}
            error={error}
          />
        ) : (
          <div className="main-content">
            <h2 className="stores-title">
              Выбери любимый магазин
            </h2>
            
            {loading && (
              <div className="loading-message">
                <p>Загрузка магазинов...</p>
              </div>
            )}
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <p>Используются локальные данные</p>
              </div>
            )}
            
            <div className="stores-grid">
              {stores.map(store => (
                <div key={store.id} className="store-card">
                  <button 
                    className="store-card__image-container store-card__button"
                    onClick={() => handleStoreClick(store)}
                  >
                    <img 
                      src={store.image} 
                      alt={store.name}
                      className="store-card__image"
                      onError={(e) => {
                        // Запасной вариант если PNG не загрузится
                        e.target.style.backgroundColor = '#f5f5f5';
                        e.target.style.display = 'flex';
                        e.target.style.alignItems = 'center';
                        e.target.style.justifyContent = 'center';
                        e.target.style.color = '#666';
                        e.target.style.fontFamily = 'Arial';
                        e.target.style.fontSize = '16px';
                        e.target.style.fontWeight = 'bold';
                        e.target.innerHTML = store.name;
                        e.target.src = '';
                      }}
                    />
                  </button>
                  <div className="store-card__content">
                    <h3 className="store-card__name">{store.name}</h3>
                    <p className="store-card__description">{store.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Правая боковая панель */}
      <aside className="home-page__sidebar home-page__sidebar--right">
        <Cart isVisible={isCartVisible} onClose={() => setIsCartVisible(false)}/>
      </aside>
    </div>
  );
};

export default Home;