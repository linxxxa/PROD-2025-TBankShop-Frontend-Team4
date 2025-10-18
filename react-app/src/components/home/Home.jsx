import lentaImage from '../../images/lenta.png';
import perekImage from '../../images/perek.png';
import pyaterochkaImage from '../../images/pyaterochka.png';
import vvImage from '../../images/vv.png'; // Импорт каталога
import './Home.css'


const Home = () => {
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

  return (
    <div className="home-page">
      <aside className="home-page__sidebar home-page__sidebar--left">
        <div className="sidebar-placeholder">
        </div>
      </aside>
      <main className="home-page__main">
        <div className="main-content">
          <h1 className="main-title">
            Т-Банк Супермаркеты
          </h1>
          <p className="subtitle">
            Все магазины в одном месте
          </p>
          <div className="main-image">
            <img 
              src="https://imgproxy.cdn-tinkoff.ru/compressed95/aHR0cHM6Ly9jZG4udGJhbmsucnUvc3RhdGljL3BhZ2VzL2ZpbGVzLzNmYzFiYzAzLWM3MTQtNDY4NC05OTg0LTdiMTU3ZmI5ZDkxZC5wbmc=" 
              alt="Т-Банк Супермаркеты" 
            />
          </div>
          <h2 className="stores-title">
            Выбери любимый магазин
          </h2>
          <div className="stores-grid">
            {stores.map(store => (
              <div key={store.id} className="store-card">
                <div className="store-card__image-container">
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
                </div>
                <div className="store-card__content">
                  <h3 className="store-card__name">{store.name}</h3>
                  <p className="store-card__description">{store.description}</p>
                  <button className="store-card__button">
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <aside className="home-page__sidebar home-page__sidebar--right">
        <div className="sidebar-placeholder">
        </div>
      </aside>
    </div>
  );
};

export default Home;