import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Search, Calendar, Settings, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="sidebar">
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{user.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{user.name}</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-gray)' }}>AAST Booking System</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}></div>

      <div style={{ padding: '1.5rem' }}>
        <Link to="/multipurpose-request" style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary" style={{ width: '100%', backgroundColor: '#0b1a40' }}>
            <Plus size={18} /> Request Multipurpose Room
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
