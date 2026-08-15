import React from 'react';
import { CheckCircle, ShoppingBag, X } from 'lucide-react';

const OrderConfirmationModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ textAlign: 'center', maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: '64px', height: '64px', background: '#D1FAE5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
          <CheckCircle size={36} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
          Order Placed Successfully!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Your order has been saved into the MySQL database.
        </p>

        <div style={{ background: '#FAF8F5', padding: '16px', borderRadius: '12px', textAlign: 'left', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Order Number:</span>
            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{order.order_number || `#${order.id}`}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
            <span style={{ fontWeight: 600 }}>{order.customer_name || 'Valued Guest'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
            <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{(order.payment_method || 'cash_on_delivery').replace(/_/g, ' ')}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
            <span className={`badge badge-${order.payment_status || 'pending'}`}>
              {order.payment_status || 'Pending'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', marginTop: '10px', borderTop: '1px solid #E2E8F0', fontWeight: 800, fontSize: '1.05rem' }}>
            <span>Total Amount Paid:</span>
            <span style={{ color: 'var(--primary)' }}>₹{parseFloat(order.total_amount || 0).toFixed(2)}</span>
          </div>
        </div>

        <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Back to Home & Order Again
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
