import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut, Menu, X,
  Bell, ChevronDown, Users, CreditCard, Star, MessageSquare, HelpCircle
} from 'lucide-react';

const instructorMenuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/instructor/dashboard' },
  { label: 'Courses', icon: BookOpen, path: '/instructor/my-courses' },
  { label: 'Students', icon: Users, path: '/instructor/students' },
  { label: 'Payouts', icon: CreditCard, path: '/instructor/earnings' },
  { label: 'Reviews', icon: Star, path: '/instructor/reviews' },
  { label: 'Messages', icon: MessageSquare, path: '/instructor/messages' },
  { label: 'Settings', icon: Settings, path: '/instructor/settings' },
];

const InstructorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[260px] bg-[#1a1c2e] z-50 transition-transform duration-300 lg:translate-x-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-wide">zindalearn</span>
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-0.5">INSTRUCTOR PORTAL</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto p-1.5 rounded-lg text-indigo-300 hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {instructorMenuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/20'
                    : 'text-indigo-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-indigo-300'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 space-y-4">
          <Link
            to="/instructor/create-course"
            className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-900/20 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Create Course
          </Link>
          <Link
            to="/instructor/help"
            className="flex items-center gap-3 text-indigo-300 hover:text-white px-2 py-2 text-sm font-medium transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Help Center
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 h-20">
          <div className="flex items-center justify-between h-full px-8">
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50">
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center bg-slate-100/80 rounded-full px-5 py-2.5 w-full max-w-md">
                <svg className="w-4 h-4 text-slate-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search analytics, students or courses..." 
                  className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute 0 0 w-2 h-2 bg-purple-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden border-2 border-white shadow-sm">
                  <img src="https://ui-avatars.com/api/?name=Mohammed&background=6366f1&color=fff" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{user?.name || 'Mohammed'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SENIOR EDITOR</span>
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

export default InstructorLayout;
