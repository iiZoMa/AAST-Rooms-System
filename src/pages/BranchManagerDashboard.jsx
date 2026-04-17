import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings, GLOBAL_ROOMS, TIME_SLOTS, isOutsideWorkingHours } from '../context/BookingContext';
import { CheckCircle, XCircle, AlertTriangle, User, Calendar, Edit3, Save } from 'lucide-react';

const BranchManagerDashboard = () => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus, forceModifyBooking } = useBookings();

  const pendingRequests = bookings.filter(b => b.status === 'pending_manager');
  const allBookings = bookings;
  
  const [editing, setEditing] = useState(null);
  const [timeMode, setTimeMode] = useState('standard');
  const [customTime, setCustomTime] = useState('');

  const handleApprove = (id) => updateBookingStatus(id, 'approved');
  const handleReject = (id) => updateBookingStatus(id, 'rejected', 'Branch Manager invoked final refusal.');

  const startEdit = (booking) => {
    const isStandard = TIME_SLOTS.includes(booking.time);
    setTimeMode(isStandard ? 'standard' : 'custom');
    if (!isStandard) {
       setCustomTime(booking.time || '');
    }
    setEditing({ ...booking });
  };

  const handleSaveModification = () => {
    let finalTime = editing.time;
    if (timeMode === 'custom') {
       if (!isOutsideWorkingHours(customTime)) {
         alert('Cannot override with this custom hour block! Modifying custom times is strictly reserved for OUTSIDE standard working hours only. Please select a time off-peak, or use the standard grid.');
         return;
       }
       finalTime = customTime;
    }

    const { id, roomName, date, reason } = editing;
    const result = forceModifyBooking(id, { roomName, date, time: finalTime, reason }, user.name);
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
        <h1>Branch Manager Operations</h1>
        <p style={{ color: '#666' }}>Final authorization & Override command center.</p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
          <AlertTriangle size={20} /> Action Required (Multipurpose Approvals)
        </h3>
        {pendingRequests.length === 0 ? (
          <p style={{ color: '#888' }}>No multipurpose requests pending final review.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
            {pendingRequests.map(b => (
              <div key={b.id} className="glass-panel" style={{ borderLeft: '4px solid var(--accent-color)', padding: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{b.roomName}</h4>
                <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}><User size={14} className="inline-icon" /> {b.applicantName} ({b.applicantRole})</p>
                <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}><Calendar size={14} className="inline-icon" /> {b.date} at {b.time}</p>
                <p style={{ fontSize: '0.9rem', margin: '0 0 1rem 0' }}><strong>Reason:</strong> {b.reason}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleApprove(b.id)} className="btn btn-success" style={{ flex: 1 }}>Final Approve</button>
                  <button onClick={() => handleReject(b.id)} className="btn btn-danger" style={{ flex: 1 }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Edit3 size={20} /> Master Registry & Override Console
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
          Use the Master Console to view every active footprint in the building. You may directly overwrite booking parameters without permission if the University requires it.
        </p>

        {editing ? (
          <div className="glass-panel animate-fade-in" style={{ borderTop: '4px solid #ff9800', marginBottom: '2rem' }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>Modifying Booking: {editing.id}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Room</label>
                <select className="form-control" value={editing.roomName} onChange={e => setEditing({...editing, roomName: e.target.value})}>
                  {Object.values(GLOBAL_ROOMS).flat().map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={editing.date} onChange={e => setEditing({...editing, date: e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
               <label className="form-label">Time Selection</label>
               <select className="form-control" value={timeMode === 'standard' ? editing.time : 'custom'} onChange={(e) => {
                 if(e.target.value === 'custom') {
                   setTimeMode('custom');
                 } else {
                   setTimeMode('standard');
                   setEditing({...editing, time: e.target.value});
                 }
               }}>
                 {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                 <option value="custom">[ Custom Time (Off-Hours) ]</option>
               </select>
            </div>

            {timeMode === 'custom' && (
              <div className="form-group animate-fade-in" style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px', borderLeft: '3px solid #ff9800' }}>
                <label className="form-label">Custom Off-Hours Time</label>
                <input type="time" className="form-control" value={customTime} onChange={(e) => setCustomTime(e.target.value)} required />
                {!isOutsideWorkingHours(customTime) && customTime && (
                  <p style={{ color: '#cc0000', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}>
                     <strong>Restricted:</strong> Time ({customTime}) is during standard working hours. Please use the core grid above.
                  </p>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleSaveModification} 
                style={{ flex: 1, opacity: (timeMode === 'custom' && !isOutsideWorkingHours(customTime)) ? 0.5 : 1 }} 
                disabled={timeMode === 'custom' && !isOutsideWorkingHours(customTime)}
              >
                <Save size={16} /> Broadcast Changes
              </button>
              <button className="btn" onClick={() => setEditing(null)} style={{ flex: 1, backgroundColor: '#eee' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '1rem' }}>ID</th>
                  <th style={{ padding: '1rem' }}>Applicant</th>
                  <th style={{ padding: '1rem' }}>Room</th>
                  <th style={{ padding: '1rem' }}>Date & Time</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>#{b.id.toString().slice(-4)}</td>
                    <td style={{ padding: '1rem' }}>{b.applicantName}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{b.roomName}</td>
                    <td style={{ padding: '1rem' }}>{b.date} / {b.time}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        backgroundColor: b.status === 'approved' ? '#d4edda' : b.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                        color: b.status === 'approved' ? '#155724' : b.status === 'rejected' ? '#721c24' : '#856404'
                      }}>
                        {b.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn" onClick={() => startEdit(b)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Edit Slot</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default BranchManagerDashboard;
