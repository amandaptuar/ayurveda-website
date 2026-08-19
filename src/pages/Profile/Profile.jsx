import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Mail, MapPin } from 'lucide-react'
import './Profile.css'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('info')
  const [address, setAddress] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    
    fetchProfileData()

    // Subscribe to realtime order updates for this specific user
    const orderSubscription = supabase
      .channel('custom-update-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
        (payload) => {
          // Re-fetch data when the admin updates the status
          fetchProfileData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(orderSubscription)
    }
  }, [user, navigate])

  const fetchProfileData = async () => {
    setLoading(true)
    try {
      // Fetch latest address
      const { data: addressData } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        
      if (addressData) setAddress(addressData)

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_time,
            products (name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!ordersError && ordersData) {
        setOrders(ordersData)
      }
      
    } catch (error) {
      console.error('Error fetching profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orderId);
          
        if (error) throw error;
        
        alert('Order cancelled successfully.');
        fetchProfileData();
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout()
      navigate('/')
    }
  }

  if (!user) return null

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-header">
            <div className="user-avatar-large">
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-email-display">
              {user.email}
            </div>
          </div>
          
          <div className="sidebar-nav">
            <button 
              className={`profile-nav-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Account Info
            </button>
            <button 
              className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Order History
            </button>
            
            <button className="profile-nav-btn btn-logout" onClick={handleLogout}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading your profile...</div>
          ) : (
            <>
              {activeTab === 'info' && (
                <div className="profile-section">
                  <h2 className="profile-section-title">Account Settings</h2>
                  
                  <div className="profile-cards-grid">
                    <div className="modern-profile-card">
                      <div className="card-icon-wrapper">
                        <Mail size={24} color="#16a34a" />
                      </div>
                      <div className="card-content">
                        <h3>Email Address</h3>
                        <p>{user.email}</p>
                      </div>
                    </div>

                    <div className="modern-profile-card">
                      <div className="card-icon-wrapper">
                        <MapPin size={24} color="#16a34a" />
                      </div>
                      <div className="card-content">
                        <h3>Default Shipping Address</h3>
                        {address ? (
                          <>
                            <p className="highlight-name">{address.full_name}</p>
                            <p className="address-details">
                              📞 {address.phone}<br />
                              📍 {address.street}<br />
                              {address.city}, {address.state} - {address.zip_code}
                            </p>
                          </>
                        ) : (
                          <div className="empty-state-address">
                            <p>No saved address found.</p>
                            <Link to="/collections/all">Shop now to save an address</Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="profile-section">
                  <h2 className="profile-section-title">Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div className="info-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛍️</div>
                      <h3 style={{ marginBottom: '8px' }}>No orders yet</h3>
                      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>You haven't placed any orders with us yet.</p>
                      <Link to="/collections/all" className="view-receipt-btn" style={{ padding: '12px 24px' }}>Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {orders.map(order => (
                        <div key={order.id} className="order-card">
                          <div className="order-card-header">
                            <div className="order-id-group">
                              <span className="order-id">#{order.id.split('-')[0].toUpperCase()}</span>
                              <span className="order-date">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className={`order-status status-${order.status || 'pending'}`} style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              textTransform: 'capitalize',
                              backgroundColor: order.status === 'delivered' ? '#dcfce7' : 
                                               order.status === 'shipped' ? '#e0e7ff' : 
                                               order.status === 'cancelled' ? '#fee2e2' : 
                                               order.status === 'confirmed' ? '#dbeafe' : '#fef3c7',
                              color: order.status === 'delivered' ? '#166534' : 
                                     order.status === 'shipped' ? '#3730a3' : 
                                     order.status === 'cancelled' ? '#991b1b' : 
                                     order.status === 'confirmed' ? '#1e40af' : '#92400e',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              {order.status === 'delivered' && '✅'}
                              {order.status === 'shipped' && '🚚'}
                              {order.status === 'pending' && '⏳'}
                              {order.status === 'cancelled' && '❌'}
                              {order.status === 'confirmed' && '👍'}
                              {order.status || 'pending'}
                            </div>
                          </div>
                          
                          {order.status === 'cancelled' ? (
                            <div className="cancelled-alert">
                              <p>Order Cancelled</p>
                            </div>
                          ) : (
                            <div className="order-tracking-container">
                              <div className="expected-delivery">
                                {order.status === 'delivered' ? 'Delivered on ' : 'Arriving '}
                                <span>
                                  {new Date(new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              
                              <div className="tracking-timeline">
                                <div className="tracking-progress-bar" style={{ 
                                  width: order.status === 'delivered' ? '100%' : 
                                         order.status === 'shipped' ? '66%' : 
                                         order.status === 'confirmed' ? '33%' : '0%' 
                                }}></div>
                                
                                <div className={`tracking-step ${order.status !== 'cancelled' ? 'active' : ''}`}>
                                  <div className="step-dot"></div>
                                  <span className="step-label">Ordered</span>
                                </div>
                                <div className={`tracking-step ${['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                                  <div className="step-dot"></div>
                                  <span className="step-label">Processing</span>
                                </div>
                                <div className={`tracking-step ${['shipped', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                                  <div className="step-dot"></div>
                                  <span className="step-label">Shipped</span>
                                </div>
                                <div className={`tracking-step ${order.status === 'delivered' ? 'active' : ''}`}>
                                  <div className="step-dot"></div>
                                  <span className="step-label">Delivered</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="order-card-body">
                            <div className="order-items-preview">
                              {order.order_items && order.order_items.map((item, idx) => (
                                <div key={idx} className="order-item-mini">
                                  <span>{item.quantity}x {item.products?.name}</span>
                                  <span>₹{(item.price_at_time * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="order-card-footer">
                            <div>
                              <span className="order-total-label">Total Amount: </span>
                              <span className="order-total-value">₹{Number(order.total_amount).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              {(order.status === 'pending' || order.status === 'confirmed') && (
                                <button 
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="view-receipt-btn" 
                                  style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer' }}
                                >
                                  Cancel Order
                                </button>
                              )}
                              <Link to={`/order-success/${order.id}`} className="view-receipt-btn">View Receipt</Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default Profile
