import React from 'react'
import { Link } from 'react-router-dom'
import './Bestsellers.css'

const Bestsellers = () => {
  const products = [
    {
      category: "WOMEN'S WELLNESS",
      name: 'She Care Juice',
      desc: "Clinically Proven Formula for women's wellness",
      rating: 4.5,
      reviews: 8738,
      price: 541,
      originalPrice: 543,
    },
    {
      category: 'DIABETIC WELLNESS',
      name: 'Diabic Care Juice',
      desc: 'Clinically Proven Ayurvedic Formula for Blood Sugar Management',
      rating: 4.5,
      reviews: 8275,
      price: 457,
      originalPrice: 459,
    },
    {
      category: 'CARDIAC WELLNESS',
      name: 'Cholesterol Care Juice',
      desc: 'Natural Cholesterol Management and Boosts Heart Health',
      rating: 4.5,
      reviews: 6372,
      price: 560,
      originalPrice: 562,
    },
    {
      category: 'WEIGHT MANAGEMENT',
      name: 'Shapefix Juice',
      desc: 'Natural Weight Management and Boosts Metabolism',
      rating: 4,
      reviews: 5744,
      price: 476,
      originalPrice: 478,
    },
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#f5a623' : '#ddd' }}>★</span>
    ))
  }

  return (
    <section className="bestsellers">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Our <span>Bestsellers</span>
            </h2>
            <p className="section-subtitle">Most loved by our customers</p>
          </div>
          <button className="view-all-btn">View All →</button>
        </div>

        <div className="bestseller-grid">
          {products.map((product, index) => (
            <Link to="/products/sample-product" key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-card">
                <div className="product-image placeholder-image">
                  <span className="badge-bestseller">✦ Bestseller</span>
                  <div className="placeholder-text">
                    <span className="placeholder-icon">🌿</span>
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

        <div className="bestseller-divider"></div>
      </div>
    </section>
  )
}

export default Bestsellers
