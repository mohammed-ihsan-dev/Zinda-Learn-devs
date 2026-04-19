import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import StudentLayout from './layouts/StudentLayout';

// Pages
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/auth/StudentRegister';
import CoursesPage from './pages/CoursesPage';
import StudentDashboard from './pages/student/Dashboard';

import MyLearning from './pages/student/MyLearning';
import BrowseCourses from './pages/student/BrowseCourses';
import Messages from './pages/student/Messages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/register" element={<StudentRegister />} />
          <Route path="/courses" element={<CoursesPage />} />

          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="my-learning" element={<MyLearning />} />
            <Route path="browse-courses" element={<BrowseCourses />} />
            <Route path="messages" element={<Messages />} />
            <Route path="live-classes" element={<div>Live Classes Page</div>} />
            <Route path="progress" element={<div>Progress Page</div>} />
            <Route path="certificates" element={<div>Certificates Page</div>} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center">404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
