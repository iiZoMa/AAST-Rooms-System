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

  const [notifications, setNotifications] = useState([]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now(),
      status: booking.roomType === 'regular' ? 'approved' : 'pending_dean'
    };
    setBookings([newBooking, ...bookings]);
  };

  const addNotification = (role, message) => {
    setNotifications(prev => [{ id: Date.now() + Math.random(), role, message, read: false }, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = (role) => {
    setNotifications(prev => prev.filter(n => n.role !== role));
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    
    if (newStatus === 'pending_faisal') {
      const roomBooking = bookings.find(b => b.id === id);
      addNotification('faisal', `تم تحويل طلب القاعة (${roomBooking?.roomName}) من السيد العميد أكرم وبانتظار اعتمادك النهائي.`);
    }
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, notifications, addNotification, markNotificationAsRead, clearAllNotifications }}>
      {children}
    </BookingContext.Provider>
  );
};
