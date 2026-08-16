import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import './Collections.css'

const Collections = () => {
  const products = [
    {
      category: 'GENERAL WELLNESS',
      name: 'Acidant Juice',
      desc: 'Helps boost metabolism | Goodness of Mulethi',
      price: 528,
      originalPrice: 530,
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
      name: 'Acidity Care Juice 1000 ml | Amla Juice 1000 ml',
      desc: '',
      price: 663,
      originalPrice: 693,
      rating: 5,
      reviews: 2
    },
    {
      category: 'COMBOS',
      name: 'Acidity Care Juice 1000 ml | Bael Juice 1000 ml',
      desc: '',
      price: 869,
      originalPrice: 899,
      rating: 5,
      reviews: 2
    },
    // Adding more duplicates for layout purposes
    {
      category: 'GENERAL WELLNESS',
      name: 'Amla Juice',
      desc: 'Rich source of Vitamin C',
      price: 250,
      originalPrice: 280,
    },
    {
      category: 'DIGESTIVE WELLNESS',
      name: 'Aloe Vera Juice',
      desc: 'Good for digestion and skin',
      price: 299,
      originalPrice: 320,
    }
  ]

  return (
    <div className="collections-page">
      <Helmet>
        <title>Products | FAIR DEAL TRADING AGENCY</title>
        <meta name="description" content="Explore our extensive collection of Ayurvedic health and wellness products at FAIR DEAL TRADING AGENCY. Shop juices, combos, and more." />
      </Helmet>
      <div className="collections-header">
        <h1>Products</h1>
      </div>

      <div className="collections-container">
        <div className="filter-bar">
          <button className="btn-filter">
            <span className="filter-icon">⚙️</span> Show filter
          </button>
          
          <div className="filter-right">
            <div className="view-toggles">
              <button className="view-btn active">▦</button>
              <button className="view-btn">▤</button>
            </div>
            <div className="sort-by">
              <span>Sort by:</span>
              <select>
                <option>Alphabetically, A-Z</option>
                <option>Alphabetically, Z-A</option>
                <option>Price, low to high</option>
                <option>Price, high to low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <Link to="/products/sample-product" key={index} className="product-card-link">
              <div className="product-card">
                <div className="product-image-container">
                  <div className="placeholder-image">
                    <span className="placeholder-icon">📦</span>
                    <span className="placeholder-text">{product.name}</span>
                  </div>
                </div>
                
                <div className="product-info-card">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  {product.desc && <p className="product-desc">{product.desc}</p>}
                  
                  {product.rating && (
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
                    From ₹{product.price} <span className="original-price">₹{product.originalPrice}</span>
                  </div>
                  
                  <button className="btn-add-cart">
                    Add to cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collections
