import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { notifications } = useBookings();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <h2 style={{ margin: 0, color: '#d1d5db', fontWeight: 800, fontSize: '1.4rem' }}>AAST Portal</h2>
        
        <nav style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
          <NavLink to="/" className={({isActive}) => isActive ? 'header-link active' : 'header-link'}>Dashboard</NavLink>
          <NavLink to="/rooms" className={({isActive}) => isActive ? 'header-link active' : 'header-link'}>Rooms</NavLink>
          <NavLink to="/my-bookings" className={({isActive}) => isActive ? 'header-link active' : 'header-link'}>My Bookings</NavLink>
          <NavLink to="/fixed-schedule" className={({isActive}) => isActive ? 'header-link active' : 'header-link'}>Fixed Schedule</NavLink>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', position: 'relative' }}>
            <Bell size={20} />
            {notifications && notifications.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, backgroundColor: 'var(--danger)', width: 10, height: 10, borderRadius: '50%' }}></span>
            )}
          </button>

          {showNotifications && (
            <div className="glass-panel animate-fade-in" style={{ position: 'absolute', top: '2.5rem', right: 0, width: '350px', padding: '1rem', zIndex: 1000, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Notifications</h4>
              {(!notifications || notifications.length === 0) ? (
                <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', margin: 0 }}>No new notifications.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ fontSize: '0.85rem', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid var(--secondary-color)' }}>
                      <div style={{ color: '#4b5563', marginBottom: '0.25rem' }}>{n.message}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{n.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
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
