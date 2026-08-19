import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import './Cart.css'

const Cart = () => {
  const { cartItems, cartTotal, loading, updateQuantity, removeFromCart, clearCart, appliedCoupon, setAppliedCoupon } = useCart()
  const { user, setShowLoginModal } = useAuth()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [couponInput, setCouponInput] = useState(appliedCoupon ? appliedCoupon.code : '')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const navigate = useNavigate()

  const subtotal = cartTotal
  const shipping = subtotal > 399 || subtotal === 0 ? 0 : 50

  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discount = subtotal * (appliedCoupon.discount_value / 100)
    } else {
      discount = appliedCoupon.discount_value
    }
    if (discount > subtotal) discount = subtotal
  }

  const total = subtotal + shipping - discount

  const handleApplyCoupon = async () => {
    if (!couponInput) return
    setIsApplyingCoupon(true)
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponInput.toUpperCase().trim())
        .eq('is_active', true)
        .single()
        
      if (error || !data) {
        toast.error('Invalid or expired coupon code')
        setAppliedCoupon(null)
      } else {
        setAppliedCoupon(data)
        toast.success('Coupon applied successfully!')
      }
    } catch (err) {
      toast.error('Error applying coupon')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput('')
  }

  const handleCheckout = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (cartItems.length === 0) return

    navigate('/checkout')
  }

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading your cart...</div>

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Your Cart</h1>
        
        {(!cartItems || cartItems.length === 0) ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is currently empty.</h2>
            {!user && <p style={{ marginBottom: '20px', color: '#64748b' }}>Please login to view or add items to your cart.</p>}
            <Link to="/collections/all" className="continue-shopping-btn">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <span className="col-product">Product</span>
                <span className="col-quantity">Quantity</span>
                <span className="col-total">Total</span>
              </div>
              
              <div className="cart-items-list">
                {cartItems.map(item => {
                  const itemPrice = item.selected_size?.price ? Number(item.selected_size.price) : Number(item.products?.price);
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-product">
                        <div className="cart-item-image">
                          {item.products?.image_url ? (
                             <img src={item.products.image_url} alt={item.products.name} />
                          ) : (
                             <div style={{width: '100%', height: '100%', backgroundColor: '#e2e8f0', borderRadius: '8px'}}></div>
                          )}
                        </div>
                        <div className="cart-item-details">
                          <span className="cart-item-category">WELLNESS</span>
                          <h3 className="cart-item-name">{item.products?.name}</h3>
                          {item.selected_size?.name && (
                            <div style={{fontSize: '0.85rem', color: '#64748b', marginTop: '4px'}}>
                              Size: {item.selected_size.name}
                            </div>
                          )}
                          <div className="cart-item-price">
                            <span className="price-current">₹ {itemPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="cart-item-quantity">
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                      
                      <div className="cart-item-total">
                        ₹ {(itemPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="cart-summary-section">
              <div className="cart-summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹ {Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹ ${Number(shipping).toFixed(2)}`}</span>
                </div>
                {appliedCoupon && (
                  <div className="summary-row" style={{ color: 'var(--color-primary-green)' }}>
                    <span>Discount ({appliedCoupon.code}) <button onClick={handleRemoveCoupon} style={{background:'none',border:'none',color:'red',cursor:'pointer',fontSize:'0.8rem',marginLeft:'4px'}}>✕</button></span>
                    <span>-₹ {Number(discount).toFixed(2)}</span>
                  </div>
                )}
                <hr className="summary-divider" />
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>₹ {Number(total).toFixed(2)}</span>
                </div>

                <div className="cart-coupon-section" style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Coupon Code" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', textTransform: 'uppercase' }}
                      disabled={appliedCoupon !== null}
                    />
                    {!appliedCoupon && (
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponInput}
                        style={{ padding: '10px 16px', background: 'var(--color-primary-green)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  className="checkout-btn" 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                <div className="secure-checkout">
                  <span>🔒 Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
