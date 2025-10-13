import { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardProvider } from './context/DashboardContext';
import { BrandingProvider } from './context/BrandingContext';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const [showChatOnly, setShowChatOnly] = useState(false);
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />
      
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout showChatOnly={showChatOnly} setShowChatOnly={setShowChatOnly}>
            <AdminDashboard showChatOnly={showChatOnly} setShowChatOnly={setShowChatOnly} />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/faculty" element={
        <ProtectedRoute allowedRoles={['faculty']}>
          <Layout showChatOnly={showChatOnly} setShowChatOnly={setShowChatOnly}>
            <FacultyDashboard showChatOnly={showChatOnly} setShowChatOnly={setShowChatOnly} />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Layout showChatOnly={showChatOnly} setShowChatOnly={setShowChatOnly}>
            <StudentDashboard showChatOnly={showChatOnly} setShowChatOnly={setShowChatOnly} />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/parent" element={
        <ProtectedRoute allowedRoles={['parent']}>
          <Layout showChatOnly={showChatOnly} setShowChatOnly={setShowChatOnly}>
            <ParentDashboard showChatOnly={showChatOnly} setShowChatOnly={setShowChatOnly} />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/super-admin" element={<SuperAdminDashboard />} />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
            <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      } />
      

    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrandingProvider>
        <AuthProvider>
          <DashboardProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <AppRoutes />
              </div>
            </Router>
          </DashboardProvider>
        </AuthProvider>
      </BrandingProvider>
    </ThemeProvider>
  );
}

export default App;