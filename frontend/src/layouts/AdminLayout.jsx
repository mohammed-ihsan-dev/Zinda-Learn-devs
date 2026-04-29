import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Shield, Settings, LogOut, Menu, X,
  Bell, ChevronDown, CheckCircle, XCircle, Users, GraduationCap, BookOpen, CreditCard, BarChart3
} from 'lucide-react';

const adminMenuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Users', icon: Users, path: '/admin/user-management' },
  { label: 'Tutors', icon: GraduationCap, path: '/admin/instructor-management' },
  { label: 'Courses', icon: BookOpen, path: '/admin/course-approval' },
  { label: 'Payments', icon: CreditCard, path: '/admin/payments' },
  { label: 'Reports', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#121212] font-sans text-zinc-300">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[260px] bg-[#0a0a0b] border-r border-[#1f1f23] z-50 transition-transform duration-300 lg:translate-x-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-none">zindalearn</span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest mt-0.5">ADMIN PORTAL</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto p-1.5 rounded-lg text-zinc-400 hover:bg-[#1a1a24]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {adminMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1a1a24] text-purple-400 border-l-2 border-purple-500'
                    : 'text-zinc-400 hover:bg-[#15151a] hover:text-zinc-200'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-[#15151a] rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#121212]/90 backdrop-blur-md h-20">
          <div className="flex items-center justify-between h-full px-8">
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-zinc-400 hover:bg-[#1a1a24]">
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center bg-[#1c1c21] rounded-lg px-4 py-2.5 w-full max-w-md border border-[#27272a]">
                <svg className="w-4 h-4 text-zinc-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-500 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="relative text-zinc-400 hover:text-zinc-200 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full border border-[#121212]"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-5 border-l border-[#27272a] cursor-pointer group">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{user?.name || 'Alex Rivera'}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">SUPER ADMIN</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#1c1c21] overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Alex+Rivera&background=6366f1&color=fff" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
