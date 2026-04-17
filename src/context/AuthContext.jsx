import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Mock users for the new tier structure
  const users = {
    '1': { id: '1', name: 'System Admin', role: 'admin', password: '123' },
    '2': { id: '2', name: 'Branch Manager', role: 'branch_manager', password: '123' },
    '3': { id: '3', name: 'Dr. Sarah (Employee)', role: 'employee', password: '123' },
    '4': { id: '4', name: 'College Secretary', role: 'secretary', password: '123' },
    '5': { id: '5', name: 'Prof. John (Employee 2)', role: 'employee', password: '123' },
    '6': { id: '6', name: 'Dr. Mona (Employee 3)', role: 'employee', password: '123' },
  };

  const login = (id, password) => {
    const foundUser = users[id];
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
