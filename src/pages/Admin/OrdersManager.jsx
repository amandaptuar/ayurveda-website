import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Package } from 'lucide-react';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (email),
          order_items (
            id,
            quantity,
            price_at_time,
            selected_size,
            products (name, image_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  const filteredOrders = selectedDate 
    ? orders.filter(order => order.created_at.startsWith(selectedDate))
    : orders;

  return (
    <div>
      <div className="admin-header-actions" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="admin-title">Manage Orders</h1>
          <p style={{color: 'var(--admin-text-secondary)', marginTop: '8px'}}>View customer orders, details, and update delivery status.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--admin-text-secondary)' }}>Filter by Date:</label>
          <input 
            type="date" 
            className="admin-input" 
            style={{ padding: '6px 12px', minWidth: '150px' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate && (
            <button 
              onClick={() => setSelectedDate('')} 
              style={{ background: 'transparent', border: 'none', color: 'var(--admin-primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID & Date</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>Loading orders...</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--admin-text-primary)' }}>
                      #{order.id.split('-')[0].toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: '600' }}>{order.customer_name || 'Unknown Name'}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>{order.profiles?.email || 'Unknown Email'}</span>
                      {order.customer_phone && <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>📞 {order.customer_phone}</span>}
                      
                      {order.shipping_address && (
                        <div style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--admin-text-secondary)', background: '#f1f5f9', padding: '6px', borderRadius: '4px', lineHeight: '1.4' }}>
                          <div>{order.shipping_address.street}</div>
                          <div>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.zip_code}</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.order_items?.map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           {item.products?.image_url ? (
                            <img src={item.products.image_url} alt="" style={{width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)'}} />
                           ) : (
                            <div style={{width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '4px'}}></div>
                           )}
                           <div>
                             <div style={{fontSize: '0.9rem', fontWeight: '500'}}>{item.products?.name || 'Deleted Product'}</div>
                             <div style={{fontSize: '0.8rem', color: 'var(--admin-text-secondary)'}}>
                               Qty: {item.quantity} 
                               {item.selected_size?.name ? ` • Size: ${item.selected_size.name}` : ''} 
                               {` • ₹${item.price_at_time}`}
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--admin-text-primary)', fontSize: '1.1rem' }}>
                      ₹{Number(order.total_amount).toFixed(2)}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="admin-input"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ padding: '8px', minWidth: '130px', fontWeight: '600' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Order Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--admin-text-secondary)' }}>
                    <ShoppingCart size={48} style={{opacity: 0.2, marginBottom: '16px'}} />
                    <div>{selectedDate ? `No orders found on ${selectedDate}.` : 'No orders found yet.'}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersManager;
