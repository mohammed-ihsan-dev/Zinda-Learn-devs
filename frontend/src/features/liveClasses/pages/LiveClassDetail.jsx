import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  ArrowLeft, 
  Play, 
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import liveClassService from '../services/liveClassService';

const LiveClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liveClass, setLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  useEffect(() => {
    if (!liveClass || liveClass.status !== 'upcoming') return;

    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, [liveClass]);

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await liveClassService.getLiveClassById(id);
      if (response.success) {
        setLiveClass(response.data);
        checkJoinStatus(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch details');
      navigate('/student/live-classes');
    } finally {
      setLoading(false);
    }
  };

  const checkJoinStatus = (data) => {
    if (data.status === 'live') {
      setCanJoin(true);
      return;
    }

    if (data.status === 'ended' || data.status === 'cancelled') {
      setCanJoin(false);
      return;
    }

    // Check if within 10 minutes
    const now = new Date();
    const scheduledTime = new Date(data.scheduledDateStr || data.startTime);
    const [hours, minutes] = data.startTimeStr ? data.startTimeStr.split(':') : [0, 0];
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const diffInMinutes = (scheduledTime - now) / (1000 * 60);
    if (diffInMinutes <= 10) {
      setCanJoin(true);
    } else {
      setCanJoin(false);
    }
  };

  const calculateTimeLeft = () => {
    if (!liveClass) return;

    const now = new Date();
    const scheduledTime = new Date(liveClass.scheduledDateStr || liveClass.startTime);
    const [hours, minutes] = liveClass.startTimeStr ? liveClass.startTimeStr.split(':') : [0, 0];
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const difference = scheduledTime - now;

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });

      // Update canJoin status if it hits the 10-minute mark
      const diffInMinutes = difference / (1000 * 60);
      if (diffInMinutes <= 10 && !canJoin) {
        setCanJoin(true);
      }
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      // If time passed but status still UPCOMING, maybe instructor hasn't started
      if (liveClass.status === 'upcoming') {
        setCanJoin(true); // Still allow joining/waiting
      }
    }
  };

  const handleJoin = async () => {
    try {
      setJoining(true);
      const response = await liveClassService.joinLiveClass(id);
      if (response.success) {
        toast.success('Joining class...');
        // Open meeting link in new tab
        window.open(response.data.meetingLink, '_blank');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join class');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!liveClass) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Live Classes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="relative h-64 bg-slate-100">
              {liveClass.thumbnail ? (
                <img src={liveClass.thumbnail} alt={liveClass.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Video className="text-white/20" size={80} />
                </div>
              )}
              {liveClass.status === 'live' && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-rose-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Live Now
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-4">
                <CheckCircle2 size={16} />
                {liveClass.course?.title}
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-6">{liveClass.title}</h1>
              
              <div className="prose prose-slate max-w-none text-slate-600 mb-8">
                <p>{liveClass.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</span>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Calendar size={18} className="text-indigo-500" />
                    {new Date(liveClass.scheduledDateStr || liveClass.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start Time</span>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Clock size={18} className="text-indigo-500" />
                    {liveClass.startTimeStr}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Clock size={18} className="text-indigo-500" />
                    {liveClass.duration} Mins
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-lg shadow-slate-100">
              {liveClass.instructor?.avatar ? (
                <img src={liveClass.instructor.avatar} alt={liveClass.instructor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-400">
                  <User size={32} />
                </div>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Instructor</span>
              <h3 className="text-xl font-bold text-slate-900">{liveClass.instructor?.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2">{liveClass.instructor?.bio || 'Senior Subject Matter Expert at Zinda Learn'}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm text-center">
            {liveClass.status === 'upcoming' && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Class Starts In</h3>
                <div className="grid grid-cols-4 gap-2 mb-8">
                  <TimeBox label="Days" value={timeLeft.days} />
                  <TimeBox label="Hours" value={timeLeft.hours} />
                  <TimeBox label="Mins" value={timeLeft.minutes} />
                  <TimeBox label="Secs" value={timeLeft.seconds} />
                </div>
              </>
            )}

            {liveClass.status === 'live' && (
              <div className="mb-8">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Play size={32} fill="currentColor" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Session is Live!</h3>
                <p className="text-slate-500 text-sm mt-2">Join now to participate in the interactive session.</p>
              </div>
            )}

            {liveClass.status === 'ended' && (
              <div className="mb-8">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Class Ended</h3>
                <p className="text-slate-500 text-sm mt-2">This session has been completed. Check recordings if available.</p>
              </div>
            )}

            <button
              onClick={handleJoin}
              disabled={!canJoin || joining}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                canJoin && !joining
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {joining ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : canJoin ? (
                <>
                  <Video size={20} />
                  Join Live Class
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Join Link Locked
                </>
              )}
            </button>

            {!canJoin && liveClass.status === 'upcoming' && (
              <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                Join button will be enabled 10 minutes before the scheduled start time.
              </p>
            )}
          </div>

          <div className="bg-slate-900 rounded-[40px] p-8 text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-400" />
              Join Rules
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></span>
                Must be enrolled in the course
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></span>
                Join up to 10 mins before start
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></span>
                Stay active for attendance tracking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeBox = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
    <div className="text-xl font-bold text-slate-900">{value.toString().padStart(2, '0')}</div>
    <div className="text-[8px] font-bold text-slate-400 uppercase">{label}</div>
  </div>
);

export default LiveClassDetail;
