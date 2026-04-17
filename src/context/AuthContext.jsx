import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState({
    '1001': { id: '1001', name: 'Dr. Ahmed (Staff)', role: 'staff', password: '123', status: 'approved' },
    '1002': { id: '1002', name: 'Dean Akram', role: 'dean', password: '123', status: 'approved' },
    '1003': { id: '1003', name: 'Dr. Faisal', role: 'faisal', password: '123', status: 'approved' },
    'admin': { id: 'admin', name: 'System Admin', role: 'admin', password: 'admin', status: 'approved' },
  });

  const login = (id, password) => {
    const foundUser = users[id];
    if (foundUser && foundUser.password === password) {
      if (foundUser.status !== 'approved') {
        return { success: false, message: 'الحساب قيد الانتظار لموافقة الإدارة' };
      }
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: 'الرقم الوظيفي أو كلمة المرور غير صحيحة' };
  };

  const register = (id, name, password, role) => {
    if (users[id]) {
      return { success: false, message: 'الرقم الوظيفي مسجل مسبقاً' };
    }
    setUsers(prev => ({
      ...prev,
      [id]: { id, name, role, password, status: 'pending' }
    }));
    return { success: true };
  };

  const approveUser = (id) => {
    setUsers(prev => ({
      ...prev,
      [id]: { ...prev[id], status: 'approved' }
    }));
  };

  const rejectUser = (id) => {
    setUsers(prev => {
      const newUsers = { ...prev };
      delete newUsers[id];
      return newUsers;
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, users, login, register, approveUser, rejectUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
