import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import logoImg from '../../assets/image.png'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_time,
            selected_size,
            products (name)
          )
        `)
        .eq('id', orderId)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orderId);
          
        if (error) throw error;
        
        alert('Order cancelled successfully.');
        fetchOrderDetails();
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
      }
    }
  }

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading your receipt...</div>
  
  if (!order) return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h2>Order not found</h2>
      <Link to="/" style={{ color: 'var(--color-primary-green)' }}>Return to Home</Link>
    </div>
  )

  const address = order.shipping_address || {}
  const orderNumber = order.id.split('-')[0].toUpperCase()

  // Calculate subtotal from items if available (fallback to total if not)
  let subtotal = 0;
  if (order.order_items && order.order_items.length > 0) {
    subtotal = order.order_items.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);
  } else {
    subtotal = order.total_amount > 50 ? order.total_amount - 50 : order.total_amount; // Rough estimate of shipping
  }
  const shipping = Number(order.total_amount) - subtotal;

  return (
    <div className="order-success-page">
      <div className="order-actions no-print">
        <div className="success-message">
          <div className="success-icon-small">✓</div>
          <h2>Order Confirmed!</h2>
        </div>
        <p>Thank you for shopping with us.</p>
        <div className="action-buttons-group">
          {(order.status === 'pending' || order.status === 'confirmed') && (
            <button 
              onClick={handleCancelOrder} 
              className="continue-btn-outline"
              style={{ borderColor: '#fee2e2', color: '#991b1b', backgroundColor: '#fee2e2' }}
            >
              Cancel Order
            </button>
          )}
          <button onClick={handlePrint} className="print-btn">
            Download PDF Receipt
          </button>
          <Link to="/collections/all" className="continue-btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="receipt-container" id="printable-receipt">
        <div className="receipt-header">
          <img src={logoImg} alt="Logo" className="receipt-logo" />
          <h2>FAIR DEAL TRADING AGENCY</h2>
          <p>Ayurvedic Health & Wellness</p>
          <div className="receipt-divider"></div>
          <h3>TAX INVOICE / RECEIPT</h3>
        </div>

        <div className="receipt-meta">
          <div>
            <span className="meta-label">Order No:</span>
            <span className="meta-value">#{orderNumber}</span>
          </div>
          <div>
            <span className="meta-label">Date:</span>
            <span className="meta-value">{new Date(order.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="receipt-divider"></div>

        <div className="receipt-customer">
          <div className="meta-label" style={{marginBottom: '4px'}}>Billed To:</div>
          <strong>{order.customer_name || 'Customer'}</strong>
          {order.customer_phone && <div>{order.customer_phone}</div>}
          {address.street && (
            <div>
              {address.street}<br/>
              {address.city}, {address.state} - {address.zip_code}
            </div>
          )}
        </div>

        <div className="receipt-divider"></div>

        <table className="receipt-table">
          <thead>
            <tr>
              <th style={{textAlign: 'left'}}>ITEM</th>
              <th style={{textAlign: 'center'}}>QTY</th>
              <th style={{textAlign: 'right'}}>PRICE</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item, index) => (
              <tr key={index}>
                <td style={{textAlign: 'left'}}>
                  <div className="item-name">{item.products?.name || 'Product'}</div>
                  {item.selected_size?.name && <div className="item-size">Size: {item.selected_size.name}</div>}
                </td>
                <td style={{textAlign: 'center'}}>{item.quantity}</td>
                <td style={{textAlign: 'right'}}>₹{Number(item.price_at_time * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="receipt-divider"></div>

        <div className="receipt-totals">
          <div className="total-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Shipping</span>
            <span>{shipping > 0 ? `₹${shipping.toFixed(2)}` : 'FREE'}</span>
          </div>
          <div className="total-row">
            <span>Payment Method</span>
            <span>Cash on Delivery</span>
          </div>
          <div className="total-row grand-total">
            <span>TOTAL</span>
            <span>₹{Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        <div className="receipt-divider"></div>

        <div className="receipt-footer">
          <p>Thank you for your business!</p>
          <p style={{fontSize: '0.75rem', marginTop: '4px', color: '#888'}}>For support, contact us at info@fairdealtrading.com</p>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
