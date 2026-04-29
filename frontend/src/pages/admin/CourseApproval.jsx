import { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  Edit2, 
  Eye, 
  Archive, 
  Trash2, 
  Clock, 
  PlayCircle, 
  Loader2, 
  CheckCircle,
  MoreVertical,
  ChevronDown,
  X,
  AlertCircle,
  Undo2,
  Send,
  ExternalLink,
  Ban
} from 'lucide-react';
import { getAllCourses, getPendingCourses, approveCourse, declineCourse, updateCourseStatus } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/currencyFormatter';

const CourseApproval = () => {
  const [activeTab, setActiveTab] = useState('All Courses');
  const [allCourses, setAllCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [declineModal, setDeclineModal] = useState({ isOpen: false, courseId: null, courseTitle: '', reason: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allRes, pendingRes] = await Promise.all([
        getAllCourses(),
        getPendingCourses()
      ]);
      setAllCourses(allRes.courses || allRes.data || []);
      setPendingCourses(pendingRes.courses || pendingRes.data || []);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setProcessing(true);
      await approveCourse(id);
      toast.success('Course approved and published!');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve course');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeclineSubmit = async () => {
    if (!declineModal.reason.trim()) return toast.error('Please provide a reason');
    try {
      setProcessing(true);
      await declineCourse(declineModal.courseId, declineModal.reason);
      toast.success('Course declined');
      setDeclineModal({ isOpen: false, courseId: null, courseTitle: '', reason: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to decline course');
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setProcessing(true);
      await updateCourseStatus(id, status);
      toast.success(`Course moved to ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setProcessing(false);
      setOpenMenuId(null);
    }
  };

  const featuredPending = pendingCourses.length > 0 ? pendingCourses[0] : null;
  const queuePending = pendingCourses.slice(1);

  const filteredCourses = allCourses.filter(course => {
    if (activeTab === 'All Courses') return true;
    if (activeTab === 'Published') return course.status === 'published';
    if (activeTab === 'Pending Review') return course.status === 'pending';
    if (activeTab === 'Draft') return course.status === 'draft';
    return true;
  });

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Course Management</h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Manage, review and publish educational content across the platform.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
          <Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2 bg-[#1c1c21] p-1 rounded-full border border-[#27272a]">
          {['All Courses', 'Published', 'Pending Review', 'Draft'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors ml-auto">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Large Review Card */}
            <div className="lg:col-span-2 bg-[#1c1c21] border border-[#27272a] rounded-2xl p-5 flex flex-col md:flex-row gap-6 group hover:border-[#3f3f46] transition-colors">
              {featuredPending ? (
                <>
                  <div className="w-full md:w-1/3 relative rounded-xl overflow-hidden aspect-video md:aspect-auto">
                    <img src={featuredPending.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"} alt="Course" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500/90 text-black text-[9px] font-bold uppercase tracking-widest rounded shadow-lg backdrop-blur-sm">
                      IN REVIEW
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{featuredPending.category || 'GENERAL'}</span>
                      <span className="text-lg font-bold text-white">{formatCurrency(featuredPending.price || 0)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">{featuredPending.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 mb-6">
                      <span className="flex items-center gap-1.5"><UserIcon /> {featuredPending.instructor?.name || 'Instructor'}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Pending Review</span>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#27272a] text-zinc-300 hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setDeclineModal({ isOpen: true, courseId: featuredPending._id, courseTitle: featuredPending.title, reason: '' })} 
                          className="px-5 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all hover:bg-rose-500/20 active:scale-95"
                        >
                          Decline
                        </button>
                        <button 
                          onClick={() => handleApprove(featuredPending._id)} 
                          className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-95 flex items-center gap-2"
                        >
                          {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          Approve & Publish
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center text-zinc-500 bg-emerald-500/5 border border-dashed border-emerald-500/20 rounded-xl">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h4 className="text-white font-bold mb-1">Queue Clear!</h4>
                  <p className="text-[11px]">No courses are waiting for review right now.</p>
                </div>
              )}
            </div>

            {/* Review Queue List */}
            <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-5 flex flex-col">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">REVIEW QUEUE ({queuePending.length})</h3>
              
              {queuePending.length > 0 ? (
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
                  {queuePending.map(course => (
                    <div key={course._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#25252b] transition-colors border border-transparent hover:border-[#3f3f46]">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
                        <FileIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{course.title}</p>
                        <p className="text-[10px] text-zinc-500 truncate">By {course.instructor?.name || 'Unknown'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-zinc-500">Queue is empty</p>
                </div>
              )}

              <button className="w-full mt-4 py-3 bg-[#121212] hover:bg-[#27272a] text-purple-400 text-xs font-bold rounded-xl border border-[#27272a] transition-colors">
                View All Queue
              </button>
            </div>
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? filteredCourses.map(course => (
              <div key={course._id} className="bg-[#1c1c21] border border-[#27272a] rounded-2xl overflow-hidden group hover:border-[#3f3f46] transition-all flex flex-col relative">
                <div className="relative aspect-video shrink-0">
                  <img 
                    src={course.thumbnail || "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop"} 
                    alt={course.title} 
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${course.status === 'draft' ? 'grayscale opacity-70' : ''}`} 
                  />
                  <div className={`absolute top-3 left-3 px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded shadow-lg backdrop-blur-md border ${
                    course.status === 'published' ? 'bg-emerald-500/80 text-white border-emerald-400/30' : 
                    course.status === 'pending' ? 'bg-amber-500/80 text-black border-amber-400/30' : 
                    course.status === 'declined' ? 'bg-rose-500/80 text-white border-rose-400/30' :
                    'bg-zinc-600/80 text-white border-zinc-500/30'
                  }`}>
                    {course.status}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">{course.category || 'General'}</span>
                    <p className="text-sm font-bold text-white leading-none">{course.price === 0 ? 'Free' : formatCurrency(course.price)}</p>
                  </div>
                  
                  <h3 className="text-base font-bold text-white leading-tight line-clamp-2 mb-4 flex-1">{course.title}</h3>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-[10px] font-bold">
                        {course.instructor?.name?.charAt(0) || 'I'}
                      </div>
                      <p className="text-[10px] font-medium text-zinc-400 truncate max-w-[100px]">{course.instructor?.name || 'Instructor'}</p>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === course._id ? null : course._id)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${openMenuId === course._id ? 'bg-purple-600 text-white' : 'bg-[#27272a] text-zinc-400 hover:bg-[#3f3f46] hover:text-white'}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === course._id && (
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#1c1c21] border border-[#27272a] rounded-xl shadow-2xl z-50 py-2 animate-scale-in">
                          {course.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(course._id)} className="w-full px-4 py-2 text-left text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 transition-colors">
                                <CheckCircle className="w-3.5 h-3.5" /> Approve Course
                              </button>
                              <button onClick={() => { setDeclineModal({ isOpen: true, courseId: course._id, courseTitle: course.title, reason: '' }); setOpenMenuId(null); }} className="w-full px-4 py-2 text-left text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors">
                                <Ban className="w-3.5 h-3.5" /> Decline Course
                              </button>
                            </>
                          )}
                          {course.status === 'published' && (
                            <button onClick={() => handleStatusUpdate(course._id, 'draft')} className="w-full px-4 py-2 text-left text-xs font-bold text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 transition-colors">
                              <Undo2 className="w-3.5 h-3.5" /> Move to Draft
                            </button>
                          )}
                          {course.status === 'declined' && (
                            <button onClick={() => handleStatusUpdate(course._id, 'draft')} className="w-full px-4 py-2 text-left text-xs font-bold text-indigo-400 hover:bg-indigo-500/10 flex items-center gap-2 transition-colors">
                              <Undo2 className="w-3.5 h-3.5" /> Reset to Draft
                            </button>
                          )}
                          <button onClick={() => window.open(`/course/${course._id}`, '_blank')} className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-300 hover:bg-[#27272a] flex items-center gap-2 transition-colors border-t border-zinc-800/50 mt-1 pt-3">
                            <ExternalLink className="w-3.5 h-3.5" /> Preview Course
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {course.status === 'declined' && course.declineReason && (
                    <div className="mt-3 p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                      <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> Decline Reason
                      </p>
                      <p className="text-[10px] text-rose-200/70 italic line-clamp-2">"{course.declineReason}"</p>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 bg-[#1c1c21]/50 rounded-3xl border border-dashed border-[#27272a]">
                <Archive className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">No courses match your current view.</p>
              </div>
            )}
          </div>

          {/* Decline Reason Modal */}
          {declineModal.isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
              <div className="bg-[#1c1c21] border border-zinc-800 rounded-[32px] w-full max-w-md shadow-2xl shadow-purple-500/5 animate-scale-in overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
                      <Ban className="w-6 h-6" />
                    </div>
                    <button 
                      onClick={() => setDeclineModal({ isOpen: false, courseId: null, courseTitle: '', reason: '' })}
                      className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">Decline Course</h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    Provide a detailed reason why <span className="text-white font-bold">"{declineModal.courseTitle}"</span> is being rejected. This will be shown to the instructor.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Reason for Rejection</label>
                      <textarea 
                        autoFocus
                        rows="4"
                        placeholder="e.g. Video quality is too low, or content violates community guidelines..."
                        value={declineModal.reason}
                        onChange={(e) => setDeclineModal({ ...declineModal, reason: e.target.value })}
                        className="w-full bg-[#121212] border border-zinc-800 rounded-2xl p-4 text-sm text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all outline-none resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => setDeclineModal({ isOpen: false, courseId: null, courseTitle: '', reason: '' })}
                        className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-2xl transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDeclineSubmit}
                        disabled={processing}
                        className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Decline Course
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Showing {filteredCourses.length} courses</p>
          </div>
        </>
      )}
    </div>
  );
};

// Mini icons for inline use
const UserIcon = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const FileIcon = () => <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const MoreIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>;

export default CourseApproval;
