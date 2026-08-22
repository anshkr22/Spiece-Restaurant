import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';
import MenuSection from './components/MenuSection';
import GallerySection from './components/GallerySection';
import AboutSection from './components/AboutSection';
import ReviewsSection from './components/ReviewsSection';
import ReservationSection from './components/ReservationSection';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import { fetchMe } from './services/api';

function App() {
  const [view, setView] = useState('customer'); // 'customer', 'admin_login', 'admin_dashboard'
  const [adminUser, setAdminUser] = useState(null);

  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('spice_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmationOrder, setConfirmationOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('spice_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const token = localStorage.getItem('spice_token');
    const user = localStorage.getItem('spice_user');
    if (token && user) {
      setAdminUser(JSON.parse(user));
      // Validate token with backend
      fetchMe()
        .then((res) => {
          if (res.data && res.data.success) {
            setAdminUser(res.data.user);
          } else {
            handleLogout();
          }
        })
        .catch(() => {
          handleLogout();
        });
    }

    const checkHash = () => {
      const activeToken = localStorage.getItem('spice_token');
      if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
        if (activeToken) setView('admin_dashboard');
        else setView('admin_login');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('spice_token');
    localStorage.removeItem('spice_user');
    setAdminUser(null);
    if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
      setView('admin_login');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = (dish) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === dish.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...dish, quantity: 1 }];
    });
    showToast(`Added "${dish.name}" to cart! 🛒`);
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
    } else {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleOrderSuccess = (createdOrder) => {
    setCartItems([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setConfirmationOrder(createdOrder);
  };

  if (view === 'admin_login') {
    return (
      <AdminLogin 
        onLoginSuccess={(user) => {
          setAdminUser(user);
          setView('admin_dashboard');
        }}
        onBackToSite={() => setView('customer')}
      />
    );
  }

  if (view === 'admin_dashboard') {
    return (
      <AdminDashboard 
        onLogout={() => {
          localStorage.removeItem('spice_token');
          localStorage.removeItem('spice_user');
          setAdminUser(null);
          setView('customer');
        }}
        onReturnToSite={() => setView('customer')}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          background: 'var(--primary)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '30px',
          fontWeight: 700,
          boxShadow: '0 10px 30px rgba(230,81,0,0.4)',
          zIndex: 4000,
          fontSize: '0.9rem'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Sticky Header Navbar */}
      <Navbar 
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        onOpenAdmin={() => {
          if (adminUser) setView('admin_dashboard');
          else setView('admin_login');
        }}
      />

      {/* Main Hero Section */}
      <Hero 
        onExploreClick={() => {
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onBookClick={() => {
          const el = document.getElementById('reservations');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4 Feature Cards */}
      <FeatureCards />

      {/* Menu Section (MySQL Powered) */}
      <MenuSection onAddToCart={handleAddToCart} />

      {/* Split Section: Food Gallery & About Us */}
      <section className="split-section">
        <div className="container split-grid">
          <GallerySection />
          <AboutSection />
        </div>
      </section>

      {/* Reviews & Reservation Section */}
      <section className="reviews-booking-section">
        <div className="container reviews-grid">
          <ReviewsSection />
          <ReservationSection />
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenAdmin={() => {
        if (adminUser) setView('admin_dashboard');
        else setView('admin_login');
      }} />

      {/* Floating Spice Garden Chatbot */}
      <Chatbot 
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal 
        isOpen={!!confirmationOrder}
        onClose={() => setConfirmationOrder(null)}
        order={confirmationOrder}
      />
    </div>
  );
}

export default App;
