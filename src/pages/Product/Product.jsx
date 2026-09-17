import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import './Product.css'

const Product = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  
  const { addToCart, cartItems } = useCart()

  useEffect(() => {
    if (id) {
      fetchProductDetails()
      window.scrollTo(0, 0)
    }
  }, [id])

  const fetchProductDetails = async () => {
    setLoading(true)
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
        
      if (productError) throw productError
      setProduct(productData)
      setActiveImageIndex(0)
      setQuantity(1)
      setSelectedSizeIndex(0)

      // Fetch related products (same category preferred)
      const { data: relatedData } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .neq('id', id)
        .limit(10)
        
      setRelatedProducts(relatedData || [])
      
    } catch (error) {
      console.error('Error fetching product details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQtyChange = (type) => {
    if (type === 'inc') setQuantity(prev => prev + 1)
    if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1)
  }

  const handleAddToCart = () => {
    if (product) {
      const sizeData = product.sizes && product.sizes.length > 0 ? product.sizes[selectedSizeIndex] : null;
      addToCart(product.id, quantity, sizeData);
    }
  }

  // Loading skeleton
  if (loading) return (
    <div className="product-page">
      <div className="product-container" style={{ padding: '20px' }}>
        <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#f1f5f9', borderRadius: '16px', animation: 'pulse 1.5s infinite' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 0' }}>
          <div style={{ width: '30%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ width: '80%', height: '28px', backgroundColor: '#e2e8f0', borderRadius: '6px', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ width: '100%', height: '60px', backgroundColor: '#f1f5f9', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ width: '40%', height: '32px', backgroundColor: '#e2e8f0', borderRadius: '6px', animation: 'pulse 1.5s infinite' }}></div>
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="product-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '3rem', marginBottom: '16px' }}>😞</p>
        <h2>Product not found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/collections/all" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 24px', background: 'var(--color-primary-green)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>
          Browse Products
        </Link>
      </div>
    </div>
  )

  const activeSize = product.sizes && product.sizes.length > 0 ? product.sizes[selectedSizeIndex] : null;
  const currentDisplayPrice = activeSize ? activeSize.price : product.price;
  const originalDisplayPrice = activeSize ? activeSize.original_price : product.original_price;
  const discount = originalDisplayPrice && Number(originalDisplayPrice) > Number(currentDisplayPrice)
    ? Math.round(((originalDisplayPrice - currentDisplayPrice) / originalDisplayPrice) * 100)
    : 0;

  // Build image gallery array
  const allImages = [product.image_url, ...(product.additional_images || [])].filter(Boolean);
  const activeImageUrl = allImages.length > 0 ? allImages[activeImageIndex] : null;

  const isAddedToCart = cartItems?.some(item => item.product_id === product.id);

  return (
    <div className="product-page">
      <Helmet>
        <title>{product.name} | FAIR DEAL TRADING AGENCY</title>
        <meta name="description" content={product.description ? product.description.substring(0, 160) : `Buy ${product.name} from FAIR DEAL TRADING AGENCY.`} />
      </Helmet>
      
      <div className="product-container">
        {/* Left Column - Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-placeholder">
            {activeImageUrl ? (
              <img 
                src={activeImageUrl} 
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px'
                }}
              />
            ) : (
              <>
                <span className="placeholder-icon">📦</span>
                <span className="placeholder-text">{product.name}</span>
              </>
            )}
            {discount > 0 && (
              <span className="product-badge-discount">{discount}% OFF</span>
            )}
          </div>
          
          {/* Thumbnail / Dots Navigation */}
          {allImages.length > 1 && (
            <div className="gallery-navigation">
              <div className="hero-dots-product desktop-hide">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    className={`hero-dot-product ${activeImageIndex === index ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="thumbnail-strip mobile-hide">
                {allImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-item ${activeImageIndex === index ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={img} alt={`${product.name} view ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="product-info">
          
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/collections/all">Products</Link>
            <span>›</span>
            <span className="breadcrumb-current">{product.name}</span>
          </nav>

          {/* Category badge */}
          <span className="product-category-badge">{product.category || 'WELLNESS'}</span>

          <h1 className="product-title">{product.name}</h1>
          
          {/* Short description */}
          {product.description && (
            <p className="product-subtitle">{product.description}</p>
          )}

          {/* Rating */}
          <div className="product-detail-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-text">4.9</span>
            <span className="reviews-text">(128 Reviews)</span>
          </div>

          <div className="divider"></div>

          {/* Price Section */}
          <div className="product-price-section">
            <div className="price-row">
              <span className="current-price">₹{Number(currentDisplayPrice).toFixed(2)}</span>
              {originalDisplayPrice && Number(originalDisplayPrice) > Number(currentDisplayPrice) && (
                <>
                  <span className="original-price">₹{Number(originalDisplayPrice).toFixed(2)}</span>
                  <span className="discount-tag">Save {discount}%</span>
                </>
              )}
            </div>
            <p className="tax-info">MRP (Inclusive of all taxes)</p>
          </div>

          {/* Offers */}
          <div className="offers-strip">
            <div className="offer-item">
              <span className="offer-icon">🚚</span>
              <span>Free Delivery on orders ₹399 & above</span>
            </div>
            <div className="offer-item">
              <span className="offer-icon">⚡</span>
              <span>Extra 10% Off on Prepaid</span>
            </div>
          </div>

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <>
              <div className="divider"></div>
              <div className="benefits-section">
                <p className="section-label">Key Benefits</p>
                <div className="benefits-list">
                  {product.benefits.map((benefit, i) => (
                    <div className="benefit-item" key={i}>
                      <span className="benefit-check">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <>
              <div className="divider"></div>
              <div className="size-selector">
                <p className="section-label">Choose Pack</p>
                <div className="size-options">
                  {product.sizes.map((size, index) => {
                    const sizeDiscount = size.original_price && Number(size.original_price) > Number(size.price)
                      ? Math.round(((size.original_price - size.price) / size.original_price) * 100)
                      : 0;
                    return (
                      <div 
                        key={index}
                        className={`size-card ${selectedSizeIndex === index ? 'selected' : ''}`}
                        onClick={() => setSelectedSizeIndex(index)}
                      >
                        {/* Radio indicator */}
                        <div className="size-card-radio">
                          <div className={`radio-outer ${selectedSizeIndex === index ? 'active' : ''}`}>
                            {selectedSizeIndex === index && <div className="radio-inner"></div>}
                          </div>
                        </div>
                        
                        <div className="size-card-content">
                          <div className="size-card-top">
                            <span className="size-card-name">{size.name}</span>
                            {sizeDiscount > 0 && (
                              <span className="size-card-discount">{sizeDiscount}% OFF</span>
                            )}
                          </div>
                          
                          <div className="size-card-price-row">
                            <span className="size-card-price">₹{Number(size.price).toFixed(0)}</span>
                            {size.original_price && (
                              <span className="size-card-original">₹{Number(size.original_price).toFixed(0)}</span>
                            )}
                          </div>
                          
                          {size.volume && <div className="size-card-volume">📦 {size.volume}</div>}
                          {size.saveText && <div className="size-card-save">🎉 {size.saveText}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="divider"></div>

          {/* Quantity */}
          <div className="quantity-section">
            <p className="section-label">Quantity</p>
            <div className="quantity-controls">
              <button onClick={() => handleQtyChange('dec')} disabled={quantity <= 1}>−</button>
              <span>{quantity}</span>
              <button onClick={() => handleQtyChange('inc')}>+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn-add-to-cart" 
              onClick={handleAddToCart} 
              disabled={isAddedToCart}
            >
              {isAddedToCart ? '✅ ADDED TO CART' : '🛒 ADD TO CART'}
            </button>
            <button 
              className="btn-buy-now" 
              onClick={() => { handleAddToCart(); navigate('/cart'); }}
            >
              BUY IT NOW
            </button>
          </div>
            
          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <span className="trust-badge-icon">🌿</span>
              <span>100% Natural</span>
            </div>
            <div className="trust-badge">
              <span className="trust-badge-icon">🧪</span>
              <span>Lab Tested</span>
            </div>
            <div className="trust-badge">
              <span className="trust-badge-icon">⚕️</span>
              <span>Ayush Certified</span>
            </div>
            <div className="trust-badge">
              <span className="trust-badge-icon">✅</span>
              <span>No Side Effects</span>
            </div>
          </div>

          {/* Description Accordion */}
          {product.description && (
            <div className="accordion-section">
              <div className="accordion-item">
                <div className="accordion-header">
                  📋 Product Description
                </div>
                <div className="accordion-content">
                  {product.description}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2 className="related-products-title">You May Also Like</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => {
              const isRelatedAddedToCart = cartItems?.some(item => item.product_id === relatedProduct.id);
              return (
              <Link to={`/products/${relatedProduct.id}`} key={relatedProduct.id} className="related-card-link">
                <div className="product-card">
                  <div className="product-image-container">
                    {relatedProduct.image_url ? (
                      <img src={relatedProduct.image_url} alt={relatedProduct.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                    ) : (
                      <div className="placeholder-image">
                        <span className="placeholder-icon">📦</span>
                        <span className="placeholder-text">{relatedProduct.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="product-info-card">
                    <span className="product-category">{relatedProduct.category || 'WELLNESS'}</span>
                    <h3 className="product-name">{relatedProduct.name}</h3>
                    <div className="product-price">
                      ₹{relatedProduct.price}
                      {relatedProduct.original_price && Number(relatedProduct.original_price) > Number(relatedProduct.price) && (
                        <span className="original-price" style={{marginLeft: '8px'}}>₹{relatedProduct.original_price}</span>
                      )}
                    </div>
                    <button 
                      className="btn-add-cart"
                      disabled={isRelatedAddedToCart}
                      onClick={(e) => {
                        if (isRelatedAddedToCart) return;
                        e.preventDefault();
                        e.stopPropagation();
                        const sizeData = relatedProduct.sizes && relatedProduct.sizes.length > 0 ? relatedProduct.sizes[0] : null;
                        addToCart(relatedProduct.id, 1, sizeData);
                      }}
                    >
                      {isRelatedAddedToCart ? '✓ Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </div>
      )}
    </div>
  )
}

export default Product
