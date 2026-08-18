import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import './ComboDeals.css'

const ComboDeals = () => {
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

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
          <div className="combo-grid">
            {combos.map((combo) => (
              <div key={combo.id} className="combo-card">
                <Link to={`/products/${combo.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '16px' }}>
                  <div className="combo-image placeholder-image" style={combo.image_url ? { backgroundImage: `url(${combo.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', width: 100, height: 100, borderRadius: 12, flexShrink: 0 } : { width: 100, height: 100, borderRadius: 12, flexShrink: 0, backgroundColor: '#e2e8f0' }}>
                    {!combo.image_url && <div className="placeholder-text" style={{ fontSize: '0.8rem' }}>📦</div>}
                  </div>
                  <div className="combo-info">
                    {combo.original_price && combo.price < combo.original_price && (
                      <span className="combo-save">SAVE ₹{Number(combo.original_price - combo.price).toFixed(2)}</span>
                    )}
                    <h3 className="combo-title" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{combo.name}</h3>
                    {combo.description && <p className="combo-desc" style={{ fontSize: '0.9rem', color: '#64748b' }}>{combo.description.substring(0, 60)}...</p>}
                    <div className="price-group" style={{ marginTop: 'auto', paddingTop: '8px' }}>
                      <span className="price-current">₹{Number(combo.price).toFixed(2)}</span>
                      {combo.original_price && <span className="price-original" style={{ textDecoration: 'line-through', color: '#94a3b8', marginLeft: '8px', fontSize: '0.9rem' }}>₹{Number(combo.original_price).toFixed(2)}</span>}
                    </div>
                  </div>
                </Link>
                <button 
                  className="combo-shop-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const sizeData = combo.sizes && combo.sizes.length > 0 ? combo.sizes[0] : null;
                    addToCart(combo.id, 1, sizeData);
                  }}
                  style={{ marginTop: '16px', width: '100%', padding: '12px', border: 'none', borderRadius: '8px', backgroundColor: 'var(--color-primary-green)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Shop combo →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ComboDeals
