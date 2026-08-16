import React from 'react'
import './ConsultationBanner.css'

const ConsultationBanner = () => {
  return (
    <section className="consultation-banner">
      <div className="container">
        <div className="consultation-card">
          <div className="consultation-left">
            <div className="consultation-icon">💬</div>
            <div className="consultation-info">
              <h3 className="consultation-title">Expert Consultation from Ayurvedic Experts</h3>
              <p className="consultation-time">Mon–Sat, 10am to 6pm · Available in Hindi & English</p>
            </div>
          </div>
          <a 
            href="https://wa.me/917088711540?text=I%20want%20to%20book%20a%20consultation%20with%20you" 
            target="_blank" 
            rel="noopener noreferrer"
            className="consultation-btn"
          >
            Book Consultation →
          </a>
        </div>
      </div>
    </section>
  )
}

export default ConsultationBanner
