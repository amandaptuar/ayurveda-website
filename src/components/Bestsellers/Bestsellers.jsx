import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import './Bestsellers.css'

const Bestsellers = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('is_bestseller', true)
        .limit(8)
      
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching bestsellers:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#f5a623' : '#ddd' }}>★</span>
    ))
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading bestsellers...</div>

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
          <Link to="/collections/all">
            <button className="view-all-btn">View All →</button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
            <h3>No bestsellers available yet!</h3>
            <p>Check back later or browse our admin panel to add some products.</p>
          </div>
        ) : (
          <div className="bestseller-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image placeholder-image" style={product.image_url ? { backgroundImage: `url(${product.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                    <span className="badge-bestseller">✦ Bestseller</span>
                    {!product.image_url && (
                      <div className="placeholder-text">
                        <span className="placeholder-icon">🌿</span>
                        {product.name}
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <span className="product-category">WELLNESS</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.description ? (product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description) : 'Natural Ayurvedic Formula'}</p>
                    <div className="star-rating">
                      {renderStars(4.5)}
                      <span className="count">(4.5)</span>
                    </div>
                    <div className="price-group">
                      <span className="price-current">₹{product.price}</span>
                      {product.original_price && <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginLeft: '8px', fontSize: '0.9rem' }}>₹{product.original_price}</span>}
                    </div>
                  </div>
                </Link>
                <button 
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const sizeData = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
                    addToCart(product.id, 1, sizeData);
                  }}
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bestseller-divider"></div>
      </div>
    </section>
  )
}

export default Bestsellers
