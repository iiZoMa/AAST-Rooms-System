import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <h2 style={{ margin: 0, color: '#d1d5db', fontWeight: 800, fontSize: '1.4rem' }}>AAST Portal</h2>
        
        <nav style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
          <NavLink to="/" className={({isActive}) => isActive ? 'header-link active' : 'header-link'}>Dashboard</NavLink>
          <NavLink to="/rooms" className={({isActive}) => isActive ? 'header-link active' : 'header-link'}>Rooms</NavLink>
          <NavLink to="/my-bookings" className={({isActive}) => isActive ? 'header-link active' : 'header-link'}>My Bookings</NavLink>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
          <Bell size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e5e7eb', padding: '0.4rem', borderRadius: '50%', color: '#6b7280' }}>
             <User size={20} />
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
