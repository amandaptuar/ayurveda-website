import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import './Collections.css'

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  
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

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [sortOption, setSortOption] = useState('featured')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]

  // Update URL search params when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery })
    } else {
      setSearchParams({})
    }
  }, [searchQuery, setSearchParams])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortOption, selectedCategory])

  // Derive displayed products based on search, category and sort
  let displayedProducts = products.filter(p => {
    const search = searchQuery.toLowerCase().trim()
    const matchesSearch = search === '' || (
      (p.name && p.name.toLowerCase().includes(search)) ||
      (p.category && p.category.toLowerCase().includes(search))
    )
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (sortOption === 'price-asc') {
    displayedProducts.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
  } else if (sortOption === 'price-desc') {
    displayedProducts.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
  }

  // Pagination
  const totalPages = Math.ceil(displayedProducts.length / productsPerPage) || 1
  const paginatedProducts = displayedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

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
            <div className="filter-bar">
              <div className="search-filter">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search for products, categories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filters-wrapper">
                <div className="category-filter">
                  <span className="filter-label">Category:</span>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="sort-by">
                  <span className="filter-label">Sort by:</span>
                  <select 
                    value={sortOption} 
                    onChange={(e) => setSortOption(e.target.value)}
                    className="filter-select"
                  >
                    <option value="featured">Featured (Newest)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {displayedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
                <h3>No products match your search.</h3>
                <p>Try searching for a different keyword or category.</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {paginatedProducts.map((product) => {
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
                        <h3 className="product-name" title={product.name}>{product.name}</h3>
                        
                        <div className="product-rating">
                          <span className="stars">
                            <span className="star-filled">★</span>
                            <span className="star-filled">★</span>
                            <span className="star-filled">★</span>
                            <span className="star-filled">★</span>
                            <span className="star-filled">★</span>
                          </span>
                          <span className="reviews-count">5.0</span>
                        </div>

                        {product.description && (
                          <p className="product-desc" dangerouslySetInnerHTML={{ __html: product.description.substring(0, 80) + '...' }}></p>
                        )}

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
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: currentPage === 1 ? '#f1f5f9' : 'var(--color-primary-green)', color: currentPage === 1 ? '#94a3b8' : 'white', fontWeight: '600', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                    >
                      Previous
                    </button>
                    
                    <span style={{ fontWeight: '600', color: '#475569' }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: currentPage === totalPages ? '#f1f5f9' : 'var(--color-primary-green)', color: currentPage === totalPages ? '#94a3b8' : 'white', fontWeight: '600', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Collections
