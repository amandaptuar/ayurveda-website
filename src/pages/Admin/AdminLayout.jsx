import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, ArrowLeft, Menu, X, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminLogin from './AdminLogin';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, isAdmin, loading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isBypassed = localStorage.getItem('adminBypass') === 'true';

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (loading && !isBypassed) return <div className="admin-loading" style={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  
  // If not an admin and not bypassed, show the Admin Login page (allows them to enter bypass credentials)
  if ((!user || !isAdmin) && !isBypassed) return <AdminLogin />;

  const getInitials = (email) => {
    if (isBypassed && !user) return 'A';
    if (!email) return 'A';
    return email.charAt(0).toUpperCase();
  };

  const displayEmail = user?.email || (isBypassed ? 'admin' : '');

  const handleLogout = async () => {
    localStorage.removeItem('adminBypass');
    if (user) {
      await logout();
    }
    window.location.href = '/admin';
  };

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="admin-sidebar-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3a7233 0%, #1a3d16 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>F</div>
          <h2>Admin Panel</h2>
          <button 
            className="mobile-menu-close" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Package size={20} />
            Products
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            Orders
          </NavLink>
          <NavLink to="/admin/coupons" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Ticket size={20} />
            Coupons
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item">
            <ArrowLeft size={20} />
            Back to Store
          </Link>
          <button onClick={handleLogout} className="admin-nav-item logout-btn">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
      
      <main className="admin-main-content">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button 
              className="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h3>Overview</h3>
          </div>
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {getInitials(displayEmail)}
            </div>
            <span className="admin-user-email">{displayEmail}</span>
          </div>
        </header>
        <div className="admin-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
