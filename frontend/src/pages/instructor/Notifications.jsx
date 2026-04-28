import { Bell, CheckCircle2, MessageSquare, AlertCircle, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'enrollment',
      title: 'New Student Enrolled',
      message: 'Alex Rivera just enrolled in your course "Advanced UI/UX Mastery".',
      time: '2 minutes ago',
      read: false,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100'
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message Received',
      message: 'You have a new question from Sarah Jenkins in the course Q&A.',
      time: '1 hour ago',
      read: false,
      icon: MessageSquare,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      id: 3,
      type: 'system',
      title: 'Course Approved',
      message: 'Great news! Your course "Python for Beginners" has been approved by the admin.',
      time: '5 hours ago',
      read: true,
      icon: AlertCircle,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Notifications</h1>
          <p className="text-slate-500 text-sm">Stay updated with your courses and student activity.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-2 rounded-xl transition-all"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`group relative bg-white p-6 rounded-[32px] border transition-all duration-300 flex items-start gap-5 ${
                n.read ? 'border-slate-100 opacity-75' : 'border-purple-100 shadow-xl shadow-purple-500/5'
              }`}
            >
              {!n.read && (
                <div className="absolute top-6 right-8 w-2 h-2 bg-purple-600 rounded-full"></div>
              )}
              
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${n.iconBg} ${n.iconColor}`}>
                <n.icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 text-base">{n.title}</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.time}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{n.message}</p>
                
                <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[10px] font-bold text-purple-600 uppercase tracking-widest hover:underline">View Details</button>
                  <button 
                    onClick={() => deleteNotification(n.id)}
                    className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>

              <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[32px] border border-slate-100 p-20 text-center">
            <Bell className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">You're all caught up!</p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium italic">
            "Tip: Regular student engagement leads to 30% higher course completion rates."
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
