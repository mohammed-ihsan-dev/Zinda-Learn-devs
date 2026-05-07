import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, 
  Calendar, 
  Clock, 
  User, 
  Play, 
  Search,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLiveClasses } from '../hooks/useLiveClasses';
import Pagination from '../../../components/common/Pagination';

const StudentLiveClasses = () => {
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const { liveClasses, loading, pagination } = useLiveClasses({
    page: currentPage,
    limit: 9,
    status: filter === 'ALL' ? '' : filter
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (f) => {
    setFilter(f);
    setCurrentPage(1);
  };

  const liveNow = liveClasses.filter(c => c.status === 'LIVE');
  const upcomingCount = pagination.totalItems - liveNow.length;

  if (loading && liveClasses.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Video size={20} className="text-purple-600 animate-pulse" />
          </div>
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Syncing Sessions...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000 pb-20">
      {/* Premium Hero Section */}
      <div className="relative rounded-[45px] overflow-hidden bg-slate-950 text-white p-10 md:p-16 shadow-2xl shadow-indigo-200/20 border border-white/5">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-8">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Interactive Learning
            </span>
            {liveNow.length > 0 && (
              <span className="px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                • {liveNow.length} Live
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
            Level up with <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic">Live</span> Expertise.
          </h1>
          
          <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
            Join elite sessions, engage with mentors, and collaborate in real-time with your global peer network.
          </p>
          
          <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Video className="text-indigo-400" size={18} />
              </div>
              <div>
                <div className="text-xs font-black text-white uppercase tracking-wider">{liveNow.length} Active</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sessions</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Calendar className="text-purple-400" size={18} />
              </div>
              <div>
                <div className="text-xs font-black text-white uppercase tracking-wider">{pagination.totalItems} Total</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Available</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Artistic Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Academic Calendar</h2>
            <p className="text-slate-500 text-sm font-medium">Your roadmap to mastery through live interaction</p>
          </div>
          
          <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50">
            {['ALL', 'LIVE', 'UPCOMING', 'ENDED'].map(f => (
              <button 
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  filter === f 
                    ? 'bg-white text-indigo-600 shadow-sm shadow-indigo-100' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {liveClasses.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center shadow-sm">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="text-slate-200" size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Sessions Found</h3>
            <p className="text-slate-500 max-w-xs mx-auto font-medium text-sm leading-relaxed">
              It looks like there aren't any live classes matching your filter right now.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveClasses.map(c => (
                <StudentLiveClassCard key={c._id} liveClass={c} />
              ))}
            </div>
            
            <Pagination 
              pagination={pagination} 
              onPageChange={handlePageChange} 
            />
          </>
        )}
      </section>
    </div>
  );
};

const StudentLiveClassCard = ({ liveClass }) => {
  const formattedDate = new Date(liveClass.scheduledDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });

  const isLive = liveClass.status === 'LIVE';

  return (
    <div className="bg-white rounded-[35px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group flex flex-col h-full border-b-4 border-b-transparent hover:border-b-indigo-500">
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        {liveClass.thumbnail ? (
          <img src={liveClass.thumbnail} alt={liveClass.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-50">
            <Video className="text-indigo-200" size={48} strokeWidth={1} />
          </div>
        )}
        
        {isLive && (
          <div className="absolute top-5 left-5 flex items-center gap-2 bg-rose-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            Streaming
          </div>
        )}
        
        <div className="absolute bottom-5 left-5 right-5">
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl inline-flex items-center gap-3 text-[10px] font-black text-indigo-600 shadow-sm uppercase tracking-wider border border-white/50 max-w-full">
            <BookOpen size={14} className="shrink-0" />
            <span className="truncate">{liveClass.course?.title || 'General Session'}</span>
          </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-xl font-black text-slate-900 mb-6 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors tracking-tight">
          {liveClass.title}
        </h3>
        
        <div className="flex items-center gap-6 mb-8 pt-6 border-t border-slate-50">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-wider">
            <Calendar size={14} className="text-indigo-400" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-wider">
            <Clock size={14} className="text-indigo-400" />
            {liveClass.startTime}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100/50">
              {liveClass.instructor?.avatar ? (
                <img src={liveClass.instructor.avatar} alt={liveClass.instructor.name} className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="text-indigo-300" />
              )}
            </div>
            <div className="text-[11px] font-black text-slate-700 uppercase tracking-wide truncate max-w-[80px]">{liveClass.instructor?.name}</div>
          </div>

          <Link 
            to={`/student/live-classes/${liveClass._id}`}
            className={`px-6 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-3 ${
              isLive 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 shadow-xl shadow-indigo-100 active:scale-95' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {isLive ? (
              <>
                <Play size={14} fill="white" />
                Join Now
              </>
            ) : (
              'Details'
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLiveClasses;
