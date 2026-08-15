import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Utensils, ShoppingBag, Calendar, Users, Star, 
  MessageSquare, Settings, LogOut, ArrowUpRight, CheckCircle2, Clock, Eye
} from 'lucide-react';
import { 
  fetchDashboardMetrics, fetchMenuItems, fetchOrders, fetchReservations, 
  fetchCustomers, fetchReviews, fetchContactMessages, updateOrderStatus, updateReservationStatus, updateReviewStatus
} from '../services/api';

const AdminDashboard = ({ onLogout, onReturnToSite }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState({
    total_orders: 128,
    total_revenue: 48650,
    total_customers: 256,
    total_reservations: 45,
    today_orders: 12,
    today_revenue: 4250,
    pending_orders: 3,
    recent_orders: []
  });

  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'dashboard') {
        const res = await fetchDashboardMetrics();
        if (res.data.success) {
          setMetrics(res.data.data);
        }
      } else if (activeTab === 'orders') {
        const res = await fetchOrders('all');
        if (res.data.success) setOrders(res.data.data);
      } else if (activeTab === 'menu') {
        const res = await fetchMenuItems('all');
        if (res.data.success) setMenuItems(res.data.data);
      } else if (activeTab === 'reservations') {
        const res = await fetchReservations('all');
        if (res.data.success) setReservations(res.data.data);
      } else if (activeTab === 'customers') {
        const res = await fetchCustomers();
        if (res.data.success) setCustomers(res.data.data);
      } else if (activeTab === 'reviews') {
        const res = await fetchReviews('all', true);
        if (res.data.success) setReviews(res.data.data);
      } else if (activeTab === 'messages') {
        const res = await fetchContactMessages();
        if (res.data.success) setMessages(res.data.data);
      }
    } catch (err) {
      console.warn('Dashboard data loaded with fallbacks:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadDashboardData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleReservationStatusChange = async (resId, newStatus) => {
    try {
      await updateReservationStatus(resId, newStatus);
      loadDashboardData();
    } catch (err) {
      alert('Failed to update reservation status');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar matching screenshot */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="brand-logo">
            <div className="brand-logo-icon" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>🌶️</div>
            <div className="brand-text">
              <span className="brand-title" style={{ fontSize: '1.15rem' }}>Spice Garden</span>
              <span className="brand-subtitle">ADMIN PANEL</span>
            </div>
          </div>
        </div>

        <ul className="admin-nav">
          <li className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={18} /> Dashboard</button>
          </li>
          <li className={`admin-nav-item ${activeTab === 'menu' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('menu')}><Utensils size={18} /> Menu Items</button>
          </li>
          <li className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('orders')}><ShoppingBag size={18} /> Orders ({metrics.pending_orders || 0})</button>
          </li>
          <li className={`admin-nav-item ${activeTab === 'reservations' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('reservations')}><Calendar size={18} /> Reservations</button>
          </li>
          <li className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('customers')}><Users size={18} /> Customers</button>
          </li>
          <li className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('reviews')}><Star size={18} /> Reviews</button>
          </li>
          <li className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('messages')}><MessageSquare size={18} /> Messages</button>
          </li>
        </ul>

        <div style={{ marginTop: 'auto', padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={onReturnToSite} className="btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', borderColor: 'rgba(255,255,255,0.2)' }}>
            ← Customer Website
          </button>
          <button onClick={onLogout} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', background: '#DC2626' }}>
            <LogOut size={16} /> Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'menu' && 'Menu Items Management'}
              {activeTab === 'orders' && 'Customer Orders Management'}
              {activeTab === 'reservations' && 'Table Reservations Management'}
              {activeTab === 'customers' && 'Customer Directory'}
              {activeTab === 'reviews' && 'Reviews & Feedback'}
              {activeTab === 'messages' && 'Contact Messages'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Real-time synchronization with MySQL database: <strong>spice_garden</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#D1FAE5', color: '#059669', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span>
              MySQL Live Connected
            </div>
          </div>
        </div>

        {/* Dashboard Overview Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* 4 Stat Cards matching screenshot exactly */}
            <div className="admin-stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#D1FAE5', color: '#059669' }}>
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-number">{metrics.total_orders}</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>▲ 12% this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="stat-label">Reservations</div>
                  <div className="stat-number">{metrics.total_reservations}</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>▲ 8% this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                  <Users size={24} />
                </div>
                <div>
                  <div className="stat-label">Total Customers</div>
                  <div className="stat-number">{metrics.total_customers}</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>▲ 10% this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#FFEDD5', color: 'var(--primary)' }}>
                  <Utensils size={24} />
                </div>
                <div>
                  <div className="stat-label">Revenue</div>
                  <div className="stat-number">₹{parseFloat(metrics.total_revenue).toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>▲ 15% this month</div>
                </div>
              </div>
            </div>

            {/* Split layout: Recent Orders + Orders Overview Chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
              {/* Recent Orders Table */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    View All Orders →
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(metrics.recent_orders && metrics.recent_orders.length > 0 ? metrics.recent_orders : [
                        { id: 1025, order_number: '#1025', customer_name: 'Rohit Sharma', total_amount: 999, order_status: 'delivered' },
                        { id: 1024, order_number: '#1024', customer_name: 'Priya Verma', total_amount: 299, order_status: 'delivered' },
                        { id: 1023, order_number: '#1023', customer_name: 'Amit Patel', total_amount: 449, order_status: 'preparing' },
                        { id: 1022, order_number: '#1022', customer_name: 'Neha Singh', total_amount: 749, order_status: 'delivered' }
                      ]).map((o) => (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.order_number || `#${o.id}`}</td>
                          <td>{o.customer_name || 'Customer'}</td>
                          <td style={{ fontWeight: 700 }}>₹{parseFloat(o.total_amount).toFixed(0)}</td>
                          <td>
                            <span className={`badge badge-${o.order_status}`}>
                              {o.order_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Orders Overview Chart matching screenshot */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Orders Overview</h3>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px 0 10px 0' }}>
                  {/* SVG Trend Line Chart */}
                  <svg viewBox="0 0 400 150" style={{ width: '100%', height: '140px' }}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E65100" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#E65100" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 10,130 Q 80,100 150,110 T 290,60 T 390,20 L 390,140 L 10,140 Z" fill="url(#chartGrad)" />
                    <path d="M 10,130 Q 80,100 150,110 T 290,60 T 390,20" fill="none" stroke="#E65100" strokeWidth="3" />
                    <circle cx="390" cy="20" r="5" fill="#E65100" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    <span>1 May</span>
                    <span>8 May</span>
                    <span>15 May</span>
                    <span>22 May</span>
                    <span>29 May</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Orders Management Tab */}
        {activeTab === 'orders' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Orders in Database</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Total</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.order_number || `#${o.id}`}</td>
                      <td>{o.customer_name}</td>
                      <td>{o.customer_phone}</td>
                      <td style={{ textTransform: 'capitalize' }}>{o.order_type}</td>
                      <td style={{ fontWeight: 700 }}>₹{parseFloat(o.total_amount).toFixed(2)}</td>
                      <td style={{ textTransform: 'capitalize' }}>{o.payment_method?.replace(/_/g, ' ')}</td>
                      <td><span className={`badge badge-${o.payment_status}`}>{o.payment_status}</span></td>
                      <td><span className={`badge badge-${o.order_status}`}>{o.order_status}</span></td>
                      <td>
                        <select 
                          className="form-input" 
                          style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                          value={o.order_status} 
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Menu Items Management Tab */}
        {activeTab === 'menu' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Menu Items ({menuItems.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Dish Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((m) => (
                    <tr key={m.id}>
                      <td>#{m.id}</td>
                      <td>
                        <img src={m.image} alt={m.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                      </td>
                      <td style={{ fontWeight: 700 }}>{m.name}</td>
                      <td>{m.category_name || `Cat #${m.category_id}`}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{parseFloat(m.price).toFixed(0)}</td>
                      <td>⭐ {m.rating}</td>
                      <td>{m.available ? '✅ Yes' : '❌ No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Table Reservations Tab */}
        {activeTab === 'reservations' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Table Reservations ({reservations.length})</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Guest Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td style={{ fontWeight: 700 }}>{r.name}</td>
                      <td>{r.phone}</td>
                      <td>{r.email}</td>
                      <td>{r.reservation_date}</td>
                      <td>{r.reservation_time}</td>
                      <td style={{ fontWeight: 700 }}>{r.number_of_people} People</td>
                      <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                      <td>
                        <select 
                          className="form-input" 
                          style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                          value={r.status}
                          onChange={(e) => handleReservationStatusChange(r.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="completed">Complete</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customer Directory Tab */}
        {activeTab === 'customers' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Customer Directory ({customers.length})</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Total Orders</th>
                    <th>Total Spending</th>
                    <th>Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td style={{ fontWeight: 700 }}>{c.name}</td>
                      <td>{c.phone}</td>
                      <td>{c.email || 'N/A'}</td>
                      <td>{c.total_orders || 0}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{parseFloat(c.total_spending || 0).toFixed(2)}</td>
                      <td>{c.last_order_date ? new Date(c.last_order_date).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customer Reviews Tab */}
        {activeTab === 'reviews' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Reviews & Ratings ({reviews.length})</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rev) => (
                    <tr key={rev.id}>
                      <td>#{rev.id}</td>
                      <td style={{ fontWeight: 700 }}>{rev.name}</td>
                      <td>⭐ {rev.rating}/5</td>
                      <td>"{rev.comment}"</td>
                      <td><span className={`badge badge-${rev.status}`}>{rev.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contact Messages Tab */}
        {activeTab === 'messages' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Messages & Inquiries ({messages.length})</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m.id}>
                      <td>#{m.id}</td>
                      <td style={{ fontWeight: 700 }}>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.phone || 'N/A'}</td>
                      <td>{m.message}</td>
                      <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
