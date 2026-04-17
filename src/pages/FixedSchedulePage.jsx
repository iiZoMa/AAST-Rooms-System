import React, { useState } from 'react';
import { useBookings, GLOBAL_ROOMS } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Building, Calendar as CalendarIcon, Clock, Edit2 } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];

const FixedSchedulePage = () => {
  const { user } = useAuth();
  const { fixedSchedule, TIME_SLOTS, COLLEGES, swapFixedScheduleRoom } = useBookings();
  const [selectedCollege, setSelectedCollege] = useState(COLLEGES[0]);

  const [swapId, setSwapId] = useState(null);
  const [swapRoomName, setSwapRoomName] = useState('');

  const handleSwapSubmit = (id) => {
    if (!swapRoomName) return;
    const result = swapFixedScheduleRoom(id, swapRoomName);
    if (result.success) {
      setSwapId(null);
    } else {
      alert(result.message);
    }
  };

  const allRooms = [...GLOBAL_ROOMS.regular, ...GLOBAL_ROOMS.labs, ...GLOBAL_ROOMS.multipurpose];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem', position: 'relative' }}>
      <h1 style={{ fontSize: '2.5rem', margin: '2rem 0 0.5rem 0', color: 'var(--primary-color)', fontWeight: 800 }}>Fixed Schedule</h1>
      <p className="text-gray" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Official semester timetables for all colleges.</p>

      {/* College Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        {COLLEGES.map(college => (
          <button
            key={college}
            onClick={() => setSelectedCollege(college)}
            className={`btn ${selectedCollege === college ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '20px', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            <Building size={16} /> {college}
          </button>
        ))}
      </div>

      {/* Schedule Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', borderRight: '1px solid var(--border-color)', width: '100px' }}>Day</th>
              {TIME_SLOTS.map(slot => (
                <th key={slot.id} style={{ padding: '1rem', borderRight: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{slot.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)', fontWeight: 500 }}><Clock size={12} className="inline-icon"/> {slot.timeString}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((dayName, dayIndex) => {
              // Note: Date.getDay() uses 0 for Sunday, 6 for Saturday.
              const actualDayIndex = dayName === 'Saturday' ? 6 : dayIndex;

              return (
                <tr key={dayName} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', borderRight: '1px solid var(--border-color)', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                    {dayName}
                  </td>
                  {TIME_SLOTS.map(slot => {
                    const item = fixedSchedule.find(fs => fs.college === selectedCollege && fs.dayOfWeek === actualDayIndex && fs.slotId === slot.id);
                    
                    return (
                      <td key={slot.id} style={{ padding: '1rem', borderRight: '1px solid var(--border-color)', verticalAlign: 'top', minWidth: '180px' }}>
                        {item ? (
                          <div style={{ backgroundColor: '#eef2ff', borderLeft: '4px solid var(--primary-color)', padding: '0.75rem', borderRadius: '4px', textAlign: 'left', position: 'relative' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary-color)', marginBottom: '0.25rem' }}>{item.subject}</div>
                            
                            {swapId === item.id ? (
                              <div style={{ marginTop: '0.5rem' }}>
                                <select className="form-control" style={{ fontSize: '0.8rem', padding: '0.25rem', width: '100%', marginBottom: '0.5rem' }} value={swapRoomName} onChange={(e) => setSwapRoomName(e.target.value)}>
                                  <option value="">-- Select Room --</option>
                                  {allRooms.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                  <button className="btn btn-success" onClick={() => handleSwapSubmit(item.id)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem', flex: 1 }}>Save</button>
                                  <button className="btn btn-outline" onClick={() => setSwapId(null)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem', flex: 1 }}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><Building size={12} className="inline-icon"/> {item.roomName}</span>
                                {user?.role === 'admin' && (
                                  <button onClick={() => { setSwapId(item.id); setSwapRoomName(item.roomName); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-color)', padding: 0 }} title="Swap Room">
                                    <Edit2 size={14} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#d1d5db', fontSize: '0.85rem' }}>--</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FixedSchedulePage;
