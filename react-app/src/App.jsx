// src/App.jsx
import React, { useState } from 'react';
import Header from './components/layout/Header';
import Home from './components/home/Home'; // Импорт из components/home
import './App.css';
import Footer from './components/footer/Fouter';

function App() {
  const [showBackButton, setShowBackButton] = useState(false);
  const [onBackClick, setOnBackClick] = useState(null);

  return (
    <div className="App">
      <Header 
        showBackButton={showBackButton}
        onBackClick={onBackClick}
      />
      <Home 
        setShowBackButton={setShowBackButton}
        setOnBackClick={setOnBackClick}
      />
    </div>
  );
}

export default App;