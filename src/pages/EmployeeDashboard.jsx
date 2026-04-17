import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings, GLOBAL_ROOMS, TIME_SLOTS } from '../context/BookingContext';
import { Calendar, Clock, CheckCircle, XCircle, Clock3, AlertCircle, Trash2 } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { bookings, addBooking, cancelBooking } = useBookings();
  
  const [roomType, setRoomType] = useState('regular');
  const [roomName, setRoomName] = useState(GLOBAL_ROOMS.regular[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [reason, setReason] = useState('');
  
  const myBookings = bookings.filter(b => b.applicantId === user.id);

  const getMinDate = () => {
    const minimum = new Date();
    minimum.setDate(minimum.getDate() + 1); // 24 hours in advance
    return minimum.toISOString().split('T')[0];
  };

  const isInvalidDate = date && date < getMinDate();

  const isBooked = bookings.some(b => 
    b.roomName === roomName && 
    b.date === date && 
    b.time === time && 
    (b.status === 'approved' || b.status === 'pending_manager')
  );

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setRoomType(type);
    setRoomName(GLOBAL_ROOMS[type][0]); // Auto-select first item of the new list
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = addBooking({
      applicantId: user.id,
      applicantName: user.name,
      applicantRole: user.role,
      roomType,
      roomName,
      date,
      time,
      reason
    });

    if (result.success) {
      alert(result.message);
      setRoomName(GLOBAL_ROOMS[roomType][0]);
      setDate('');
      setTime(TIME_SLOTS[0]);
      setReason('');
    } else {
      alert(result.message);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="badge badge-approved"><CheckCircle size={14} className="inline-icon" /> Approved</span>;
      case 'pending_admin': return <span className="badge badge-pending"><Clock3 size={14} className="inline-icon" /> Pending Admin</span>;
      case 'pending_manager': return <span className="badge badge-pending"><Clock3 size={14} className="inline-icon" /> Pending Branch Manager</span>;
      case 'rejected': return <span className="badge badge-rejected"><XCircle size={14} className="inline-icon" /> Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <h1 style={{ marginTop: '2rem' }}>Welcome, {user.name}</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Employee Room Booking Dashboard.</p>
      
      <div style={styles.grid}>
        <div className="glass-panel" style={styles.formPanel}>
          <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} /> New Booking Request
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Room Type</label>
              <select className="form-control" value={roomType} onChange={handleTypeChange}>
                <option value="regular">Regular Room (Lecture)</option>
                <option value="multipurpose">Multipurpose Room</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Room Selection</label>
              <select className="form-control" value={roomName} onChange={(e) => setRoomName(e.target.value)} required>
                {GLOBAL_ROOMS[roomType].map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Date (Min. 24h)</label>
                <input type="date" className="form-control" min={getMinDate()} value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Time Slot</label>
                <select className="form-control" value={time} onChange={(e) => setTime(e.target.value)} required>
                  {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </div>
            </div>

            {roomType === 'multipurpose' && (
              <div className="form-group" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <label className="form-label">Reason for Multipurpose Request</label>
                <textarea className="form-control" rows="2" value={reason} onChange={(e) => setReason(e.target.value)} required></textarea>
              </div>
            )}

            {isInvalidDate && date && (
              <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <AlertCircle size={16} /> <strong>Notice:</strong> All requests must be submitted at least 24 hours in advance.
              </div>
            )}

            {isBooked && (
              <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> <strong>Warning:</strong> This room is already booked at this specific date and time!
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', opacity: (isBooked || isInvalidDate) ? 0.5 : 1 }} disabled={isBooked || isInvalidDate || !date || !time}>
              {isBooked ? 'Unavailable' : isInvalidDate ? 'Cannot book today' : 'Submit Booking'}
            </button>
          </form>
        </div>

        <div style={styles.listPanel}>
          <h3 style={{ marginBottom: '1.5rem' }}>My Bookings</h3>
          {myBookings.map(b => (
            <div key={b.id} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>{b.roomName}</h4>
                {getStatusBadge(b.status)}
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{b.date} at {b.time} - {b.roomType === 'regular' ? 'Regular' : 'Multipurpose'}</p>
              
              {b.status === 'rejected' && b.rejectionReason && (
                <div style={styles.rejectionNotice}>
                  <p style={{ margin: '0 0 0.25rem 0' }}><strong><AlertCircle size={14} className="inline-icon" /> Rejection Reason:</strong> {b.rejectionReason}</p>
                  {b.suggestedAlternative && <p style={{ margin: 0 }}><strong>Suggested Alternative:</strong> {b.suggestedAlternative}</p>}
                </div>
              )}

              {b.status === 'pending_admin' && (
                <button 
                   onClick={() => cancelBooking(b.id)} 
                   className="btn" 
                   style={{ marginTop: '1rem', width: '100%', backgroundColor: '#eee', color: '#cc0000', padding: '0.5rem' }}
                >
                  <Trash2 size={16} /> Cancel Request
                </button>
              )}
            </div>
          ))}
          {myBookings.length === 0 && <p style={{ color: '#888' }}>No previous bookings.</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'start' },
  formPanel: { padding: '2rem' },
  listPanel: { display: 'flex', flexDirection: 'column' },
  rejectionNotice: { backgroundColor: '#ffecec', color: '#cc0000', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '0.5rem' }
};

export default EmployeeDashboard;
