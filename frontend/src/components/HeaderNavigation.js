import React from 'react';
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import './styles.css';

const HeaderNavigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: DollarSign }
  ];

  return (
    <>
      <div className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <span className="logo-text">GB</span>
            </div>
            <h1 className="logo-title">Grameen Bazaar</h1>
            <span className="portal-text">Seller Portal</span>
          </div>
          <div className="user-section">
            <span className="user-email">vp1246194@gmail.com</span>
            <div className="user-avatar">
              <span className="logo-text">VP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation">
        <div className="nav-content">
          <nav className="nav-menu">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`nav-item ${activeTab === id ? 'nav-item-active' : ''}`}
              >
                <Icon style={{ height: '20px', width: '20px' }} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default HeaderNavigation;