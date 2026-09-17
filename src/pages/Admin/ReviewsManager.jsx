import React, { useEffect, useState } from 'react';
import { fetchAllReviewsAdmin, deleteCustomerReview } from '../../services/reviewService';
import { toast } from 'react-hot-toast';
import { Star, MessageSquare, Trash2, User, CheckCircle } from 'lucide-react';
import './ReviewsManager.css';

const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchAllReviewsAdmin();
      setReviews(data || []);
    } catch (err) {
      toast.error('Failed to load customer reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer feedback?')) return;

    try {
      await deleteCustomerReview(id);
      toast.success('Feedback deleted successfully');
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter(r => Number(r.rating) === Number(filterRating));

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <div className="admin-reviews-manager">
      <div className="admin-header-actions" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="admin-title">Customer Reviews & Feedback</h1>
          <p style={{ color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
            View and manage customer reviews, ratings, and feedback submitted on your store.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="reviews-stats-grid">
        <div className="reviews-stat-card">
          <div className="reviews-stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="reviews-stat-value">{totalReviews}</div>
            <div className="reviews-stat-label">Total Customer Reviews</div>
          </div>
        </div>

        <div className="reviews-stat-card">
          <div className="reviews-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Star size={24} />
          </div>
          <div>
            <div className="reviews-stat-value">{avgRating} / 5.0</div>
            <div className="reviews-stat-label">Average Store Rating</div>
          </div>
        </div>

        <div className="reviews-stat-card">
          <div className="reviews-stat-icon" style={{ background: '#dcfce7', color: '#166534' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="reviews-stat-value">{reviews.filter(r => r.rating >= 4).length}</div>
            <div className="reviews-stat-label">Positive Feedback (4★ & 5★)</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontWeight: '600', color: 'var(--admin-text-primary)' }}>
          Filter by Rating:
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', '5', '4', '3', '2', '1'].map(stars => (
            <button
              key={stars}
              onClick={() => setFilterRating(stars)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--admin-border)',
                background: filterRating === stars ? 'var(--admin-primary)' : 'white',
                color: filterRating === stars ? 'white' : 'var(--admin-text-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {stars === 'all' ? 'All Ratings' : `${stars} ⭐`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Feedback & Comment</th>
                <th>Product / Topic</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading feedback...</td></tr>
              ) : filteredReviews.map((rev) => (
                <tr key={rev.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 'bold' }}>
                        <User size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--admin-text-primary)' }}>
                          {rev.customer_name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
                          {rev.customer_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="rating-stars">
                      {'★'.repeat(Number(rev.rating || 5))}
                      <span style={{ color: '#cbd5e1' }}>{'★'.repeat(5 - Number(rev.rating || 5))}</span>
                    </div>
                  </td>
                  <td>
                    <div className="comment-bubble">
                      "{rev.comment}"
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--admin-text-primary)' }}>
                      {rev.product_name || 'General Feedback'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>
                      {new Date(rev.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  <td>
                    <button className="delete-review-btn" onClick={() => handleDelete(rev.id)}>
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredReviews.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--admin-text-secondary)' }}>
                    <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <div>No customer feedback found in this section.</div>
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

export default ReviewsManager;
