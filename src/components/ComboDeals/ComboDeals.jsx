import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import './ComboDeals.css'

const ComboDeals = () => {
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart, cartItems } = useCart()

  useEffect(() => {
    fetchCombos()
  }, [])

  const fetchCombos = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('is_combo', true)
        .limit(4)
      
      if (error) throw error
      setCombos(data || [])
    } catch (error) {
      console.error('Error fetching combos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading deals...</div>

  return (
    <section className="combo-deals">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Combo <span>Deals</span>
            </h2>
            <p className="section-subtitle">Better together — save more</p>
          </div>
          <Link to="/collections/combos">
            <button className="view-all-btn">View All →</button>
          </Link>
        </div>

        {combos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
            <h3>No combo deals available yet!</h3>
            <p>Check back later or browse our admin panel to add some.</p>
          </div>
        ) : (
          <div className="combo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {combos.map((combo) => {
              const isAddedToCart = cartItems?.some(item => item.product_id === combo.id);
              return (
              <div className="product-card" key={combo.id}>
                <Link to={`/products/${combo.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image-container">
                    <span className="badge-bestseller" style={{ backgroundColor: 'var(--color-accent-orange)' }}>✦ Combo Deal</span>
                    {combo.image_url ? (
                      <img src={combo.image_url} alt={combo.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <div className="placeholder-image">
                        <span className="placeholder-icon">📦</span>
                        <span className="placeholder-text">{combo.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="product-info-card">
                    <span className="product-category">{combo.category || 'WELLNESS'}</span>
                    <h3 className="product-name">{combo.name}</h3>
                    
                    <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0 8px' }}>
                      <span className="stars" style={{ color: '#f5a623', fontSize: '0.9rem' }}>
                        ★★★★★
                      </span>
                      <span className="reviews-count" style={{ fontSize: '0.8rem', color: '#64748b' }}>(4.5)</span>
                    </div>

                    <div className="product-price">
                      ₹{Number(combo.price).toFixed(2)}
                      {combo.original_price && <span className="original-price" style={{marginLeft: '8px', textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.85rem'}}>₹{Number(combo.original_price).toFixed(2)}</span>}
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
                      const sizeData = combo.sizes && combo.sizes.length > 0 ? combo.sizes[0] : null;
                      addToCart(combo.id, 1, sizeData);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: isAddedToCart ? '#f5b041' : 'var(--color-primary-green)',
                      color: 'white',
                      border: 'none',
                      fontWeight: '600',
                      cursor: isAddedToCart ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isAddedToCart ? '✓ Added to cart' : 'Add to cart'}
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </section>
  )
}

export default ComboDeals
