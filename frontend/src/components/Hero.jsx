import React from 'react';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = ({ onExploreClick, onBookClick }) => {
  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        {/* Left Content */}
        <div className="hero-text-content">
          <div className="hero-subtag">Welcome to</div>
          <h1 className="hero-title">SPICE GARDEN</h1>
          <div className="hero-tagline">GOOD FOOD | GOOD MOOD</div>
          
          <p className="hero-desc">
            Experience the perfect blend of taste, aroma and hygiene. Fresh ingredients, 
            expert chefs and a warm ambience await you.
          </p>

          <div className="hero-buttons">
            <button onClick={onExploreClick} className="btn-primary">
              Explore Menu
            </button>
            <button onClick={onBookClick} className="btn-outline">
              <Calendar size={18} />
              Book a Table
            </button>
          </div>

          {/* Carousel indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}></span>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80" 
            alt="Spice Garden Special Biryani Bowl" 
            className="hero-food-img" 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
