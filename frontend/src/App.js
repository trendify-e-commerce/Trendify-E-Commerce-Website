import { Routes, Route } from 'react-router-dom';
import LoginRegister from './components/Login';
import Home from './components/Home';
import ProductsPage from './components/productPage';
import CartCheckout from './components/cart'
import ThankYou from './components/thankyou';
import CusAgentOrder from './components/cus_agent_order';
import Orders from './components/orders';

function App() {  
  return (
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/" element={<LoginRegister />} />
      <Route path="/Products" element={<ProductsPage />} />
      <Route path="/CartCheckout" element={<CartCheckout />} />
      <Route path="/thankyou" element={<ThankYou />} />
      <Route path="/Orders" element={<Orders />} />
      <Route path="/OrderData" element={<CusAgentOrder />} />
    </Routes>
  );
}

export default App;