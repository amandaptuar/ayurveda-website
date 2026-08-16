import React from 'react'
import './TrustBanner.css'

const TrustBanner = () => {
  const items = [
    { icon: '🔒', title: 'Secure Payments', subtitle: 'UPI, cards & COD available' },
    { icon: '✅', title: 'Pure Herbs', subtitle: 'with No Extract' },
    { icon: '🚚', title: 'Free Delivery', subtitle: 'On all orders above ₹399' },
  ]

  // Double the items for seamless infinite scroll
  const marqueeItems = [...items, ...items, ...items, ...items]

  return (
    <section className="trust-banner">
      <div className="trust-marquee">
        <div className="trust-marquee-inner">
          {marqueeItems.map((item, index) => (
            <div key={index} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              <div className="trust-text">
                <span className="trust-title">{item.title}</span>
                <span className="trust-subtitle">{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBanner
