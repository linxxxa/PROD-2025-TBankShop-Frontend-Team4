import { useState, useEffect } from 'react';
import './Header.css';
import Modal from '../modal/Modal';

const Header = ({ showBackButton, onBackClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Проверяем, есть ли сохраненный пользователь при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search query:', searchQuery);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      handleSearchSubmit(new Event('submit'));
    }
  };

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogin = (formData) => {
    // Простая проверка - если номер телефона есть в localStorage, считаем что пользователь зарегистрирован
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.phone === formData.phone) {
        setUser(userData);
        setIsModalOpen(false);
        alert('Добро пожаловать!');
      } else {
        alert('Пользователь с таким номером не найден');
      }
    } else {
      alert('Пользователь с таким номером не найден');
    }
  };

  const handleRegister = (formData) => {
    // Сохраняем данные пользователя в localStorage
    localStorage.setItem('user', JSON.stringify(formData));
    setUser(formData);
    setIsModalOpen(false);
    alert('Регистрация успешна!');
  };

  return (
    <header className='header'>
      <div className="header__container">
        {showBackButton && (
          <button className="header__back-button" onClick={onBackClick}>
            ← Назад
          </button>
        )}
        <div className="header__brand">
          <img 
            src="https://cdn.tbank.ru/static/pfa-multimedia/images/33447f85-5b92-42f9-8d88-509bd152b47c.svg" 
            alt="Т-Банк" 
            className="header__logo"
          />
        </div>
        
        <div className="header__search">
          <form onSubmit={handleSearchSubmit} className="header__search-form">
            <div className="header__search-container">
              {/* Лупа слева */}
              <button 
                type="button"
                onClick={handleSearchClick}
                className="header__search-button"
              >
                <svg width="32" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <input
                type="text"
                placeholder="Искать в Т-Банк продукты"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header__search-input"
              />
            </div>
          </form>
        </div>
        
        <button 
          className="header__profile-btn"
          onClick={handleProfileClick}
        >
          <div className="header__profile-content">
            <span className="header__profile-text">Личный кабинет</span>
            <span className="header__profile-icon">
              {/* Обновленная SVG иконка с новыми цветами */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Голова - RGB(175,205,253) */}
                <path opacity="0.35" fillRule="evenodd" clipRule="evenodd" d="M16.223 2.952a2.454 2.454 0 0 1-2.177 1.32H11.59a2.455 2.455 0 0 0-2.454 2.455v3.88A4.5 4.5 0 0 0 16.5 7.137V4.273c0-.47-.1-.917-.278-1.32Z" fill="rgb(175,205,253)"></path>
                {/* Тело - RGB(18,109,247) */}
                <path d="M3 19a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v3H3v-3Z" fill="rgb(18,109,247)"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M16.223 2.952A3.274 3.274 0 0 0 13.227 1H7.5v6.136a4.49 4.49 0 0 0 1.636 3.472v-3.88a2.455 2.455 0 0 1 2.455-2.455h2.455c.946 0 1.767-.536 2.177-1.32Z" fill="rgb(175,205,253)"></path>
              </svg>
            </span>
          </div>
        </button>
      </div>
      
      <Modal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </header>
  );
};

export default Header;