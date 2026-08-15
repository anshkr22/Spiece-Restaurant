import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, Utensils } from 'lucide-react';
import { fetchMenuItems, fetchCategories } from '../services/api';

const dishFallbackImages = {
  'paneer tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80',
  'chicken biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
  'mutton biryani': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80',
  'butter chicken': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=900&q=80',
  'veg manchurian': 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=900&q=80',
  'masala dosa': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80',
  'gulab jamun': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
  'mango lassi': 'https://images.unsplash.com/photo-1571006682858-a45752990da5?auto=format&fit=crop&w=900&q=80'
};

const getDishImage = (dish) => {
  if (dish.image && dish.image.startsWith('http')) {
    return dish.image;
  }
  const key = (dish.name || '').toLowerCase();
  return dishFallbackImages[key] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80';
};

const MenuSection = ({ onAddToCart }) => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, menuRes] = await Promise.all([
        fetchCategories(),
        fetchMenuItems('all')
      ]);
      if (catRes.data.success) {
        setCategories(catRes.data.data);
      }
      if (menuRes.data.success) {
        setMenuItems(menuRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load menu from MySQL database:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category_id === parseInt(activeCategory, 10));

  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="section-tag">OUR MENU</div>
        <h2 className="section-title">Popular Dishes</h2>
        <div className="section-title-underline"></div>

        {/* Category Filter Pills */}
        <div className="category-filter-bar">
          <button 
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategory === String(cat.id) ? 'active' : ''}`}
              onClick={() => setActiveCategory(String(cat.id))}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading authentic dishes from MySQL database...
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No dishes available in this category.
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map((dish) => {
              const dishImg = getDishImage(dish);
              return (
                <div key={dish.id} className="menu-card">
                  <div className="menu-card-img-wrapper">
                    <img 
                      src={dishImg} 
                      alt={dish.name} 
                      className="menu-card-img"
                      onError={(e) => {
                        const key = (dish.name || '').toLowerCase();
                        e.target.src = dishFallbackImages[key] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80';
                      }}
                    />
                    <div className="rating-tag">
                      <Star size={12} fill="#FFB300" color="#FFB300" />
                      <span>{dish.rating || '4.8'}</span>
                    </div>
                  </div>

                <div className="menu-card-body">
                  <h3 className="menu-card-title">{dish.name}</h3>
                  <p className="menu-card-desc">{dish.description}</p>
                  
                  <div className="menu-card-footer">
                    <div className="menu-card-price">₹{parseFloat(dish.price).toFixed(0)}</div>
                    <button 
                      onClick={() => onAddToCart(dish)} 
                      className="btn-add-order"
                    >
                      <ShoppingBag size={14} />
                      Add to Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        <div className="view-all-center">
          <button onClick={() => setActiveCategory('all')} className="btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
            <Utensils size={16} />
            View Full Menu 🍽️
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
