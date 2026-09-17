import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Package, ExternalLink, Edit3, Plus, Truck, Check, X } from 'lucide-react';
import { createShadowfaxOrder, cancelShadowfaxOrder } from '../../services/shadowfaxService';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [editingAwbId, setEditingAwbId] = useState(null);
  const [editingAwbText, setEditingAwbText] = useState('');

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

  const saveAwbNumber = async (orderId) => {
    try {
      const cleanAwb = editingAwbText.trim();
      const { error } = await supabase
        .from('orders')
        .update({ tracking_number: cleanAwb || null })
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Shadowfax AWB Tracking Number updated!');
      setEditingAwbId(null);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update AWB Number');
      console.error(err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const targetOrder = orders.find(o => o.id === orderId);
      let updatePayload = { status: newStatus };

      // Trigger Shadowfax Cancellation API if order is cancelled by Admin
      if (newStatus === 'cancelled' && targetOrder && targetOrder.tracking_number) {
        await cancelShadowfaxOrder(targetOrder, 'Cancelled by Admin');
      }

      // If status shipped and has API response, attach AWB
      if (newStatus === 'shipped' && targetOrder && !targetOrder.tracking_number) {
        const sfResult = await createShadowfaxOrder(targetOrder);
        if (sfResult.success && sfResult.awbNumber) {
          updatePayload.tracking_number = sfResult.awbNumber;
        }
      }

      const { error } = await supabase
        .from('orders')
        .update(updatePayload)
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
                <th>Shadowfax AWB</th>
                <th>Items Ordered</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>Loading orders...</td></tr>
              ) : filteredOrders.map((order) => {
                const awbCode = order.tracking_number || `SFX-${order.id.replace(/-/g, '').slice(0, 10).toUpperCase()}`;
                return (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--admin-text-primary)', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      #{order.id.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: '600' }}>{order.customer_name || 'Unknown Name'}</span>
                      {order.profiles?.email && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>📧 {order.profiles.email}</span>
                      )}
                      {order.customer_phone && <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>📞 {order.customer_phone}</span>}
                      
                      {order.shipping_address && (
                        <div style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--admin-text-secondary)', background: '#f1f5f9', padding: '6px', borderRadius: '4px', lineHeight: '1.4' }}>
                          <div>{order.shipping_address.street}</div>
                          <div>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.zip_code}</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {editingAwbId === order.id ? (
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        padding: '10px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        minWidth: '180px'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                          ENTER SHADOWFAX AWB
                        </div>
                        <input
                          type="text"
                          value={editingAwbText}
                          onChange={(e) => setEditingAwbText(e.target.value)}
                          placeholder="e.g. SFX10293847"
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #2563eb',
                            fontSize: '0.85rem',
                            fontFamily: 'monospace',
                            outline: 'none',
                            marginBottom: '8px'
                          }}
                          autoFocus
                        />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => saveAwbNumber(order.id)}
                            style={{
                              flex: 1,
                              background: '#2563eb',
                              color: 'white',
                              border: 'none',
                              padding: '6px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <Check size={13} /> Save
                          </button>
                          <button
                            onClick={() => setEditingAwbId(null)}
                            style={{
                              background: '#f1f5f9',
                              color: '#64748b',
                              border: '1px solid #cbd5e1',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '170px' }}>
                        {order.tracking_number ? (
                          <div style={{
                            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                            border: '1px solid #bbf7d0',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#15803d', letterSpacing: '0.5px' }}>
                                ⚡ SHADOWFAX
                              </span>
                              <button
                                onClick={() => {
                                  setEditingAwbId(order.id);
                                  setEditingAwbText(order.tracking_number || '');
                                }}
                                style={{ background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer', padding: '0' }}
                                title="Edit AWB Number"
                              >
                                <Edit3 size={13} />
                              </button>
                            </div>
                            <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#0f172a', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                              {order.tracking_number}
                            </span>
                            <a 
                              href={`https://tracker.shadowfax.in/track?awb=${order.tracking_number}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: '#15803d',
                                textDecoration: 'none',
                                marginTop: '2px'
                              }}
                            >
                              Track Live <ExternalLink size={12} />
                            </a>
                          </div>
                        ) : (
                          <div style={{
                            background: '#f8fafc',
                            border: '1px dashed #cbd5e1',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            alignItems: 'flex-start'
                          }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Truck size={14} /> Unassigned AWB
                            </span>
                            <button
                              onClick={() => {
                                setEditingAwbId(order.id);
                                setEditingAwbText('');
                              }}
                              style={{
                                background: '#2563eb',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '2px'
                              }}
                            >
                              <Plus size={13} /> Set AWB Number
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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
              );
            })}
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
