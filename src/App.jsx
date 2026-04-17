import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
<<<<<<< HEAD
import AdminDashboard from './pages/AdminDashboard';
import BranchManagerDashboard from './pages/BranchManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SecretaryDashboard from './pages/SecretaryDashboard';
=======
import Register from './pages/Register';
import StaffDashboard from './pages/StaffDashboard';
import DeanDashboard from './pages/DeanDashboard';
import FaisalDashboard from './pages/FaisalDashboard';
>>>>>>> origin/master
import Navbar from './components/Navbar';

const RequireAuth = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
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
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <div className="container" style={{ paddingTop: user ? '80px' : '0' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
<<<<<<< HEAD
=======
          <Route path="/register" element={<Register />} />
          
>>>>>>> origin/master
          <Route path="/" element={<RoleBasedRedirect />} />
          
          <Route path="/admin/*" element={<RequireAuth allowedRoles={['admin']}><AdminDashboard /></RequireAuth>} />
          <Route path="/manager/*" element={<RequireAuth allowedRoles={['branch_manager']}><BranchManagerDashboard /></RequireAuth>} />
          <Route path="/employee/*" element={<RequireAuth allowedRoles={['employee']}><EmployeeDashboard /></RequireAuth>} />
          <Route path="/secretary/*" element={<RequireAuth allowedRoles={['secretary']}><SecretaryDashboard /></RequireAuth>} />
        </Routes>
      </div>
    </>
  );
};

export default App;
