import React from 'react'
import { Link } from 'react-router-dom'
import './ShopByCategories.css'

const ShopByCategories = () => {
  const categories = [
    { name: 'Juices', count: 148, icon: '🥤' },
    { name: 'Herbal Powders & Churna', count: 45, icon: '🌾' },
    { name: 'Tablets', count: 17, icon: '💊' },
    { name: 'Herbal Oil', count: 3, icon: '🫒' },
    { name: 'Skin Wellness', count: 43, icon: '✨' },
    { name: 'Exclusive', count: 12, icon: '🌿' },
  ]

  return (
    <section className="shop-categories">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" style={{ fontWeight: 700 }}>Shop by Categories</h2>
          <Link to="/collections/all" className="categories-all-btn" style={{ textDecoration: 'none' }}>All categories →</Link>
        </div>

        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link to="/collections/all" key={index} className="category-card" style={{ textDecoration: 'none' }}>
              <div className="category-icon-wrapper">
                <span className="category-icon">{cat.icon}</span>
              </div>
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-count">{cat.count} products</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopByCategories
