import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import StudentLayout from './layouts/StudentLayout';

// Pages
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/auth/StudentRegister';
import InstructorLogin from './pages/auth/InstructorLogin';
import InstructorSignup from './pages/auth/InstructorSignup';
import AdminLogin from './pages/auth/AdminLogin';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import StudentDashboard from './pages/student/Dashboard';

// Instructor Pages
import InstructorLayout from './layouts/InstructorLayout';
import InstructorDashboard from './pages/instructor/Dashboard';
import MyCourses from './pages/instructor/MyCourses';
import CourseDetail from './pages/instructor/CourseDetail';
import CreateCourse from './pages/instructor/CreateCourse';
import Earnings from './pages/instructor/Earnings';
import Students from './pages/instructor/Students';
import Reviews from './pages/instructor/Reviews';
import InstructorSettings from './pages/instructor/InstructorSettings';
import Notifications from './pages/instructor/Notifications';
import EditCourse from './pages/instructor/EditCourse';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import CourseApproval from './pages/admin/CourseApproval';
import UserManagement from './pages/admin/UserManagement';
import InstructorManagement from './pages/admin/InstructorManagement';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import Payments from './pages/admin/Payments';

import MyLearning from './pages/student/MyLearning';
import BrowseCourses from './pages/student/BrowseCourses';
import Messages from './pages/student/Messages';
import StudentNotifications from './pages/student/Notifications';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/register" element={<StudentRegister />} />
            <Route path="/instructor/login" element={<InstructorLogin />} />
            <Route path="/instructor/signup" element={<InstructorSignup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="my-learning" element={<MyLearning />} />
              <Route path="browse-courses" element={<BrowseCourses />} />
               <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<StudentNotifications />} />
              <Route path="live-classes" element={<div>Live Classes Page</div>} />
              <Route path="progress" element={<div>Progress Page</div>} />
              <Route path="certificates" element={<div>Certificates Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
            </Route>

            {/* Instructor Routes */}
            <Route path="/instructor" element={<ProtectedRoute roles={['instructor', 'admin']}><InstructorLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/instructor/dashboard" replace />} />
              <Route path="dashboard" element={<InstructorDashboard />} />
              <Route path="my-courses" element={<MyCourses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="edit-course/:id" element={<EditCourse />} />
              <Route path="create-course" element={<CreateCourse />} />
              <Route path="earnings" element={<div className="p-8 bg-white rounded-3xl border border-slate-100 text-slate-500 font-bold text-center">Payouts coming soon</div>} />
              <Route path="students" element={<Students />} />
              <Route path="reviews" element={<div className="p-8 bg-white rounded-3xl border border-slate-100 text-slate-500 font-bold text-center">Reviews coming soon</div>} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<div className="p-8 bg-white rounded-3xl border border-slate-100 text-slate-500 font-bold text-center">Settings coming soon</div>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="course-approval" element={<CourseApproval />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="instructor-management" element={<InstructorManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="payments" element={<Payments />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<div className="min-h-screen flex items-center justify-center">404 - Page Not Found</div>} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
