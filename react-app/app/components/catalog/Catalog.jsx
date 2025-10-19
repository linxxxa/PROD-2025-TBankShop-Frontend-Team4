// src/components/catalog/CatalogSidebar.jsx
import { useState } from 'react';
import './Catalog.css';
import Grain from '../../images/крупы.png';
import Milk from '../../images/молоко.png';
import Fruits from '../../images/фрукты.png';
import Bread from '../../images/хлеб.png';
import Freez from '../../images/заморозка.png';
import Meat from '../../images/мясо.png';
import Veggie from '../../images/овощи.png';
const Catalog = ({ onCategoryClick }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categories = [
    { id: 1, name: "Молоко и яйца", icon: Milk },
    { id: 2, name: "Мясо", icon: Meat},
    { id: 3, name: "Фрукты", icon: Fruits },
    { id: 4, name: "Овощи", icon: Veggie},
    { id: 5, name: "Заморозка", icon: Freez },
    { id: 6, name: "Крупы", icon: Grain },
    { id: 7, name: "Хлеб", icon: Bread},
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    console.log('Selected category:', categoryId);
    
    // Передаем категорию в родительский компонент
    if (onCategoryClick) {
      const categoryMap = {
        1: 'dairy',    // Молоко и яйца
        2: 'meat',     // Мясо
        3: 'fruits',   // Фрукты
        4: 'vegetables', // Овощи
        5: 'frozen',   // Заморозка
        6: 'grains',   // Крупы
        7: 'bread'     // Хлеб
      };
      onCategoryClick(categoryMap[categoryId] || 'dairy');
    }
  };

  const handleTitleClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="catalog-sidebar">
      <h2 
        className={`catalog-title ${isCollapsed ? 'collapsed' : ''}`}
        onClick={handleTitleClick}
      >
        Продукты по категориям
      </h2>
      
      <div className={`catalog-content ${isCollapsed ? '' : 'expanded'}`}>
        <div className="categories-list">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'category-item--active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-icon">
                <img 
                  src={category.icon} 
                  alt={category.name}
                  className="category-icon-image"
                />
              </div>
              <span className="category-name">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;