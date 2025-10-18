import { useState, useEffect } from 'react';
import lentaImage from '../../images/lenta.png';
import perekImage from '../../images/perek.png';
import pyaterochkaImage from '../../images/pyaterochka.png';
import vvImage from '../../images/vv.png'; // Импорт каталога
import Catalog from '../catalog/Catalog';
import Cart from '../cart/Cart';
import StoreProducts from '../store/StoreProducts';
import './Home.css'


const Home = ({ setShowBackButton, setOnBackClick }) => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentView, setCurrentView] = useState('stores'); // 'stores' или 'products'

  const stores = [
    {
      id: 1,
      name: "ВкусВилл",
      description: "Магазин продуктов для здорового питания",
      image: vvImage, // Используем импортированную PNG картинку
      category: "healthy"
    },
    {
      id: 2,
      name: "Пятерочка", 
      description: "Доставка продуктов из магазина у дома",
      image: pyaterochkaImage, // Используем импортированную PNG картинку
      category: "supermarket"
    },
    {
      id: 3,
      name: "Перекресток",
      description: "Доставка из магазина и кафе Select",
      image: perekImage, // Используем импортированную PNG картинку
      category: "supermarket"
    },
    {
      id: 4,
      name: "Лента",
      description: "Гипермаркет продуктов и товаров для дома", 
      image: lentaImage, // Используем импортированную PNG картинку
      category: "hypermarket"
    }
  ];

  // Обработчик клика на магазин
  const handleStoreClick = (store) => {
    setSelectedStore(store);
    setCurrentView('products');
    // Показываем кнопку "Назад" в header
    setShowBackButton(true);
    setOnBackClick(() => handleBackToStores);
    // Обновляем URL
    window.history.pushState({}, '', `?store=${store.id}`);
  };

  // Обработчик возврата к магазинам
  const handleBackToStores = () => {
    setSelectedStore(null);
    setCurrentView('stores');
    // Скрываем кнопку "Назад" в header
    setShowBackButton(false);
    setOnBackClick(null);
    // Обновляем URL
    window.history.pushState({}, '', '/');
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
        <Catalog/>
      </aside>
      
      {/* Основной контент */}
      <main className="home-page__main">
        {currentView === 'products' && selectedStore ? (
          <StoreProducts 
            storeId={selectedStore.id}
            storeName={selectedStore.name}
          />
        ) : (
          <div className="main-content">
            <h2 className="stores-title">
              Выбери любимый магазин
            </h2>
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
        <Cart/>
      </aside>
    </div>
  );
};

export default Home;