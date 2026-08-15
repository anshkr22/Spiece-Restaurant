import React, { useState } from 'react';
import { Lock, Mail, Key, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginAdmin } from '../services/api';

const AdminLogin = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginAdmin(email, password);
      if (res.data.success) {
        localStorage.setItem('spice_token', res.data.token);
        localStorage.setItem('spice_user', JSON.stringify(res.data.user));
        onLoginSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="modal-content" style={{ maxWidth: '440px', background: '#1E1E1E', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', fontSize: '1.8rem', color: 'white' }}>
            🌶️
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'white' }}>Admin Portal Login</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Spice Garden Restaurant Management</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.2)', color: '#F87171', border: '1px solid #EF4444', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Admin Email</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                required 
                className="form-input" 
                style={{ background: '#2A2E33', borderColor: '#3A3F45', color: 'white', paddingLeft: '38px' }}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                required 
                className="form-input" 
                style={{ background: '#2A2E33', borderColor: '#3A3F45', color: 'white', paddingLeft: '38px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Key size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(255,179,0,0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--accent)', border: '1px solid rgba(255,179,0,0.2)' }}>
            💡 Enter your registered administrator credentials
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}>
            {loading ? 'Authenticating with JWT...' : <>Login to Admin Dashboard <ArrowRight size={18} /></>}
          </button>

          <button type="button" onClick={onBackToSite} className="btn-outline" style={{ width: '100%', justifyContent: 'center', borderColor: '#3A3F45', color: '#94A3B8' }}>
            Back to Restaurant Website
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
