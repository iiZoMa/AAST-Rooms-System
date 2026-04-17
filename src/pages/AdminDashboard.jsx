import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings, GLOBAL_ROOMS, TIME_SLOTS, isOutsideWorkingHours } from '../context/BookingContext';
import { Check, X, Clock3, MapPin, User, FileText, Calendar, Bell, Building, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { bookings, addBooking, updateBookingStatus, notifications } = useBookings();

  const pendingRequests = bookings.filter(b => b.status === 'pending_admin');
  const activeBookings = bookings.filter(b => b.status === 'approved' || b.status === 'pending_manager');

  const allRooms = [...GLOBAL_ROOMS.regular, ...GLOBAL_ROOMS.multipurpose];

  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suggestedAlternative, setSuggestedAlternative] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState(GLOBAL_ROOMS.multipurpose[0]);
  const [date, setDate] = useState('');
  
  const [timeMode, setTimeMode] = useState('standard');
  const [standardTime, setStandardTime] = useState(TIME_SLOTS[0]);
  const [customTime, setCustomTime] = useState('');
  const [reason, setReason] = useState('');

  const selectedTime = timeMode === 'standard' ? standardTime : customTime;
  const isInvalidCustom = timeMode === 'custom' && !isOutsideWorkingHours(customTime);

  const isBooked = bookings.some(b => 
    b.roomName === roomName && 
    b.date === date && 
    b.time === selectedTime && 
    (b.status === 'approved' || b.status === 'pending_manager')
  );

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

  const handleAdminMultipurposeRequest = (e) => {
    e.preventDefault();
    if (isInvalidCustom) return;

    const result = addBooking({
      applicantId: user.id,
      applicantName: user.name,
      applicantRole: user.role,
      roomType: 'multipurpose',
      roomName,
      date,
      time: selectedTime,
      reason
    });
    
    if (result.success) {
      setRoomName(GLOBAL_ROOMS.multipurpose[0]); setDate(''); setStandardTime(TIME_SLOTS[0]); setCustomTime(''); setTimeMode('standard'); setReason('');
      setShowModal(false);
      alert('Request sent directly to Branch Manager.');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem', position: 'relative' }}>
      
      <button 
        style={styles.fab} 
        onClick={() => setShowModal(true)} 
        title="Request Multipurpose Room"
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <Plus size={20} color="#fff" /> Request Flex-Room
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
                  <label className="form-label">Time Selection</label>
                  <select className="form-control" value={timeMode === 'standard' ? standardTime : 'custom'} onChange={(e) => {
                    if(e.target.value === 'custom') {
                      setTimeMode('custom');
                    } else {
                      setTimeMode('standard');
                      setStandardTime(e.target.value);
                    }
                  }}>
                    {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                    <option value="custom">[ Custom Time (Off-Hours) ]</option>
                  </select>
                </div>
              </div>
              
              {timeMode === 'custom' && (
                <div className="form-group animate-fade-in" style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', borderLeft: '3px solid var(--primary-color)' }}>
                  <label className="form-label">Custom Off-Hours Time</label>
                  <input type="time" className="form-control" value={customTime} onChange={(e) => setCustomTime(e.target.value)} required />
                  {isInvalidCustom && customTime && (
                    <p style={{ color: '#cc0000', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}>
                      <strong>Restricted:</strong> Time ({customTime}) is during standard working hours. Please use the dropdown grid explicitly.
                    </p>
                  )}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Reason</label>
                <textarea className="form-control" rows="2" value={reason} onChange={(e) => setReason(e.target.value)} required></textarea>
              </div>
              
              {isBooked && selectedTime && date && (
                <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <strong>Warning:</strong> This room is booked at this date and time!
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', opacity: (isBooked || isInvalidCustom) ? 0.5 : 1 }} disabled={isBooked || isInvalidCustom || !date || !selectedTime}>
                {isBooked ? 'Unavailable' : isInvalidCustom ? 'Invalid Time' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <p style={{ color: '#666' }}>System overview, approvals, and status tracking.</p>
      </div>

      {notifications.length > 0 && (
        <div style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffecb5', padding: '1rem', marginBottom: '2rem', borderRadius: '4px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.5rem 0', color: '#856404' }}>
            <Bell size={18} /> Notifications from Branch Manager
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#856404' }}>
            {notifications.map(n => <li key={n.id}>[{n.date}] {n.message}</li>)}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Building size={20} /> All Rooms Availability Schedule
        </h3>
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
           <table style={styles.table}>
             <thead>
               <tr>
                 <th>Room Name</th>
                 <th>Status</th>
                 <th>Date</th>
                 <th>Time</th>
                 <th>Applicant</th>
               </tr>
             </thead>
             <tbody>
               {allRooms.map(room => {
                 const currentBooking = activeBookings.find(b => b.roomName.toLowerCase() === room.toLowerCase());
                 
                 return (
                   <tr key={room} style={{ backgroundColor: currentBooking ? 'rgba(255, 0, 0, 0.02)' : 'white' }}>
                     <td style={{ fontWeight: 'bold' }}>{room}</td>
                     <td>
                       {currentBooking ? 
                         <span style={styles.badgeDanger}>Occupied</span> : 
                         <span style={styles.badgeSuccess}>Available</span>
                       }
                     </td>
                     <td>{currentBooking ? currentBooking.date : '--'}</td>
                     <td>{currentBooking ? currentBooking.time : '--'}</td>
                     <td>{currentBooking ? `${currentBooking.applicantName} (${currentBooking.applicantRole})` : '--'}</td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
        </div>
      </div>

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
  fab: { position: 'fixed', bottom: '2rem', right: '2rem', padding: '0.75rem 1.5rem', borderRadius: '30px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', boxShadow: '0 6px 15px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', zIndex: 100, fontWeight: 'bold', letterSpacing: '0.5px', transition: 'all 0.3s ease', backgroundImage: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200, padding: '1rem' },
  modalContent: { width: '100%', maxWidth: '500px', padding: '2rem', backgroundColor: 'white', position: 'relative' }
};

export default AdminDashboard;
