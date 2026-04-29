import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Download, Plus, MoreVertical, CreditCard, Wallet, TrendingUp, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { getPayments, getDashboardStats } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });

  useEffect(() => {
    fetchData();
  }, [pagination.page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, statsRes] = await Promise.all([
        getPayments({ page: pagination.page, limit: pagination.limit }),
        getDashboardStats()
      ]);
      setTransactions(paymentsRes.data || []);
      setPagination(prev => ({ ...prev, total: paymentsRes.total || 0 }));
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Financial Ledger</h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Oversee global transactions and platform revenue performance.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6 group hover:border-[#3f3f46] transition-colors relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] flex items-center justify-center text-purple-400">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 12.4%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Net Platform Revenue</p>
            <h3 className="text-3xl font-bold text-white">{formatCurrency(stats?.totalRevenue || 0)}</h3>
          </div>
        </div>

        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6 group hover:border-[#3f3f46] transition-colors relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] flex items-center justify-center text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 8.2%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Platform Margin (15%)</p>
            <h3 className="text-3xl font-bold text-white">{formatCurrency((stats?.totalRevenue || 0) * 0.15)}</h3>
          </div>
        </div>

        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6 group hover:border-[#3f3f46] transition-colors relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] flex items-center justify-center text-rose-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 18.5%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Enrollments</p>
            <h3 className="text-3xl font-bold text-white">{pagination.total.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1c1c21] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl transition-colors">
            <Calendar className="w-4 h-4 text-zinc-500" />
            Oct 1, 2023 - Oct 31, 2023
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1c1c21] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl transition-colors">
            All Statuses
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1c1c21] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl transition-colors">
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
            New Payout
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[#27272a]">
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TRANSACTION ID</th>
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">USER</th>
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">AMOUNT</th>
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">DATE</th>
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">STATUS</th>
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">METHOD</th>
              <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]/50">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                  <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">Loading transactions...</p>
                </td>
              </tr>
            ) : transactions.length > 0 ? transactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-[#25252b] transition-colors group">
                <td className="p-5 text-sm font-mono text-zinc-400">#{tx.razorpayOrderId?.split('_')[1] || tx._id.slice(-8).toUpperCase()}</td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <img 
                      src={tx.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tx.user?.name || 'User')}&background=random`} 
                      alt={tx.user?.name} 
                      className="w-8 h-8 rounded-full object-cover border border-[#27272a]" 
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{tx.user?.name || 'Unknown User'}</span>
                      <span className="text-[10px] text-zinc-500">{tx.course?.title || 'Unknown Course'}</span>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-sm font-bold text-white">{formatCurrency(tx.amountPaid)}</td>
                <td className="p-5 text-sm text-zinc-400">{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${tx.paymentStatus === 'completed' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]'}`}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${tx.paymentStatus === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {tx.paymentStatus}
                    </span>
                  </div>
                </td>
                <td className="p-5">
                  <span className="flex items-center gap-2 text-sm text-zinc-300">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center text-[8px] font-bold text-white italic">R</div>
                    Razorpay
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button className="text-zinc-500 hover:text-white transition-colors p-2">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="p-20 text-center">
                  <CreditCard className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">No transactions found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="p-4 border-t border-[#27272a] bg-[#121212]/30 flex justify-between items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total.toLocaleString()} transactions
          </span>
          <div className="flex gap-1">
            <button 
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              className="w-6 h-6 flex items-center justify-center rounded bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:text-white transition-colors text-xs font-bold disabled:opacity-30"
            >‹</button>
            <button className="w-6 h-6 flex items-center justify-center rounded bg-purple-600 text-white font-bold text-xs shadow-[0_0_10px_rgba(147,51,234,0.3)]">{pagination.page}</button>
            <button 
              disabled={pagination.page * pagination.limit >= pagination.total}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              className="w-6 h-6 flex items-center justify-center rounded bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:bg-[#27272a] hover:text-white transition-colors text-xs font-bold disabled:opacity-30"
            >›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
