import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import BranchManagerDashboard from './pages/BranchManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SecretaryDashboard from './pages/SecretaryDashboard';
import FixedSchedulePage from './pages/FixedSchedulePage';
import RoomsPage from './pages/RoomsPage';
import DelegationSettings from './pages/DelegationSettings';
import Layout from './components/Layout';

const RequireAuth = ({ children, allowedRoles }) => {
  const { user, getActiveDelegations } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  const activeDels = getActiveDelegations(user.id) || [];
  const effectiveRoles = [user.role, ...activeDels.map(d => d.roleGranted)];

  if (allowedRoles && !allowedRoles.some(r => effectiveRoles.includes(r))) {
    return <Navigate to="/" replace />;
  }
  return <Layout>{children}</Layout>;
};

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  switch(user.role) {
    case 'admin': return <Navigate to="/admin" replace />;
    case 'branch_manager': return <Navigate to="/manager" replace />;
    case 'employee': return <Navigate to="/employee" replace />;
    case 'secretary': return <Navigate to="/secretary" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RoleBasedRedirect />} />
      
      <Route path="/admin/*" element={<RequireAuth allowedRoles={['admin']}><AdminDashboard /></RequireAuth>} />
      <Route path="/manager/*" element={<RequireAuth allowedRoles={['branch_manager']}><BranchManagerDashboard /></RequireAuth>} />
      <Route path="/employee/*" element={<RequireAuth allowedRoles={['employee']}><EmployeeDashboard /></RequireAuth>} />
      <Route path="/secretary/*" element={<RequireAuth allowedRoles={['secretary']}><SecretaryDashboard /></RequireAuth>} />
      
      <Route path="/rooms" element={<RequireAuth><RoomsPage /></RequireAuth>} />
      <Route path="/fixed-schedule" element={<RequireAuth><FixedSchedulePage /></RequireAuth>} />
      <Route path="/delegations" element={<RequireAuth><DelegationSettings /></RequireAuth>} />
    </Routes>
  );
};

export default App;
