import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Video,
  CheckCircle2,
  Clock,
  MoreVertical,
  Trash2,
  Edit3,
  Play,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import liveClassService from '../services/liveClassService';

const InstructorLiveClasses = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const response = await liveClassService.getInstructorLiveClasses();
      if (response.success) {
        setLiveClasses(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch live classes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartClass = async (id) => {
    try {
      const response = await liveClassService.startLiveClass(id);
      if (response.success) {
        toast.success('Live class started!');
        fetchLiveClasses();
      }
    } catch (error) {
      toast.error('Failed to start class');
    }
  };

  const handleEndClass = async (id) => {
    try {
      const response = await liveClassService.endLiveClass(id);
      if (response.success) {
        toast.success('Live class ended!');
        fetchLiveClasses();
      }
    } catch (error) {
      toast.error('Failed to end class');
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      const response = await liveClassService.deleteLiveClass(id);
      if (response.success) {
        toast.success('Live class deleted');
        fetchLiveClasses();
      }
    } catch (error) {
      toast.error('Failed to delete class');
    }
  };

  const filteredClasses = liveClasses.filter(c => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  const stats = {
    total: liveClasses.length,
    upcoming: liveClasses.filter(c => c.status === 'UPCOMING').length,
    live: liveClasses.filter(c => c.status === 'LIVE').length,
    completed: liveClasses.filter(c => c.status === 'ENDED').length
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Video size={20} className="text-purple-600 animate-pulse" />
          </div>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Loading Sessions...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
              <Video className="text-white" size={20} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Live Classes</h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Manage and schedule your high-impact interactive sessions</p>
        </div>
        <Link
          to="/instructor/live-classes/create"
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-[22px] font-black text-sm hover:scale-[1.02] transition-all shadow-xl shadow-purple-200 active:scale-95 uppercase tracking-wider"
        >
          <Plus size={20} strokeWidth={3} />
          Schedule Session
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Sessions" value={stats.total} icon={<Calendar />} color="bg-blue-500" />
        <StatCard title="Upcoming" value={stats.upcoming} icon={<Clock />} color="bg-amber-500" />
        <StatCard title="Live Now" value={stats.live} icon={<Video />} color="bg-rose-500" pulse />
        <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 />} color="bg-emerald-500" />
      </div>

      {/* Filters & Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 bg-white/50 backdrop-blur-sm p-2 rounded-[28px] border border-slate-100/50">
        <div className="flex items-center gap-1 w-full md:w-auto">
          {['ALL', 'UPCOMING', 'LIVE', 'ENDED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${filter === f
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
          Showing {filteredClasses.length} sessions
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center shadow-sm">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="text-slate-200" size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No Sessions Found</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium text-sm leading-relaxed">
            Ready to teach? Schedule your first live interaction with your students today.
          </p>
          <Link
            to="/instructor/live-classes/create"
            className="inline-flex items-center gap-2 text-purple-600 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all"
          >
            Create your first class <Play size={14} fill="currentColor" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.map((liveClass) => (
            <LiveClassCard
              key={liveClass._id}
              liveClass={liveClass}
              onStart={() => handleStartClass(liveClass._id)}
              onEnd={() => handleEndClass(liveClass._id)}
              onDelete={() => handleDeleteClass(liveClass._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, pulse }) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500`}></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 ${pulse ? 'animate-pulse' : ''} text-[${color}]`}>
        {React.cloneElement(icon, { size: 22, className: color.replace('bg-', 'text-') })}
      </div>
      <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
    </div>
    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{title}</h3>
  </div>
);

const LiveClassCard = ({ liveClass, onStart, onEnd, onDelete }) => {
  const statusConfig = {
    UPCOMING: { color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Upcoming' },
    LIVE: { color: 'text-rose-600 bg-rose-50 border-rose-100 animate-pulse', label: 'Live Now' },
    ENDED: { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Completed' },
    CANCELLED: { color: 'text-slate-400 bg-slate-50 border-slate-100', label: 'Cancelled' }
  };

  const config = statusConfig[liveClass.status] || statusConfig.UPCOMING;

  const formattedDate = new Date(liveClass.scheduledDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-[35px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/5 transition-all group flex flex-col h-full">
      {/* Thumbnail Area */}
      <div className="relative h-56 overflow-hidden">
        {liveClass.thumbnail ? (
          <img src={liveClass.thumbnail} alt={liveClass.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
            <Video className="text-purple-200" size={56} strokeWidth={1} />
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-5 left-5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${config.color}`}>
          {config.label}
        </div>

        {/* Delete Overlay (Hidden by default) */}
        <button
          onClick={onDelete}
          className="absolute top-5 right-5 p-3 bg-white/20 hover:bg-rose-500 text-white backdrop-blur-md rounded-2xl transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="text-[10px] font-black text-purple-600 mb-3 uppercase tracking-[0.2em] line-clamp-1">
            {liveClass.course?.title || 'Personal Session'}
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-6 leading-tight line-clamp-2 tracking-tight">
            {liveClass.title}
          </h3>

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-slate-500 text-[11px] font-bold gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                <Calendar size={14} className="text-slate-400" />
              </div>
              {formattedDate}
            </div>
            <div className="flex items-center text-slate-500 text-[11px] font-bold gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                <Clock size={14} className="text-slate-400" />
              </div>
              {liveClass.startTime} • {liveClass.duration} Minutes
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50">
          {liveClass.status === 'UPCOMING' && (
            <>
              <button
                onClick={onStart}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-purple-200"
              >
                <Play size={16} fill="white" />
                Start Now
              </button>
              <Link
                to={`/instructor/live-classes/edit/${liveClass._id}`}
                className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-purple-50 hover:text-purple-600 transition-all border border-slate-100/50"
              >
                <Edit3 size={18} />
              </Link>
            </>
          )}

          {liveClass.status === 'LIVE' && (
            <>
              <a
                href={liveClass.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <ExternalLink size={16} />
                Join
              </a>
              <button
                onClick={onEnd}
                className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                <XCircle size={16} />
                End
              </button>
            </>
          )}

          {liveClass.status === 'ENDED' && (
            <div className="w-full flex items-center justify-center py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
              Session Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorLiveClasses;
