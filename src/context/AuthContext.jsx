import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState({
    '1': { id: '1', name: 'System Admin', role: 'admin', password: '123', status: 'approved' },
    '2': { id: '2', name: 'Branch Manager', role: 'branch_manager', password: '123', status: 'approved' },
    '3': { id: '3', name: 'Dr. Sarah (Employee)', role: 'employee', password: '123', status: 'approved' },
    '4': { id: '4', name: 'College Secretary', role: 'secretary', password: '123', status: 'approved' },
    '5': { id: '5', name: 'Prof. John (Employee 2)', role: 'employee', password: '123', status: 'approved' },
    '6': { id: '6', name: 'Dr. Mona (Employee 3)', role: 'employee', password: '123', status: 'approved' },
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
    setUsers(prev => ({
      ...prev,
      [id]: { id, name, role: 'employee', password, status: 'pending' }
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
