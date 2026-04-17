import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { Calendar, Clock, MapPin, FileText, CheckCircle, XCircle, Clock3 } from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  const { bookings, addBooking } = useBookings();
  
  const [roomType, setRoomType] = useState('regular');
  const [roomName, setRoomName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myBookings = bookings.filter(b => b.staffId === user.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate slight network delay for visual effect
    setTimeout(() => {
      addBooking({
        staffId: user.id,
        staffName: user.name,
        roomType,
        roomName,
        date,
        time,
        reason
      });
      setIsSubmitting(false);
      setRoomName('');
      setDate('');
      setTime('');
      setReason('');
      alert('تم تقديم طلب الحجز بنجاح!');
    }, 800);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="badge badge-approved"><CheckCircle size={14} className="inline-icon" /> مكتمل / معتمد</span>;
      case 'pending_dean': return <span className="badge badge-pending"><Clock3 size={14} className="inline-icon" /> بانتظار موافقة العميد</span>;
      case 'pending_faisal': return <span className="badge badge-pending"><Clock3 size={14} className="inline-icon" /> بانتظار موافقة د. فيصل</span>;
      case 'rejected': return <span className="badge badge-rejected"><XCircle size={14} className="inline-icon" /> مرفوض</span>;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <h1 style={{ marginTop: '2rem' }}>مرحباً، {user.name}</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>لوحة تحكم حجز القاعات الخاصة بك.</p>
      
      <div style={styles.grid}>
        {/* Reservation Form */}
        <div className="glass-panel" style={styles.formPanel}>
          <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} /> طلب حجز جديد (E-Form)
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">نوع القاعة</label>
              <select className="form-control" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                <option value="regular">قاعة عادية (محاضرات / سكاشن)</option>
                <option value="multipurpose">قاعة متعددة الأغراض</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">اسم / رقم القاعة</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={styles.inputIcon} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingRight: '2.5rem' }} 
                  placeholder="مثال: قاعة 101, مدرج أ" 
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">التاريخ</label>
                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">الوقت</label>
                <div style={{ position: 'relative' }}>
                   <Clock size={18} style={styles.inputIcon} />
                   <input type="time" className="form-control" style={{ paddingRight: '2.5rem' }} value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>
            </div>

            {roomType === 'multipurpose' && (
              <div className="form-group animate-fade-in" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
                <label className="form-label" style={{ color: '#b99522' }}>سبب الحجز / النشاط (متطلب للقاعات متعددة الأغراض)</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="يرجى كتابة أسباب حجز القاعة المتعددة الأغراض لكي يتم مراجعتها من قبل السيد العميد وبعدها السيد رئيس الأكاديمية (د. فيصل)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                ></textarea>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>ملاحظة: هذا الطلب سيمر بدورة موافقات.</p>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الحجز'}
            </button>
          </form>
        </div>

        {/* Previous Bookings */}
        <div style={styles.listPanel}>
          <h3 style={{ marginBottom: '1.5rem' }}>حجوزاتي السابقة</h3>
          
          {myBookings.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <FileText size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#888' }}>لا توجد حجوزات سابقة لك حتى الآن.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myBookings.map(b => (
                <div key={b.id} className="glass-panel" style={styles.bookingCard}>
                  <div style={styles.cardHeader}>
                    <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>{b.roomName}</h4>
                    {getStatusBadge(b.status)}
                  </div>
                  <div style={styles.cardBody}>
                    <p><strong>التاريخ:</strong> {b.date}</p>
                    <p><strong>الوقت:</strong> {b.time}</p>
                    <p><strong>النوع:</strong> {b.roomType === 'regular' ? 'قاعة عادية' : 'متعددة الأغراض'}</p>
                    {b.reason && <p><strong>السبب:</strong> {b.reason}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    alignItems: 'start',
  },
  formPanel: {
    padding: '2rem',
  },
  listPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputIcon: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
  },
  bookingCard: {
    padding: '1.5rem',
    transition: 'var(--transition)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.5rem',
  },
  cardBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
    fontSize: '0.9rem',
  }
};

export default StaffDashboard;
