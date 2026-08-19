import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import './Bestsellers.css'

const Bestsellers = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart, cartItems } = useCart()

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
            {products.map((product) => {
              const isAddedToCart = cartItems?.some(item => item.product_id === product.id);
              return (
              <div className="product-card" key={product.id}>
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image-container">
                    <span className="badge-bestseller">✦ Bestseller</span>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="placeholder-image">
                        <span className="placeholder-icon">🌿</span>
                        <span className="placeholder-text">{product.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="product-info-card">
                    <span className="product-category">WELLNESS</span>
                    <h3 className="product-name">{product.name}</h3>
                    
                    <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0 8px' }}>
                      <span className="stars" style={{ color: '#f5a623', fontSize: '0.9rem' }}>
                        ★★★★★
                      </span>
                      <span className="reviews-count" style={{ fontSize: '0.8rem', color: '#64748b' }}>(4.5)</span>
                    </div>

                    <div className="product-price-box">
                      <div className="price-current">
                        <span className="price-symbol">₹</span>
                        <span className="price-amount">{Number(product.price).toLocaleString('en-IN')}</span>
                      </div>
                      {product.original_price && Number(product.original_price) > Number(product.price) && (
                        <div className="price-original-row">
                          <span className="mrp-label">M.R.P:</span>
                          <span className="original-price">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
                          <span className="discount-badge">
                            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                <div style={{ padding: '0 16px 16px' }}>
                  <button 
                    className="btn-add-cart"
                    disabled={isAddedToCart}
                    onClick={(e) => {
                      if (isAddedToCart) return;
                      e.preventDefault();
                      e.stopPropagation();
                      const sizeData = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
                      addToCart(product.id, 1, sizeData);
                    }}
                  >
                    {isAddedToCart ? '✓ Added to cart' : 'Add to cart'}
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}

        <div className="bestseller-divider"></div>
      </div>
    </section>
  )
}

export default Bestsellers
