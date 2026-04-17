import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings, GLOBAL_ROOMS, TIME_SLOTS, isOutsideWorkingHours } from '../context/BookingContext';
import { Calendar, Clock, CheckCircle, XCircle, Clock3, AlertCircle, Trash2, Building, Edit3, Save, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user, getActiveDelegations } = useAuth();
  const { bookings, addBooking, cancelBooking, forceModifyBooking, updateBookingStatus } = useBookings();
  
  const [roomType, setRoomType] = useState('regular');
  const [roomName, setRoomName] = useState(GLOBAL_ROOMS.regular[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIME_SLOTS[0]?.timeString || '');
  const [reason, setReason] = useState('');

  // Active Delegations and Substituted Bookings
  const activeDels = getActiveDelegations(user.id) || [];
  const hasAdminDelegation = activeDels.some(d => d.roleGranted === 'admin');
  
  const peerDelegators = activeDels.filter(d => d.roleGranted === 'employee').map(d => d.delegatorId);
  const myBookings = bookings.filter(b => b.applicantId === user.id);
  const substituteBookings = bookings.filter(b => peerDelegators.includes(b.applicantId));

  // Overrides tracking
  const canViewMasterRegistry = user.overrides && user.overrides.viewMasterRegistry;
  const canBypassLeadTimes = user.overrides && user.overrides.bypassLeadTimes;
  const canEditGlobalRegistry = user.overrides && user.overrides.enableGlobalEditing;
  const canApproveRequests = user.overrides && user.overrides.enableApprovals;
  
  const pendingRequests = bookings.filter(b => b.status === 'pending_admin');

  // Master Editing Logic
  const [editing, setEditing] = useState(null);
  const [editTimeMode, setEditTimeMode] = useState('standard');
  const [editCustomTime, setEditCustomTime] = useState('');

  const getMinDate = () => {
    if (canBypassLeadTimes) return new Date().toISOString().split('T')[0];
    const minimum = new Date();
    minimum.setDate(minimum.getDate() + 1);
    return minimum.toISOString().split('T')[0];
  };

  const isInvalidDate = date && date < getMinDate();
  const isBooked = bookings.some(b => b.roomName === roomName && b.date === date && b.time === time && (b.status === 'approved' || b.status === 'pending_manager'));

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setRoomType(type);
    setRoomName(GLOBAL_ROOMS[type][0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = addBooking({ applicantId: user.id, applicantName: user.name, applicantRole: user.role, roomType, roomName, date, time, reason });
    if (result.success) { alert(result.message); setRoomName(GLOBAL_ROOMS[roomType][0]); setDate(''); setTime(TIME_SLOTS[0]?.timeString || ''); setReason(''); } 
    else { alert(result.message); }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="badge badge-approved"><CheckCircle size={14} className="inline-icon" /> Approved</span>;
      case 'pending': return <span className="badge badge-pending"><Clock3 size={14} className="inline-icon" /> Pending Admin Review</span>;
      case 'pending_admin': return <span className="badge badge-pending"><Clock3 size={14} className="inline-icon" /> Pending Admin</span>;
      case 'pending_manager': return <span className="badge badge-pending"><Clock3 size={14} className="inline-icon" /> Pending Branch Manager</span>;
      case 'rejected': return <span className="badge badge-rejected"><XCircle size={14} className="inline-icon" /> Rejected</span>;
      default: return <span className="badge badge-pending">{status}</span>;
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
       if (!isOutsideWorkingHours(editCustomTime)) {
         alert('Cannot override with this custom hour block! Modifying custom times is strictly reserved for OUTSIDE standard working hours only.');
         return;
       }
       finalTime = editCustomTime;
    }
    const { id, roomName: newRoom, date: newDate, reason: newReason } = editing;
    const result = forceModifyBooking(id, { roomName: newRoom, date: newDate, time: finalTime, reason: newReason }, user.name);
    if (!result.success) alert(result.message);
    else { alert('Active modification broadcasted globally!'); setEditing(null); }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {hasAdminDelegation && (
        <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={18} /> Active Administrative Inheritance</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>You are currently operating inside of an authorized Admin leave period.</p>
          </div>
          <Link to="/admin" className="btn" style={{ backgroundColor: 'white', color: '#2563eb', fontWeight: 'bold' }}>Hot-Swap to Admin Dashboard</Link>
        </div>
      )}

      <h1 style={{ marginTop: '2rem' }}>Welcome, {user.name}</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Employee Room Booking Dashboard.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '3rem' }}>
        
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
                {GLOBAL_ROOMS[roomType].map(room => <option key={room} value={room}>{room}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Date {canBypassLeadTimes ? "(Bypass Override Active)" : "(Min. 24h)"}</label>
                <input type="date" className="form-control" min={getMinDate()} value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Time Slot</label>
                <select className="form-control" value={time} onChange={(e) => setTime(e.target.value)} required>
                  {TIME_SLOTS.map(slot => <option key={slot.id} value={slot.timeString}>{slot.timeString}</option>)}
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
      </div>

      <div style={styles.grid}>
        <div style={styles.listPanel}>
          <h3 style={{ marginBottom: '1.5rem' }}>My Original Bookings</h3>
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
                <button onClick={() => cancelBooking(b.id)} className="btn" style={{ marginTop: '1rem', width: '100%', backgroundColor: '#eee', color: '#cc0000', padding: '0.5rem' }}>
                  <Trash2 size={16} /> Cancel Request
                </button>
              )}
            </div>
          ))}
          {myBookings.length === 0 && <p style={{ color: '#888' }}>No generic bookings tracked.</p>}
        </div>

        {substituteBookings.length > 0 && (
          <div style={styles.listPanel}>
             <h3 style={{ marginBottom: '1.5rem', color: '#8b5cf6' }}>Inherited Substitute Monitoring</h3>
             {substituteBookings.map(b => (
               <div key={b.id} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #8b5cf6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                     <h4 style={{ margin: 0 }}>{b.roomName}</h4>
                     {getStatusBadge(b.status)}
                  </div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#666' }}>Owner: <strong>{b.applicantName}</strong></p>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{b.date} at {b.time}</p>
               </div>
             ))}
          </div>
        )}
      </div>

      {(canViewMasterRegistry || canEditGlobalRegistry) && (
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: canEditGlobalRegistry ? '#cc0000' : '#444' }}>
            <Building size={20} /> Master Registry Overview {canEditGlobalRegistry ? '(Execution Editing Enabled)' : '(View-Only Override)'}
          </h3>
          
          {editing && canEditGlobalRegistry ? (
             <div className="glass-panel animate-fade-in" style={{ borderTop: '4px solid #cc0000', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Global Modification: Ticket #{editing.id}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div><label className="form-label">Force Room Change</label><select className="form-control" value={editing.roomName} onChange={e => setEditing({...editing, roomName: e.target.value})}>{Object.values(GLOBAL_ROOMS).flat().map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                  <div><label className="form-label">Force Date Change</label><input type="date" className="form-control" value={editing.date} onChange={e => setEditing({...editing, date: e.target.value})} /></div>
                </div>
                <div style={{ marginBottom: '1rem' }}><label className="form-label">Force Time Reallocation</label><select className="form-control" value={editTimeMode === 'standard' ? editing.time : 'custom'} onChange={(e) => { if(e.target.value === 'custom') setEditTimeMode('custom'); else { setEditTimeMode('standard'); setEditing({...editing, time: e.target.value}); } }}>{TIME_SLOTS.map(slot => <option key={slot.id} value={slot.timeString}>{slot.timeString}</option>)}<option value="custom">[ Custom Time (Off-Hours) ]</option></select></div>
                {editTimeMode === 'custom' && (<div className="form-group animate-fade-in" style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px', borderLeft: '3px solid #cc0000' }}><label className="form-label">Custom Off-Hours Time</label><input type="time" className="form-control" value={editCustomTime} onChange={(e) => setEditCustomTime(e.target.value)} required /></div>)}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <button className="btn btn-primary" onClick={handleSaveModification} style={{ flex: 1, backgroundColor: '#cc0000', border: 'none', opacity: (editTimeMode === 'custom' && !isOutsideWorkingHours(editCustomTime)) ? 0.5 : 1 }} disabled={editTimeMode === 'custom' && !isOutsideWorkingHours(editCustomTime)}><Save size={16} /> Execute Global Overwrite</button>
                  <button className="btn" onClick={() => setEditing(null)} style={{ flex: 1, backgroundColor: '#eee' }}>Cancel Operation</button>
                </div>
             </div>
          ) : (
             <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                 <thead>
                   <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                     <th style={{ padding: '1rem' }}>Applicant</th>
                     <th style={{ padding: '1rem' }}>Room</th>
                     <th style={{ padding: '1rem' }}>Date & Time</th>
                     <th style={{ padding: '1rem' }}>Status</th>
                     {canEditGlobalRegistry && <th style={{ padding: '1rem' }}>Actions</th>}
                   </tr>
                 </thead>
                 <tbody>
                   {bookings.map(b => (
                     <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                       <td style={{ padding: '1rem' }}>{b.applicantName} ({b.applicantRole})</td>
                       <td style={{ padding: '1rem', fontWeight: 'bold' }}>{b.roomName}</td>
                       <td style={{ padding: '1rem' }}>{b.date} / {b.time}</td>
                       <td style={{ padding: '1rem' }}>{b.status.toUpperCase()}</td>
                       {canEditGlobalRegistry && (
                         <td style={{ padding: '1rem' }}>
                           <button className="btn" onClick={() => startEdit(b)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', backgroundColor: '#cc0000', color: '#fff', border: 'none' }}>Force Edit</button>
                         </td>
                       )}
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      )}

      {canApproveRequests && (
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ margin: '2rem 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
             <Clock3 size={20} /> Decentralized Administrative Approvals (Override Enabled)
          </h3>
          
          {pendingRequests.length === 0 ? (
            <p style={{ color: '#888' }}>No pending requests.</p>
          ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
              {pendingRequests.map(b => (
                <div key={b.id} className="glass-panel" style={{ borderLeft: '4px solid #10b981', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0 }}>{b.roomName}</h4>
                  </div>
                  <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>By {b.applicantName}</p>
                  <p style={{ fontSize: '0.9rem', margin: '0 0 1rem 0' }}>{b.date} at {b.time}</p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => updateBookingStatus(b.id, b.roomType === 'regular' ? 'approved' : 'pending_manager')} className="btn btn-success" style={{ flex: 1, minWidth: '150px' }}>
                      <Check size={16} /> Approve
                    </button>
                    <button onClick={() => updateBookingStatus(b.id, 'rejected', 'Decentralized Frontline Refusal')} className="btn btn-danger" style={{ flex: '0 0 auto' }}>
                      <X size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

const styles = { grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'start' }, formPanel: { padding: '2rem' }, listPanel: { display: 'flex', flexDirection: 'column' }, rejectionNotice: { backgroundColor: '#ffecec', color: '#cc0000', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '0.5rem' } };

export default EmployeeDashboard;
