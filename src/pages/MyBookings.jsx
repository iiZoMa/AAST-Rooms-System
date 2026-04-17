import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { Filter, Plus, Clock3, Users, Edit2, X, Check, History, Calendar } from 'lucide-react';

const MyBookings = () => {
  const { user } = useAuth();
  const { bookings, cancelBooking } = useBookings();
  const { t } = useLanguage();
  
  const myBookings = bookings.filter(b => b.applicantId === user.id);

  // Helper to format date into Day and Month
  const formatMonth = (dateStr) => {
    if (!dateStr) return 'MON';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  };
  
  const formatDay = (dateStr) => {
    if (!dateStr) return '00';
    const d = new Date(dateStr);
    return d.getDate().toString().padStart(2, '0');
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return { border: '#d1b06b', bg: '#fef3c7', text: '#92400e', label: t('confirmed') };
    if (status.includes('pending')) return { border: '#93c5fd', bg: '#e5e7eb', text: '#374151', label: t('pending_approval') };
    return { border: '#fca5a5', bg: '#fee2e2', text: '#991b1b', label: t('rejected') };
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 3rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>{t('my_bookings')}</h1>
          <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>{t('review_manage')}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ backgroundColor: '#f3f4f6', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '24px', fontWeight: '600' }}>
            <Filter size={16} /> {t('filter')}
          </button>
          <Link to="/multipurpose-request" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ backgroundColor: 'var(--primary-color)', padding: '0.75rem 1.25rem', borderRadius: '24px', fontWeight: '600' }}>
              <Plus size={16} /> {t('new_booking')}
            </button>
          </Link>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* Left Column - Upcoming */}
        <div style={{ flex: '2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>{t('upcoming')}</h2>
            <Link to="/fixed-schedule" style={{ color: 'var(--secondary-color)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>{t('view_calendar')}</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <Calendar size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#4b5563' }}>{t('no_bookings')}</h3>
                <p style={{ color: '#6b7280' }}>{t('no_bookings_desc')}</p>
              </div>
            ) : (
              myBookings.map(b => {
                const statusStyle = getStatusColor(b.status);
                return (
                  <div key={b.id} style={{ 
                    display: 'flex', 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    borderLeft: `6px solid ${statusStyle.border}`,
                    padding: '1.5rem',
                    position: 'relative'
                  }}>
                    {/* Date Block */}
                    <div style={{ backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '80px', marginRight: '1.5rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)', lineHeight: '1' }}>{formatDay(b.date)}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginTop: '0.25rem' }}>{formatMonth(b.date)}</span>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)' }}>{b.roomName}</h3>
                        <span style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusStyle.text }}></span>
                          {statusStyle.label}
                        </span>
                      </div>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>{b.roomType === 'multipurpose' ? t('special_facility') : t('academic_block')}</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#4b5563', fontSize: '0.85rem', fontWeight: '500' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock3 size={16} />
                          {b.time} - {b.time} {/* Placeholder for end time */}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Users size={16} />
                          {b.roomType === 'multipurpose' ? `150 ${t('attendees')}` : `25 ${t('attendees')}`}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', borderLeft: '1px solid #f3f4f6', paddingLeft: '1.5rem' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}>
                        <Edit2 size={20} />
                      </button>
                      <button onClick={() => cancelBooking(b.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Booking Summary Card */}
          <div style={{ backgroundColor: 'var(--primary-color)', borderRadius: '20px', padding: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.1rem', fontWeight: '600', color: 'white' }}>{t('booking_summary')}</h3>
            <div style={{ display: 'flex', gap: '3rem' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{t('this_month')}</p>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: '1' }}>{myBookings.length.toString().padStart(2, '0')}</div>
              </div>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{t('total_hours')}</p>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: '1' }}>{myBookings.length * 2}<span style={{ fontSize: '1.5rem', fontWeight: '400' }}>h</span></div>
              </div>
            </div>
            {/* Background graphic decoration */}
            <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', width: '150px', height: '150px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '24px', transform: 'rotate(15deg)' }}></div>
          </div>

          {/* Recent Past Card */}
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '20px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{t('recent_past')}</h3>
              <History size={18} color="#6b7280" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Dummy data for visual layout matching the mockup */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={16} color="#4b5563" />
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.9rem' }}>Study Room B</div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>02 Nov • 2 Hours</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={16} color="#4b5563" />
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.9rem' }}>Computer Lab 1</div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>28 Oct • 3 Hours</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyBookings;
