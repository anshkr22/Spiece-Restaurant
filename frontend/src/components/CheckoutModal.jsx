import React, { useState } from 'react';
import { X, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from '../services/api';

const CheckoutModal = ({ isOpen, onClose, cartItems, onOrderSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    order_type: 'delivery',
    payment_method: 'cash_on_delivery'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.05;
  const deliveryFee = form.order_type === 'delivery' ? 40 : 0;
  const total = subtotal + tax + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create order in MySQL database via Express API
      const orderPayload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        order_type: form.order_type,
        payment_method: form.payment_method,
        items: cartItems,
        subtotal,
        tax,
        delivery_fee: deliveryFee,
        total_amount: total
      };

      const res = await createOrder(orderPayload);

      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to place order');
      }

      const createdOrder = res.data.order;

      // 2. If Payment Method is Online Payment (Razorpay Test Mode)
      if (form.payment_method === 'online_payment') {
        try {
          const rzpRes = await createRazorpayOrder(total, createdOrder.id);
          const { key, order: rzpOrder, isMock } = rzpRes.data;

          if (window.Razorpay && !isMock && key && !key.includes('placeholder')) {
            const options = {
              key,
              amount: rzpOrder.amount,
              currency: rzpOrder.currency,
              name: "Spice Garden Restaurant",
              description: `Order #${createdOrder.order_number}`,
              image: "https://images.unsplash.com/photo-1603072245870-5ca87af7a814?auto=format&fit=crop&w=300&q=80",
              order_id: rzpOrder.id,
              handler: async function (response) {
                try {
                  const verifyRes = await verifyRazorpayPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    order_id: createdOrder.id
                  });

                  if (verifyRes.data && verifyRes.data.success) {
                    onOrderSuccess({ ...createdOrder, payment_status: 'paid', order_status: 'confirmed' });
                  } else {
                    setError('Payment verification failed. Signature mismatched.');
                  }
                } catch (vErr) {
                  setError('Payment signature verification error. Please contact support.');
                }
              },
              modal: {
                ondismiss: function () {
                  setError(`Payment window closed. Order #${createdOrder.order_number} is pending. You can retry payment or choose Cash on Delivery.`);
                }
              },
              prefill: {
                name: form.name,
                email: form.email,
                contact: form.phone
              },
              theme: { color: "#E65100" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (resp) {
              setError(`Payment Failed: ${resp.error?.description || 'Transaction declined.'}`);
            });
            rzp.open();
          } else {
            // Test Mode Fallback Simulation (when local .env key is not set or mock mode)
            await verifyRazorpayPayment({
              razorpay_order_id: rzpOrder.id,
              razorpay_payment_id: `pay_test_${Date.now()}`,
              razorpay_signature: 'test_signature',
              order_id: createdOrder.id
            });
            onOrderSuccess({ ...createdOrder, payment_status: 'paid', order_status: 'confirmed' });
          }
        } catch (rzpErr) {
          setError('Could not initialize Razorpay checkout. Proceeding with order as pending.');
          onOrderSuccess(createdOrder);
        }
      } else {
        // Cash on delivery
        onOrderSuccess(createdOrder);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to complete checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Checkout & Order Details</h3>
          <button onClick={onClose} style={{ background: 'transparent' }}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Customer Name *</label>
            <input 
              type="text" 
              required 
              className="form-input" 
              value={form.name} 
              onChange={(e) => setForm({...form, name: e.target.value})} 
              placeholder="e.g. Rohit Sharma"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone Number *</label>
              <input 
                type="tel" 
                required 
                className="form-input" 
                value={form.phone} 
                onChange={(e) => setForm({...form, phone: e.target.value})} 
                placeholder="+91 9876543210"
              />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})} 
                placeholder="customer@gmail.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Order Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {['delivery', 'pickup', 'dine_in'].map((type) => (
                <button
                  type="button"
                  key={type}
                  className={`filter-btn ${form.order_type === type ? 'active' : ''}`}
                  onClick={() => setForm({...form, order_type: type})}
                  style={{ textTransform: 'capitalize', fontSize: '0.8rem', padding: '8px 4px' }}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {form.order_type === 'delivery' && (
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Delivery Address *</label>
              <textarea 
                required 
                rows={2} 
                className="form-input" 
                value={form.address} 
                onChange={(e) => setForm({...form, address: e.target.value})} 
                placeholder="Flat/House No., Street, Landmark, City"
              />
            </div>
          )}

          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment Method *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`filter-btn ${form.payment_method === 'cash_on_delivery' ? 'active' : ''}`}
                onClick={() => setForm({...form, payment_method: 'cash_on_delivery'})}
                style={{ fontSize: '0.8rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <DollarSign size={16} /> Cash on Delivery
              </button>
              <button
                type="button"
                className={`filter-btn ${form.payment_method === 'online_payment' ? 'active' : ''}`}
                onClick={() => setForm({...form, payment_method: 'online_payment'})}
                style={{ fontSize: '0.8rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <CreditCard size={16} /> Razorpay (Online)
              </button>
            </div>
          </div>

          {/* Payment Summary Box */}
          <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Items Total ({cartItems.length} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>GST & Taxes (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>Delivery Charges</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #E2E8F0', color: 'var(--primary)' }}>
              <span>Total Payable</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}>
            {loading ? 'Saving Order to MySQL...' : 'Place Order Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
