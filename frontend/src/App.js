import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginRegister from './components/Login';
import Home from './components/Home';
import ProductsPage from './components/productPage';
import CartCheckout from './components/cart'
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  useEffect(() => {
    fetch(`${BASE_URL}/api/initial`, { method: 'POST' })
      .then(res => res.json())
      .then(data => { console.log('Login auto-triggered:', data); })
      .catch(err => console.error(err));
  }, []);
  
  return (
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/" element={<LoginRegister />} />
      <Route path="/Products" element={<ProductsPage />} />
      <Route path="/Cart" element={<CartCheckout />} />
    </Routes>
  );
}

export default App;