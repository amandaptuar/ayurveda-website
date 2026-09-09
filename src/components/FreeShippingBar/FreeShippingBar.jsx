import React, { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import './FreeShippingBar.css'

const FREE_SHIPPING_THRESHOLD = 399

const FreeShippingBar = () => {
  const { cartItems, cartTotal } = useCart()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const hasItems = cartItems && cartItems.length > 0
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD

  useEffect(() => {
    if (hasItems && !dismissed) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setVisible(true), 300)
      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [hasItems, dismissed, cartTotal])

  // Reset dismissed state when cart becomes empty
  useEffect(() => {
    if (!hasItems) {
      setDismissed(false)
    }
  }, [hasItems])

  if (!hasItems || dismissed) return null

  return (
    <div className={`free-shipping-bar ${visible ? 'visible' : ''}`}>
      <button className="free-shipping-close" onClick={() => setDismissed(true)} aria-label="Dismiss">
        ✕
      </button>

      {isFreeShipping ? (
        <div className="free-shipping-content free-shipping-unlocked">
          <span className="free-shipping-icon">🎉</span>
          <span className="free-shipping-text">
            Yay! You've unlocked <strong>FREE Delivery!</strong>
          </span>
        </div>
      ) : (
        <div className="free-shipping-content">
          <span className="free-shipping-icon">🚚</span>
          <div className="free-shipping-info">
            <span className="free-shipping-text">
              Add <strong>₹{Math.ceil(remaining)}</strong> more for <strong>FREE Delivery!</strong>
            </span>
            <div className="free-shipping-progress-track">
              <div 
                className="free-shipping-progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FreeShippingBar
