import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './ShopByConcern.css'

const ShopByConcern = () => {
  const [activeTab, setActiveTab] = useState('Diabetic Wellness')

  const tabs = [
    'Diabetic Wellness',
    "Women's Wellness",
    'Digestive Wellness',
    'Pain Reliever',
    'Cardiac Wellness',
    'Skin Wellness',
  ]

  const products = {
    'Diabetic Wellness': [
      {
        category: 'DIABETIC WELLNESS',
        name: 'Diabic Care Juice',
        desc: 'Clinically Proven Ayurvedic Formula for Blood Sugar Management',
        rating: 4.5,
        reviews: 8275,
        price: 457,
        originalPrice: 459,
        bestseller: true,
      },
      {
        category: 'DIABETIC WELLNESS',
        name: 'Diabic Care Tablet',
        desc: 'Blend of 11 Powerful herbs to manage sugar level',
        rating: 5,
        reviews: 146,
        price: 448,
        originalPrice: 450,
        bestseller: false,
      },
      {
        category: 'DIABETIC WELLNESS',
        name: 'Triphala Churna',
        desc: 'Helps promote healthy digestion and maintain bowel regularity.',
        rating: 4.5,
        reviews: 18,
        price: 68,
        originalPrice: 70,
        bestseller: false,
      },
      {
        category: 'DIABETIC WELLNESS',
        name: 'Karela Jamun Mix Juice',
        desc: 'Karela Juice & Jamun Mix | Naturally Balance Your Blood Sugar',
        rating: 5,
        reviews: 14,
        price: 279,
        originalPrice: 281,
        bestseller: false,
      },
    ],
    "Women's Wellness": [
      {
        category: "WOMEN'S WELLNESS",
        name: 'She Care Juice',
        desc: "Clinically Proven Formula for women's wellness",
        rating: 4.5,
        reviews: 8738,
        price: 541,
        originalPrice: 543,
        bestseller: true,
      },
      {
        category: "WOMEN'S WELLNESS",
        name: 'Aloe Vera Juice',
        desc: 'Pure Aloe Vera for skin and digestive health',
        rating: 4.5,
        reviews: 2340,
        price: 299,
        originalPrice: 350,
        bestseller: false,
      },
      {
        category: "WOMEN'S WELLNESS",
        name: 'Amla Juice',
        desc: 'Rich in Vitamin C, boosts immunity naturally',
        rating: 4.5,
        reviews: 1200,
        price: 245,
        originalPrice: 280,
        bestseller: false,
      },
      {
        category: "WOMEN'S WELLNESS",
        name: 'Giloy Juice',
        desc: 'Natural immunity booster with pure Giloy extract',
        rating: 4,
        reviews: 890,
        price: 299,
        originalPrice: 320,
        bestseller: false,
      },
    ],
  }

  const currentProducts = products[activeTab] || products['Diabetic Wellness']

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#f5a623' : '#ddd' }}>★</span>
    ))
  }

  return (
    <section className="shop-concern">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Shop By <span>Concern?</span>
            </h2>
            <p className="section-subtitle">Browse products by your health need</p>
          </div>
          <button className="view-all-btn">View All →</button>
        </div>

        {/* Tabs */}
        <div className="concern-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`concern-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="concern-products">
          {currentProducts.map((product, index) => (
            <Link to="/products/sample-product" key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-card">
                <div className="product-image placeholder-image">
                  {product.bestseller && (
                    <span className="badge-bestseller">✦ Bestseller</span>
                  )}
                  <div className="placeholder-text">
                    <span className="placeholder-icon">📦</span>
                    {product.name}
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.desc}</p>
                  <div className="star-rating">
                    {renderStars(product.rating)}
                    <span className="count">({product.reviews.toLocaleString()})</span>
                  </div>
                  <div className="price-group">
                    <span className="price-current">From ₹{product.price}</span>
                    <span className="price-original">₹{product.originalPrice}</span>
                  </div>
                </div>
                <button className="add-to-cart-btn">Add to cart</button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopByConcern
