import React, { useState, useEffect } from 'react';
import { 
  Search, 
  HelpCircle, 
  Book, 
  PlayCircle, 
  MessageCircle, 
  ChevronRight, 
  Plus, 
  X,
  Loader2,
  Send,
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  LifeBuoy
} from 'lucide-react';
import { submitTicket, getMyTickets } from '../../services/instructorDashboardService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const HelpCenter = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingTickets, setFetchingTickets] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    subject: '',
    category: 'Course Creation',
    message: '',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setFetchingTickets(true);
      const res = await getMyTickets();
      if (res.success) setTickets(res.tickets);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingTickets(false);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await submitTicket(formData);
      if (res.success) {
        toast.success('Ticket submitted successfully');
        setShowTicketModal(false);
        setFormData({ subject: '', category: 'Course Creation', message: '' });
        fetchTickets();
      }
    } catch (error) {
      toast.error('Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      category: 'Payments & Withdrawals',
      items: [
        { q: 'How do I withdraw my earnings?', a: 'Go to the Payouts page and click "Request Withdrawal". Minimum amount is ₹500.' },
        { q: 'When will I receive my payment?', a: 'Withdrawals are typically processed within 2-3 business days after approval.' },
        { q: 'What are the platform fees?', a: 'We charge a flat 10% platform fee on all course sales to cover hosting and transaction costs.' }
      ]
    },
    {
      category: 'Course Management',
      items: [
        { q: 'How do I upload high-quality videos?', a: 'We recommend MP4 format with H.264 codec at 1080p resolution for best results.' },
        { q: 'Can I offer coupons for my courses?', a: 'Yes, go to the course settings and use the Coupon generator to create discount codes.' }
      ]
    }
  ];

  const categories = [
    { name: 'Course Creation', icon: PlayCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Student Support', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Payments', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Account Info', icon: User, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const filteredTickets = tickets.filter(t => t.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="animate-fade-in space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary-600 rounded-[3rem] p-10 lg:p-16 text-center text-white">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl lg:text-5xl font-black">How can we help you?</h2>
          <p className="text-primary-100">Find answers to frequently asked questions or contact our support team.</p>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search help articles..."
              className="w-full pl-14 pr-6 py-5 bg-white text-slate-900 rounded-3xl border-none focus:ring-4 focus:ring-primary-400/30 font-bold"
            />
          </div>
        </div>
        {/* Background Decorations */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <button key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group text-center flex flex-col items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
              <cat.icon className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold text-slate-900">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FAQ Accordion */}
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <HelpCircle className="w-7 h-7 text-primary-600" />
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {faqs.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{group.category}</h4>
                {group.items.map((faq, fIdx) => {
                  const id = `${gIdx}-${fIdx}`;
                  const isOpen = activeFaq === id;
                  return (
                    <div key={id} className={`bg-white rounded-2xl border transition-all ${isOpen ? 'border-primary-200 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
                      <button 
                        onClick={() => setActiveFaq(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-bold text-slate-900 text-sm">{faq.q}</span>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4 mx-5">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Ticket className="w-7 h-7 text-primary-600" />
              Support Tickets
            </h3>
            <button 
              onClick={() => setShowTicketModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-600 font-bold text-xs rounded-xl hover:bg-primary-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Ticket
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            <div className="p-4 border-b border-slate-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs"
                />
              </div>
            </div>
            
            <div className="divide-y divide-slate-50">
              {fetchingTickets ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                </div>
              ) : filteredTickets.length > 0 ? filteredTickets.map((ticket, i) => (
                <div key={i} className="p-6 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                      ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                      ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{ticket.subject}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ticket.message}</p>
                </div>
              )) : (
                <div className="py-20 text-center space-y-4">
                  <Ticket className="w-12 h-12 text-slate-100 mx-auto" />
                  <p className="text-sm text-slate-400">No tickets found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {showTicketModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                      <LifeBuoy className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Contact Support</h3>
                  </div>
                  <button onClick={() => setShowTicketModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleTicketSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                    <input 
                      type="text" 
                      placeholder="Summary of your issue"
                      value={formData.subject}
                      onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500 appearance-none"
                    >
                      <option>Course Creation</option>
                      <option>Payments</option>
                      <option>Withdrawals</option>
                      <option>Technical Issues</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Message</label>
                    <textarea 
                      placeholder="Explain your problem in detail..."
                      value={formData.message}
                      onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500 h-40 resize-none"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary-600 text-white font-black rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Submit Ticket
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CreditCard = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const User = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default HelpCenter;
