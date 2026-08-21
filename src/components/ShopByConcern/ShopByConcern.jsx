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
  const { addToCart, cartItems } = useCart()

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
            <div className="concern-products-scroll">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => {
                  const isAddedToCart = cartItems?.some(item => item.product_id === product.id);
                  return (
                  <div className="product-card" key={product.id}>
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="product-image-container">
                        {product.is_bestseller && (
                          <span className="badge-bestseller">✦ Bestseller</span>
                        )}
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        ) : (
                          <div className="placeholder-image">
                            <span className="placeholder-icon">📦</span>
                            <span className="placeholder-text">{product.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="product-info-card">
                        <span className="product-category">{product.category || 'WELLNESS'}</span>
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
                )})
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
