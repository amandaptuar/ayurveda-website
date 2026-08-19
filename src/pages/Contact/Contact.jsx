import React from 'react'
import { Helmet } from 'react-helmet-async'
import bannerImg from '../../assets/contact-banner.jpg'
import './Contact.css'

const Contact = () => {
  return (
    <div className="contact-page">
      <Helmet>
        <title>Contact Us | FAIR DEAL TRADING AGENCY</title>
        <meta name="description" content="Get in touch with FAIR DEAL TRADING AGENCY. We're here to help with any queries or support regarding our Ayurvedic products." />
      </Helmet>
      {/* Page Header */}
      <div className="contact-header" style={{ backgroundImage: `url(${bannerImg})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div className="contact-header-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(247, 249, 247, 0.85)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>Contact Us</h1>
          <p>We're here to help! Reach out to us for any queries or support.</p>
        </div>
      </div>

      <div className="contact-container">
        {/* Contact Info */}
        <div className="contact-info-section">
          <h2>Get In Touch</h2>
          <p className="contact-subtitle">
            Have questions about our products, Ayurveda, or your order? Our team of experts is ready to assist you.
          </p>
          
          <div className="info-cards">
            <div className="info-card">
              <span className="info-icon">📍</span>
              <div>
                <h3>Our Location</h3>
                <p>FAIR DEAL TRADING AGENCY<br/>Shahbad Gate, Kashiram Colony,<br/>Rampur (U.P) 244901</p>
              </div>
            </div>
            
            <div className="info-card">
              <span className="info-icon">📞</span>
              <div>
                <h3>Phone Number</h3>
                <p>+91 70887 11540<br/>Mon - Sat: 9:00 AM to 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send a Message</h2>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Enter your full name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email address" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" placeholder="Enter your phone number" />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea id="message" rows="5" placeholder="How can we help you?" required></textarea>
            </div>
            
            <button type="submit" className="btn-submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
