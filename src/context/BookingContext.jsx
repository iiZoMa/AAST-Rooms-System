import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBookings = () => useContext(BookingContext);

export const GLOBAL_ROOMS = {
  regular: ['Lecture Hall A', 'Lecture Hall B', 'Lecture Hall C', 'Lab 101', 'Lab 102'],
  multipurpose: ['Main Event Hall', 'Conference Room 1', 'Conference Room 2']
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      applicantId: '3',
      applicantName: 'Employee',
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

  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    setNotifications([{ id: Date.now(), message, date: new Date().toLocaleString() }, ...notifications]);
  };

  const checkOverlap = (roomName, date, time) => {
    return bookings.some(b => 
      b.roomName === roomName && 
      b.date === date && 
      b.time === time && 
      (b.status === 'approved' || b.status === 'pending_manager')
    );
  };

  const addBooking = (booking) => {
    // If user tries to submit an overlapping time for an actively secured room
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
    
    // Safety lock: if Admin tries to approve a request but someone else already secured it
    if ((newStatus === 'approved' || newStatus === 'pending_manager') && checkOverlap(booking.roomName, booking.date, booking.time)) {
      return { success: false, message: 'Overlap Detected! Another booking currently occupies this room at this specific time. Please reject this request.' };
    }

    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus, rejectionReason, suggestedAlternative } : b));
    return { success: true };
  };

  const forceModifyBooking = (bookingId, updatedFields, modifierName) => {
    // Note: Force modify is an override, so Branch Manager is trusted here, but an overlap check is still good.
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

  return (
    <BookingContext.Provider value={{ bookings, notifications, addBooking, updateBookingStatus, forceModifyBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
