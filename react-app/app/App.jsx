// src/App.jsx
import React, { useState } from 'react';
import Header from './components/layout/Header';
import Home from './components/home/Home'; 
import FloatingCartButton from './components/cart/FloatingCartButton';
import CartModal from './components/cart/CartModal';
import './App.css';

function App() {
  const [showBackButton, setShowBackButton] = useState(false);
  const [onBackClick, setOnBackClick] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(true); // По умолчанию видна на десктопе
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const handleCartToggle = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleShowCartModal = () => {
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  return (
    <div className="App">
      <Header 
        showBackButton={showBackButton}
        onBackClick={onBackClick}
      />
      
      <Home 
        setShowBackButton={setShowBackButton}
        setOnBackClick={setOnBackClick}
        isCartVisible={isCartVisible}
        setIsCartVisible={setIsCartVisible}
      />
      
      <FloatingCartButton onCartToggle={handleShowCartModal} />
      
      <CartModal 
        isOpen={isCartModalOpen} 
        onClose={handleCloseCartModal} 
      />
    </div>
  );
}

export default App;