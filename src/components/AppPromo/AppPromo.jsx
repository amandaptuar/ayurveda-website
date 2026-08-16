import React from 'react'
import './AppPromo.css'

const AppPromo = () => {
  return (
    <section className="app-promo">
      <div className="container app-promo-container">
        {/* Left Content */}
        <div className="app-promo-content">
          <div className="app-promo-badge">NOW AVAILABLE 🌿</div>
          <h2 className="app-promo-title">
            FAIR DEAL'S<br />
            APP IS HERE!
          </h2>
          <div className="app-promo-divider"></div>
          <p className="app-promo-subtitle">TO GET</p>
          <p className="app-promo-offers">EXCLUSIVE OFFERS</p>
          <p className="app-promo-download">DOWNLOAD NOW</p>
          <div className="app-store-buttons">
            <button className="store-btn google-play" aria-label="Get it on Google Play">
              <div className="store-btn-inner">
                <span className="store-icon">▶</span>
                <div className="store-text">
                  <span className="store-label">GET IT ON</span>
                  <span className="store-name">Google Play</span>
                </div>
              </div>
            </button>
            <button className="store-btn app-store" aria-label="Download on the App Store">
              <div className="store-btn-inner">
                <span className="store-icon">🍎</span>
                <div className="store-text">
                  <span className="store-label">Download on the</span>
                  <span className="store-name">App Store</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Right - Phone Mockups */}
        <div className="app-promo-phones">
          <div className="phone-mockup" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <img src="/home-page-img/2677ab69-59a4-4ce9-812b-3c9bc6426636.jpg" alt="App preview 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="phone-mockup phone-mockup-right" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <img src="/home-page-img/272d5019-e6df-44c3-94f5-737446aed5a0.jpg" alt="App preview 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppPromo
