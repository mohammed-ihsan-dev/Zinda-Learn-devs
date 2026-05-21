import {
  Bell, CheckCircle2, MessageSquare, AlertCircle, Info,
  GraduationCap, DollarSign, Calendar, UserPlus, ShieldAlert, ShieldCheck,
  CheckCheck, Inbox
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AdminNotifications = () => {
  const { notifications, markAsRead, markAllRead, unreadCount } = useNotifications();
  const navigate = useNavigate();

  const getIconData = (type) => {
    switch (type) {
      case 'enrollment':
        return { icon: UserPlus, color: 'text-indigo-400', bg: 'bg-indigo-900/20', border: 'border-indigo-800/40' };
      case 'course_approved':
        return { icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-800/40' };
      case 'course_declined':
        return { icon: GraduationCap, color: 'text-rose-400', bg: 'bg-rose-900/20', border: 'border-rose-800/40' };
      case 'payout_approved':
        return { icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-800/40' };
      case 'payout_rejected':
        return { icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-900/20', border: 'border-rose-800/40' };
      case 'live_class':
        return { icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-800/40' };
      case 'message':
      case 'support_reply':
      case 'support_resolved':
        return { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-800/40' };
      case 'account_blocked':
        return { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-800/40' };
      case 'account_restored':
        return { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-800/40' };
      case 'success':
        return { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-800/40' };
      case 'warning':
      case 'error':
        return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-800/40' };
      default:
        return { icon: Info, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-800/40' };
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Notifications</h1>
          <p className="text-zinc-500 text-sm">
            {unreadCount > 0 ? (
              <span className="text-purple-400 font-semibold">{unreadCount} unread</span>
            ) : (
              'All caught up'
            )}{' '}
            · {notifications.length} total
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-[#1c1c21] border border-[#27272a] hover:border-purple-600 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((n) => {
            const { icon: Icon, color, bg, border } = getIconData(n.type);
            return (
              <div
                key={n._id}
                className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  n.isRead
                    ? 'bg-[#111113] border-[#1f1f23] opacity-70 hover:opacity-100'
                    : 'bg-[#16161a] border-purple-800/30 shadow-lg shadow-purple-900/10'
                }`}
                onClick={() => {
                  if (!n.isRead) markAsRead(n._id);
                  if (n.link) navigate(n.link);
                }}
              >
                {/* Unread dot */}
                {!n.isRead && (
                  <span className="absolute top-5 right-5 w-2 h-2 bg-purple-500 rounded-full" />
                )}

                <div className={`p-2.5 rounded-xl border flex-shrink-0 ${bg} ${border}`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-0.5">
                    <h3 className={`text-sm font-bold truncate ${n.isRead ? 'text-zinc-400' : 'text-white'}`}>
                      {n.title}
                    </h3>
                    <span className="text-[10px] text-zinc-600 whitespace-nowrap flex-shrink-0">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{n.message}</p>

                  {!n.isRead && (
                    <button
                      onClick={(e) => { e.stopPropagation(); markAsRead(n._id); }}
                      className="mt-2 text-[10px] text-purple-500 hover:text-purple-400 font-bold transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center space-y-4 bg-[#111113] border border-[#1f1f23] rounded-2xl">
            <div className="w-16 h-16 bg-[#1c1c21] border border-[#27272a] rounded-2xl flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7 text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-sm font-medium">No notifications yet</p>
            <p className="text-zinc-700 text-xs max-w-xs mx-auto">
              Notifications will appear here when important platform events occur.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
