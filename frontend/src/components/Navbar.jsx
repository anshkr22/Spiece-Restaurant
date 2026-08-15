import React, { useState } from 'react';
import { ShoppingBag, Phone, Menu, X, Utensils, UserCheck } from 'lucide-react';

const Navbar = ({ cartCount, onOpenCart, onOpenAdmin, onBookTableClick }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrollToSection = (id) => {
    setDrawerOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="brand-logo">
          <div className="brand-logo-icon">
            🌶️
          </div>
          <div className="brand-text">
            <span className="brand-title">Spice Garden</span>
            <span className="brand-subtitle">RESTAURANT</span>
          </div>
        </a>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="nav-link">Home</a></li>
          <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }} className="nav-link">Menu</a></li>
          <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="nav-link">About Us</a></li>
          <li><a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }} className="nav-link">Gallery</a></li>
          <li><a href="#reservations" onClick={(e) => { e.preventDefault(); scrollToSection('reservations'); }} className="nav-link">Reservations</a></li>
          <li><a href="#reviews" onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }} className="nav-link">Reviews</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="nav-link">Contact</a></li>
        </ul>

        {/* Right CTA Actions */}
        <div className="nav-right">
          <div className="phone-badge">
            <Phone size={16} />
            <span>+91 98765 43210</span>
          </div>

          <button onClick={() => scrollToSection('menu')} className="btn-primary">
            Order Now
          </button>

          <button onClick={onOpenCart} className="cart-icon-btn" title="View Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button onClick={() => setDrawerOpen(!drawerOpen)} className="hamburger-btn">
            {drawerOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="brand-logo">
            <span className="brand-title" style={{ fontSize: '1.2rem' }}>Spice Garden</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="mobile-drawer-close">
            <X size={24} />
          </button>
        </div>
        <ul className="mobile-nav-links">
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="mobile-nav-link">Home</a></li>
          <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }} className="mobile-nav-link">Menu</a></li>
          <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="mobile-nav-link">About Us</a></li>
          <li><a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }} className="mobile-nav-link">Gallery</a></li>
          <li><a href="#reservations" onClick={(e) => { e.preventDefault(); scrollToSection('reservations'); }} className="mobile-nav-link">Reservations</a></li>
          <li><a href="#reviews" onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }} className="mobile-nav-link">Reviews</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="mobile-nav-link">Contact</a></li>
        </ul>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => { setDrawerOpen(false); scrollToSection('reservations'); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Book a Table
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
