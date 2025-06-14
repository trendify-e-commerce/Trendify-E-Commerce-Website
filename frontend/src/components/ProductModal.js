import React from 'react';
import { X, Upload, Save } from 'lucide-react';
import './styles.css';

const ProductModal = ({ 
  show, 
  onClose, 
  newProduct, 
  setNewProduct, 
  onSave, 
  categories, 
  sizes, 
  colors, 
  handleSizeToggle, 
  handleColorToggle,
  isEditing = false 
}) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div style={{ padding: '24px' }}>
          <div className="modal-header">
            <h2 className="modal-title">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="close-button">
              <X style={{ height: '24px', width: '24px' }} />
            </button>
          </div>

          <div className="form-grid">
            
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="form-group">
                <label className="form-label">Product Name*</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="form-input"
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                  className="form-input"
                  placeholder="Enter brand name"
                />
              </div>

              <div className="two-col-grid">
                <div className="form-group">
                  <label className="form-label">Category*</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value, subcategory: ''})}
                    className="form-select"
                  >
                    <option value="">Select Category</option>
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subcategory*</label>
                  <select
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                    className="form-select"
                    disabled={!newProduct.category}
                  >
                    <option value="">Select Subcategory</option>
                    {newProduct.category && categories[newProduct.category]?.map(subcat => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="form-textarea"
                  placeholder="Enter product description"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Material</label>
                <input
                  type="text"
                  value={newProduct.material}
                  onChange={(e) => setNewProduct({...newProduct, material: e.target.value})}
                  className="form-input"
                  placeholder="e.g., Cotton, Polyester, Silk"
                />
              </div>
            </div>

           
            <div className="form-section">
              <h3 className="section-title">Pricing & Inventory</h3>
              
              <div className="two-col-grid">
                <div className="form-group">
                  <label className="form-label">Price (₹)*</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="form-input"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity*</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

             
              <div className="form-group">
                <label className="form-label">Available Sizes</label>
                <div className="options-grid">
                  {sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`option-button ${newProduct.size.includes(size) ? 'option-button-selected' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

           
              <div className="form-group">
                <label className="form-label">Available Colors</label>
                <div className="options-grid-colors">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorToggle(color)}
                      className={`option-button ${newProduct.color.includes(color) ? 'option-button-selected' : ''}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

           
              <div className="form-group">
                <label className="form-label">Product Images</label>
                <div
                  className="upload-area"
                  onClick={() => {}}
                >
                  <Upload className="upload-icon" />
                  <p className="upload-text">Click to upload images</p>
                  <p className="upload-subtext">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button onClick={onSave} className="save-button">
              <Save style={{ height: '16px', width: '16px' }} />
              <span>{isEditing ? 'Update Product' : 'Save Product'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;