import { useState, useEffect } from 'react';
import './StoreProducts.css';

const StoreProducts = ({ storeId, storeName }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Моковые данные продуктов (в реальном проекте будут приходить с бэка)
  const mockProducts = {
    1: [ // ВкусВилл
      { id: 1, name: 'Органические яблоки', price: 299, category: 'fruits', image: '/api/placeholder/200/200' },
      { id: 2, name: 'Молоко 3.2%', price: 89, category: 'dairy', image: '/api/placeholder/200/200' },
      { id: 3, name: 'Хлеб цельнозерновой', price: 65, category: 'bread', image: '/api/placeholder/200/200' },
      { id: 4, name: 'Йогурт греческий', price: 149, category: 'dairy', image: '/api/placeholder/200/200' },
      { id: 5, name: 'Авокадо', price: 199, category: 'fruits', image: '/api/placeholder/200/200' },
      { id: 6, name: 'Сыр чеддер', price: 399, category: 'dairy', image: '/api/placeholder/200/200' }
    ],
    2: [ // Пятерочка
      { id: 7, name: 'Молоко 2.5%', price: 75, category: 'dairy', image: '/api/placeholder/200/200' },
      { id: 8, name: 'Хлеб белый', price: 45, category: 'bread', image: '/api/placeholder/200/200' },
      { id: 9, name: 'Яйца куриные', price: 89, category: 'dairy', image: '/api/placeholder/200/200' },
      { id: 10, name: 'Бананы', price: 99, category: 'fruits', image: '/api/placeholder/200/200' },
      { id: 11, name: 'Колбаса докторская', price: 299, category: 'meat', image: '/api/placeholder/200/200' },
      { id: 12, name: 'Сыр российский', price: 199, category: 'dairy', image: '/api/placeholder/200/200' }
    ],
    3: [ // Перекресток
      { id: 13, name: 'Молоко 3.5%', price: 95, category: 'dairy', image: '/api/placeholder/200/200' },
      { id: 14, name: 'Хлеб ржаной', price: 55, category: 'bread', image: '/api/placeholder/200/200' },
      { id: 15, name: 'Яблоки красные', price: 149, category: 'fruits', image: '/api/placeholder/200/200' },
      { id: 16, name: 'Сметана 20%', price: 79, category: 'dairy', image: '/api/placeholder/200/200' },
      { id: 17, name: 'Мясо говядина', price: 599, category: 'meat', image: '/api/placeholder/200/200' },
      { id: 18, name: 'Творог 5%', price: 89, category: 'dairy', image: '/api/placeholder/200/200' }
    ],
    4: [ // Лента
      { id: 19, name: 'Молоко 1%', price: 65, category: 'dairy', image: '/api/placeholder/200/200' },
      { id: 20, name: 'Хлеб бородинский', price: 49, category: 'bread', image: '/api/placeholder/200/200' },
      { id: 21, name: 'Апельсины', price: 199, category: 'fruits', image: '/api/placeholder/200/200' },
      { id: 22, name: 'Кефир 2.5%', price: 69, category: 'dairy', image: '/api/placeholder/200/200' },
      { id: 23, name: 'Курица целая', price: 399, category: 'meat', image: '/api/placeholder/200/200' },
      { id: 24, name: 'Сыр моцарелла', price: 299, category: 'dairy', image: '/api/placeholder/200/200' }
    ]
  };

  const categories = [
    { id: 'all', name: 'Все товары', icon: '🛒' },
    { id: 'dairy', name: 'Молочные продукты', icon: '🥛' },
    { id: 'fruits', name: 'Фрукты', icon: '🍎' },
    { id: 'bread', name: 'Хлеб', icon: '🍞' },
    { id: 'meat', name: 'Мясо', icon: '🥩' }
  ];

  useEffect(() => {
    // Имитация загрузки с бэка
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts[storeId] || []);
      setLoading(false);
    }, 1000);
  }, [storeId]);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    console.log('Добавлено в корзину:', product);
    // Здесь будет логика добавления в корзину
  };

  const handleProductClick = (product) => {
    // Обновляем URL для товара
    window.history.pushState({}, '', `?store=${storeId}&product=${product.id}`);
    console.log('Открыт товар:', product);
    // Здесь можно добавить модальное окно с деталями товара
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

      <div className="store-products__filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="filter-icon">{category.icon}</span>
            <span className="filter-name">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="store-products__grid">
        {filteredProducts.map(product => (
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
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>Товары в этой категории не найдены</p>
        </div>
      )}
    </div>
  );
};

export default StoreProducts;
