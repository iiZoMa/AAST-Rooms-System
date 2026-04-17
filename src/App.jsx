import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StaffDashboard from './pages/StaffDashboard';
import DeanDashboard from './pages/DeanDashboard';
import FaisalDashboard from './pages/FaisalDashboard';
import Navbar from './components/Navbar';

const RequireAuth = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect to their actual home based on role later if needed
  }

  return children;
};

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  switch(user.role) {
    case 'staff': return <Navigate to="/staff" replace />;
    case 'dean': return <Navigate to="/dean" replace />;
    case 'faisal': return <Navigate to="/faisal" replace />;
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
          
          <Route path="/" element={<RoleBasedRedirect />} />

          <Route 
            path="/staff/*" 
            element={
              <RequireAuth allowedRoles={['staff']}>
                <StaffDashboard />
              </RequireAuth>
            } 
          />

          <Route 
            path="/dean/*" 
            element={
              <RequireAuth allowedRoles={['dean']}>
                <DeanDashboard />
              </RequireAuth>
            } 
          />

          <Route 
            path="/faisal/*" 
            element={
              <RequireAuth allowedRoles={['faisal']}>
                <FaisalDashboard />
              </RequireAuth>
            } 
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
