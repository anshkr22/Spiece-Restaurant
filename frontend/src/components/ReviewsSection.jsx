import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, X } from 'lucide-react';
import { fetchReviews, createReview } from '../services/api';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await fetchReviews('approved');
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews from MySQL:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await createReview(form);
      if (res.data.success) {
        setMessage('Thank you! Your review has been submitted.');
        setForm({ name: '', rating: 5, comment: '' });
        loadReviews();
        setTimeout(() => {
          setShowModal(false);
          setMessage('');
        }, 2000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="reviews">
      <div className="section-tag" style={{ textAlign: 'left' }}>CUSTOMER REVIEWS</div>
      <h2 className="section-title" style={{ textAlign: 'left' }}>What Our Customers Say</h2>
      <div className="section-title-underline" style={{ margin: '8px 0 24px 0' }}></div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ color: 'var(--text-muted)' }}>No customer reviews yet. Be the first to review!</div>
      ) : (
        <div className="review-cards-list">
          {reviews.slice(0, 3).map((r) => (
            <div key={r.id} className="review-card">
              <img 
                src={r.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
                alt={r.name} 
                className="review-avatar"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'; }}
              />
              <div>
                <div className="review-name">{r.name}</div>
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < r.rating ? "#FFB300" : "none"} 
                      color={i < r.rating ? "#FFB300" : "#CBD5E1"} 
                      style={{ display: 'inline-block', marginRight: '2px' }}
                    />
                  ))}
                </div>
                <p className="review-comment">"{r.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Plus size={16} /> Write a Review
        </button>
        <button onClick={loadReviews} className="btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', padding: '8px 16px', fontSize: '0.85rem' }}>
          <MessageSquare size={16} /> View More Reviews
        </button>
      </div>

      {/* Write Review Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Write a Customer Review</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent' }}>
                <X size={22} />
              </button>
            </div>

            {message && (
              <div style={{ background: '#D1FAE5', color: '#059669', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Your Name *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  placeholder="e.g. Rahul Verma"
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rating (1 to 5 Stars) *</label>
                <select 
                  className="form-input" 
                  value={form.rating} 
                  onChange={(e) => setForm({...form, rating: parseInt(e.target.value, 10)})}
                >
                  <option value={5}>5 Stars - Outstanding ⭐⭐⭐⭐⭐</option>
                  <option value={4}>4 Stars - Very Good ⭐⭐⭐⭐</option>
                  <option value={3}>3 Stars - Good ⭐⭐⭐</option>
                  <option value={2}>2 Stars - Average ⭐⭐</option>
                  <option value={1}>1 Star - Poor ⭐</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Your Review / Feedback *</label>
                <textarea 
                  required 
                  rows={4} 
                  className="form-input" 
                  value={form.comment} 
                  onChange={(e) => setForm({...form, comment: e.target.value})} 
                  placeholder="Share your dining experience with us..."
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {submitting ? 'Submitting to MySQL...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
