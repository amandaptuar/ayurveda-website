import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import './Collections.css'

const Collections = () => {
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
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('featured')

  // Derive displayed products based on search and sort
  let displayedProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (sortOption === 'price-asc') {
    displayedProducts.sort((a, b) => a.price - b.price)
  } else if (sortOption === 'price-desc') {
    displayedProducts.sort((a, b) => b.price - a.price)
  }

  // Skeleton Loader for Products
  const renderSkeleton = () => (
    <div className="products-grid">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <div key={n} className="product-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '250px', backgroundColor: '#e2e8f0', animation: 'pulse 1.5s infinite' }}></div>
          <div className="product-info-card" style={{ padding: '16px' }}>
            <div style={{ width: '40%', height: '12px', backgroundColor: '#e2e8f0', marginBottom: '8px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ width: '80%', height: '20px', backgroundColor: '#cbd5e1', marginBottom: '12px', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ width: '30%', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
          </div>
        </div>
      ))}
    </div>
  )

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
        {loading ? (
          renderSkeleton()
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', color: '#64748b', margin: '0 auto', maxWidth: '600px' }}>
            <h3>No products available yet!</h3>
            <p>Check back later or browse our admin panel to add some products.</p>
          </div>
        ) : (
          <>
            <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px', backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
              <div className="search-filter" style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search for products, categories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc', transition: 'border-color 0.2s' }}
                />
              </div>
              
              <div className="sort-by" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort by:</span>
                <select 
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', cursor: 'pointer', backgroundColor: '#f8fafc', fontWeight: '500', color: '#334155' }}
                >
                  <option value="featured">Featured (Newest)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {displayedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
                <h3>No products match your search.</h3>
                <p>Try searching for a different keyword or category.</p>
              </div>
            ) : (
              <div className="products-grid">
                {displayedProducts.map((product) => {
                  const isAddedToCart = cartItems?.some(item => item.product_id === product.id);
                  return (
                  <Link to={`/products/${product.id}`} key={product.id} className="product-card">
                    <div className="product-image-container">
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
                      
                      <div className="product-rating">
                        <span className="stars">
                          <span className="star-filled">★</span>
                          <span className="star-filled">★</span>
                          <span className="star-filled">★</span>
                          <span className="star-filled">★</span>
                          <span className="star-filled">★</span>
                        </span>
                        <span className="reviews-count">(5.0)</span>
                      </div>

                      <div className="product-price">
                        ₹{Number(product.price).toFixed(2)}
                        {product.original_price && <span className="original-price" style={{marginLeft: '8px', textDecoration: 'line-through', color: 'var(--color-text-muted)'}}>₹{Number(product.original_price).toFixed(2)}</span>}
                      </div>
                      
                      <button 
                        className="btn-add-cart"
                        disabled={isAddedToCart}
                        onClick={(e) => {
                          if (isAddedToCart) return;
                          e.preventDefault();
                          e.stopPropagation();
                          // Get first size if available
                          const sizeData = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
                          addToCart(product.id, 1, sizeData);
                        }}
                        style={{
                          backgroundColor: isAddedToCart ? '#f5b041' : 'var(--color-primary-green)',
                          cursor: isAddedToCart ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isAddedToCart ? '✓ Added to cart' : 'Add to cart'}
                      </button>
                    </div>
                  </Link>
                )})}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Collections
