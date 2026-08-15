import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle, Globe, Send } from 'lucide-react';
import { submitContact } from '../services/api';

const Footer = ({ onOpenAdmin }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await submitContact({
        name: 'Newsletter Subscriber',
        email: newsletterEmail,
        message: 'Subscribed to Spice Garden Newsletter & Special Offers'
      });
      setSubscribed(true);
      setNewsletterEmail('');
    } catch (err) {
      alert('Subscription failed');
    }
  };

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="brand-logo">
              <div className="brand-logo-icon">🌶️</div>
              <div className="brand-text">
                <span className="brand-title">Spice Garden</span>
                <span className="brand-subtitle">RESTAURANT</span>
              </div>
            </div>
            <p>
              Good food, good mood. Visit us today and enjoy a delightful 
              experience with family and friends. Authentic flavours prepared fresh daily.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-btn" title="Facebook"><Facebook size={18} /></a>
              <a href="#" className="social-btn" title="Instagram"><Instagram size={18} /></a>
              <a href="#" className="social-btn" title="WhatsApp"><MessageCircle size={18} /></a>
              <a href="#" className="social-btn" title="Website"><Globe size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#reservations">Reservations</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a href="#contact">Contact Us</a></li>
              {onOpenAdmin && (
                <li>
                  <a href="#admin" onClick={(e) => { e.preventDefault(); onOpenAdmin(); }} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                    Admin Login 🔑
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="footer-title">Our Services</h4>
            <ul className="footer-links">
              <li><a href="#menu">Dine-in Dining</a></li>
              <li><a href="#menu">Express Takeaway</a></li>
              <li><a href="#menu">Home Delivery</a></li>
              <li><a href="#reservations">Catering Services</a></li>
              <li><a href="#reservations">Party & Special Events</a></li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div>
            <h4 className="footer-title">Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--accent)' }} />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--accent)' }} />
                <span>info@spicegarden.com</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: 'var(--accent)', marginTop: '3px' }} />
                <span>123, Food Street, City Center, Your City, State - 110001</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Clock size={16} style={{ color: 'var(--accent)' }} />
                <span>Mon - Sun: 10:00 AM - 11:00 PM</span>
              </div>
            </div>

            <h4 className="footer-title" style={{ fontSize: '0.95rem' }}>Newsletter</h4>
            <p style={{ fontSize: '0.8rem', marginBottom: '10px' }}>Subscribe to get updates on offers and new arrivals.</p>
            {subscribed ? (
              <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your email" 
                  className="footer-newsletter-input" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 14px', height: '40px' }}>
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2024 Spice Garden Restaurant. All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
