import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings, GLOBAL_ROOMS } from '../context/BookingContext';
import { Search, Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, Trash2, Edit2, ChevronRight, Settings, SlidersHorizontal, Users } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const [activeTab, setActiveTab] = useState('overview'); // overview, find-space, my-bookings
  const [searchQuery, setSearchQuery] = useState('');

  const myBookings = bookings.filter(b => b.applicantId === user.id);

  const renderOverview = () => (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--primary-color)', fontWeight: 800 }}>Overview</h1>
          <p className="text-gray" style={{ fontSize: '1.1rem' }}>Today's Academic Ledger</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: 12, color: '#9ca3af' }} />
          <input 
            type="text" 
            placeholder="Search halls, rooms, or events..." 
            className="form-control" 
            style={{ paddingLeft: '2.5rem', width: '300px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '24px' }}
          />
          <span style={{ position: 'absolute', right: 16, top: 12, fontSize: '0.8rem', fontWeight: 'bold', color: '#9ca3af' }}>FIND</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-color)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>
                <CheckCircle size={16} /> SYSTEM STATUS
              </div>
              <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '2rem' }}>Campus Utilization Optimal</h2>
              
              <div style={{ display: 'flex', gap: '3rem' }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase' }}>Available Halls</p>
                  <p style={{ color: 'var(--secondary-color)', fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>24</p>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase' }}>Active Bookings</p>
                  <p style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>142</p>
                </div>
              </div>
            </div>
            {/* Abstract building shape decoration */}
            <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', opacity: 0.1, transform: 'scale(1.5)' }}>
               <svg width="200" height="200" viewBox="0 0 24 24" fill="white"><path d="M3 21h18v-2H3v2zm6-4h2V7H9v10zm4 0h2V7h-2v10zM3 5l9-4 9 4v2H3V5z"/></svg>
            </div>
          </div>

          <div className="glass-panel">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ margin: 0 }}>Today's Schedule</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--secondary-color)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>VIEW ALL</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { time: '09:00', period: 'AM', title: 'Advanced Logistics', prof: 'Prof. Ahmed Youssef', room: 'Room 304' },
                { time: '11:30', period: 'AM', title: 'Marine Engineering Practicum', prof: 'Lab Building B', room: 'Lab 02' },
                { time: '02:00', period: 'PM', title: 'Faculty Meeting', prof: 'Department Heads', room: 'Conf. A' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                  <div style={{ paddingRight: '1rem', borderRight: '3px solid var(--secondary-color)', textAlign: 'center', width: '80px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{item.time}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>{item.period}</div>
                  </div>
                  <div style={{ flex: 1, paddingLeft: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>{item.prof}</div>
                  </div>
                  <div style={{ backgroundColor: '#f3f4f6', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {item.room}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ backgroundColor: '#e5e7eb', border: 'none' }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Upcoming</h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>Next major event requires attention.</p>
            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                 <div style={{ backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '8px' }}><Calendar size={20} /></div>
                 <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>IN 2 HRS</span>
               </div>
               <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Maritime Law Seminar</h4>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-gray)', fontSize: '0.85rem' }}>
                 <MapPin size={14} /> Hall A, Main Building
               </div>
            </div>
          </div>

          <div className="glass-panel" style={{ backgroundColor: '#f9fafb' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ margin: 0 }}>Alerts</h3>
              <AlertCircle size={18} color="var(--secondary-color)" />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
               <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                 <AlertCircle size={16} />
               </div>
               <div>
                 <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Projector Maintenance</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '0.25rem' }}>Hall B projector requires urgent bulb replacement before 3 PM.</div>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
               <div style={{ backgroundColor: '#fef3c7', color: '#b45309', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                 <AlertCircle size={16} />
               </div>
               <div>
                 <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>New Booking Request</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '0.25rem' }}>Student Union requested Main Auditorium for Friday.</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyBookings = () => (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--primary-color)', fontWeight: 800 }}>My Bookings</h1>
      <p className="text-gray" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Review and manage your upcoming reservations across campus facilities.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
         <button className="btn btn-outline" style={{ backgroundColor: '#e5e7eb', border: 'none' }}><SlidersHorizontal size={16} /> Filter</button>
         <button className="btn btn-primary" onClick={() => setActiveTab('find-space')}>+ New Booking</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Upcoming</h3>
            <button style={{ background: 'none', border: 'none', color: 'var(--secondary-color)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>View Calendar</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myBookings.length === 0 ? <p className="text-gray">No bookings found.</p> : myBookings.map((b, idx) => (
              <div key={b.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderLeft: `6px solid ${b.status === 'approved' ? 'var(--secondary-color)' : '#93c5fd'}` }}>
                <div style={{ backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '1rem', textAlign: 'center', width: '80px', marginRight: '1.5rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{b.date.split('-')[2] || '14'}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)', textTransform: 'uppercase' }}>NOV</div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{b.roomName}</h4>
                    {b.status === 'approved' ? 
                      <span className="badge badge-pending" style={{ backgroundColor: '#fef3c7' }}><CheckCircle size={12} /> Confirmed</span> : 
                      <span className="badge" style={{ backgroundColor: '#e5e7eb', color: '#4b5563' }}><Clock size={12} /> Pending Approval</span>
                    }
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-gray)', marginBottom: '0.5rem' }}>Building C, Room 302</div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {b.time} - {b.time.replace('00', '30')}</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={14} /> 25 Attendees</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}><Edit2 size={18} /></button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><XCircle size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontWeight: 600 }}>Booking Summary</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.25rem' }}>This Month</div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>04</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Total Hours</div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>12<span style={{ fontSize: '1rem', fontWeight: 400, color: '#9ca3af' }}>h</span></div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ backgroundColor: '#f9fafb' }}>
            <div className="flex justify-between items-center mb-4">
              <h4 style={{ margin: 0 }}>Recent Past</h4>
              <Clock3 size={16} color="var(--text-gray)" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Study Room B', date: '02 Nov', hours: '2 Hours' },
                { title: 'Computer Lab 1', date: '28 Oct', hours: '3 Hours' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#e5e7eb', padding: '0.5rem', borderRadius: '50%', color: 'var(--text-gray)' }}>
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>{item.date} • {item.hours}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: '2rem' }}>
       {/* Tab navigation for demo purposes */}
       <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
         <button className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('overview')}>Overview</button>
         <button className={`btn ${activeTab === 'my-bookings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('my-bookings')}>My Bookings</button>
       </div>

       {activeTab === 'overview' && renderOverview()}
       {activeTab === 'my-bookings' && renderMyBookings()}
    </div>
  );
};

export default EmployeeDashboard;
