import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import './Product.css'

const Product = () => {
  const [selectedSize, setSelectedSize] = useState('starter')
  const [quantity, setQuantity] = useState(1)
  const relatedProducts = [
    {
      category: 'COMBOS',
      name: 'Acidity Care Juice 1000 ml | Amla Juice 1000 ml',
      desc: '',
      price: 663,
      originalPrice: 693,
      rating: 5,
      reviews: 2
    },
    {
      category: 'DIGESTIVE WELLNESS',
      name: 'Acidity Care Juice',
      desc: 'Helps provide relief from acidity and bloating',
      price: 476,
      originalPrice: 478,
      rating: 5,
      reviews: 52
    },
    {
      category: 'COMBOS',
      name: 'She Care Juice 1000ml | Neem Face Wash 100ml | Aloe Vera Gel 100gm | Haldi Chandan Handmade Soap 100gm',
      desc: 'Purify, Heal, Balance & Glow—The Ayurvedic Way.',
      price: 768,
      originalPrice: 818,
      rating: 0,
      reviews: 0
    },
    {
      category: 'COMBOS',
      name: 'Acidity Care Juice 1000 ml | Diabic Care Juice 1000 ml',
      desc: 'Relieves acidity and bloating and helping manage healthy blood sugar levels',
      price: 907,
      originalPrice: 937,
      rating: 5,
      reviews: 4
    }
  ]

  const handleQtyChange = (type) => {
    if (type === 'inc') setQuantity(prev => prev + 1)
    if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1)
  }

  return (
    <div className="product-page">
      <Helmet>
        <title>Acidant Juice | FAIR DEAL TRADING AGENCY</title>
        <meta name="description" content="Buy Acidant Juice for Herbal Support for Acidity & Smooth Digestion. Get the best Ayurvedic solutions from FAIR DEAL TRADING AGENCY." />
      </Helmet>
      <div className="product-container">
        
        {/* Left Column - Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-placeholder">
            <span className="placeholder-icon">🧴</span>
            <span className="placeholder-text">Acidant Juice Image</span>
          </div>
          <div className="thumbnail-strip">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`thumbnail-placeholder ${i === 1 ? 'active' : ''}`}>
                <span>Thumb {i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="product-info">
          <h1 className="product-title">Acidant Juice</h1>
          <p className="product-subtitle">Herbal Support for Acidity & Smooth Digestion</p>

          <div className="product-price-section">
            <p className="mrp-label">MRP (Inclusive of taxes)</p>
            <div className="price-display">
              <span className="current-price">₹528</span>
              <span className="original-price">₹530</span>
            </div>
          </div>

          <div className="offers-strip">
            <div className="offer-item">
              <span className="offer-icon">🏷️</span>
              <span>5% OFF, Code "SAVE5" (Order above ₹499)</span>
            </div>
            <div className="offer-item">
              <span className="offer-icon">🚚</span>
              <span>Free Delivery On All Orders Above ₹399</span>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">🌿</span>
              <span>Maintains healthy Bowel movements</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✨</span>
              <span>Promotes Digestive Wellness</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🛡️</span>
              <span>Soothes Stomach Irritation</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <span>Supports Hyperacidity</span>
            </div>
          </div>

          <div className="size-selector">
            <p className="selector-label">Size</p>
            <div className="size-options">
              <div 
                className={`size-card ${selectedSize === 'starter' ? 'selected' : ''}`}
                onClick={() => setSelectedSize('starter')}
              >
                <div className="size-header">Starter Pack</div>
                <div className="size-body">
                  <div className="size-img-placeholder"></div>
                  <div className="size-price">₹528 <span className="size-mrp">₹530</span></div>
                  <div className="size-volume">1000 ml x 1 <span className="size-unit-price">(₹0.52/1 ml)</span></div>
                  <div className="size-save">Save ₹2</div>
                </div>
                <div className="size-footer beginner">Beginner Friendly</div>
              </div>

              <div 
                className={`size-card ${selectedSize === 'balance' ? 'selected' : ''}`}
                onClick={() => setSelectedSize('balance')}
              >
                <div className="size-header">One Month Balance Pack</div>
                <div className="size-body">
                  <div className="size-img-placeholder double"></div>
                  <div className="size-price">₹1,040 <span className="size-mrp">₹1,060</span></div>
                  <div className="size-volume">1000 ml x 2 <span className="size-unit-price">(₹0.52/1 ml)</span></div>
                  <div className="size-save">Save ₹20</div>
                </div>
                <div className="size-footer saver">Super Saver</div>
              </div>
            </div>
          </div>

          <div className="quantity-section">
            <p className="selector-label">Quantity</p>
            <div className="quantity-controls">
              <button onClick={() => handleQtyChange('dec')}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQtyChange('inc')}>+</button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-add-to-cart">
              <span className="btn-icon">🛍️</span> ADD TO CART
            </button>
            <button className="btn-buy-now">BUY NOW</button>
          </div>

        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="related-products-section">
        <h2 className="related-products-title">You May Also Like...</h2>
        <div className="related-products-grid">
          {relatedProducts.map((product, index) => (
            <div key={index} className="product-card">
              <div className="product-image-container">
                <div className="placeholder-image">
                  <span className="placeholder-icon">📦</span>
                  <span className="placeholder-text">{product.name}</span>
                </div>
              </div>
              <div className="product-info-card">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.desc}</p>
                {product.rating > 0 && (
                  <div className="product-rating">
                    <span className="stars">
                      {Array(5).fill('★').map((star, i) => (
                        <span key={i} className={i < product.rating ? 'star-filled' : 'star-empty'}>
                          {star}
                        </span>
                      ))}
                    </span>
                    <span className="reviews-count">({product.reviews})</span>
                  </div>
                )}
                <div className="product-price">
                  {product.category !== 'COMBOS' && 'From '}₹{product.price} <span className="original-price">₹{product.originalPrice}</span>
                </div>
                <button className="btn-add-cart">Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Product
