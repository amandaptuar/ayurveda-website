import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import './Checkout.css'

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [addressData, setAddressData] = useState({
    full_name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip_code: ''
  })

  const subtotal = cartTotal
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50
  const total = subtotal + shipping

  useEffect(() => {
    if (!user) {
      toast.error('Please login to checkout')
      navigate('/cart')
      return
    }
    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }
    fetchSavedAddress()
  }, [user, cartItems])

  const fetchSavedAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setAddressData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || ''
        })
      }
    } catch (error) {
      // It's okay if no address exists yet
      console.log('No saved address found')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAddressData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Save or update address in user_addresses
      const { error: addressError } = await supabase
        .from('user_addresses')
        .insert([{
          user_id: user.id,
          ...addressData
        }])

      if (addressError) {
        console.warn('Could not save address to history', addressError)
      }

      // 2. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{ 
          user_id: user.id, 
          total_amount: total,
          customer_name: addressData.full_name,
          customer_phone: addressData.phone,
          shipping_address: addressData // Save as JSONB
        }])
        .select()
        .single()

      if (orderError) throw orderError

      // 3. Create order items
      const orderItems = cartItems.map(item => {
        const price = item.selected_size?.price ? Number(item.selected_size.price) : Number(item.products.price);
        return {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_time: price,
          selected_size: item.selected_size || null
        }
      })

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      toast.success('Order placed successfully!')
      clearCart()
      navigate(`/order-success/${order.id}`)
      
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        
        <form onSubmit={handlePlaceOrder} className="checkout-grid">
          {/* Left Column - Form */}
          <div className="checkout-form-section">
            <div className="checkout-section">
              <h2 className="checkout-section-title">Shipping Address</h2>
              
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="full_name" value={addressData.full_name} onChange={handleInputChange} required placeholder="John Doe" />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={addressData.phone} onChange={handleInputChange} required placeholder="+91 9876543210" />
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input type="text" name="street" value={addressData.street} onChange={handleInputChange} required placeholder="House No, Building, Street" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={addressData.city} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" value={addressData.state} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>PIN Code</label>
                  <input type="text" name="zip_code" value={addressData.zip_code} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h2 className="checkout-section-title">Payment Method</h2>
              <div style={{ padding: '16px', border: '1px solid var(--color-primary-green)', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="radio" checked readOnly style={{ accentColor: 'var(--color-primary-green)', transform: 'scale(1.2)' }} />
                <span style={{ fontWeight: '600', color: 'var(--color-primary-green)' }}>Cash on Delivery (COD)</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="checkout-summary-section">
            <div className="checkout-summary-card">
              <h2 className="checkout-summary-title">Order Summary</h2>
              
              <div className="summary-items">
                {cartItems.map(item => {
                  const itemPrice = item.selected_size?.price ? Number(item.selected_size.price) : Number(item.products?.price);
                  return (
                    <div key={item.id} className="summary-item">
                      <img src={item.products?.image_url || 'https://via.placeholder.com/60'} alt={item.products?.name} />
                      <div className="summary-item-details">
                        <div className="summary-item-name">{item.products?.name}</div>
                        <div style={{fontSize: '0.8rem', color: '#64748b'}}>Qty: {item.quantity} {item.selected_size?.name && `| Size: ${item.selected_size.name}`}</div>
                        <div style={{fontWeight: '700', marginTop: '4px'}}>₹ {(itemPrice * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹ {Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹ ${Number(shipping).toFixed(2)}`}</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>₹ {Number(total).toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
