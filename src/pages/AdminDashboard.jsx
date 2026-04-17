import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings, GLOBAL_ROOMS, TIME_SLOTS, isOutsideWorkingHours } from '../context/BookingContext';
import { Check, X, Clock3, Calendar, Bell, Building, CheckCircle, XCircle, Edit3, Save } from 'lucide-react';

const AdminDashboard = () => {
  const { user, users, approveUser, rejectUser } = useAuth();
  const { bookings, addBooking, updateBookingStatus, forceModifyBooking, notifications, addNotification } = useBookings();

  const pendingRequests = bookings.filter(b => b.status === 'pending_admin');
  const activeBookings = bookings.filter(b => b.status === 'approved' || b.status === 'pending_manager');
  const pendingUsers = Object.values(users || {}).filter(u => u.status === 'pending');
  const allBookings = bookings;
  
  const allRooms = [...GLOBAL_ROOMS.regular, ...GLOBAL_ROOMS.multipurpose];

  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suggestedAlternative, setSuggestedAlternative] = useState('');

  // Top Level Direct Multipurpose Request Logic
  const [roomName, setRoomName] = useState(GLOBAL_ROOMS.multipurpose[0]);
  const [date, setDate] = useState('');
  const [timeMode, setTimeMode] = useState('standard');
  const [standardTime, setStandardTime] = useState(TIME_SLOTS[0]);
  const [customReqTime, setCustomReqTime] = useState('');
  const [reason, setReason] = useState('');

  // Global Override Console Logic
  const [editing, setEditing] = useState(null);
  const [editTimeMode, setEditTimeMode] = useState('standard');
  const [editCustomTime, setEditCustomTime] = useState('');

  const selectedReqTime = timeMode === 'standard' ? standardTime : customReqTime;
  const isInvalidReqCustom = timeMode === 'custom' && !isOutsideWorkingHours(customReqTime);
  const isBooked = bookings.some(b => 
    b.roomName === roomName && 
    b.date === date && 
    b.time === selectedReqTime && 
    (b.status === 'approved' || b.status === 'pending_manager')
  );

  const handleApprove = (booking) => {
    const newStatus = booking.roomType === 'regular' ? 'approved' : 'pending_manager';
    const result = updateBookingStatus(booking.id, newStatus);
    if (!result.success) alert(result.message);
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
    if (isInvalidReqCustom) return;
    const result = addBooking({
      applicantId: user.id,
      applicantName: user.name,
      applicantRole: user.role,
      roomType: 'multipurpose',
      roomName,
      date,
      time: selectedReqTime,
      reason
    });
    if (result.success) {
      setRoomName(GLOBAL_ROOMS.multipurpose[0]); setDate(''); setStandardTime(TIME_SLOTS[0]); setCustomReqTime(''); setTimeMode('standard'); setReason('');
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

  // --- Master Console Functions ---
  const startEdit = (booking) => {
    const isStandard = TIME_SLOTS.includes(booking.time);
    setEditTimeMode(isStandard ? 'standard' : 'custom');
    if (!isStandard) setEditCustomTime(booking.time || '');
    setEditing({ ...booking });
  };

  const handleSaveModification = () => {
    let finalTime = editing.time;
    if (editTimeMode === 'custom') {
       if (!isOutsideWorkingHours(editCustomTime)) {
         alert('Cannot override with this custom hour block! Modifying custom times is strictly reserved for OUTSIDE standard working hours only. Please select a time off-peak, or use the standard grid.');
         return;
       }
       finalTime = editCustomTime;
    }
    const { id, roomName: newRoom, date: newDate, reason: newReason } = editing;
    const result = forceModifyBooking(id, { roomName: newRoom, date: newDate, time: finalTime, reason: newReason }, user.name);
    if (!result.success) {
      alert(result.message);
    } else {
      alert('Active modification broadcasted globally!');
      setEditing(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h1>Admin Operations Dashboard</h1>
        <p style={{ color: '#666' }}>System overview, approvals, status tracking, and global registry override access.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Top-Level Quick Book UI */}
        <div className="glass-panel" style={{ borderTop: '4px solid var(--primary-color)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} /> Request Multipurpose Flex-Room
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Bypasses Tier 1 approvals straight to the Branch Manager.</p>
          <form onSubmit={handleAdminMultipurposeRequest}>
            <div className="form-group">
              <label className="form-label">Room Location</label>
              <select className="form-control" value={roomName} onChange={(e) => setRoomName(e.target.value)} required>
                {GLOBAL_ROOMS.multipurpose.map(r => <option key={r} value={r}>{r}</option>)}
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
                  if(e.target.value === 'custom') setTimeMode('custom');
                  else { setTimeMode('standard'); setStandardTime(e.target.value); }
                }}>
                  {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  <option value="custom">[ Custom Time (Off-Hours) ]</option>
                </select>
              </div>
            </div>
            
            {timeMode === 'custom' && (
              <div className="form-group animate-fade-in" style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px', borderLeft: '3px solid var(--primary-color)' }}>
                <label className="form-label">Custom Off-Hours Time</label>
                <input type="time" className="form-control" value={customReqTime} onChange={(e) => setCustomReqTime(e.target.value)} required />
                {isInvalidReqCustom && customReqTime && (
                  <p style={{ color: '#cc0000', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}>
                    <strong>Restricted:</strong> Time ({customReqTime}) is during standard working hours. Please use the dropdown grid.
                  </p>
                )}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Reason</label>
              <textarea className="form-control" rows="2" value={reason} onChange={(e) => setReason(e.target.value)} required></textarea>
            </div>
            {isBooked && selectedReqTime && date && (
              <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <strong>Warning:</strong> This room is booked at this date and time!
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', opacity: (isBooked || isInvalidReqCustom) ? 0.5 : 1 }} disabled={isBooked || isInvalidReqCustom || !date || !selectedReqTime}>
              {isBooked ? 'Unavailable' : isInvalidReqCustom ? 'Invalid Time' : 'Send Request'}
            </button>
          </form>
        </div>

        {/* Global Notifications and Approvals Area */}
        <div>
          {pendingUsers.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Pending Account Approvals</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {pendingUsers.map(u => (
                  <div key={u.id} className="glass-panel" style={{ borderLeft: '4px solid var(--primary-color)', padding: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{u.name}</h4>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#666' }}>Role: {u.role} | ID: {u.id}</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-success" onClick={() => handleApproveUser(u.id)} style={{ flex: 1 }}><Check size={16} /> Approve</button>
                      <button className="btn btn-danger" onClick={() => rejectUser(u.id)} style={{ flex: 1 }}><X size={16} /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notifications.length > 0 && (
            <div style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffecb5', padding: '1rem', marginBottom: '2rem', borderRadius: '4px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.5rem 0', color: '#856404' }}>
                <Bell size={18} /> Administrative Tracking
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#856404', fontSize: '0.9rem' }}>
                {notifications.map(n => <li key={n.id} style={{ marginBottom: '0.25rem' }}>[{n.date}] {n.message}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Edit3 size={20} /> Master Registry & Global Override Console
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
          Room Managers possess unmitigated override privileges. Use the console to hard-modify conflicting bookings without secondary authorization.
        </p>

        {editing ? (
          <div className="glass-panel animate-fade-in" style={{ borderTop: '4px solid #cc0000', marginBottom: '2rem' }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>Global Modification: Ticket #{editing.id}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Force Room Change</label>
                <select className="form-control" value={editing.roomName} onChange={e => setEditing({...editing, roomName: e.target.value})}>
                  {Object.values(GLOBAL_ROOMS).flat().map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Force Date Change</label>
                <input type="date" className="form-control" value={editing.date} onChange={e => setEditing({...editing, date: e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
               <label className="form-label">Force Time Reallocation</label>
               <select className="form-control" value={editTimeMode === 'standard' ? editing.time : 'custom'} onChange={(e) => {
                 if(e.target.value === 'custom') setEditTimeMode('custom');
                 else { setEditTimeMode('standard'); setEditing({...editing, time: e.target.value}); }
               }}>
                 {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                 <option value="custom">[ Custom Time (Off-Hours) ]</option>
               </select>
            </div>

            {editTimeMode === 'custom' && (
              <div className="form-group animate-fade-in" style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px', borderLeft: '3px solid #cc0000' }}>
                <label className="form-label">Custom Off-Hours Time</label>
                <input type="time" className="form-control" value={editCustomTime} onChange={(e) => setEditCustomTime(e.target.value)} required />
                {!isOutsideWorkingHours(editCustomTime) && editCustomTime && (
                  <p style={{ color: '#cc0000', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}>
                     <strong>Restricted:</strong> Time ({editCustomTime}) is during standard working hours. Please use the core grid above.
                  </p>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleSaveModification} 
                style={{ flex: 1, backgroundColor: '#cc0000', border: 'none', opacity: (editTimeMode === 'custom' && !isOutsideWorkingHours(editCustomTime)) ? 0.5 : 1 }} 
                disabled={editTimeMode === 'custom' && !isOutsideWorkingHours(editCustomTime)}
              >
                <Save size={16} /> Execute Global Overwrite
              </button>
              <button className="btn" onClick={() => setEditing(null)} style={{ flex: 1, backgroundColor: '#eee' }}>Cancel Operation</button>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '1rem' }}>ID</th>
                  <th style={{ padding: '1rem' }}>Applicant</th>
                  <th style={{ padding: '1rem' }}>Room</th>
                  <th style={{ padding: '1rem' }}>Date & Time</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Authority Access</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>#{b.id.toString().slice(-4)}</td>
                    <td style={{ padding: '1rem' }}>{b.applicantName}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{b.roomName}</td>
                    <td style={{ padding: '1rem' }}>{b.date} / {b.time}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        backgroundColor: b.status === 'approved' ? '#d4edda' : b.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                        color: b.status === 'approved' ? '#155724' : b.status === 'rejected' ? '#721c24' : '#856404'
                      }}>
                        {b.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn" onClick={() => startEdit(b)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', backgroundColor: 'var(--primary-color)', color: '#fff', border: 'none' }}>Force Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3 style={{ margin: '2rem 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Clock3 size={20} /> Pending Frontline Requests
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
                <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>By {b.applicantName}</p>
                <p style={{ fontSize: '0.9rem', margin: '0 0 1rem 0' }}>{b.date} at {b.time}</p>
                
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
                      <Check size={16} /> Approve
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
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' }
};

export default AdminDashboard;
