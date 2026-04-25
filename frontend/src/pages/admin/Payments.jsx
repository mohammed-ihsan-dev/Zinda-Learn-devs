import { useState } from 'react';
import { Calendar, ChevronDown, Download, Plus, MoreVertical, CreditCard, Wallet, TrendingUp } from 'lucide-react';

const Payments = () => {
  const transactions = [
    { id: 'ATX-943950', user: 'Sarah Jenkins', amount: '$129.00', date: 'Oct 24, 2023', status: 'COMPLETED', method: 'Visa', avatar: 'https://i.pravatar.cc/150?u=11' },
    { id: 'ATX-943951', user: 'Marcus Chen', amount: '$49.50', date: 'Oct 24, 2023', status: 'FAILED', method: 'PayPal', avatar: 'https://i.pravatar.cc/150?u=12' },
    { id: 'ATX-943952', user: 'David Miller', amount: '$899.00', date: 'Oct 25, 2023', status: 'COMPLETED', method: 'Visa', avatar: 'https://i.pravatar.cc/150?u=13' },
    { id: 'ATX-943953', user: 'Elena Rodriguez', amount: '$215.00', date: 'Oct 25, 2023', status: 'COMPLETED', method: 'Visa', avatar: 'https://i.pravatar.cc/150?u=14' },
    { id: 'ATX-943954', user: 'Jordan Smith', amount: '$12.99', date: 'Oct 22, 2023', status: 'COMPLETED', method: 'PayPal', avatar: 'https://i.pravatar.cc/150?u=15' },
  ];

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
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              +12.4%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Net Platform Revenue</p>
            <h3 className="text-3xl font-bold text-white">$428,942.50</h3>
          </div>
        </div>

        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6 group hover:border-[#3f3f46] transition-colors relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] flex items-center justify-center text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              +8.2%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Instructor Payouts</p>
            <h3 className="text-3xl font-bold text-white">$294,200.00</h3>
          </div>
        </div>

        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6 group hover:border-[#3f3f46] transition-colors relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] flex items-center justify-center text-rose-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              +18.5%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Transaction Volume</p>
            <h3 className="text-3xl font-bold text-white">12,842</h3>
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
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#25252b] transition-colors group">
                <td className="p-5 text-sm font-mono text-zinc-400">{tx.id}</td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <img src={tx.avatar} alt={tx.user} className="w-8 h-8 rounded-full object-cover border border-[#27272a]" />
                    <span className="text-sm font-bold text-white">{tx.user}</span>
                  </div>
                </td>
                <td className="p-5 text-sm font-bold text-white">{tx.amount}</td>
                <td className="p-5 text-sm text-zinc-400">{tx.date}</td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'COMPLETED' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${tx.status === 'COMPLETED' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.status}
                    </span>
                  </div>
                </td>
                <td className="p-5">
                  <span className="flex items-center gap-2 text-sm text-zinc-300">
                    <CreditCard className="w-4 h-4 text-zinc-500" />
                    {tx.method}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button className="text-zinc-500 hover:text-white transition-colors p-2">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-[#27272a] bg-[#121212]/30 flex justify-between items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Showing 1-5 of 1,284 transactions</span>
          <div className="flex gap-1">
            <button className="w-6 h-6 flex items-center justify-center rounded bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:text-white transition-colors text-xs font-bold">‹</button>
            <button className="w-6 h-6 flex items-center justify-center rounded bg-purple-600 text-white font-bold text-xs shadow-[0_0_10px_rgba(147,51,234,0.3)]">1</button>
            <button className="w-6 h-6 flex items-center justify-center rounded bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:bg-[#27272a] hover:text-white transition-colors text-xs font-bold">2</button>
            <button className="w-6 h-6 flex items-center justify-center rounded bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:text-white transition-colors text-xs font-bold">›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
