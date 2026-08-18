import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import './ShopByConcern.css'

const ShopByConcern = () => {
  const [allProducts, setAllProducts] = useState([])
  const [tabs, setTabs] = useState([])
  const [activeTab, setActiveTab] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchAllProducts()
  }, [])

  const fetchAllProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        
      if (error) throw error
      
      const products = data || []
      setAllProducts(products)
      
      // Extract unique categories
      const uniqueCategories = [...new Set(products.map(p => p.category || 'GENERAL WELLNESS'))]
      
      // Optional: Filter out 'COMBO' or specific tags if you want them strictly in Combo Deals
      // const filteredCategories = uniqueCategories.filter(c => !c.toUpperCase().includes('COMBO'))
      
      setTabs(uniqueCategories)
      if (uniqueCategories.length > 0) {
        setActiveTab(uniqueCategories[0])
      }
    } catch (error) {
      console.error('Error fetching concern products:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentProducts = allProducts
    .filter(p => (p.category || 'GENERAL WELLNESS') === activeTab)
    .slice(0, 4) // Show up to 4 products per category tab

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#f5a623' : '#ddd' }}>★</span>
    ))
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading categories...</div>

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
          <Link to="/collections/all">
            <button className="view-all-btn">View All →</button>
          </Link>
        </div>

        {tabs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', color: '#64748b', margin: '20px 0' }}>
            <h3>No products available yet!</h3>
            <p>Check back later or browse our admin panel to add some products.</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="concern-tabs" style={{ display: 'flex', overflowX: 'auto', gap: '10px', scrollbarWidth: 'none', paddingBottom: '10px' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`concern-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  style={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                >
                  {tab.toLowerCase()}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="concern-products">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <div className="product-card" key={product.id}>
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="product-image placeholder-image" style={product.image_url ? { backgroundImage: `url(${product.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                        {product.is_bestseller && (
                          <span className="badge-bestseller">✦ Bestseller</span>
                        )}
                        {!product.image_url && (
                          <div className="placeholder-text">
                            <span className="placeholder-icon">📦</span>
                            {product.name}
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <span className="product-category">{product.category || 'WELLNESS'}</span>
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-desc">{product.description ? (product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description) : 'Natural Ayurvedic Formula'}</p>
                        <div className="star-rating">
                          {renderStars(4.5)}
                          <span className="count">(4.5)</span>
                        </div>
                        <div className="price-group">
                          <span className="price-current">₹{product.price}</span>
                          {product.original_price && <span className="price-original" style={{ textDecoration: 'line-through', color: '#94a3b8', marginLeft: '8px', fontSize: '0.9rem' }}>₹{product.original_price}</span>}
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
                ))
              ) : (
                <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
                  <h3>No products found for this concern!</h3>
                  <p>Try selecting a different category.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default ShopByConcern
