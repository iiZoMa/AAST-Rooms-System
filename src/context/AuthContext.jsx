import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Mock users
  const users = {
    '1001': { id: '1001', name: 'Dr. Ahmed (Staff)', role: 'staff', password: '123' },
    '1002': { id: '1002', name: 'Dean Akram', role: 'dean', password: '123' },
    '1003': { id: '1003', name: 'Dr. Faisal', role: 'faisal', password: '123' },
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
