import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X, Scissors } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './CouponsManager.css';

const CouponsManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      toast.error('Failed to fetch coupons. Make sure you ran the SQL migration!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        is_active: coupon.is_active
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const couponData = {
        code: formData.code.toUpperCase().trim(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        is_active: formData.is_active
      };

      if (!couponData.code || isNaN(couponData.discount_value) || couponData.discount_value <= 0) {
          throw new Error("Please enter a valid code and discount value.");
      }

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);
          
        if (error) throw error;
        toast.success('Coupon updated successfully');
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([couponData]);
          
        if (error) {
            if (error.code === '23505') {
                throw new Error("Coupon code already exists!");
            }
            throw error;
        }
        toast.success('Coupon created successfully');
      }

      handleCloseModal();
      fetchCoupons();
    } catch (error) {
      toast.error(error.message || 'Failed to save coupon');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
      console.error(error);
    }
  };

  return (
    <div className="coupons-manager">
      <div className="coupons-header">
        <h1>Coupons</h1>
        <button className="btn-add-coupon" onClick={() => handleOpenModal()}>
          <Plus size={20} /> Create Coupon
        </button>
      </div>

      <div className="coupons-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Scissors size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#334155', marginBottom: '8px' }}>No Coupons Found</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Create your first discount code to offer savings to your customers.</p>
            <button className="btn-add-coupon" onClick={() => handleOpenModal()} style={{ margin: '0 auto' }}>
              <Plus size={20} /> Create Coupon
            </button>
          </div>
        ) : (
          <div className="coupons-grid">
            {coupons.map((coupon) => (
              <div className="coupon-card" key={coupon.id}>
                <div className="coupon-card-inner">
                  <div className="coupon-top">
                    <div>
                      <div className="coupon-value">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                      </div>
                      <div className="coupon-type">
                        {coupon.discount_type === 'percentage' ? 'OFF' : 'FLAT OFF'}
                      </div>
                    </div>
                    <span className={`coupon-status ${coupon.is_active ? 'status-active' : 'status-inactive'}`}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="coupon-divider"></div>

                  <div className="coupon-code-container">
                    <span className="coupon-code">{coupon.code}</span>
                    <Scissors size={20} color="#94a3b8" />
                  </div>

                  <div className="coupon-actions">
                    <button className="action-btn" onClick={() => handleOpenModal(coupon)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(coupon.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="coupon-modal-overlay" onClick={handleCloseModal}>
          <div className="coupon-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g. SUMMER25"
                    style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}
                  />
                </div>

                <div className="form-group">
                  <label>Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                    placeholder={formData.discount_type === 'percentage' ? "e.g. 10 for 10%" : "e.g. 100 for ₹100"}
                  />
                </div>

                <div className="form-group toggle-group">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  <label htmlFor="isActive">Coupon is Active</label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsManager;
