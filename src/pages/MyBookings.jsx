import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { CheckCircle, XCircle, Clock3, AlertCircle, Trash2, Calendar, MapPin } from 'lucide-react';

const MyBookings = () => {
  const { user } = useAuth();
  const { bookings, cancelBooking } = useBookings();
  
  const myBookings = bookings.filter(b => b.applicantId === user.id);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="badge badge-approved" style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={14} /> Approved</span>;
      case 'pending_admin': return <span className="badge badge-pending" style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock3 size={14} /> Pending Admin</span>;
      case 'pending_manager': return <span className="badge badge-pending" style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock3 size={14} /> Pending Manager</span>;
      case 'rejected': return <span className="badge badge-rejected" style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><XCircle size={14} /> Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary-color)' }}>My Bookings</h1>
        <p style={{ color: '#666' }}>View and manage your room reservation requests.</p>
      </header>

      {myBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
          <Calendar size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#4b5563' }}>No Bookings Found</h3>
          <p style={{ color: '#6b7280' }}>You haven't made any booking requests yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {myBookings.map(b => (
            <div key={b.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.25rem' }}>{b.roomName}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{b.roomType} Room</span>
                </div>
                {getStatusBadge(b.status)}
              </div>

              <div style={{ display: 'grid', gap: '0.5rem', color: '#4b5563', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} />
                  <span>{b.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock3 size={16} />
                  <span>{b.time}</span>
                </div>
              </div>

              {b.reason && (
                <div style={{ backgroundColor: '#f3f4f6', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> {b.reason}
                </div>
              )}

              {b.status === 'rejected' && b.rejectionReason && (
                <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <AlertCircle size={16} />
                    <strong>Rejection Reason:</strong>
                  </div>
                  <p style={{ margin: 0 }}>{b.rejectionReason}</p>
                  {b.suggestedAlternative && (
                    <p style={{ margin: '0.5rem 0 0 0' }}><strong>Suggestion:</strong> {b.suggestedAlternative}</p>
                  )}
                </div>
              )}

              {(b.status === 'pending_admin' || b.status === 'pending_manager') && (
                <button 
                  onClick={() => cancelBooking(b.id)} 
                  className="btn" 
                  style={{ marginTop: '0.5rem', width: '100%', backgroundColor: 'transparent', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.6rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Trash2 size={16} /> Cancel Request
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
