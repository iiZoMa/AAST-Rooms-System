import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings, GLOBAL_ROOMS } from '../context/BookingContext';
import { Check, X, Clock3, MapPin, User, FileText, Calendar, Bell, Building, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const { user, users, approveUser, rejectUser } = useAuth();
  const { bookings, addBooking, updateBookingStatus, notifications, addNotification, fixedSchedule, TIME_SLOTS, swapFixedScheduleRoom } = useBookings();
  const navigate = useNavigate();

  const pendingRequests = bookings.filter(b => b.status === 'pending_admin');
  const activeBookings = bookings.filter(b => b.status === 'approved' || b.status === 'pending_manager');
  const pendingUsers = Object.values(users || {}).filter(u => u.status === 'pending');

  const allRooms = [...GLOBAL_ROOMS.regular, ...GLOBAL_ROOMS.multipurpose];

  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suggestedAlternative, setSuggestedAlternative] = useState('');

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
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <p style={{ color: '#666' }}>System overview, approvals, and status tracking.</p>
      </div>

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
                {Object.values(users || {}).length > 0 ? (
                  Object.values(users).map((u, index) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No employees found in the database.</td>
                  </tr>
                )}
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

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} /> Daily Activity Report
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
  badgeSuccess: { backgroundColor: '#d4edda', color: '#155724', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' },
  badgeDanger: { backgroundColor: '#f8d7da', color: '#721c24', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' },
  fab: { position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200, padding: '1rem' },
  modalContent: { width: '100%', maxWidth: '500px', padding: '2rem', backgroundColor: 'white', position: 'relative' }
};

export default AdminDashboard;
