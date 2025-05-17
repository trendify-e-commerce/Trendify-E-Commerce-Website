import React, { useEffect, useState, useMemo } from 'react';
import products from './Product_List.js';
import './CSS/product.css';
import { Header, Footer } from "./header_footer";

const ProductsPage = () => {
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerLoad = 60;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    populateCategories();
  }, []);

  useEffect(() => {
    const filtered = filterProducts(searchInput, selectedCategory);
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchInput, selectedCategory]);

  const populateCategories = () => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    setCategories(['All Categories', ...uniqueCategories]);
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    setSelectedCategory(categoryParam || 'All Categories');
  };

  const filterProducts = (search, category) => {
    return products.filter(product => {
      const matchesCategory = category === 'All Categories' || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const handleAddToCart = (productId) => {
    const product = products.find(p => p.id === Number(productId));
    if (!product) return;
    const existing = cart.find(item => item.product.id === productId);
    let updatedCart;
    if (existing) {
      updatedCart = cart.map(item => item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      updatedCart = [...cart, { product, quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleUpdateQuantity = (productId, action) => {
    let updatedCart = cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const paginatedProducts = useMemo(() =>
    filteredProducts.slice((currentPage - 1) * productsPerLoad, currentPage * productsPerLoad),
    [filteredProducts, currentPage]
  );  

  return (
    <div>
     <Header />
     <div className="search-bar">
        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products..." />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
        </select>
        <a className="anchor" href="/CartCheckout">View Cart</a>
        <a className={`anchor ${cart.length === 0 ? "disabled" : ""}`} href={cart.length === 0 ? "#" : `/CartCheckout?step=${encodeURIComponent("checkout")}`} onClick={(e) => { if (cart.length === 0) e.preventDefault();}}> Checkout </a>
     </div>

     <div id="products" className="section">
        <h1>Our Products</h1>
        <div className="product-container">
          {paginatedProducts.map(product => {
            const existingProduct = cart.find(item => item.product.id === product.id);
            return (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Price: ₹{product.price}</p>
                {existingProduct ? (
                  <div className="quantity-container">
                    <button className="quantity-button" onClick={() => handleUpdateQuantity(product.id, 'decrease')}>-</button>
                    <span className="quantity-display">{existingProduct.quantity}</span>
                    <button className="quantity-button" onClick={() => handleUpdateQuantity(product.id, 'increase')}>+</button>
                  </div>
                ) : (
                  <button onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
                )}
              </div>
            );
          })}
        </div>

        <div className="pagination-container">
          {currentPage > 1 && (
            <button className="page-button current-page" onClick={() => setCurrentPage(currentPage - 1)}>&#10094;</button>
          )}
          <button className="page-button">{currentPage}</button>
          {currentPage * productsPerLoad < filteredProducts.length && (
            <button className="page-button current-page" onClick={() => setCurrentPage(currentPage + 1)}>&#10095;</button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;