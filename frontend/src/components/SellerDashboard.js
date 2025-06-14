import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, TrendingUp, DollarSign, Users, Search, Filter } from 'lucide-react';
import HeaderNavigation from './HeaderNavigation';
import ProductModal from './ProductModal';
import StatCard from './StatCard';
import './styles.css';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Cotton Casual Shirt",
      category: "Men's Clothing",
      subcategory: "Shirts",
      price: 1299,
      stock: 25,
      status: "Active",
      image: "https://via.placeholder.com/100",
      orders: 15,
      rating: 4.2
    },
    {
      id: 2,
      name: "Designer Kurti",
      category: "Women's Clothing",
      subcategory: "Ethnic Wear",
      price: 899,
      stock: 10,
      status: "Active",
      image: "https://via.placeholder.com/100",
      orders: 8,
      rating: 4.5
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    stock: '',
    description: '',
    brand: '',
    material: '',
    size: [],
    color: [],
    images: []
  });

  const categories = {
    "Men's Clothing": ["Shirts", "T-Shirts", "Jeans", "Trousers", "Jackets"],
    "Women's Clothing": ["Ethnic Wear", "Western Wear", "Dresses", "Tops", "Bottoms"],
    "Electronics": ["Mobile Phones", "Laptops", "Accessories", "Audio"],
    "Home & Living": ["Furniture", "Decor", "Kitchen", "Bedding"]
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Gray"];

  const handleSizeToggle = (size) => {
    setNewProduct(prev => ({
      ...prev,
      size: prev.size.includes(size) 
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size]
    }));
  };

  const handleColorToggle = (color) => {
    setNewProduct(prev => ({
      ...prev,
      color: prev.color.includes(color)
        ? prev.color.filter(c => c !== color)
        : [...prev.color, color]
    }));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.subcategory || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all required fields');
      return;
    }

    const product = {
      id: products.length + 1,
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      status: "Active",
      orders: 0,
      rating: 0,
      image: "https://via.placeholder.com/100"
    };
    
    setProducts([...products, product]);
    resetForm();
    setShowAddProduct(false);
  };


  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      brand: product.brand || '',
      material: product.material || '',
      size: product.size || [],
      color: product.color || [],
      images: product.images || []
    });
    setShowAddProduct(true);
  };

 
  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.subcategory || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingProduct) {
      const updatedProducts = products.map(product => 
        product.id === editingProduct.id 
          ? {
              ...product,
              ...newProduct,
              price: parseFloat(newProduct.price),
              stock: parseInt(newProduct.stock)
            }
          : product
      );
      setProducts(updatedProducts);
    } else {

      const product = {
        id: Math.max(...products.map(p => p.id), 0) + 1, 
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        status: "Active",
        orders: 0,
        rating: 0,
        image: "https://via.placeholder.com/100"
      };
      setProducts([...products, product]);
    }
    
    resetForm();
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };


  const resetForm = () => {
    setNewProduct({
      name: '', category: '', subcategory: '', price: '', stock: '',
      description: '', brand: '', material: '', size: [], color: [], images: []
    });
  };

 
  const handleCloseModal = () => {
    resetForm();
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  return (
    <div className="container">
      <HeaderNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />

      <div className="main-content">
        {activeTab === 'dashboard' && (
          <div>
            <div className="section-header">
              <h2 className="page-title">Dashboard Overview</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="add-button"
              >
                <Plus style={{ height: '20px', width: '20px' }} />
                <span>Add Product</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <StatCard
                icon={Package}
                title="Total Products"
                value={products.length.toString()}
                change="+2 this week"
                color="#10B981"
              />
              <StatCard
                icon={Users}
                title="Total Orders"
                value="157"
                change="+12 this week"
                color="#3B82F6"
              />
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value="₹1,24,500"
                change="+8.2% this month"
                color="#F59E0B"
              />
              <StatCard
                icon={TrendingUp}
                title="Avg. Rating"
                value="4.3"
                change="+0.1 this month"
                color="#EF4444"
              />
            </div>

            <div className="card">
              <h3 className="card-title">Recent Products</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-header">Product</th>
                      <th className="table-header">Category</th>
                      <th className="table-header">Price</th>
                      <th className="table-header">Stock</th>
                      <th className="table-header">Status</th>
                      <th className="table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 3).map((product) => (
                      <tr key={product.id} className="table-row">
                        <td className="table-cell">
                          <div className="product-info">
                            <img src={product.image} alt={product.name} className="product-image" />
                            <span style={{ fontWeight: '500' }}>{product.name}</span>
                          </div>
                        </td>
                        <td className="table-cell" style={{ color: '#6B7280' }}>{product.category}</td>
                        <td className="table-cell" style={{ fontWeight: '600', color: '#10B981' }}>₹{product.price}</td>
                        <td className="table-cell">{product.stock}</td>
                        <td className="table-cell">
                          <span className={`status-badge ${product.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="edit-button"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                              <Edit style={{ height: '12px', width: '12px' }} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="delete-button"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                              <Trash2 style={{ height: '12px', width: '12px' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

  
        {activeTab === 'products' && (
          <div>
            <div className="section-header">
              <h2 className="page-title">Manage Products</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="add-button"
              >
                <Plus style={{ height: '20px', width: '20px' }} />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="search-section">
              <div className="search-container">
                <div className="search-input-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="search-input"
                  />
                </div>
                <button className="filter-button">
                  <Filter style={{ height: '20px', width: '20px' }} />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} className="product-image-large" />
                  <div className="product-content">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category} • {product.subcategory}</p>
                    <div className="product-pricing">
                      <span className="product-price">₹{product.price}</span>
                      <span className="product-stock">Stock: {product.stock}</span>
                    </div>
                    <div className="product-meta">
                      <span className={`status-badge ${product.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {product.status}
                      </span>
                      <div className="product-stats">
                        {product.orders} orders • ⭐ {product.rating}
                      </div>
                    </div>
                    <div className="product-actions">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="edit-button"
                      >
                        <Edit style={{ height: '16px', width: '16px' }} />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="delete-button"
                      >
                        <Trash2 style={{ height: '16px', width: '16px' }} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="section-header">
              <h2 className="page-title">Order Management</h2>
            </div>
            <div className="card">
              <h3 className="card-title">Recent Orders</h3>
              <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                <Package style={{ height: '48px', width: '48px', margin: '0 auto 16px', color: '#D1D5DB' }} />
                <p>No orders found. Orders will appear here once customers start purchasing your products.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="section-header">
              <h2 className="page-title">Analytics & Reports</h2>
            </div>
            <div className="card">
              <h3 className="card-title">Sales Analytics</h3>
              <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                <TrendingUp style={{ height: '48px', width: '48px', margin: '0 auto 16px', color: '#D1D5DB' }} />
                <p>Analytics dashboard coming soon. Track your sales performance, customer insights, and revenue trends.</p>
              </div>
            </div>
          </div>
        )}
      </div>

    
      {showAddProduct && (
        <ProductModal
          show={showAddProduct}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
          categories={categories}
          sizes={sizes}
          colors={colors}
          handleSizeToggle={handleSizeToggle}
          handleColorToggle={handleColorToggle}
          isEditing={!!editingProduct}
        />
      )}
    </div>
  );
};

export default SellerDashboard;