import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Download, Plus, MoreVertical, CreditCard, Wallet, TrendingUp, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { getPayments, getDashboardStats } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/common/Pagination';

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
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
      const [paymentsRes, statsRes] = await Promise.all([
        getPayments({ page: currentPage, limit: 10 }),
        getDashboardStats()
      ]);
      setTransactions(paymentsRes.data || []);
      if (paymentsRes.pagination) {
        setPagination(paymentsRes.pagination);
      }
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
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
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Financial Ledger</h1>
          <p className="text-zinc-500 font-medium max-w-2xl">
            Oversee global transactions and platform revenue performance.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatSummaryCard 
          title="Net Revenue" 
          value={formatCurrency(stats?.totalRevenue || 0)} 
          icon={Wallet} 
          trend="12.4%" 
          color="purple" 
        />
        <StatSummaryCard 
          title="Platform Margin (15%)" 
          value={formatCurrency((stats?.totalRevenue || 0) * 0.15)} 
          icon={CreditCard} 
          trend="8.2%" 
          color="blue" 
        />
        <StatSummaryCard 
          title="Total Enrollments" 
          value={pagination.totalItems.toLocaleString()} 
          icon={TrendingUp} 
          trend="18.5%" 
          color="rose" 
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-[#1c1c21] p-3 rounded-[32px] border border-[#27272a] shadow-xl shadow-black/20">
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto hide-scrollbar">
          <button className="flex items-center gap-3 px-6 py-3 bg-[#121212] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all whitespace-nowrap">
            <Calendar className="w-4 h-4 text-purple-500" />
            Lifetime Range
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-[#121212] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all whitespace-nowrap">
            All Statuses
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-[#121212] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-900/20 transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            New Payout
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1c1c21] border border-[#27272a] rounded-[40px] overflow-hidden shadow-2xl shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#121212]/50">
                <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Transaction ID</th>
                <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Recipient Details</th>
                <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Amount</th>
                <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Date</th>
                <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Status</th>
                <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]/50">
              {loading && transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Auditing Ledger...</p>
                  </td>
                </tr>
              ) : transactions.length > 0 ? transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-8">
                     <span className="px-3 py-1.5 bg-[#121212] border border-[#27272a] rounded-xl text-[10px] font-black text-zinc-500 font-mono tracking-wider group-hover:text-purple-400 group-hover:border-purple-500/30 transition-all">
                        #{tx.razorpayOrderId?.split('_')[1] || tx._id.slice(-8).toUpperCase()}
                     </span>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <img 
                        src={tx.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tx.user?.name || 'User')}&background=random`} 
                        alt={tx.user?.name} 
                        className="w-10 h-10 rounded-2xl object-cover border border-[#27272a] shadow-lg shadow-black/20" 
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white mb-1 leading-none">{tx.user?.name || 'Unknown User'}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide line-clamp-1 max-w-[200px]">{tx.course?.title || 'Course Purchase'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                     <span className="text-base font-black text-emerald-400 tracking-tight">{formatCurrency(tx.amountPaid)}</span>
                  </td>
                  <td className="p-8 text-center">
                     <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-zinc-300">{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                  </td>
                  <td className="p-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#121212] border border-[#27272a] rounded-xl">
                      <div className={`w-1.5 h-1.5 rounded-full ${tx.paymentStatus === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${tx.paymentStatus === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {tx.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <button className="text-zinc-500 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-2xl">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <CreditCard className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">No financial history found</p>
                  </td>
                </tr>
              )}
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
      
      {/* Footer Info */}
      {!loading && transactions.length > 0 && (
        <div className="flex items-center justify-center">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-[#1c1c21] px-6 py-3 rounded-2xl border border-[#27272a]">
              Displaying {transactions.length} of {pagination.totalItems} platform transactions
           </p>
        </div>
      )}
    </div>
  );
};

const StatSummaryCard = ({ title, value, icon: Icon, trend, color }) => {
  const colors = {
    purple: 'text-purple-400 bg-purple-500/10 shadow-purple-500/20',
    blue: 'text-blue-400 bg-blue-500/10 shadow-blue-500/20',
    rose: 'text-rose-400 bg-rose-500/10 shadow-rose-500/20'
  };

  return (
    <div className="bg-[#1c1c21] border border-[#27272a] rounded-[40px] p-8 group hover:border-purple-500/30 transition-all relative overflow-hidden shadow-2xl shadow-black/40">
      <div className={`absolute -right-8 -top-8 w-40 h-40 ${colors[color].split(' ')[1]} rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700`}></div>
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`w-14 h-14 rounded-3xl ${colors[color].split(' ').slice(0,2).join(' ')} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-7 h-7" />
        </div>
        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5 uppercase tracking-widest">
          <ArrowUpRight className="w-3 h-3" /> {trend}
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">{title}</p>
        <h3 className="text-4xl font-black text-white tracking-tighter">{value}</h3>
      </div>
    </div>
  );
};

export default Payments;
