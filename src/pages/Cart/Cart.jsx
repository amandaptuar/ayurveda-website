import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Cart.css'

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Diabic Care Juice',
      price: 457,
      originalPrice: 459,
      image: '/home-page-img/00993d27-94d5-4499-83aa-c650da60507c.jpg',
      quantity: 1,
      category: 'DIABETIC WELLNESS'
    },
    {
      id: 2,
      name: 'Freshoeaze Powder',
      price: 299,
      originalPrice: 350,
      image: '/home-page-img/004ee39d-f838-4cc9-8c4e-a6d8aaba44dc.jpg',
      quantity: 2,
      category: 'DIGESTIVE WELLNESS'
    }
  ])

  const updateQuantity = (id, change) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }
      }
      return item
    }))
  }

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + shipping

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is currently empty.</h2>
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
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-product">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-item-details">
                        <span className="cart-item-category">{item.category}</span>
                        <h3 className="cart-item-name">{item.name}</h3>
                        <div className="cart-item-price">
                          <span className="price-current">₹ {item.price}</span>
                          <span className="price-original">₹ {item.originalPrice}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="cart-item-quantity">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <button className="remove-item-btn" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                    
                    <div className="cart-item-total">
                      ₹ {item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="cart-summary-section">
              <div className="cart-summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹ {subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹ ${shipping}`}</span>
                </div>
                <hr className="summary-divider" />
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>₹ {total}</span>
                </div>
                <button className="checkout-btn">Proceed to Checkout</button>
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
