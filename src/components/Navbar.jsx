import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.navContainer}>
        <div style={styles.logoInfo}>
          <div style={styles.logoPlaceholder}>AAST</div>
          <h2 style={styles.header}>نظام حجز القاعات</h2>
        </div>
        
        <div style={styles.userInfo}>
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
  }
};

export default Navbar;
