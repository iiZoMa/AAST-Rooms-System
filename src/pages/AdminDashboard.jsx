import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings, GLOBAL_ROOMS } from '../context/BookingContext';
import { Check, X, Clock3, MapPin, User, FileText, Calendar, Bell, Building, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const { user, users, approveUser, rejectUser } = useAuth();
  const { bookings, addBooking, updateBookingStatus, notifications, addNotification, fixedSchedule, TIME_SLOTS, swapFixedScheduleRoom } = useBookings();

  const pendingRequests = bookings.filter(b => b.status === 'pending_admin');
  const activeBookings = bookings.filter(b => b.status === 'approved' || b.status === 'pending_manager');
  const pendingUsers = Object.values(users || {}).filter(u => u.status === 'pending');

  const allRooms = [...GLOBAL_ROOMS.regular, ...GLOBAL_ROOMS.multipurpose];

  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suggestedAlternative, setSuggestedAlternative] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState(GLOBAL_ROOMS.multipurpose[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const [swapId, setSwapId] = useState(null);
  const [swapRoomName, setSwapRoomName] = useState('');

  const handleApprove = (booking) => {
    const newStatus = booking.roomType === 'regular' ? 'approved' : 'pending_manager';
    const result = updateBookingStatus(booking.id, newStatus);
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleRejectPrompt = (id) => {
    setRejectId(id);
    setRejectReason('');
    setSuggestedAlternative('');
  };

  const submitRejection = () => {
    updateBookingStatus(rejectId, 'rejected', rejectReason, suggestedAlternative);
    setRejectId(null);
  };

  const isBooked = bookings.some(b => 
    b.roomName === roomName && 
    b.date === date && 
    b.time === time && 
    (b.status === 'approved' || b.status === 'pending_manager')
  );

  const handleAdminMultipurposeRequest = (e) => {
    e.preventDefault();
    const result = addBooking({
      applicantId: user.id,
      applicantName: user.name,
      applicantRole: user.role,
      roomType: 'multipurpose',
      roomName,
      date,
      time,
      reason
    });
    
    if (result.success) {
      setRoomName(GLOBAL_ROOMS.multipurpose[0]); setDate(''); setTime(''); setReason('');
      setShowModal(false);
      alert('Request sent directly to Branch Manager.');
    } else {
      alert(result.message);
    }
  };

  const handleApproveUser = (userId) => {
    approveUser(userId);
    const u = users[userId];
    if (addNotification && u) {
      addNotification(`Admin approved a new account for employee: ${u.name}`);
    }
  };

  const handleSwapSubmit = (id) => {
    if (!swapRoomName) return;
    const result = swapFixedScheduleRoom(id, swapRoomName);
    if (result.success) {
      setSwapId(null);
    } else {
      alert(result.message);
    }
  };

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem', position: 'relative' }}>
      
      <button 
        style={styles.fab} 
        onClick={() => setShowModal(true)} 
        title="Request Multipurpose Room"
      >
        <Plus size={24} color="#fff" />
      </button>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel animate-fade-in" style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} /> Request Multipurpose Room
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666' }}>&times;</button>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Bypasses Tier 1 straight to the Branch Manager.</p>
            <form onSubmit={handleAdminMultipurposeRequest}>
              <div className="form-group">
                <label className="form-label">Room Location</label>
                <select className="form-control" value={roomName} onChange={(e) => setRoomName(e.target.value)} required>
                  {GLOBAL_ROOMS.multipurpose.map(r => (
                     <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Time</label>
                  <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Reason</label>
                <textarea className="form-control" rows="2" value={reason} onChange={(e) => setReason(e.target.value)} required></textarea>
              </div>
              
              {isBooked && (
                <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <strong>Warning:</strong> This room is booked at this date and time!
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', opacity: isBooked ? 0.5 : 1 }} disabled={isBooked || !date || !time}>
                {isBooked ? 'Unavailable' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <p style={{ color: '#666' }}>System overview, approvals, and status tracking.</p>
      </div>



      {pendingUsers.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Pending Account Approvals</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {pendingUsers.map(u => (
              <div key={u.id} className="glass-panel" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{u.name}</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#666' }}>Role: {u.role} | ID: {u.id}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-success" onClick={() => handleApproveUser(u.id)} style={{ flex: 1 }}><Check size={16} /> Approve</button>
                  <button className="btn btn-danger" onClick={() => rejectUser(u.id)} style={{ flex: 1 }}><X size={16} /> Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}





      <div>
        <h3 style={{ margin: '2rem 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Clock3 size={20} /> Pending Employee/Secretary Requests
        </h3>
        
        {pendingRequests.length === 0 ? (
          <p style={{ color: '#888' }}>No pending requests.</p>
        ) : (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
            {pendingRequests.map(b => (
              <div key={b.id} className="glass-panel" style={{ borderLeft: '4px solid var(--primary-color)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>{b.roomName} ({b.roomType === 'regular' ? 'Regular' : 'Multipurpose'})</h4>
                </div>
                <p style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}><User size={14} className="inline-icon"/> {b.applicantName} ({b.applicantRole})</p>
                <p style={{ fontSize: '0.9rem', margin: '0 0 1rem 0' }}><Calendar size={14} className="inline-icon"/> {b.date} at {b.time}</p>
                
                {rejectId === b.id ? (
                  <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Provide Rejection Details</p>
                    <input type="text" placeholder="Reason for refusal" className="form-control" style={{ marginBottom: '0.5rem' }} value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                    <select className="form-control" style={{ marginBottom: '1rem' }} value={suggestedAlternative} onChange={e => setSuggestedAlternative(e.target.value)}>
                      <option value="">-- No suggestion --</option>
                      {allRooms.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-danger" onClick={submitRejection} style={{ flex: 1 }}>Submit Reject</button>
                      <button className="btn" onClick={() => setRejectId(null)} style={{ flex: 1, backgroundColor: '#ccc' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => handleApprove(b)} className="btn btn-success" style={{ flex: 1, minWidth: '150px' }}>
                      <Check size={16} /> {b.roomType === 'regular' ? 'Approve' : 'Accept and send request to manager'}
                    </button>
                    <button onClick={() => handleRejectPrompt(b.id)} className="btn btn-danger" style={{ flex: '0 0 auto' }}>
                      <X size={16} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  badgeSuccess: { backgroundColor: '#d4edda', color: '#155724', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' },
  badgeDanger: { backgroundColor: '#f8d7da', color: '#721c24', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' },
  fab: { position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200, padding: '1rem' },
  modalContent: { width: '100%', maxWidth: '500px', padding: '2rem', backgroundColor: 'white', position: 'relative' }
};

export default AdminDashboard;
