import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Camera, Key, Info, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { notifications } = useBookings();
  const { lang, toggleLanguage, t } = useLanguage();
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
    <header className="top-header" style={{ backgroundColor: 'var(--primary-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <button 
          onClick={toggleLanguage} 
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        >
          {lang === 'en' ? 'العربية' : 'English'}
        </button>
        <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem', letterSpacing: '0.5px' }}>{t('portal')}</h2>
      </div>

      <nav style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flex: 2 }}>
        <NavLink to="/" className={({isActive}) => isActive ? 'header-link-dark active' : 'header-link-dark'}>{t('dashboard')}</NavLink>
        <NavLink to="/rooms" className={({isActive}) => isActive ? 'header-link-dark active' : 'header-link-dark'}>{t('rooms')}</NavLink>
        <NavLink to="/my-bookings" className={({isActive}) => isActive ? 'header-link-dark active' : 'header-link-dark'}>{t('my_bookings')}</NavLink>
        <NavLink to="/fixed-schedule" className={({isActive}) => isActive ? 'header-link-dark active' : 'header-link-dark'}>{t('fixed_schedule')}</NavLink>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1b06b', position: 'relative' }}>
            <Bell size={20} />
            {notifications && notifications.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, backgroundColor: 'var(--danger)', width: 10, height: 10, borderRadius: '50%' }}></span>
            )}
          </button>

          {showNotifications && (
            <div className="glass-panel animate-fade-in" style={{ position: 'absolute', top: '2.5rem', right: 0, width: '350px', padding: '1rem', zIndex: 1000, boxShadow: 'var(--shadow-lg)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{t('notifications')}</h4>
              {(!notifications || notifications.length === 0) ? (
                <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', margin: 0 }}>{t('no_notifications')}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ fontSize: '0.85rem', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid var(--secondary-color)' }}>
                      <div style={{ color: '#4b5563', marginBottom: '0.25rem' }}>{n.message}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{n.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button onClick={() => setShowProfile(!showProfile)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1b06b', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(209, 176, 107, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} />
          </div>
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
                <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Info size={18} /> {t('user_info')}</h4>
                <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>{t('emp_id')}:</span> <span style={{ fontWeight: '700' }}>{user.id}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>{t('full_name')}:</span> <span style={{ fontWeight: '700' }}>{user.name}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>{t('account_status')}:</span> <span style={{ color: 'green', fontWeight: '700' }}>{t('approved')}</span></div>
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Key size={18} /> {t('change_pass')}</h4>
                <form onSubmit={handlePasswordChange} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder={t('new_pass')} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>{t('update')}</button>
                </form>
              </div>
              
              <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: '#fee2e2', backgroundColor: '#fef2f2', width: '100%' }}>
                <LogOut size={18} /> {t('sign_out')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
