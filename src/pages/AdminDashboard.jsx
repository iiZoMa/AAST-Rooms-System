import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings, GLOBAL_ROOMS, TIME_SLOTS, isOutsideWorkingHours } from '../context/BookingContext';
import { Check, X, Clock3, Calendar, Bell, Building, Edit3, Save, Plus, User } from 'lucide-react';

const AdminDashboard = () => {
  const { user, users, approveUser, rejectUser } = useAuth();
  const { 
    bookings, 
    addBooking, 
    updateBookingStatus, 
    notifications, 
    addNotification, 
    fixedSchedule, 
    swapFixedScheduleRoom,
    forceModifyBooking
  } = useBookings();
  const navigate = useNavigate();

  const pendingRequests = bookings.filter(b => b.status === 'pending_admin');
  const pendingUsers = Object.values(users || {}).filter(u => u.status === 'pending');
  const allBookings = bookings;

  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState(GLOBAL_ROOMS.multipurpose[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  // Global Override Console Logic
  const [editing, setEditing] = useState(null);
  const [editTimeMode, setEditTimeMode] = useState('standard');
  const [editCustomTime, setEditCustomTime] = useState('');

  const isBooked = bookings.some(b => 
    b.roomName === roomName && 
    b.date === date && 
    b.time === time && 
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
  };

  const submitRejection = () => {
    if (!rejectReason) return alert('Please provide a reason for rejection.');
    const result = updateBookingStatus(rejectId, 'rejected', rejectReason);
    if (result.success) {
      setRejectId(null);
      setRejectReason('');
    } else {
      alert(result.message);
    }
  };

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
      alert(result.message);
      setShowModal(false);
      setRoomName(GLOBAL_ROOMS.multipurpose[0]);
      setDate('');
      setTime('');
      setReason('');
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

  const startEdit = (booking) => {
    const isStandard = TIME_SLOTS.some(slot => slot.timeString === booking.time);
    setEditTimeMode(isStandard ? 'standard' : 'custom');
    if (!isStandard) setEditCustomTime(booking.time || '');
    setEditing({ ...booking });
  };

  const handleSaveModification = () => {
    let finalTime = editing.time;
    if (editTimeMode === 'custom') {
      if (typeof isOutsideWorkingHours === 'function' && !isOutsideWorkingHours(editCustomTime)) {
        alert('Cannot override with this custom hour block! Modifying custom times is strictly reserved for OUTSIDE standard working hours only.');
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
        <h1>Admin Operations Dashboard</h1>
        <p style={{ color: '#666' }}>System overview, approvals, status tracking, and global registry override.</p>
      </div>

      {/* Employees Database */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building size={20} /> Employees Database
        </h3>
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Employee ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Full Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(users || {}).map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>{u.id}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: '#1e293b' }}>{u.name}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#64748b' }}>
                      <span style={{ textTransform: 'capitalize' }}>{u.role.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.2rem 0.5rem', 
                        backgroundColor: u.status === 'pending' ? '#fef3c7' : '#d1fae5', 
                        color: u.status === 'pending' ? '#92400e' : '#065f46', 
                        borderRadius: '4px', 
                        fontWeight: '700' 
                      }}>
                        {u.status === 'pending' ? 'WAITING' : 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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

      {/* Global Override Console */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Edit3 size={20} /> Master Registry & Global Override Console
        </h3>
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
                 {TIME_SLOTS.map(slot => <option key={slot.timeString} value={slot.timeString}>{slot.timeString}</option>)}
                 <option value="custom">[ Custom Time (Off-Hours) ]</option>
               </select>
            </div>
            {editTimeMode === 'custom' && (
              <div className="form-group animate-fade-in" style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px', borderLeft: '3px solid #cc0000' }}>
                <label className="form-label">Custom Off-Hours Time</label>
                <input type="time" className="form-control" value={editCustomTime} onChange={(e) => setEditCustomTime(e.target.value)} required />
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={handleSaveModification} style={{ flex: 1, backgroundColor: '#cc0000', border: 'none' }}>
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
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: b.status === 'approved' ? '#d4edda' : b.status === 'rejected' ? '#f8d7da' : '#fff3cd', color: b.status === 'approved' ? '#155724' : b.status === 'rejected' ? '#721c24' : '#856404' }}>
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
                <h4 style={{ margin: 0 }}>{b.roomName} ({b.roomType === 'regular' ? 'Regular' : 'Multipurpose'})</h4>
                <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>By {b.applicantName}</p>
                <p style={{ fontSize: '0.9rem', margin: '0 0 1rem 0' }}>{b.date} at {b.time}</p>
                
                {rejectId === b.id ? (
                  <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Provide Rejection Details</p>
                    <input type="text" placeholder="Reason for refusal" className="form-control" style={{ marginBottom: '0.5rem' }} value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-danger" onClick={submitRejection} style={{ flex: 1 }}>Submit Reject</button>
                      <button className="btn" onClick={() => setRejectId(null)} style={{ flex: 1, backgroundColor: '#ccc' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => handleApprove(b)} className="btn btn-success" style={{ flex: 1, minWidth: '150px' }}><Check size={16} /> Approve</button>
                    <button onClick={() => handleRejectPrompt(b.id)} className="btn btn-danger" style={{ flex: '0 0 auto' }}><X size={16} /> Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} /> Daily Activity Report
        </h3>
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</th>
                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activity / Change</th>
                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {(notifications && notifications.length > 0) ? (
                notifications.slice().reverse().map((notif, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {notif.date.includes(',') ? notif.date.split(',')[1].trim() : notif.date}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>
                      {notif.message}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '4px', fontWeight: '600' }}>
                        SYSTEM
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                    No activity logs recorded for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  fab: { position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200, padding: '1rem' },
  modalContent: { width: '100%', maxWidth: '500px', padding: '2rem', backgroundColor: 'white', position: 'relative', borderRadius: '12px' }
};

export default AdminDashboard;
