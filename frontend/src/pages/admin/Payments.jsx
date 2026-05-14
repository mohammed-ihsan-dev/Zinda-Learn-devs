import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Download, Plus, MoreVertical, CreditCard, Wallet, TrendingUp, Loader2, ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, Clock, Banknote, User } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { getPayments, getPayouts, updatePayoutStatus, getDashboardStats } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('enrollments'); // 'enrollments' or 'payouts'
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });
  const [payoutPagination, setPayoutPagination] = useState({ page: 1, limit: 50, total: 0 });

  useEffect(() => {
    fetchData();
  }, [activeTab, pagination.page, payoutPagination.page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'enrollments') {
        const [paymentsRes, statsRes] = await Promise.all([
          getPayments({ page: pagination.page, limit: pagination.limit }),
          getDashboardStats()
        ]);
        setTransactions(paymentsRes.data || []);
        setPagination(prev => ({ ...prev, total: paymentsRes.total || 0 }));
        setStats(statsRes.data);
      } else {
        const payoutsRes = await getPayouts({ page: payoutPagination.page, limit: payoutPagination.limit });
        setPayouts(payoutsRes.data || []);
        setPayoutPagination(prev => ({ ...prev, total: payoutsRes.total || 0 }));
      }
    } catch (error) {
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, adminComment = '') => {
    try {
      await updatePayoutStatus(id, { status, adminComment });
      toast.success(`Payout ${status} successfully`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Financial Ledger</h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Oversee global transactions, instructor earnings, and platform revenue performance.
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
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Revenue</p>
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

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-[#1c1c21] border border-[#27272a] rounded-xl w-fit mb-8">
        <button
          onClick={() => setActiveTab('enrollments')}
          className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'enrollments' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-zinc-500 hover:text-white'}`}
        >
          Enrollment Revenue
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'payouts' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-zinc-500 hover:text-white'}`}
        >
          Instructor Payouts
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1c1c21] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl transition-colors">
            <Calendar className="w-4 h-4 text-zinc-500" />
            Last 30 Days
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1c1c21] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl transition-colors">
            All Statuses
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1c1c21] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl overflow-x-auto">
        {activeTab === 'enrollments' ? (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#27272a]">
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TRANSACTION ID</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">STUDENT</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">COURSE</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">AMOUNT</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">DATE</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">STATUS</th>
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
                        <span className="text-[10px] text-zinc-500">{tx.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-sm text-zinc-300 line-clamp-1">{tx.course?.title || 'Unknown Course'}</span>
                  </td>
                  <td className="p-5 text-sm font-bold text-white">{formatCurrency(tx.amountPaid)}</td>
                  <td className="p-5 text-sm text-zinc-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${tx.paymentStatus === 'completed' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]'}`}></div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${tx.paymentStatus === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {tx.paymentStatus}
                      </span>
                    </div>
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
        ) : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#27272a]">
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">INSTRUCTOR</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">AMOUNT</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">METHOD</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">DETAILS</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">DATE</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">STATUS</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">Loading payouts...</p>
                  </td>
                </tr>
              ) : payouts.length > 0 ? payouts.map((p) => (
                <tr key={p._id} className="hover:bg-[#25252b] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.instructor?.name || 'User')}&background=random`}
                        alt={p.instructor?.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#27272a]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{p.instructor?.name || 'Unknown Instructor'}</span>
                        <span className="text-[10px] text-zinc-500">{p.instructor?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-sm font-bold text-white">{formatCurrency(p.amount)}</td>
                  <td className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-500/10 px-2 py-1 rounded">
                      {p.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="text-[10px] text-zinc-500 flex flex-col gap-0.5">
                      {p.paymentMethod === 'bank_transfer' ? (
                        <>
                          <span className="font-bold text-zinc-300">{p.paymentDetails?.bankName}</span>
                          <span>A/C: {p.paymentDetails?.accountNumber}</span>
                          <span>IFSC: {p.paymentDetails?.ifscCode}</span>
                        </>
                      ) : (
                        <span className="font-bold text-zinc-300">UPI: {p.paymentDetails?.upiId}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-5 text-sm text-zinc-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        p.status === 'paid' ? 'bg-emerald-500' : 
                        p.status === 'pending' ? 'bg-amber-500' : 
                        p.status === 'approved' ? 'bg-blue-500' : 'bg-rose-500'
                      }`}></div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        p.status === 'paid' ? 'text-emerald-400' : 
                        p.status === 'pending' ? 'text-amber-400' : 
                        p.status === 'approved' ? 'text-blue-400' : 'text-rose-400'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(p._id, 'approved')}
                            className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(p._id, 'rejected')}
                            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {p.status === 'approved' && (
                        <button 
                          onClick={() => handleUpdateStatus(p._id, 'paid')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all text-[10px] font-bold uppercase"
                        >
                          <Banknote className="w-3.5 h-3.5" />
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="p-20 text-center">
                    <Banknote className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">No payout requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        
        {/* Pagination */}
        <div className="p-4 border-t border-[#27272a] bg-[#121212]/30 flex justify-between items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {activeTab === 'enrollments' ? (
              `Showing ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total.toLocaleString()} transactions`
            ) : (
              `Showing ${(payoutPagination.page - 1) * payoutPagination.limit + 1}-${Math.min(payoutPagination.page * payoutPagination.limit, payoutPagination.total)} of ${payoutPagination.total.toLocaleString()} requests`
            )}
          </span>
          <div className="flex gap-1">
            <button
              disabled={activeTab === 'enrollments' ? pagination.page === 1 : payoutPagination.page === 1}
              onClick={() => activeTab === 'enrollments' 
                ? setPagination(prev => ({ ...prev, page: prev.page - 1 }))
                : setPayoutPagination(prev => ({ ...prev, page: prev.page - 1 }))
              }
              className="w-6 h-6 flex items-center justify-center rounded bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:text-white transition-colors text-xs font-bold disabled:opacity-30"
            >‹</button>
            <button className="w-6 h-6 flex items-center justify-center rounded bg-purple-600 text-white font-bold text-xs shadow-[0_0_10px_rgba(147,51,234,0.3)]">
              {activeTab === 'enrollments' ? pagination.page : payoutPagination.page}
            </button>
            <button
              disabled={activeTab === 'enrollments' 
                ? pagination.page * pagination.limit >= pagination.total
                : payoutPagination.page * payoutPagination.limit >= payoutPagination.total
              }
              onClick={() => activeTab === 'enrollments'
                ? setPagination(prev => ({ ...prev, page: prev.page + 1 }))
                : setPayoutPagination(prev => ({ ...prev, page: prev.page + 1 }))
              }
              className="w-6 h-6 flex items-center justify-center rounded bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:bg-[#27272a] hover:text-white transition-colors text-xs font-bold disabled:opacity-30"
            >›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
