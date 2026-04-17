import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { ShieldCheck, Users, Building, BarChart3, Clock } from 'lucide-react';

const DeanDashboard = () => {
  const { user } = useAuth();
  const { bookings } = useBookings();

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: BarChart3, color: '#3b82f6' },
    { label: 'Departments', value: '5', icon: Building, color: '#f59e0b' },
    { label: 'Active Faculty', value: '124', icon: Users, color: '#10b981' },
    { label: 'System Status', value: 'Secure', icon: ShieldCheck, color: '#6366f1' },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-color)', margin: 0 }}>
          Dean's Control Center
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Overview of campus operations and facility utilization.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
            <div style={{ backgroundColor: `${stat.color}15`, color: stat.color, padding: '1rem', borderRadius: '16px' }}>
              <stat.icon size={28} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Recent Activities</h3>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View Full Report</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.slice(0, 5).map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                <div>
                  <span style={{ fontWeight: '700' }}>{b.applicantName}</span>
                  <span style={{ color: '#666', margin: '0 0.5rem' }}>booked</span>
                  <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{b.roomName}</span>
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} /> {b.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'left', padding: '1rem' }}>
              Review Faculty Requests
            </button>
            <button className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'left', padding: '1rem' }}>
              Generate Monthly Audit
            </button>
            <button className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'left', padding: '1rem' }}>
              Departmental Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeanDashboard;
