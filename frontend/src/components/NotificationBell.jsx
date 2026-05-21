import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  MessageSquare, 
  GraduationCap, 
  DollarSign, 
  Calendar, 
  UserPlus, 
  ShieldAlert, 
  ShieldCheck, 
  Info,
  CheckCircle,
  Inbox
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'support_reply':
      case 'support_resolved':
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'course_approved':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'course_declined':
        return <GraduationCap className="w-4 h-4 text-rose-400" />;
      case 'payout_approved':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'payout_rejected':
        return <DollarSign className="w-4 h-4 text-rose-400" />;
      case 'live_class':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'enrollment':
        return <UserPlus className="w-4 h-4 text-indigo-400" />;
      case 'account_blocked':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'account_restored':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getViewAllLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/notifications';
    if (user.role === 'instructor') return '/instructor/notifications';
    return '/student/notifications';
  };

  const latestNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all duration-200 focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 bg-purple-600 rounded-full text-white text-[9px] font-black border-2 border-[#09090b] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a] bg-[#121212]/50">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-purple-900/40 text-purple-400 text-[9px] font-black rounded">
                  {unreadCount} new
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-[10px] text-purple-400 hover:text-purple-300 font-bold transition-colors flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-[#27272a] max-h-80 overflow-y-auto">
            {latestNotifications.length > 0 ? (
              latestNotifications.map((notif) => (
                <div 
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start gap-3 p-4 hover:bg-[#202024]/40 transition-colors cursor-pointer relative group ${
                    !notif.isRead ? 'bg-purple-900/5' : ''
                  }`}
                >
                  <div className="p-2 bg-[#0a0a0b] border border-[#27272a] rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-bold truncate ${notif.isRead ? 'text-zinc-400' : 'text-white'}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="block text-[9px] text-zinc-500 font-medium">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Mark as read inline button */}
                  {!notif.isRead && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif._id);
                      }}
                      className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 p-1 hover:bg-[#27272a] rounded text-zinc-400 hover:text-white transition-all"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-3 bg-[#18181b]">
                <Inbox className="w-10 h-10 text-zinc-700 mx-auto" />
                <p className="text-zinc-500 text-xs font-medium">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#27272a] bg-[#0a0a0b] text-center">
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate(getViewAllLink());
              }}
              className="block w-full py-2.5 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
