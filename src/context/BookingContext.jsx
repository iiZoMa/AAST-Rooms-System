import React, { createContext, useState, useContext } from 'react';

import { scheduleData } from '../scheduleData';

const BookingContext = createContext();

export const useBookings = () => useContext(BookingContext);

export const GLOBAL_ROOMS = {
  regular: scheduleData.A_ROOMS,
  labs: scheduleData.B_LABS,
  multipurpose: ['Main Event Hall', 'Conference Room 1', 'Conference Room 2']
};

export const TIME_SLOTS = [
  { id: 1, label: 'المحاضرة الأولى', start: '08:30', end: '10:10', timeString: '08:30 AM - 10:10 AM' },
  { id: 2, label: 'المحاضرة الثانية', start: '10:30', end: '12:10', timeString: '10:30 AM - 12:10 PM' },
  { id: 3, label: 'المحاضرة الثالثة', start: '12:30', end: '14:10', timeString: '12:30 PM - 02:10 PM' },
  { id: 4, label: 'المحاضرة الرابعة', start: '14:30', end: '16:10', timeString: '02:30 PM - 04:10 PM' },
  { id: 5, label: 'المحاضرة الخامسة', start: '16:30', end: '18:10', timeString: '04:30 PM - 06:10 PM' },
  { id: 6, label: 'المحاضرة السادسة', start: '18:30', end: '20:10', timeString: '06:30 PM - 08:10 PM' }
];

export const COLLEGES = [
  'College of Engineering and Technology',
  'College of Computing and Information Technology',
  'College of Management and Technology',
  'College of International Transport and Logistics',
  'College of Archaeology and Cultural Heritage'
];

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      applicantId: '3',
      applicantName: 'Dr. Sarah (Employee)',
      applicantRole: 'employee',
      roomType: 'multipurpose',
      roomName: 'Main Event Hall',
      date: '2026-05-01',
      time: '10:00',
      reason: 'Graduation Setup',
      status: 'pending_admin',
      rejectionReason: '',
      suggestedAlternative: ''
    }
  ]);

  const [fixedSchedule, setFixedSchedule] = useState(scheduleData.fixedSchedule);

  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    setNotifications(prev => [{ id: Date.now(), message, date: new Date().toLocaleString() }, ...prev]);
  };

  const isTimeInSlot = (timeStr, slot) => {
    // Basic string comparison works for HH:MM in 24h format
    return timeStr >= slot.start && timeStr <= slot.end;
  };

  const checkOverlap = (roomName, date, time) => {
    // 1. Check normal bookings
    const normalOverlap = bookings.some(b => 
      b.roomName === roomName && 
      b.date === date && 
      b.time === time && 
      (b.status === 'approved' || b.status === 'pending_manager')
    );
    if (normalOverlap) return true;

    // 2. Check fixed schedule
    if (date && time) {
      const d = new Date(date);
      const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      const fixedOverlap = fixedSchedule.some(fs => {
        if (fs.dayOfWeek === dayOfWeek && fs.roomName === roomName) {
          const slot = TIME_SLOTS.find(s => s.id === fs.slotId);
          if (slot && isTimeInSlot(time, slot)) {
            return true;
          }
        }
        return false;
      });
      if (fixedOverlap) return true;
    }

    return false;
  };

  const addBooking = (booking) => {
    if (checkOverlap(booking.roomName, booking.date, booking.time)) {
      return { success: false, message: 'This room is already actively booked or pending finalization for this exact time and date!' };
    }

    const newBooking = {
      ...booking,
      id: Date.now(),
      status: booking.applicantRole === 'admin' ? 'pending_manager' : 'pending_admin',
      rejectionReason: '',
      suggestedAlternative: ''
    };
    setBookings([newBooking, ...bookings]);
    return { success: true, message: 'Request submitted successfully!' };
  };

  const updateBookingStatus = (id, newStatus, rejectionReason = '', suggestedAlternative = '') => {
    const booking = bookings.find(b => b.id === id);
    
    if ((newStatus === 'approved' || newStatus === 'pending_manager') && checkOverlap(booking.roomName, booking.date, booking.time)) {
      return { success: false, message: 'Overlap Detected! Another booking currently occupies this room at this specific time. Please reject this request.' };
    }

    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus, rejectionReason, suggestedAlternative } : b));
    return { success: true };
  };

  const forceModifyBooking = (bookingId, updatedFields, modifierName) => {
    if (checkOverlap(updatedFields.roomName || '', updatedFields.date || '', updatedFields.time || '')) {
       return { success: false, message: 'Cannot modify. That exact slot is already occupied.' };
    }
    
    setBookings(bookings.map(b => {
      if(b.id === bookingId) {
        addNotification(`Booking [${b.roomName}] originally by ${b.applicantName} was modified by ${modifierName}.`);
        return { ...b, ...updatedFields };
      }
      return b;
    }));
    return { success: true };
  };

  const cancelBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const swapFixedScheduleRoom = (scheduleId, newRoomName) => {
    const scheduleItem = fixedSchedule.find(fs => fs.id === scheduleId);
    if (!scheduleItem) return { success: false, message: 'Schedule not found' };
    
    const oldRoomName = scheduleItem.roomName;
    setFixedSchedule(fixedSchedule.map(fs => fs.id === scheduleId ? { ...fs, roomName: newRoomName } : fs));
    
    addNotification(`Fixed Schedule Update: Room ${oldRoomName} was replaced with ${newRoomName} for ${scheduleItem.subject} by the Admin.`);
    return { success: true, message: 'Room swapped successfully!' };
  };

  return (
    <BookingContext.Provider value={{ 
      bookings, notifications, fixedSchedule, TIME_SLOTS, COLLEGES,
      addBooking, updateBookingStatus, forceModifyBooking, cancelBooking, addNotification, swapFixedScheduleRoom
    }}>
      {children}
    </BookingContext.Provider>
  );
};
