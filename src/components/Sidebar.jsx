import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Calendar, Settings, Plus, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="sidebar">
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{user.name.charAt(0)}</span>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>AAST Registrar</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-gray)' }}>Academic Management</p>
          </div>
        </div>
      </div>

      <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          Overview
        </NavLink>
        <NavLink to="/find-space" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Search size={20} />
          Find Space
        </NavLink>
        <NavLink to="/my-schedule" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Calendar size={20} />
          My Schedule
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Settings size={20} />
          Settings
        </NavLink>
        <NavLink to="/delegations" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <ShieldAlert size={20} />
          Authority & Delegations
        </NavLink>
      </nav>

      <div style={{ padding: '1.5rem' }}>
        <button className="btn btn-primary" style={{ width: '100%', backgroundColor: '#0b1a40' }}>
          <Plus size={18} /> Quick Book
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
