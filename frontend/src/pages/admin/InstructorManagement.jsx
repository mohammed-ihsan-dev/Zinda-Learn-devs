import { useState, useEffect } from 'react';
import { Plus, Download, FileText, MoreVertical, ChevronLeft, ChevronRight, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { getPendingInstructors, getTutors, approveInstructor, rejectInstructor, blockUser, unblockUser } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const InstructorManagement = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeTutors, setActiveTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [submittingBlock, setSubmittingBlock] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const pendingRes = await getPendingInstructors();
      setPendingRequests(pendingRes.data || []);

      const tutorsRes = await getTutors();
      setActiveTutors(tutorsRes.data || []);
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

  const handleBlockToggle = async (tutor) => {
    if (tutor.isBlocked) {
      try {
        await unblockUser(tutor._id);
        toast.success('Tutor unblocked successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to unblock tutor');
      }
    } else {
      setSelectedTutor(tutor);
      setBlockReason('');
      setShowBlockModal(true);
    }
  };

  const handleConfirmBlock = async (e) => {
    e.preventDefault();
    if (!blockReason.trim()) {
      return toast.error('Please enter a reason for suspension.');
    }

    try {
      setSubmittingBlock(true);
      await blockUser(selectedTutor._id, blockReason);
      toast.success('Tutor account suspended successfully');
      setShowBlockModal(false);
      setSelectedTutor(null);
      setBlockReason('');
      fetchData();
    } catch (error) {
      toast.error('Failed to block tutor');
    } finally {
      setSubmittingBlock(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tutor Management</h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Oversee pending applications and monitor active tutor performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-[#1c1c21] hover:bg-[#27272a] text-white text-xs font-bold rounded-xl border border-[#27272a] transition-colors">
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center gap-2">
            Add New Tutor
          </button>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div>
          <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PENDING REQUESTS ({pendingRequests.length})</h2>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-10 text-center">
            <p className="text-zinc-500 text-sm">No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map(req => (
              <div key={req._id} className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-5 flex flex-col hover:border-[#3f3f46] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img src={req.avatar || `https://ui-avatars.com/api/?name=${req.name}&background=random`} alt={req.name} className="w-10 h-10 rounded-full object-cover border border-[#27272a]" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{req.name}</h3>
                      <p className="text-[10px] text-purple-400 font-bold tracking-wider">{req.email}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-zinc-500 bg-[#121212] px-2 py-1 rounded-md border border-[#27272a]">
                    NEW
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4 flex-1">
                  {req.bio || 'No bio provided.'}
                </p>
                {req.resume && (
                  <div className="flex items-center gap-2 bg-[#121212] p-2.5 rounded-lg border border-[#27272a] mb-5">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] font-bold text-zinc-300 truncate">Resume.pdf</span>
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(req._id)}
                    className="flex-1 py-2.5 bg-[#121212] hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl border border-[#27272a] transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(req._id)}
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-[0_0_10px_rgba(147,51,234,0.3)] transition-colors"
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
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ACTIVE TUTORS ({activeTutors.length})</h2>
        </div>

        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#121212]/50">
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TUTOR DETAILS</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">EMAIL</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">JOINED</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">STATUS</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {activeTutors.map(tutor => (
                <tr key={tutor._id} className="hover:bg-[#25252b] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img src={tutor.avatar || `https://ui-avatars.com/api/?name=${tutor.name}&background=random`} alt={tutor.name} className="w-10 h-10 rounded-full object-cover border border-[#27272a]" />
                      <div>
                        <p className="text-sm font-bold text-white">{tutor.name}</p>
                        <p className="text-[10px] text-zinc-500">Instructor</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className="text-xs text-zinc-400">{tutor.email}</span>
                  </td>
                  <td className="p-5 text-center">
                    <span className="text-xs text-zinc-400">
                      {new Date(tutor.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${tutor.isBlocked
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}>
                      {tutor.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleBlockToggle(tutor)}
                        className={`p-2 hover:bg-white/5 rounded-lg transition-colors ${tutor.isBlocked ? 'text-emerald-400 hover:text-emerald-300' : 'text-rose-400 hover:text-rose-300'}`}
                        title={tutor.isBlocked ? 'Unblock Tutor' : 'Block Tutor'}
                      >
                        {tutor.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                      <button className="text-zinc-500 hover:text-white transition-colors p-2">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Confirmation Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121215] border border-rose-500/20 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Suspend Tutor Account</h3>
            </div>
            
            <p className="text-xs text-zinc-400">
              You are about to suspend <strong>{selectedTutor?.name}</strong> ({selectedTutor?.email}).
              Suspended instructors will lose access to the platform and their courses will automatically be hidden until unblocked.
            </p>

            <form onSubmit={handleConfirmBlock} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Reason for Suspension
                </label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g. Violation of platform guidelines, sharing inappropriate content, etc..."
                  rows={3}
                  className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowBlockModal(false);
                    setSelectedTutor(null);
                    setBlockReason('');
                  }}
                  className="px-4 py-2.5 bg-[#1c1c21] hover:bg-[#27272a] text-zinc-400 hover:text-zinc-200 text-xs font-bold rounded-xl border border-[#2d2d34] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBlock}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all"
                >
                  {submittingBlock ? 'Suspending...' : 'Confirm Suspension'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorManagement;
