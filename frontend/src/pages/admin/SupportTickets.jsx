import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Loader2, 
  Send, 
  Ticket, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LifeBuoy, 
  ArrowLeft,
  AlertTriangle,
  ChevronDown,
  User,
  GraduationCap
} from 'lucide-react';
import { adminGetAllTickets, adminUpdateTicket, replyToTicket } from '../../services/supportService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [createdByRole, setCreatedByRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail View state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchTickets();
  }, [status, priority, createdByRole, currentPage]);

  useEffect(() => {
    if (selectedTicket) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket?.replies]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await adminGetAllTickets({
        page: currentPage,
        limit: 10,
        status,
        priority,
        createdByRole,
        search
      });
      if (res.success) {
        setTickets(res.tickets);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTickets();
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      setSendingReply(true);
      const res = await replyToTicket(selectedTicket._id, replyMessage);
      if (res.success) {
        setSelectedTicket(res.ticket);
        setReplyMessage('');
        fetchTickets(); // refresh list in background
      }
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await adminUpdateTicket(ticketId, { status: newStatus });
      if (res.success) {
        toast.success(`Ticket status updated to ${newStatus}`);
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(res.ticket);
        }
        fetchTickets();
      }
    } catch (error) {
      toast.error('Failed to update ticket status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdatePriority = async (ticketId, newPriority) => {
    try {
      const res = await adminUpdateTicket(ticketId, { priority: newPriority });
      if (res.success) {
        toast.success(`Ticket priority updated to ${newPriority}`);
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(res.ticket);
        }
        fetchTickets();
      }
    } catch (error) {
      toast.error('Failed to update ticket priority');
    }
  };

  return (
    <div className="space-y-8 text-zinc-300">
      <div className="flex items-center justify-between border-b border-[#27272a] pb-6">
        <div>
          <h2 className="text-3xl font-black text-white">Support & Complaints Portal</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage and resolve tickets from both students and instructors securely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tickets List Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters Form */}
          <form onSubmit={handleSearchSubmit} className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search by subject, message, or user name..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <button 
                type="submit" 
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all"
              >
                Search
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Status</label>
                <select 
                  value={status} 
                  onChange={e => { setStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Priority</label>
                <select 
                  value={priority} 
                  onChange={e => { setPriority(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">User Role</label>
                <select 
                  value={createdByRole} 
                  onChange={e => { setCreatedByRole(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">All Roles</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
            </div>
          </form>

          {/* Tickets List */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden min-h-[450px] flex flex-col">
            <div className="flex-1 divide-y divide-[#27272a]">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              ) : tickets.length > 0 ? tickets.map((t) => (
                <div 
                  key={t._id} 
                  onClick={() => handleSelectTicket(t)}
                  className={`p-6 hover:bg-[#202024]/40 transition-colors group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    selectedTicket?._id === t._id ? 'bg-[#202024]/60' : ''
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${
                        t.status === 'open' ? 'bg-blue-900/30 text-blue-400 border border-blue-900' :
                        t.status === 'pending' ? 'bg-amber-900/30 text-amber-400 border border-amber-900' :
                        t.status === 'resolved' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {t.status}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${
                        t.priority === 'high' ? 'bg-rose-900/30 text-rose-400 border border-rose-900' :
                        t.priority === 'medium' ? 'bg-amber-905/30 text-amber-500 border border-amber-905' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {t.priority}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold bg-[#0a0a0b] px-2 py-0.5 rounded">
                        {t.createdByRole === 'student' ? <User className="w-3 h-3 text-purple-400" /> : <GraduationCap className="w-3 h-3 text-indigo-400" />}
                        {t.createdByRole === 'student' ? 'Student' : 'Instructor'}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">{t.subject}</h3>
                    <p className="text-zinc-400 text-xs line-clamp-1">{t.message}</p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <span className="font-semibold text-zinc-400">{t.user?.name || 'Deleted User'}</span>
                      <span>•</span>
                      <span>{new Date(t.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-24 text-center space-y-4">
                  <Ticket className="w-16 h-16 text-zinc-700 mx-auto" />
                  <p className="text-zinc-500 text-sm">No support tickets match filters</p>
                </div>
              )}
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-[#27272a] bg-[#0a0a0b] flex items-center justify-between">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 bg-[#18181b] border border-[#27272a] hover:bg-[#202024] rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-xs text-zinc-500 font-bold">Page {currentPage} of {totalPages}</span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 bg-[#18181b] border border-[#27272a] hover:bg-[#202024] rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Support Ticket Chat / Detail Section */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedTicket ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden flex flex-col h-[650px] shadow-2xl"
              >
                {/* Header */}
                <div className="p-4 border-b border-[#27272a] bg-[#121212]/50 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="p-1.5 hover:bg-[#27272a] rounded-lg text-xs font-bold text-zinc-400 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <div className="flex items-center gap-2">
                    {selectedTicket.status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket._id, 'resolved')}
                        disabled={updatingStatus}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Resolve
                      </button>
                    )}
                    {selectedTicket.status !== 'closed' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket._id, 'closed')}
                        disabled={updatingStatus}
                        className="px-2.5 py-1 bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Close
                      </button>
                    )}
                    <select 
                      value={selectedTicket.status} 
                      onChange={e => handleUpdateStatus(selectedTicket._id, e.target.value)}
                      disabled={updatingStatus}
                      className="bg-[#0a0a0b] border border-[#27272a] rounded px-2.5 py-1 text-[10px] font-bold text-zinc-300 focus:outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Conversation Thread */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Ticket Details */}
                  <div className="bg-[#0a0a0b] p-4 rounded-xl border border-[#27272a] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">{selectedTicket.category}</span>
                      <span className="text-[10px] text-zinc-500">{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{selectedTicket.subject}</h4>
                    <p className="text-zinc-300 text-xs whitespace-pre-wrap">{selectedTicket.message}</p>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-[#1f1f23] mt-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white font-bold">
                        {selectedTicket.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white font-semibold">{selectedTicket.user?.name || 'Deleted User'}</span>
                        <span className="text-[8px] text-zinc-500">{selectedTicket.user?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="block text-[9px] font-bold text-zinc-600 uppercase tracking-widest text-center border-b border-[#27272a] pb-2">Replies Thread</span>
                    {selectedTicket.replies && selectedTicket.replies.map((reply, idx) => {
                      const replyUserRole = reply.user?.role;
                      const isAdminReply = replyUserRole === 'admin';
                      return (
                        <div key={idx} className={`flex ${isAdminReply ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-2xl p-3 shadow text-xs ${
                            isAdminReply 
                              ? 'bg-purple-600 text-white rounded-tr-none' 
                              : 'bg-[#0a0a0b] border border-[#27272a] text-zinc-300 rounded-tl-none'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="font-bold text-[9px] opacity-75">
                                {reply.user?.name || 'User'}
                              </span>
                              <span className={`px-1 py-0.2 text-[8px] font-black rounded uppercase ${
                                isAdminReply ? 'bg-purple-900/50 text-purple-200' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                {replyUserRole}
                              </span>
                            </div>
                            <p className="leading-relaxed">{reply.message}</p>
                            <span className="block text-[8px] opacity-60 text-right mt-1">{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="p-3 border-t border-[#27272a] bg-[#121212]/50 flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder={selectedTicket.status === 'closed' ? "This ticket is closed" : "Type your admin reply..."} 
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    disabled={selectedTicket.status === 'closed' || sendingReply}
                    className="flex-1 px-4 py-2.5 text-xs bg-[#0a0a0b] border border-[#27272a] rounded-xl text-white focus:ring-1 focus:ring-purple-500 focus:outline-none disabled:bg-[#18181b]"
                  />
                  <button 
                    type="submit" 
                    disabled={selectedTicket.status === 'closed' || sendingReply || !replyMessage.trim()}
                    className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors active:scale-95 disabled:opacity-50"
                  >
                    {sendingReply ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
                  </button>
                </form>
              </motion.div>
            ) : (
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 text-center space-y-4 h-[350px] flex flex-col items-center justify-center">
                <LifeBuoy className="w-12 h-12 text-zinc-700" />
                <div>
                  <h4 className="font-bold text-white text-sm">No Ticket Selected</h4>
                  <p className="text-zinc-500 text-xs mt-1">Select a ticket from the list to view the full details, replies, and communicate with the user.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
