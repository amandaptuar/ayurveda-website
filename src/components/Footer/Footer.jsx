import React from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/image.png'
import './Footer.css'

const Footer = () => {
  const footerLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/collections/all' },
    { label: 'Contact', path: '/contact' },
    { label: 'Terms & Conditions', path: '/terms-and-conditions' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Disclaimer', path: '/disclaimer' },
    { label: 'Return & Refund Policy', path: '/refund-policy' },
    { label: 'Shipping Policy', path: '/shipping-policy' },
  ]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logoImg} alt="FAIR DEAL TRADING AGENCY" className="footer-logo-img" />
              <div className="footer-logo-text">
                 <span className="logo-name">FAIR DEAL TRADING</span>
                 <span className="logo-tagline">AGENCY</span>
              </div>
            </div>
            <p className="footer-intro">
               Empowering healthier lives through authentic Ayurvedic care, thoughtfully crafted to support your daily wellness journey.
            </p>
          </div>
          
          <div className="footer-links-container">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {footerLinks.map((link, i) => (
                <li key={i}><Link to={link.path}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026, FAIR DEAL TRADING AGENCY.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
