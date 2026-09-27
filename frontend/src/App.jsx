import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentComplaintsPage from './pages/StudentComplaintsPage';
import NewComplaintPage from './pages/NewComplaintPage';
import StudentComplaintDetailPage from './pages/StudentComplaintDetailPage';
import StudentProfilePage from './pages/StudentProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminComplaintDetailPage from './pages/AdminComplaintDetailPage';
import './App.css';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />} />

        <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
          <Route element={<Layout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/complaints" element={<StudentComplaintsPage />} />
            <Route path="/student/complaints/new" element={<NewComplaintPage />} />
            <Route path="/student/complaints/:id" element={<StudentComplaintDetailPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
            <Route path="/admin/complaints/:id" element={<AdminComplaintDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
