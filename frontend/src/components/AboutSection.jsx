import React from 'react';
import { ArrowRight } from 'lucide-react';

const AboutSection = () => {
  return (
    <div id="about" className="about-text-content">
      <div className="section-tag" style={{ textAlign: 'left' }}>ABOUT US</div>
      <h2 className="section-title" style={{ textAlign: 'left' }}>A Story of Passion and Taste</h2>
      <div className="section-title-underline" style={{ margin: '8px 0 24px 0' }}></div>

      <p>
        At Spice Garden, we believe in serving more than just food. We serve happiness 
        on a plate. Every dish is prepared with love, passion and the freshest hand-selected ingredients. 
        Our experienced master chefs craft rich, authentic Indian delicacies that bring warmth to your heart.
      </p>

      <div className="about-img-box">
        <img 
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80" 
          alt="Spice Garden Restaurant Ambience" 
          className="about-img" 
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => {
          const el = document.getElementById('reservations');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} className="btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', padding: '8px 16px', fontSize: '0.85rem' }}>
          Read More About Us <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default AboutSection;
