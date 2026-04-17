import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  en: {
    // Header & General
    'portal': 'AAST Portal',
    'dashboard': 'Dashboard',
    'rooms': 'Rooms',
    'my_bookings': 'My Bookings',
    'fixed_schedule': 'Fixed Schedule',
    'notifications': 'Notifications',
    'no_notifications': 'No new notifications.',
    'logout': 'Logout',
    'sign_out': 'Sign Out',
    'user_info': 'User Information',
    'emp_id': 'Employee ID',
    'full_name': 'Full Name',
    'account_status': 'Account Status',
    'approved': 'Approved',
    'change_pass': 'Change Password',
    'new_pass': 'New Password',
    'update': 'Update',
    'sys_name': 'AAST Booking System',

    // Sidebar
    'overview': 'Overview',
    'find_space': 'Find Space',
    'my_schedule': 'My Schedule',
    'delegations': 'Authority & Delegations',
    'req_multi': 'Request Multipurpose Room',

    // My Bookings
    'review_manage': 'Review and manage your upcoming reservations across campus facilities.',
    'filter': 'Filter',
    'new_booking': 'New Booking',
    'upcoming': 'Upcoming',
    'view_calendar': 'View Calendar',
    'no_bookings': 'No Bookings Found',
    'no_bookings_desc': "You haven't made any booking requests yet.",
    'confirmed': 'Confirmed',
    'pending_approval': 'Pending Approval',
    'rejected': 'Rejected',
    'special_facility': 'Special Facility',
    'academic_block': 'Academic Block',
    'attendees': 'Attendees',
    'booking_summary': 'Booking Summary',
    'this_month': 'This Month',
    'total_hours': 'Total Hours',
    'recent_past': 'Recent Past'
  },
  ar: {
    // Header & General
    'portal': 'بوابة الأكاديمية',
    'dashboard': 'لوحة التحكم',
    'rooms': 'القاعات',
    'my_bookings': 'حجوزاتي',
    'fixed_schedule': 'الجدول الثابت',
    'notifications': 'الإشعارات',
    'no_notifications': 'لا توجد إشعارات جديدة.',
    'logout': 'تسجيل خروج',
    'sign_out': 'تسجيل الخروج',
    'user_info': 'بيانات المستخدم',
    'emp_id': 'الرقم الوظيفي',
    'full_name': 'الاسم بالكامل',
    'account_status': 'حالة الحساب',
    'approved': 'مُفعل',
    'change_pass': 'تغيير كلمة المرور',
    'new_pass': 'كلمة المرور الجديدة',
    'update': 'تحديث',
    'sys_name': 'نظام حجز قاعات الأكاديمية',

    // Sidebar
    'overview': 'نظرة عامة',
    'find_space': 'البحث عن قاعة',
    'my_schedule': 'جدولي',
    'delegations': 'الصلاحيات والتفويضات',
    'req_multi': 'طلب قاعة متعددة الأغراض',

    // My Bookings
    'review_manage': 'راجع وأدر حجوزاتك القادمة في مختلف مرافق الحرم الجامعي.',
    'filter': 'تصفية',
    'new_booking': 'حجز جديد',
    'upcoming': 'القادمة',
    'view_calendar': 'عرض التقويم',
    'no_bookings': 'لا توجد حجوزات',
    'no_bookings_desc': "لم تقم بإجراء أي طلبات حجز بعد.",
    'confirmed': 'مؤكد',
    'pending_approval': 'في انتظار الموافقة',
    'rejected': 'مرفوض',
    'special_facility': 'مرفق خاص',
    'academic_block': 'مبنى أكاديمي',
    'attendees': 'حضور',
    'booking_summary': 'ملخص الحجوزات',
    'this_month': 'هذا الشهر',
    'total_hours': 'إجمالي الساعات',
    'recent_past': 'حجوزات سابقة'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
  };

  useEffect(() => {
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
