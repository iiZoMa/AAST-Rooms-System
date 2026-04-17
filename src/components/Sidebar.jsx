import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Search, Calendar, Settings, Plus, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
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
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-gray)' }}>{t('sys_name')}</p>
          </div>
        </div>
      </div>

      <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          {t('overview')}
        </NavLink>
        <NavLink to="/rooms" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Search size={20} />
          {t('find_space')}
        </NavLink>
        <NavLink to="/fixed-schedule" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Calendar size={20} />
          {t('my_schedule')}
        </NavLink>
        <NavLink to="/delegations" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <ShieldAlert size={20} />
          {t('delegations')}
        </NavLink>
      </nav>

      <div style={{ padding: '1.5rem' }}>
        <Link to="/multipurpose-request" style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary" style={{ width: '100%', backgroundColor: 'var(--primary-color)', borderRadius: '24px', padding: '0.75rem', fontSize: '0.85rem' }}>
            {t('req_multi')}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
