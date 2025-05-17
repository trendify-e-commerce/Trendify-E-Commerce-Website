import { Routes, Route } from 'react-router-dom';
import LoginRegister from './components/Login';
import Home from './components/Home';
import ProductsPage from './components/productPage';
import CartCheckout from './components/cart'
import ThankYou from './components/thankyou';

function App() {  
  return (
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/" element={<LoginRegister />} />
      <Route path="/Products" element={<ProductsPage />} />
      <Route path="/CartCheckout" element={<CartCheckout />} />
      <Route path="/thankyou" element={<ThankYou />} />
    </Routes>
  );
}

export default App;