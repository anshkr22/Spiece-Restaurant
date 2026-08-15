import React, { useState } from 'react';
import { Calendar, Clock, Users, User, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { createReservation } from '../services/api';

const ReservationSection = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().slice(0, 10),
    time: '19:30',
    number_of_people: 2,
    special_request: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await createReservation(form);
      if (res.data.success) {
        setSuccessMsg(`Table Reservation Confirmed! ID: #${res.data.data.id}. We look forward to hosting you.`);
        setForm({
          name: '',
          phone: '',
          email: '',
          date: new Date().toISOString().slice(0, 10),
          time: '19:30',
          number_of_people: 2,
          special_request: ''
        });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="reservations" className="booking-card">
      <div className="section-tag" style={{ textAlign: 'left' }}>BOOK A TABLE</div>
      <h2 className="section-title" style={{ textAlign: 'left' }}>Reserve Your Table</h2>
      <div className="section-title-underline" style={{ margin: '8px 0 24px 0' }}></div>

      {successMsg && (
        <div style={{ background: '#D1FAE5', color: '#059669', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: 600 }}>
          ✅ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: 600 }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <input 
            type="text" 
            required 
            placeholder="Your Name" 
            className="form-input"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
        </div>

        <div className="form-group">
          <input 
            type="tel" 
            required 
            placeholder="Phone Number" 
            className="form-input"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />
        </div>

        <div className="form-group full-width">
          <input 
            type="email" 
            required 
            placeholder="Email Address" 
            className="form-input"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
        </div>

        <div className="form-group">
          <input 
            type="date" 
            required 
            className="form-input"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
          />
        </div>

        <div className="form-group">
          <input 
            type="time" 
            required 
            className="form-input"
            value={form.time}
            onChange={(e) => setForm({...form, time: e.target.value})}
          />
        </div>

        <div className="form-group full-width">
          <select 
            className="form-input"
            value={form.number_of_people}
            onChange={(e) => setForm({...form, number_of_people: parseInt(e.target.value, 10)})}
          >
            <option value={1}>1 Person</option>
            <option value={2}>2 People</option>
            <option value={3}>3 People</option>
            <option value={4}>4 People</option>
            <option value={5}>5 People</option>
            <option value={6}>6 People</option>
            <option value={8}>8+ People (Group Booking)</option>
          </select>
        </div>

        <div className="form-group full-width">
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? 'Reserving Table in MySQL...' : <>Book Now <ArrowRight size={18} /></>}
          </button>
        </div>
      </form>

      {/* Map Location Card matching image */}
      <div className="map-info-card">
        <div className="map-icon-pin">
          <MapPin size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Spice Garden Restaurant</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            123, Food Street, City Center, Your City, State - 110001
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSection;
