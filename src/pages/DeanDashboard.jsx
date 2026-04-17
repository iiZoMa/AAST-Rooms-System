import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { Check, X, Clock3, MapPin, User, FileText } from 'lucide-react';

const DeanDashboard = () => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus } = useBookings();

  const pendingRequests = bookings.filter(b => b.status === 'pending_dean');
  const pastActions = bookings.filter(b => b.status !== 'pending_dean' && b.roomType === 'multipurpose');

  const handleApprove = (id) => {
    updateBookingStatus(id, 'pending_faisal');
    // alert is optional but good for mockup feedback
  };

  const handleReject = (id) => {
    updateBookingStatus(id, 'rejected');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1>لوحة تحكم السيد العميد / {user.name}</h1>
          <p style={{ color: '#666' }}>طلبات القاعات المتعددة الأغراض بانتظار موافقتك (مرحلة 1)</p>
        </div>
        <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{pendingRequests.length}</span>
          <span style={{ marginRight: '0.5rem', color: '#666' }}>طلبات معلقة</span>
        </div>
      </div>

      <div style={styles.grid}>
        <div>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Clock3 size={20} color="var(--warning)" /> الطلبات المعلقة (Pending)
          </h3>
          
          {pendingRequests.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Check size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#888' }}>لا توجد طلبات معلقة بانتظار موافقتك حالياً.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingRequests.map(b => (
                <div key={b.id} className="glass-panel" style={{ borderLeft: '4px solid var(--warning)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={18} /> {b.roomName}
                    </h4>
                    <span className="badge badge-pending">بانتظار قرارك</span>
                  </div>
                  
                  <div style={styles.requestDetails}>
                    <p><User size={14} className="inline-icon"/> <strong>مقدم الطلب:</strong> {b.staffName} (ID: {b.staffId})</p>
                    <p><Clock3 size={14} className="inline-icon"/> <strong>الموعد:</strong> {b.date} - {b.time}</p>
                  </div>
                  
                  <div style={styles.reasonBox}>
                    <p style={{ margin: 0 }}><strong><FileText size={14} className="inline-icon" /> سبب الحجز:</strong> {b.reason}</p>
                  </div>

                  <div style={styles.actions}>
                    <button onClick={() => handleApprove(b.id)} className="btn btn-success" style={{ flex: 1 }}>
                      <Check size={18} /> موافقة ورفع لدكتور فيصل
                    </button>
                    <button onClick={() => handleReject(b.id)} className="btn btn-danger" style={{ flex: 1 }}>
                      <X size={18} /> رفض الطلب
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: '1.5rem' }}>سجل الطلبات (History)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {pastActions.filter(b => b.status !== 'pending_dean').map(b => (
               <div key={b.id} className="glass-panel" style={{ opacity: 0.8 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{b.roomName}</strong>
                    {b.status === 'rejected' ? 
                      <span className="badge badge-rejected">مرفوض</span> : 
                      <span className="badge badge-approved">تم الرفع لدكتور فيصل / معتمد</span>
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
    backgroundColor: 'rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.05)',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
  }
};

export default DeanDashboard;
