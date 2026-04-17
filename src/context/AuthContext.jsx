import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

<<<<<<< HEAD
  // Mock users for the new tier structure
  const users = {
    '1': { id: '1', name: 'System Admin', role: 'admin', password: '123' },
    '2': { id: '2', name: 'Branch Manager', role: 'branch_manager', password: '123' },
    '3': { id: '3', name: 'Dr. Sarah (Employee)', role: 'employee', password: '123' },
    '4': { id: '4', name: 'College Secretary', role: 'secretary', password: '123' },
    '5': { id: '5', name: 'Prof. John (Employee 2)', role: 'employee', password: '123' },
    '6': { id: '6', name: 'Dr. Mona (Employee 3)', role: 'employee', password: '123' },
  };
=======
  const [users, setUsers] = useState({
    '1001': { id: '1001', name: 'Dr. Ahmed (Staff)', role: 'staff', password: '123', status: 'approved' },
    '1002': { id: '1002', name: 'Dean Akram', role: 'dean', password: '123', status: 'approved' },
    '1003': { id: '1003', name: 'Dr. Faisal', role: 'faisal', password: '123', status: 'approved' },
  });
>>>>>>> origin/master

  const login = (id, password) => {
    const foundUser = users[id];
    if (foundUser && foundUser.password === password) {
      if (foundUser.status !== 'approved') {
        return { success: false, message: 'الحساب قيد الانتظار لموافقة الإدارة (العميد أكرم)' };
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
