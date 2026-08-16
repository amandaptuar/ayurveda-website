import React from 'react'
import './MediaLogos.css'

const MediaLogos = () => {
  const logos = [
    'FE Leisure',
    'sugermint',
    'SMB STORY',
    'BRAND EQUITY',
    'FE Healthcare',
    'Hindustan Times',
    'THE WEEK',
    'Loktej',
  ]

  return (
    <section className="media-logos">
      <div className="container">
        <div className="logos-scroll-wrapper">
          <button className="logo-scroll-btn logo-scroll-left" aria-label="Scroll left">‹</button>
          <div className="logos-row">
            {logos.map((logo, index) => (
              <div key={index} className="media-logo-item">
                <span className="media-logo-text">{logo}</span>
              </div>
            ))}
          </div>
          <button className="logo-scroll-btn logo-scroll-right" aria-label="Scroll right">›</button>
        </div>
      </div>
    </section>
  )
}

export default MediaLogos
