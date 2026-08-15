import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';

const GallerySection = () => {
  const [activeImage, setActiveImage] = useState(null);

  const images = [
    {
      src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
      title: "Wood-fired Artisanal Pizza"
    },
    {
      src: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
      title: "Signature Dum Biryani"
    },
    {
      src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      title: "Gourmet Cheese Burger"
    },
    {
      src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
      title: "Belgian Chocolate Truffle"
    }
  ];

  return (
    <div id="gallery">
      <div className="section-tag" style={{ textAlign: 'left' }}>OUR GALLERY</div>
      <h2 className="section-title" style={{ textAlign: 'left' }}>Our Food Gallery</h2>
      <div className="section-title-underline" style={{ margin: '8px 0 24px 0' }}></div>

      <div className="gallery-grid">
        {images.map((img, idx) => (
          <div key={idx} className="gallery-card" onClick={() => setActiveImage(img)}>
            <img src={img.src} alt={img.title} className="gallery-img" />
            <div className="gallery-overlay">
              <Eye size={24} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setActiveImage(images[0])} className="btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', padding: '8px 16px', fontSize: '0.85rem' }}>
          View More Photos 📷
        </button>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="modal-backdrop" onClick={() => setActiveImage(null)}>
          <div className="modal-content" style={{ maxWidth: '700px', padding: '16px', background: '#121212', color: 'white' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem' }}>{activeImage.title}</h3>
              <button onClick={() => setActiveImage(null)} style={{ background: 'transparent', color: 'white' }}>
                <X size={24} />
              </button>
            </div>
            <img src={activeImage.src} alt={activeImage.title} style={{ width: '100%', borderRadius: '12px', maxHeight: '500px', objectFit: 'cover' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
