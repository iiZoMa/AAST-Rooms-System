import React, { createContext, useState, useContext } from 'react';
import { EMPLOYEE_DATABASE } from '../data/employeeDatabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState({
    '1': { id: '1', name: 'System Admin', role: 'admin', password: '123', status: 'approved' },
    '2': { id: '2', name: 'Branch Manager', role: 'branch_manager', password: '123', status: 'approved' },
    '1001': { id: '1001', name: 'أحمد محمد منصور', role: 'employee', password: '123', status: 'approved' },
    '1002': { id: '1002', name: 'سارة محمود علي', role: 'secretary', password: '123', status: 'approved' },
    '1003': { id: '1003', name: 'خالد وليد الزهراني', role: 'dean', password: '123', status: 'approved' },
    '1004': { id: '1004', name: 'ليلى يوسف القحطاني', role: 'employee', password: '123', status: 'approved' },
    '1005': { id: '1005', name: 'عمر عبد العزيز حسن', role: 'secretary', password: '123', status: 'approved' },
    '1006': { id: '1006', name: 'نورا إبراهيم السعيد', role: 'employee', password: '123', status: 'approved' },
  });

  const login = (id, password) => {
    const foundUser = users[id];
    if (foundUser && foundUser.password === password) {
      if (foundUser.status === 'pending') {
        return { success: false, message: 'Your account is still pending admin approval.' };
      }
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: 'Invalid ID or Password' };
  };

  const register = (id, name, password) => {
    if (users[id]) {
      return { success: false, message: 'ID is already registered' };
    }

    // New check: ID must exist in EMPLOYEE_DATABASE
    if (!EMPLOYEE_DATABASE[id]) {
      return { success: false, message: 'Your Employee ID is not recognized in our database. Please contact HR.' };
    }

    // Use name from database for consistency
    const dbName = EMPLOYEE_DATABASE[id];

    setUsers(prev => ({
      ...prev,
      [id]: { id, name: dbName, role: 'employee', password, status: 'pending' }
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

  const updateUser = (id, updates) => {
    setUsers(prev => {
      const updatedUser = { ...prev[id], ...updates };
      if (user && user.id === id) {
        setUser(updatedUser);
      }
      return { ...prev, [id]: updatedUser };
    });
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, approveUser, rejectUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
