import { useState, useEffect } from 'react';
import { Plus, Download, FileText, MoreVertical, ChevronLeft, ChevronRight, UserCheck, ShieldCheck } from 'lucide-react';
import { getPendingInstructors, getTutors, approveInstructor, rejectInstructor } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/common/Pagination';

const InstructorManagement = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeTutors, setActiveTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const pendingRes = await getPendingInstructors();
      setPendingRequests(pendingRes.data || []);
      
      const tutorsRes = await getTutors({ page: currentPage, limit: 10 });
      setActiveTutors(tutorsRes.data || []);
      if (tutorsRes.pagination) {
        setPagination(tutorsRes.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveInstructor(id);
      toast.success('Instructor approved');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve instructor');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject/remove this instructor?')) return;
    try {
      await rejectInstructor(id);
      toast.success('Instructor rejected');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject instructor');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in pb-10 space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Tutor Management</h1>
          <p className="text-zinc-500 font-medium max-w-2xl">
            Oversee pending applications and monitor active tutor performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-[#1c1c21] hover:bg-[#27272a] text-zinc-300 text-xs font-black uppercase tracking-widest rounded-2xl border border-[#27272a] transition-all">
            Export Data
          </button>
          <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-200 transition-all active:scale-95">
            Add New Tutor
          </button>
        </div>
      </div>

      {/* Pending Requests */}
      <div>
        <div className="flex items-center gap-3 mb-8">
           <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldCheck size={20} />
           </div>
           <div>
              <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Onboarding</h2>
              <p className="text-lg font-black text-white tracking-tight">Pending Requests ({pendingRequests.length})</p>
           </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-[#1c1c21] border border-dashed border-[#27272a] rounded-[32px] p-16 text-center">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingRequests.map(req => (
              <div key={req._id} className="bg-[#1c1c21] border border-[#27272a] rounded-[32px] p-8 flex flex-col hover:border-purple-500/30 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <img src={req.avatar || `https://ui-avatars.com/api/?name=${req.name}&background=random`} alt={req.name} className="w-14 h-14 rounded-2xl object-cover border border-[#27272a] shadow-lg shadow-black/20" />
                    <div>
                      <h3 className="text-base font-black text-white tracking-tight">{req.name}</h3>
                      <p className="text-[10px] text-purple-400 font-black tracking-widest uppercase">{req.email}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 uppercase tracking-widest">
                    Pending
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6 flex-1 font-medium italic">
                  "{req.bio || 'No bio provided for this applicant.'}"
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleReject(req._id)}
                    className="flex-1 py-4 bg-[#121212] hover:bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-rose-500/20 transition-all"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(req._id)}
                    className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-purple-900/20 transition-all"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Tutors */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <UserCheck size={20} />
           </div>
           <div>
              <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Community</h2>
              <p className="text-lg font-black text-white tracking-tight">Active Instructors ({pagination.totalItems})</p>
           </div>
        </div>

        <div className="bg-[#1c1c21] border border-[#27272a] rounded-[40px] overflow-hidden shadow-2xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#27272a] bg-[#121212]/50">
                  <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tutor Details</th>
                  <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Contact</th>
                  <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Joined</th>
                  <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {loading && activeTutors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center">
                       <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : activeTutors.map(tutor => (
                  <tr key={tutor._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <img src={tutor.avatar || `https://ui-avatars.com/api/?name=${tutor.name}&background=random`} alt={tutor.name} className="w-12 h-12 rounded-2xl object-cover border border-[#27272a] shadow-md group-hover:scale-105 transition-transform" />
                        <div>
                          <p className="text-sm font-black text-white leading-none mb-1.5">{tutor.name}</p>
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Certified Instructor</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <span className="text-xs font-bold text-zinc-400">{tutor.email}</span>
                    </td>
                    <td className="p-8 text-center">
                      <span className="text-xs font-bold text-zinc-400">
                        {new Date(tutor.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      <button className="text-zinc-500 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-2xl">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 border-t border-[#27272a] bg-[#1c1c21]">
            <Pagination 
              pagination={pagination} 
              onPageChange={handlePageChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorManagement;
