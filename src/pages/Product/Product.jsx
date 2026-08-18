import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import './Product.css'

const Product = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0) // Default to first size if exists
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  
  const { addToCart } = useCart()

  useEffect(() => {
    if (id) {
      fetchProductDetails()
    }
  }, [id])

  const fetchProductDetails = async () => {
    setLoading(true)
    try {
      // Fetch current product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
        
      if (productError) throw productError
      setProduct(productData)
      setActiveImageIndex(0) // Reset image on product change

      // Fetch related products
      const { data: relatedData, error: relatedError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .neq('id', id)
        .limit(4)
        
      if (relatedError) throw relatedError
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
      // Pass along the selected size if the product has variations
      const sizeData = product.sizes && product.sizes.length > 0 ? product.sizes[selectedSizeIndex] : null;
      addToCart(product.id, quantity, sizeData);
    }
  }

  if (loading) return (
    <div className="product-page" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#e2e8f0', borderRadius: '24px', animation: 'pulse 1.5s infinite' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ width: '70%', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ width: '40%', height: '24px', backgroundColor: '#cbd5e1', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ width: '100%', height: '100px', backgroundColor: '#f1f5f9', borderRadius: '12px', animation: 'pulse 1.5s infinite', marginTop: '20px' }}></div>
          <div style={{ width: '50%', height: '60px', backgroundColor: '#e2e8f0', borderRadius: '12px', animation: 'pulse 1.5s infinite', marginTop: '20px' }}></div>
        </div>
      </div>
    </div>
  )
  if (!product) return <div style={{ padding: '60px', textAlign: 'center' }}>Product not found.</div>

  const activeSize = product.sizes && product.sizes.length > 0 ? product.sizes[selectedSizeIndex] : null;
  const currentDisplayPrice = activeSize ? activeSize.price : product.price;
  const originalDisplayPrice = activeSize ? activeSize.original_price : product.original_price;

  // Build image gallery array
  const allImages = [product.image_url, ...(product.additional_images || [])].filter(Boolean);
  const activeImageUrl = allImages.length > 0 ? allImages[activeImageIndex] : null;

  return (
    <div className="product-page">
      <Helmet>
        <title>{product.name} | FAIR DEAL TRADING AGENCY</title>
        <meta name="description" content={`Buy ${product.name} from FAIR DEAL TRADING AGENCY.`} />
      </Helmet>
      
      <div className="product-container">
        {/* Left Column - Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-placeholder" style={activeImageUrl ? { backgroundImage: `url(${activeImageUrl})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', transition: 'background-image 0.3s ease-in-out' } : {}}>
            {!activeImageUrl && (
              <>
                <span className="placeholder-icon">📦</span>
                <span className="placeholder-text">{product.name}</span>
              </>
            )}
          </div>
          
          {/* Thumbnails Strip */}
          {allImages.length > 1 && (
            <div className="thumbnail-strip" style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {allImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`thumbnail-item ${activeImageIndex === index ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    border: activeImageIndex === index ? '2px solid var(--color-primary-green)' : '2px solid transparent',
                    opacity: activeImageIndex === index ? 1 : 0.7,
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="product-info">
          
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/collections/all">Products</Link>
            <span>›</span>
            <span style={{ color: 'var(--color-text-primary)' }}>{product.name}</span>
          </div>

          <h1 className="product-title">{product.name}</h1>
          <p className="product-subtitle">{product.description ? (product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description) : 'Natural Ayurvedic Formula'}</p>

          <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="stars" style={{ color: '#f5b041', fontSize: '1.1rem' }}>★★★★★</span>
            <span className="reviews-count" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>4.9 (128 Reviews)</span>
          </div>

          <div className="divider"></div>

          <div className="product-price-section">
            <p className="mrp-label">MRP (Inclusive of taxes)</p>
            <div className="price-display">
              <span className="current-price">₹{Number(currentDisplayPrice).toFixed(2)}</span>
              {originalDisplayPrice && <span className="original-price">₹{Number(originalDisplayPrice).toFixed(2)}</span>}
            </div>
          </div>

          <div className="offers-strip" style={{ marginTop: '12px' }}>
            <div className="offer-item">
              <span className="offer-icon">🚚</span>
              <span>Free Delivery On All Orders Above ₹399</span>
            </div>
            <div className="offer-item">
              <span className="offer-icon">⚡</span>
              <span>Extra 10% Off on Prepaid</span>
            </div>
          </div>

          <div className="divider"></div>

          {/* Dynamic Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="benefits-grid">
              {product.benefits.map((benefit, i) => (
                <div className="benefit-item" key={i}>
                  <span className="benefit-icon">✨</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="size-selector" style={{marginTop: '24px'}}>
              <p className="selector-label">Choose Size</p>
              <div className="size-options">
                {product.sizes.map((size, index) => (
                  <div 
                    key={index}
                    className={`size-card ${selectedSizeIndex === index ? 'selected' : ''}`}
                    onClick={() => setSelectedSizeIndex(index)}
                    style={{
                      border: selectedSizeIndex === index ? '2px solid var(--color-primary-green)' : '1px solid var(--color-border-light)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: selectedSizeIndex === index ? '#f8faeb' : '#fff'
                    }}
                  >
                    <div style={{fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)'}}>{size.name}</div>
                    <div style={{fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-primary)'}}>
                      ₹{size.price} 
                      {size.original_price && <span style={{fontSize: '0.9rem', color: 'var(--color-text-muted)', textDecoration: 'line-through', marginLeft: '8px'}}>₹{size.original_price}</span>}
                    </div>
                    {size.volume && <div style={{fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px'}}>{size.volume}</div>}
                    {size.saveText && <div style={{fontSize: '0.85rem', color: 'var(--color-primary-green)', fontWeight: 600, marginTop: '8px'}}>{size.saveText}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="divider"></div>

          <div className="quantity-section">
            <p className="selector-label">Quantity</p>
            <div className="quantity-controls">
              <button onClick={() => handleQtyChange('dec')}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQtyChange('inc')}>+</button>
            </div>
          </div>

          <div className="action-buttons" style={{marginTop: '16px'}}>
            <button className="btn-add-to-cart" onClick={handleAddToCart} style={{width: '100%', border: '1px solid var(--color-primary-green)', background: 'white', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px'}}>
              <span className="btn-icon">🛒</span> ADD TO CART
            </button>
            <button className="btn-buy-now" onClick={() => { handleAddToCart(); /* add routing to checkout later if needed */ }} style={{width: '100%', background: 'var(--color-primary-green)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px'}}>
              BUY IT NOW
            </button>
            
            <div className="contact-buttons" style={{ display: 'flex', gap: '12px' }}>
              <a 
                href={`https://wa.me/917088711540?text=Hi, I am interested in knowing more about ${encodeURIComponent(product.name)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.371a9.993 9.993 0 004.779 1.216h.004c5.502 0 9.985-4.48 9.985-9.984C21.996 6.478 17.513 2 12.012 2z" fill="currentColor"/>
                  <path d="M17.472 14.38c-.274-.137-1.623-.8-1.874-.892-.251-.091-.434-.137-.617.137-.183.274-.71 .891-.87 1.074-.16.183-.321.205-.595.068-.274-.137-1.157-.426-2.203-1.358-.813-.726-1.36-1.624-1.52-1.898-.16-.274-.017-.423.12-.56.124-.124.274-.32.41-.48.138-.16.184-.274.276-.456.091-.183.045-.343-.023-.48-.069-.137-.617-1.486-.845-2.033-.222-.533-.448-.46-.617-.468-.16-.008-.342-.01-.525-.01-.183 0-.48.069-.731.343-.251.274-.96 .937-.96 2.285 0 1.348.983 2.651 1.12 2.834.137.183 1.933 2.949 4.678 4.133.652.282 1.162.451 1.558.577.654.208 1.25.178 1.718.108.528-.079 1.623-.663 1.851-1.303.228-.641.228-1.19.16-1.304-.069-.115-.251-.183-.525-.32z" fill="#FFF"/>
                </svg>
                WhatsApp
              </a>
              <a 
                href="tel:+917088711540" 
                className="btn-call"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Call Us
              </a>
            </div>
          </div>

          <div className="trust-badges">
            <div className="trust-badge">
              <span className="trust-badge-icon">🌿</span>
              <span>100%<br/>Natural</span>
            </div>
            <div className="trust-badge">
              <span className="trust-badge-icon">🧪</span>
              <span>Lab<br/>Tested</span>
            </div>
            <div className="trust-badge">
              <span className="trust-badge-icon">⚕️</span>
              <span>Ayush<br/>Certified</span>
            </div>
            <div className="trust-badge">
              <span className="trust-badge-icon">✅</span>
              <span>No Side<br/>Effects</span>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="accordion-section">
            <div className="accordion-item">
              <div className="accordion-header">
                Description
                <span>-</span>
              </div>
              <div className="accordion-content">
                {product.description || "Experience the pure essence of Ayurveda with this highly effective natural formula. Expertly crafted to support your daily wellness journey using ethically sourced herbs."}
              </div>
            </div>
            <div className="accordion-item">
              <div className="accordion-header">
                Key Ingredients
                <span>+</span>
              </div>
            </div>
            <div className="accordion-item">
              <div className="accordion-header">
                How to Use
                <span>+</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2 className="related-products-title">You May Also Like...</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <Link to={`/products/${relatedProduct.id}`} key={relatedProduct.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-card">
                  <div className="product-image-container" style={{backgroundColor: '#fff'}}>
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
                      {relatedProduct.original_price && <span className="original-price" style={{marginLeft: '8px', textDecoration: 'line-through', color: 'var(--color-text-muted)'}}>₹{relatedProduct.original_price}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Product
