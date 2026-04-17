import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { LogOut, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationAsRead, clearAllNotifications } = useBookings();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userNotifications = (notifications || []).filter(n => n.role === user?.role);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.navContainer}>
        <div style={styles.logoInfo}>
          <div style={styles.logoPlaceholder}>AAST</div>
          <h2 style={styles.header}>نظام حجز القاعات</h2>
        </div>
        
        <div style={styles.userInfo}>
          {user?.role === 'faisal' && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                style={styles.notificationBtn}
              >
                <Bell size={20} color="var(--primary-color)" />
                {unreadCount > 0 && (
                  <span style={styles.badge}>{unreadCount}</span>
                )}
              </button>
              
              {showDropdown && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <h4 style={{ margin: 0 }}>الإشعارات</h4>
                    {userNotifications.length > 0 && (
                      <button onClick={() => clearAllNotifications(user.role)} style={styles.clearBtn}>مسح الكل</button>
                    )}
                  </div>
                  <div style={styles.dropdownBody}>
                    {userNotifications.length === 0 ? (
                      <p style={{ padding: '1rem', textAlign: 'center', color: '#888', margin: 0 }}>لا توجد إشعارات جديدة</p>
                    ) : (
                      userNotifications.map(n => (
                        <div 
                          key={n.id} 
                          style={{
                            ...styles.notificationItem,
                            backgroundColor: n.read ? 'transparent' : 'rgba(212, 175, 55, 0.1)',
                            fontWeight: n.read ? 'normal' : 'bold'
                          }}
                          onClick={() => markNotificationAsRead(n.id)}
                        >
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <User size={20} color="var(--primary-color)" />
          <span style={styles.userName}>{user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary" style={styles.logoutBtn}>
            <LogOut size={16} /> خروج
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: 'var(--glass-bg)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--glass-border)',
    boxShadow: 'var(--shadow-sm)',
    zIndex: 1000,
    padding: '1rem 0',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logoPlaceholder: {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '1.2rem',
  },
  header: {
    margin: 0,
    fontSize: '1.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    fontWeight: 'bold',
    color: 'var(--primary-color)',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
  },
  notificationBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
  },
  badge: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    backgroundColor: 'var(--danger)',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: '0', // Adjust for RTL if needed, typically left for english, maybe right for arabic
    width: '320px',
    backgroundColor: '#fff',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginTop: '0.5rem',
    overflow: 'hidden',
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f8f9fa',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary-color)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    textDecoration: 'underline',
  },
  dropdownBody: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  notificationItem: {
    padding: '1rem',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};

export default Navbar;
