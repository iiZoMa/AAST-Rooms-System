import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBookings = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      staffId: '1001',
      staffName: 'Dr. Ahmed (Staff)',
      roomType: 'multipurpose',
      roomName: 'Main Event Hall',
      date: '2026-05-01',
      time: '10:00',
      reason: 'Graduation Ceremony Preparation',
      status: 'pending_dean'
    }
  ]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now(),
      // Regular rooms are automatically approved (or assume basic workflow), multipurpose requires dean -> faisal
      status: booking.roomType === 'regular' ? 'approved' : 'pending_dean'
    };
    setBookings([newBooking, ...bookings]);
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus }}>
      {children}
    </BookingContext.Provider>
  );
};
