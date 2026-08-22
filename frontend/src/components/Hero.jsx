import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Utensils, Sparkles } from 'lucide-react';

const BANNERS_DATA = [
  {
    id: 1,
    subtag: "Welcome to Spice Restaurant",
    title: "Authentic Indian Flavours",
    tagline: "GOOD FOOD | GOOD MOOD",
    description: "Experience the taste of freshly prepared Indian cuisine crafted by expert chefs with authentic hand-ground spices.",
    buttonText: "Explore Menu",
    buttonAction: "menu",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    subtag: "Chef's Signature Specialty",
    title: "Delicious Biryani",
    tagline: "AROMATIC | SPICY | DELICIOUS",
    description: "Rich flavours, aromatic saffron spices, tender meats and perfectly cooked long-grain Basmati rice.",
    buttonText: "Order Now",
    buttonAction: "menu",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    subtag: "100% Pure Veg Delights",
    title: "Special Paneer Collection",
    tagline: "FRESH | RICH | CREAMY",
    description: "Discover our delicious vegetarian favourites, from smoky Paneer Tikka to velvety Paneer Butter Masala.",
    buttonText: "View Menu",
    buttonAction: "menu",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    subtag: "Weekend Family Dining",
    title: "Weekend Special Offer",
    tagline: "FAMILY | FRIENDS | CELEBRATION",
    description: "Enjoy your favourite authentic dishes with family and friends. Special combo discounts available!",
    buttonText: "Order Now",
    buttonAction: "menu",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    subtag: "Uncompromising Quality",
    title: "Freshly Prepared Every Day",
    tagline: "HYGIENIC | ORGANIC | AUTHENTIC",
    description: "Quality ingredients sourced daily, prepared in hygienic kitchens with traditional clay-oven tandoors.",
    buttonText: "Explore Menu",
    buttonAction: "menu",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    subtag: "Sweet Indulgence",
    title: "Sweet Ending",
    tagline: "TRADITIONAL | DELIGHTFUL | SWEET",
    description: "Complete your meal with our delicious desserts including Gulab Jamun, saffron Rasmalai, and Gajar Halwa.",
    buttonText: "View Desserts",
    buttonAction: "desserts",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80"
  }
];

const Hero = ({ onExploreClick, onBookClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Auto-sliding every 5 seconds
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % BANNERS_DATA.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? BANNERS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS_DATA.length);
  };

  const currentBanner = BANNERS_DATA[currentIndex];

  const handleCtaClick = () => {
    if (onExploreClick) onExploreClick();
  };

  return (
    <section 
      id="home" 
      className="hero hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container hero-container">
        {/* Left Content */}
        <div className="hero-text-content fade-in-key" key={currentBanner.id}>
          <div className="hero-subtag">{currentBanner.subtag}</div>
          <h1 className="hero-title">{currentBanner.title}</h1>
          <div className="hero-tagline">{currentBanner.tagline}</div>
          
          <p className="hero-desc">
            {currentBanner.description}
          </p>

          <div className="hero-buttons">
            <button onClick={handleCtaClick} className="btn-primary">
              <Utensils size={18} />
              {currentBanner.buttonText}
            </button>
            <button onClick={onBookClick} className="btn-outline">
              <Calendar size={18} />
              Book a Table
            </button>
          </div>

          {/* Slider Controls & Navigation Dots */}
          <div className="hero-controls-bar">
            <button className="slider-arrow-btn" onClick={handlePrev} aria-label="Previous Banner">
              <ChevronLeft size={20} />
            </button>

            <div className="hero-dots">
              {BANNERS_DATA.map((banner, index) => (
                <button
                  key={banner.id}
                  className={`dot-pill ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button className="slider-arrow-btn" onClick={handleNext} aria-label="Next Banner">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Hero Image Slider */}
        <div className="hero-image-wrapper">
          <img 
            src={currentBanner.image} 
            alt={currentBanner.title} 
            className="hero-food-img fade-in-img" 
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
