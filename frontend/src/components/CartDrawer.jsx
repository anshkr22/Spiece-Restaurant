import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% GST
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3 style={{ fontSize: '1.2rem' }}>Your Food Order ({cartItems.length})</h3>
          <button onClick={onClose} style={{ background: 'transparent', color: 'white' }}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛒</div>
              <p>Your cart is empty.</p>
              <p style={{ fontSize: '0.85rem' }}>Add delicious items from the menu to get started!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'} 
                  alt={item.name} 
                  className="cart-item-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'; }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">₹{parseFloat(item.price).toFixed(0)}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="cart-qty-btn">
                    <Minus size={14} />
                  </button>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', width: '18px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="cart-qty-btn">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => onRemoveItem(item.id)} style={{ background: 'transparent', color: '#EF4444', marginLeft: '6px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={onProceedToCheckout} 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '12px' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
