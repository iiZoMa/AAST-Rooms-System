import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const defaultProps = { overrides: {}, delegations: [] };

  const [users, setUsers] = useState({
    '1': { id: '1', name: 'System Admin', role: 'admin', password: '123', status: 'approved', ...defaultProps },
    '2': { id: '2', name: 'Branch Manager', role: 'branch_manager', password: '123', status: 'approved', ...defaultProps },
    '3': { id: '3', name: 'Dr. Sarah (Employee)', role: 'employee', password: '123', status: 'approved', ...defaultProps },
    '4': { id: '4', name: 'College Secretary', role: 'secretary', password: '123', status: 'approved', ...defaultProps },
    '5': { id: '5', name: 'Prof. John (Employee 2)', role: 'employee', password: '123', status: 'approved', ...defaultProps },
    '6': { id: '6', name: 'Dr. Mona (Employee 3)', role: 'employee', password: '123', status: 'approved', ...defaultProps },
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
    if (users[id]) return { success: false, message: 'ID is already registered' };
    setUsers(prev => ({
      ...prev,
      [id]: { id, name, role: 'employee', password, status: 'pending', ...defaultProps } 
    }));
    return { success: true };
  };

  const approveUser = (id) => setUsers(prev => ({ ...prev, [id]: { ...prev[id], status: 'approved' } }));
  const rejectUser = (id) => {
    setUsers(prev => {
      const newUsers = { ...prev };
      delete newUsers[id];
      return newUsers;
    });
  };

  // --- Delegation & Override Architecture ---
  const promoteUser = (id, newRole) => {
    setUsers(prev => {
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], role: newRole } };
    });
  };

  const setOverride = (id, overrideKey, value) => {
    setUsers(prev => {
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], overrides: { ...prev[id].overrides, [overrideKey]: value } } };
    });
  };

  const addDelegation = (targetUserId, payload, autoApprove = false) => {
    setUsers(prev => {
      if (!prev[targetUserId]) return prev;
      const newDel = {
        id: Date.now(),
        ...payload,
        status: autoApprove ? 'approved' : 'pending'
      };
      return { ...prev, [targetUserId]: { ...prev[targetUserId], delegations: [...(prev[targetUserId].delegations || []), newDel] } };
    });
  };

  const approveDelegation = (targetUserId, delegationId) => {
    setUsers(prev => {
      if (!prev[targetUserId]) return prev;
      const targetUser = prev[targetUserId];
      const updatedDels = targetUser.delegations.map(d => d.id === delegationId ? { ...d, status: 'approved' } : d);
      return { ...prev, [targetUserId]: { ...targetUser, delegations: updatedDels } };
    });
  };
  
  const revokeDelegation = (targetUserId, delegationId) => {
    setUsers(prev => {
      if (!prev[targetUserId]) return prev;
      const targetUser = prev[targetUserId];
      const updatedDels = targetUser.delegations.filter(d => d.id !== delegationId);
      return { ...prev, [targetUserId]: { ...targetUser, delegations: updatedDels } };
    });
  };

  const getActiveDelegations = (userId) => {
    const u = users[userId];
    if(!u || !u.delegations) return [];
    const today = new Date().toISOString().split('T')[0];
    return u.delegations.filter(d => d.status === 'approved' && today >= d.startDate && today <= d.endDate);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ 
        user, users, login, register, logout, 
        approveUser, rejectUser, 
        promoteUser, setOverride, addDelegation, approveDelegation, revokeDelegation, getActiveDelegations 
      }}>
      {children}
    </AuthContext.Provider>
  );
};
