import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import './Modal.css';

const Modal = ({ isOpen, onClose, user, onLogin, onRegister, onLogout, mode = 'login' }) => {
  const [isLoginMode, setIsLoginMode] = useState(mode === 'register' ? false : (mode === 'profile' ? false : true));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    address: ''
  });

  // Обновляем режим при изменении mode
  useEffect(() => {
    if (mode === 'profile') {
      setIsLoginMode(false); // Показываем информацию о пользователе
    } else if (mode === 'register') {
      setIsLoginMode(false); // Показываем форму регистрации
    } else {
      setIsLoginMode(true); // Показываем форму входа
    }
  }, [mode]);

  // Инициализируем formData данными пользователя при открытии профиля
  useEffect(() => {
    if (user && mode === 'profile') {
      setFormData({
        phone: user.phone || '',
        name: user.name || '',
        address: user.address || ''
      });
    }
  }, [user, mode]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoginMode) {
      // Для входа используем существующий обработчик
      onLogin(formData);
    } else {
      // Для регистрации отправляем данные на бэкенд
      try {
        console.log('Отправка данных пользователя на бэкенд:', formData);
        
        // Отправляем данные на бэкенд
        const response = await usersAPI.register(formData);
        console.log('Ответ от бэкенда:', response);
        
        // Если регистрация успешна, сохраняем пользователя локально
        const userData = {
          id: response.id || Date.now().toString(),
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          student: formData.student,
          age: formData.age
        };
        
        // Сохраняем в localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Вызываем обработчик регистрации
        onRegister(userData);
        
        
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        
        const userData = {
          id: Date.now().toString(),
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          student: formData.student,
          age: formData.age
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        onRegister(userData);
        
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      // Обновляем данные пользователя
      const updatedUser = { ...user, ...formData };
      
      // Сохраняем в localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Вызываем onRegister для обновления состояния в Header
      onRegister(updatedUser);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка обновления данных:', error);
    }
  };

  const handleCancelEdit = () => {
    // Возвращаем исходные данные пользователя
    setFormData({
      phone: user.phone || '',
      name: user.name || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        {user && mode === 'profile' ? (
          // Показываем информацию пользователя
          <div className="user-info">
            <h2 className="modal-title">Личный кабинет</h2>
            <div className="user-details">
              <div className="user-field">
                <label>Номер телефона:</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="user-input"
                    placeholder="Введите номер телефона"
                  />
                ) : (
                  <span>{user.phone}</span>
                )}
              </div>
              <div className="user-field">
                <label>Имя:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="user-input"
                    placeholder="Введите ваше имя"
                  />
                ) : (
                  <span>{user.name}</span>
                )}
              </div>
              <div className="user-field">
                <label>Адрес:</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="user-textarea"
                    placeholder="Введите ваш адрес"
                    rows="3"
                  />
                ) : (
                  <span>{user.address}</span>
                )}
              </div>
            </div>
            <div className="user-actions">
              {isEditing ? (
                <>
                  <button className="action-button save-button" onClick={handleSaveClick}>
                    Сохранить
                  </button>
                  <button className="action-button cancel-button" onClick={handleCancelEdit}>
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <button className="action-button" onClick={handleEditClick}>
                    Изменить информацию
                  </button>
                  <button className="action-button">История заказов</button>
                  <button 
                    className="action-button logout-button"
                    onClick={onLogout}
                  >
                    Выйти из аккаунта
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          // Показываем форму входа/регистрации
          <div className="auth-form">
            <h2 className="modal-title">
              {isLoginMode ? 'Вход в личный кабинет' : 'Регистрация'}
            </h2>
            
            <div className="auth-tabs">
              <button 
                className={`tab-button ${isLoginMode ? 'active' : ''}`}
                onClick={() => setIsLoginMode(true)}
              >
                Вход
              </button>
              <button 
                className={`tab-button ${!isLoginMode ? 'active' : ''}`}
                onClick={() => setIsLoginMode(false)}
              >
                Регистрация
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-content">
              <div className="form-group">
                <label htmlFor="phone">Номер телефона</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>

              {!isLoginMode && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Имя</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Введите ваше имя"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Адрес</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Введите ваш адрес"
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit" className="submit-button">
                {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

