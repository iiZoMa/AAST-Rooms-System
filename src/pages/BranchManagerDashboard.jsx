import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings, GLOBAL_ROOMS } from '../context/BookingContext';
import { Check, X, Clock3, Edit } from 'lucide-react';

const BranchManagerDashboard = () => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus, forceModifyBooking, notifications } = useBookings();

  const pendingRequests = bookings.filter(b => b.status === 'pending_manager');
  const allBookings = bookings.filter(b => b.status !== 'rejected');
  const allRooms = [...GLOBAL_ROOMS.regular, ...GLOBAL_ROOMS.multipurpose];

  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suggestedAlternative, setSuggestedAlternative] = useState('');

  const [editId, setEditId] = useState(null);
  const [editRoomName, setEditRoomName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  const handleApprove = (id) => updateBookingStatus(id, 'approved');

  const handleRejectPrompt = (id) => {
    setRejectId(id);
    setRejectReason('');
    setSuggestedAlternative('');
  };

  const submitRejection = () => {
    updateBookingStatus(rejectId, 'rejected', rejectReason, suggestedAlternative);
    setRejectId(null);
  };

  const handleEditPrompt = (booking) => {
    setEditId(booking.id);
    setEditRoomName(booking.roomName);
    setEditDate(booking.date);
    setEditTime(booking.time);
  };

  const submitEdit = () => {
    const result = forceModifyBooking(editId, { roomName: editRoomName, date: editDate, time: editTime }, user.name);
    if (!result.success) {
      alert(result.message);
    } else {
      setEditId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h1>Branch Manager Dashboard</h1>
        <p style={{ color: '#666' }}>Ultimate authority over multipurpose rooms and forced booking modifications.</p>
      </div>



      <div style={styles.grid}>
        <div>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Clock3 size={20} /> Pending Multipurpose Approvals
          </h3>
          {pendingRequests.length === 0 ? (
            <p style={{ color: '#888' }}>No pending requests.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingRequests.map(b => (
                <div key={b.id} className="glass-panel" style={{ borderLeft: '4px solid var(--secondary-color)', padding: '1.5rem' }}>
                  <h4>{b.roomName}</h4>
                  <p style={{ fontSize: '0.9rem' }}>By: {b.applicantName} ({b.applicantRole})</p>
                  <p style={{ fontSize: '0.9rem' }}>When: {b.date} at {b.time}</p>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Reason: {b.reason}</p>
                  
                  {rejectId === b.id ? (
                    <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Provide Rejection Details</p>
                      <input type="text" placeholder="Reason for refusal" className="form-control" style={{ marginBottom: '0.5rem' }} value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                      <select className="form-control" style={{ marginBottom: '1rem' }} value={suggestedAlternative} onChange={e => setSuggestedAlternative(e.target.value)}>
                        <option value="">-- No suggestion --</option>
                        {allRooms.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-danger" onClick={submitRejection} style={{ flex: 1 }}>Confirm Reject</button>
                        <button className="btn" onClick={() => setRejectId(null)} style={{ flex: 1, backgroundColor: '#ccc' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleApprove(b.id)} className="btn btn-success" style={{ flex: 1 }}><Check size={16} /> Finalize Approval</button>
                      <button onClick={() => handleRejectPrompt(b.id)} className="btn btn-danger" style={{ flex: 1 }}><X size={16} /> Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Edit size={20} /> Direct Modifications Console
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Modifying bookings here will instantly notify the Admin.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {allBookings.map(b => (
               <div key={b.id} className="glass-panel" style={{ padding: '1rem', fontSize: '0.9rem' }}>
                 {editId === b.id ? (
                   <div>
                     <select className="form-control" style={{ marginBottom: '0.5rem' }} value={editRoomName} onChange={e => setEditRoomName(e.target.value)}>
                        {allRooms.map(r => <option key={r} value={r}>{r}</option>)}
                     </select>
                     <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                       <input type="date" className="form-control" value={editDate} onChange={e => setEditDate(e.target.value)} />
                       <input type="time" className="form-control" value={editTime} onChange={e => setEditTime(e.target.value)} />
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={submitEdit} style={{ flex: 1, padding: '0.25rem' }}>Save</button>
                        <button className="btn" onClick={() => setEditId(null)} style={{ flex: 1, padding: '0.25rem', backgroundColor: '#ccc' }}>Cancel</button>
                     </div>
                   </div>
                 ) : (
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                       <strong style={{ display: 'block' }}>{b.roomName} </strong>
                       <span style={{ color: '#666' }}>{b.date} {b.time} - {b.applicantName}</span>
                     </div>
                     <button className="btn" style={{ padding: '0.5rem', backgroundColor: '#eee', color: '#333' }} onClick={() => handleEditPrompt(b)}>Edit</button>
                   </div>
                 )}
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = { grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' } };

export default BranchManagerDashboard;
