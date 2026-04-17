import React, { useState } from 'react';
import { useBookings, GLOBAL_ROOMS } from '../context/BookingContext';
import { Building, LayoutList, ChevronDown, ChevronUp } from 'lucide-react';

const RoomsPage = () => {
  const { bookings } = useBookings();
  const [expandedSection, setExpandedSection] = useState('Floor 1');

  const activeBookings = bookings.filter(b => b.status === 'approved' || b.status === 'pending_manager');

  const groups = {
    'Floor 1': GLOBAL_ROOMS.regular.filter(r => r.startsWith('A-1')),
    'Floor 2': GLOBAL_ROOMS.regular.filter(r => r.startsWith('A-2')),
    'Floor 3': GLOBAL_ROOMS.regular.filter(r => r.startsWith('A-3')),
    'Floor 4': GLOBAL_ROOMS.regular.filter(r => r.startsWith('A-4')),
    'Floor 5': GLOBAL_ROOMS.regular.filter(r => r.startsWith('A-5')),
    'Laboratories': GLOBAL_ROOMS.labs
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderTable = (rooms) => (
    <div style={{ overflowX: 'auto', padding: '0', margin: '0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid var(--border-color)', margin: 0 }}>
        <thead style={{ backgroundColor: '#f3f4f6' }}>
          <tr>
            <th style={{ padding: '1rem', border: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--primary-color)' }}>Room Name</th>
            <th style={{ padding: '1rem', border: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--primary-color)' }}>Status</th>
            <th style={{ padding: '1rem', border: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--primary-color)' }}>Date</th>
            <th style={{ padding: '1rem', border: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--primary-color)' }}>Time</th>
            <th style={{ padding: '1rem', border: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--primary-color)' }}>Applicant</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => {
            const currentBooking = activeBookings.find(b => b.roomName.toLowerCase() === room.toLowerCase());
            const isEven = index % 2 === 0;
            return (
              <tr key={room} style={{ backgroundColor: currentBooking ? '#fff5f5' : (isEven ? '#fafafa' : 'white') }}>
                <td style={{ padding: '1rem', border: '1px solid var(--border-color)', fontWeight: 'bold' }}>{room}</td>
                <td style={{ padding: '1rem', border: '1px solid var(--border-color)' }}>
                  {currentBooking ? 
                    <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Occupied</span> : 
                    <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Available</span>
                  }
                </td>
                <td style={{ padding: '1rem', border: '1px solid var(--border-color)', color: '#4b5563' }}>{currentBooking ? currentBooking.date : '--'}</td>
                <td style={{ padding: '1rem', border: '1px solid var(--border-color)', color: '#4b5563' }}>{currentBooking ? currentBooking.time : '--'}</td>
                <td style={{ padding: '1rem', border: '1px solid var(--border-color)', color: '#4b5563' }}>{currentBooking ? `${currentBooking.applicantName} (${currentBooking.applicantRole})` : '--'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', margin: '2rem 0 0.5rem 0', color: 'var(--primary-color)', fontWeight: 800 }}>Campus Facilities</h1>
      <p className="text-gray" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Current availability status for all rooms and laboratories organized by floor.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.keys(groups).map(section => (
          <div key={section} className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <button 
              onClick={() => toggleSection(section)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                backgroundColor: expandedSection === section ? '#f3f4f6' : 'white',
                border: 'none',
                borderBottom: expandedSection === section ? '1px solid var(--border-color)' : 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--primary-color)',
                textAlign: 'left',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {section === 'Laboratories' ? <LayoutList size={20} /> : <Building size={20} />}
                {section}
              </div>
              {expandedSection === section ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {expandedSection === section && (
              <div className="animate-fade-in">
                {renderTable(groups[section])}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
