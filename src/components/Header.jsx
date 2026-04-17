import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Camera, Key, Info, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';

const Header = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { notifications } = useBookings();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword.length < 3) {
      alert('Password must be at least 3 characters');
      return;
    }
    updateUser(user.id, { password: newPassword });
    alert('Password updated successfully!');
    setNewPassword('');
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        updateUser(user.id, { profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div 
          onClick={() => setShowProfile(!showProfile)} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '12px', transition: 'background 0.2s' }}
          className="header-user-btn"
        >
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid white' }}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{user.name.charAt(0)}</span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '0.95rem' }}>{user.name}</span>
            <span style={{ color: '#4b5563', fontSize: '0.7rem', fontWeight: '500', letterSpacing: '0.3px' }}>AAST Booking System</span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }}>
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

        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }} title="Logout">
          <LogOut size={20} />
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Logout</span>
        </button>
      </div>

      {showProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div ref={profileRef} className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: '500px', padding: '2rem', backgroundColor: 'white', position: 'relative' }}>
            <button onClick={() => setShowProfile(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <X size={24} />
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 1rem', borderRadius: '50%', border: '4px solid var(--secondary-color)', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                {profilePic ? (
                  <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={50} style={{ marginTop: '20px', color: '#9ca3af' }} />
                )}
                <label style={{ position: 'absolute', bottom: 0, right: 0, left: 0, background: 'rgba(0,0,0,0.5)', padding: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                  <Camera size={16} color="white" />
                  <input type="file" onChange={handleProfilePicChange} hidden accept="image/*" />
                </label>
              </div>
              <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>{user.name}</h2>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-gray)', fontWeight: '600' }}>{user.role.toUpperCase()}</p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Info size={18} /> User Information</h4>
                <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>Employee ID:</span> <span style={{ fontWeight: '700' }}>{user.id}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>Full Name:</span> <span style={{ fontWeight: '700' }}>{user.name}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>Account Status:</span> <span style={{ color: 'green', fontWeight: '700' }}>Approved</span></div>
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Key size={18} /> Change Password</h4>
                <form onSubmit={handlePasswordChange} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="New Password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Update</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
