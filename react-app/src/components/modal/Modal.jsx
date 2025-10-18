import { useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, user, onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    address: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      onLogin(formData);
    } else {
      onRegister(formData);
    }
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
        
        {user ? (
          // Показываем информацию пользователя
          <div className="user-info">
            <h2 className="modal-title">Личный кабинет</h2>
            <div className="user-details">
              <div className="user-field">
                <label>Номер телефона:</label>
                <span>{user.phone}</span>
              </div>
              <div className="user-field">
                <label>Имя:</label>
                <span>{user.name}</span>
              </div>
              <div className="user-field">
                <label>Адрес:</label>
                <span>{user.address}</span>
              </div>
            </div>
            <div className="user-actions">
              <button className="action-button">Изменить информацию</button>
              <button className="action-button">История заказов</button>
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

