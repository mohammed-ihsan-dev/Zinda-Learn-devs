import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, LayoutDashboard, BookOpen, Play, MessageSquare,
  Video, BarChart3, Award, Settings, LogOut, Menu, X,
  Bell, Search, ChevronDown
} from 'lucide-react';

const studentMenuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
  { label: 'My Learning', icon: BookOpen, path: '/student/my-learning' },
  { label: 'Browse Courses', icon: Search, path: '/student/browse-courses' },
  { label: 'Messages', icon: MessageSquare, path: '/student/messages' },
  { label: 'Live Classes', icon: Video, path: '/student/live-classes' },
  { label: 'Progress', icon: BarChart3, path: '/student/progress' },
  { label: 'Certificates', icon: Award, path: '/student/certificates' },
  { label: 'Settings', icon: Settings, path: '/student/settings' },
];

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[270px] bg-white border-r border-surface-100 z-50 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-6 border-b border-surface-100">
          <Link to="/" className="flex items-center">
            <img src="/zinda-learn-logo.png" alt="Zinda Learn" className="h-8 object-contain" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-surface-50">
            <X className="w-5 h-5 text-surface-500" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {studentMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'gradient-primary text-white shadow-md shadow-primary-500/20'
                    : 'text-surface-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 truncate">{user?.name || 'Student'}</p>
              <p className="text-xs text-surface-500 truncate">{user?.email || 'student@zindalearn.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2  w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-[270px]">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-surface-100 h-16 lg:h-20">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-surface-50">
                <Menu className="w-5 h-5 text-surface-600" />
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-surface-50 rounded-xl px-4 py-2.5 w-72">
                <Search className="w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search courses, lessons..."
                  className="bg-transparent text-sm focus:outline-none w-full text-surface-700 placeholder-surface-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl hover:bg-surface-50 transition-colors">
                <Bell className="w-5 h-5 text-surface-500" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <span className="text-sm font-medium text-surface-700">{user?.name?.split(' ')[0] || 'Student'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
