import React from 'react';
import { Leaf, Award, ShieldCheck, Truck } from 'lucide-react';

const FeatureCards = () => {
  const features = [
    {
      icon: <Leaf size={24} />,
      title: "Fresh Ingredients",
      subtitle: "Quality & Freshness"
    },
    {
      icon: <Award size={24} />,
      title: "Expert Chefs",
      subtitle: "Experienced & Passionate"
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Hygienic Food",
      subtitle: "100% Safe & Healthy"
    },
    {
      icon: <Truck size={24} />,
      title: "Fast Delivery",
      subtitle: "Quick & On-time"
    }
  ];

  return (
    <section className="features-section">
      <div className="features-grid">
        {features.map((f, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-icon-box">
              {f.icon}
            </div>
            <div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-subtitle">{f.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
