import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const FloatingButtons = () => {
  return (
    <>
      {/* Top right floating badges matching screenshot */}
      <div className="floating-action-buttons">
        <a 
          href="https://wa.me/919876543210?text=Hi%20Spice%20Garden,%20I%20would%20like%20to%20place%20an%20order" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="floating-btn-whatsapp"
        >
          <MessageCircle size={16} />
          WhatsApp Order
        </a>
        <a 
          href="tel:+919876543210" 
          className="floating-btn-call"
        >
          <Phone size={16} />
          Call Now
        </a>
      </div>

      {/* Bottom right floating WhatsApp circle icon */}
      <a 
        href="https://wa.me/919876543210?text=Hello%20Spice%20Garden" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.5)',
          zIndex: 999
        }}
        title="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </>
  );
};

export default FloatingButtons;
