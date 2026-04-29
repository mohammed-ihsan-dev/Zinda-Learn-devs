import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BookOpen, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Filter, 
  Calendar,
  Loader2,
  PieChart,
  Activity,
  Award
} from 'lucide-react';
import { getDashboardStats } from '../../services/adminService';
import { formatCurrency } from '../../utils/currencyFormatter';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Reports</h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Detailed performance analysis and growth metrics for the Zinda Learn ecosystem.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1c1c21] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl transition-colors">
            <Calendar className="w-4 h-4 text-zinc-500" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-95">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Active Learners', value: formatNumber(stats?.totalUsers || 0), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Average Rating', value: '4.8', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6 group hover:border-[#3f3f46] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" /> +12%
              </div>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Category (Horizontal Bars) */}
        <div className="lg:col-span-2 bg-[#1c1c21] border border-[#27272a] rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-400" />
                Revenue by Category
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Global sales distribution across disciplines</p>
            </div>
            <button className="p-2 hover:bg-[#27272a] rounded-lg transition-colors">
              <Filter className="w-4 h-4 text-zinc-500" />
            </button>
          </div>

          <div className="space-y-8">
            {stats?.revenueBreakdown?.length > 0 ? stats.revenueBreakdown.map((item, idx) => {
              const max = stats.revenueBreakdown[0].amount || 1;
              const percentage = (item.amount / max) * 100;
              const colors = ['bg-purple-500', 'bg-blue-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500'];
              
              return (
                <div key={idx} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-zinc-300 capitalize">{item.category}</span>
                    <span className="text-sm font-bold text-white">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="h-2 w-full bg-[#121212] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-1000`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-10 text-center text-zinc-500 italic">No revenue breakdown data available</div>
            )}
          </div>
        </div>

        {/* Growth Insights */}
        <div className="space-y-6">
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-colors"></div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              User Retention
            </h3>
            
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="#121212" strokeWidth="12" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="58" 
                    fill="transparent" 
                    stroke="#3b82f6" 
                    strokeWidth="12" 
                    strokeDasharray="364.4" 
                    strokeDashoffset="72.8" 
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">80%</span>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Monthly</span>
                </div>
              </div>
              <p className="text-center text-xs text-zinc-400 leading-relaxed px-4">
                Your platform retention rate is <span className="text-emerald-400 font-bold">5% higher</span> than the industry average.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1c1c21] to-[#121212] border border-[#27272a] rounded-2xl p-8">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest text-zinc-500">Quick Insights</h3>
            <div className="space-y-6">
              {[
                { label: 'Most Popular', value: 'Web Development', color: 'text-purple-400' },
                { label: 'Top Instructor', value: 'Elena Rodriguez', color: 'text-blue-400' },
                { label: 'Platform NPS', value: '4.9/5.0', color: 'text-amber-400' },
              ].map((insight, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-[#27272a] last:border-0 last:pb-0">
                  <span className="text-xs font-bold text-zinc-500">{insight.label}</span>
                  <span className={`text-xs font-bold ${insight.color}`}>{insight.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
