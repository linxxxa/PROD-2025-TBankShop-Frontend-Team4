// src/App.jsx
import React from 'react';
import Header from './components/layout/Header';
import Home from './components/home/Home'; // Импорт из components/home
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
    </div>
  );
}

export default App;