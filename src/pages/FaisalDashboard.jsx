import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { Check, X, Clock3, MapPin, User, FileText, CheckCircle } from 'lucide-react';

const FaisalDashboard = () => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus } = useBookings();

  // Dr. Faisal only sees requests that were already approved by Dean Akram (pending_faisal)
  const pendingRequests = bookings.filter(b => b.status === 'pending_faisal');
  const pastActions = bookings.filter(b => b.status === 'approved' || (b.status === 'rejected' && b.roomType === 'multipurpose')); // simplified history

  const handleApprove = (id) => {
    updateBookingStatus(id, 'approved');
  };

  const handleReject = (id) => {
    updateBookingStatus(id, 'rejected');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1>لوحة تحكم رئيس الأكاديمية / {user.name}</h1>
          <p style={{ color: '#666' }}>الاعتماد النهائي لطلبات القاعات المتعددة الأغراض (المرحلة 2)</p>
        </div>
        <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{pendingRequests.length}</span>
          <span style={{ marginRight: '0.5rem', color: '#666' }}>طلبات للاعتماد</span>
        </div>
      </div>

      <div style={styles.grid}>
        <div>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Clock3 size={20} color="var(--warning)" /> طلبات بانتظار الاعتماد النهائي
          </h3>
          
          {pendingRequests.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#888' }}>لا توجد طلبات معلقة بانتظار اعتمادك حالياً.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingRequests.map(b => (
                <div key={b.id} className="glass-panel" style={{ borderLeft: '4px solid var(--secondary-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={18} /> {b.roomName}
                    </h4>
                    <span className="badge" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', color: '#9e801c' }}>معتمد مبدئياً من العميد</span>
                  </div>
                  
                  <div style={styles.requestDetails}>
                    <p><User size={14} className="inline-icon"/> <strong>مقدم الطلب:</strong> {b.staffName} (ID: {b.staffId})</p>
                    <p><Clock3 size={14} className="inline-icon"/> <strong>الموعد:</strong> {b.date} - {b.time}</p>
                  </div>
                  
                  <div style={styles.reasonBox}>
                    <p style={{ margin: 0 }}><strong><FileText size={14} className="inline-icon" /> سبب الحجز:</strong> {b.reason}</p>
                  </div>

                  <div style={styles.actions}>
                    <button onClick={() => handleApprove(b.id)} className="btn btn-success" style={{ flex: 1, backgroundColor: 'var(--primary-color)' }}>
                      <Check size={18} /> اعتماد نهائي
                    </button>
                    <button onClick={() => handleReject(b.id)} className="btn btn-danger" style={{ flex: 1 }}>
                      <X size={18} /> رفض الإعتماد
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: '1.5rem' }}>سجل القرارات (History)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {pastActions.filter(b => b.status === 'approved' || b.status === 'rejected').map(b => (
               <div key={b.id} className="glass-panel" style={{ opacity: 0.8 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{b.roomName}</strong>
                    {b.status === 'rejected' ? 
                      <span className="badge badge-rejected">مرفوض</span> : 
                      <span className="badge badge-approved">تم الاعتماد النهائي</span>
                    }
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    مقدم الطلب: {b.staffName} | التاريخ: {b.date}
                  </div>
               </div>
             ))}
             {pastActions.length === 0 && <p style={{ color: '#888' }}>لا يوجد سجل حالياً.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(350px, 2fr) minmax(300px, 1fr)',
    gap: '2rem',
    alignItems: 'start',
  },
  requestDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.95rem'
  },
  reasonBox: {
    backgroundColor: '#fff',
    border: '1px solid #eee',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
  }
};

export default FaisalDashboard;
