import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/image.png'
import AuthModal from '../AuthModal/AuthModal'
import './Header.css'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const navItems = [
    { label: 'Home', path: '/', hasDropdown: false },
    { label: 'Products', hasDropdown: true },
    { label: 'Contact', path: '/contact', hasDropdown: false },
  ]

  return (
    <header className="header">
      <div className="container header-container">
        {/* Mobile Left Group */}
        <div className="header-left">
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Logo */}
        <div className="header-logo">
          <div className="logo-icon">
            <img src={logoImg} alt="FAIR DEAL TRADING AGENCY" className="logo-image" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          </div>
          <div className="logo-text">
            <span className="logo-name" style={{ fontSize: '1.2rem', textTransform: 'uppercase' }}>FAIR DEAL TRADING</span>
            <span className="logo-tagline">AGENCY</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {navItems.map((item, index) => (
            <Link to={item.path || '/collections/all'} key={index} className="nav-item">
              {item.label}
              {item.hasDropdown && (
                <svg className="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">

          <button className="action-btn" aria-label="Account" onClick={() => setAuthModalOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
          <Link to="/cart" className="action-btn cart-btn" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="cart-badge">2</span>
          </Link>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={logoImg} alt="FAIR DEAL TRADING AGENCY" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-green)', lineHeight: 1.1 }}>FAIR DEAL TRADING</span>
              <span style={{ fontSize: '0.55rem', fontWeight: 600, color: 'var(--color-accent-orange)', letterSpacing: '0.15em' }}>AGENCY</span>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-primary)' }}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        {navItems.map((item, index) => (
          <Link 
            to={item.path || '/collections/all'} 
            key={index} 
            className="mobile-nav-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label}
            {item.hasDropdown && (
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </Link>
        ))}
      </div>
    </header>
  )
}

export default Header
