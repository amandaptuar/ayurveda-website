import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import './Cart.css'

const Cart = () => {
  const { cartItems, cartTotal, loading, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user, setShowLoginModal } = useAuth()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const navigate = useNavigate()

  const subtotal = cartTotal
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50
  const total = subtotal + shipping

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
                <hr className="summary-divider" />
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>₹ {Number(total).toFixed(2)}</span>
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
