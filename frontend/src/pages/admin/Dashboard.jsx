import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/adminService';
import { Users, GraduationCap, BookOpen, DollarSign, ArrowUp, Rocket, BookPlus, ShieldCheck, Settings, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    pendingApprovals: 0,
    revenue: 0,
    userGrowth: [],
    revenueBreakdown: [],
    recentActivity: [],
    latestInsight: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getDashboardStats();
      if (data) {
        setStats({
          totalUsers: data.totalUsers || 0,
          totalCourses: data.totalCourses || 0,
          pendingApprovals: data.pendingTutors || 0,
          revenue: data.totalRevenue || 0,
          userGrowth: data.userGrowth || [],
          revenueBreakdown: data.revenueBreakdown || [],
          recentActivity: data.recentActivity || [],
          latestInsight: data.latestInsight || null
        });
      }
    } catch (error) {
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const statCards = [
    { label: 'TOTAL USERS', value: formatNumber(stats.totalUsers), icon: Users, change: 'Live' },
    { label: 'PENDING TUTORS', value: formatNumber(stats.pendingApprovals), icon: GraduationCap, change: 'Live' },
    { label: 'COURSES', value: formatNumber(stats.totalCourses), icon: BookOpen, change: 'Live' },
    { label: 'REVENUE', value: `₹${formatNumber(stats.revenue)}`, icon: DollarSign, change: 'Live' },
  ];

  const colors = ['bg-purple-400', 'bg-purple-500', 'bg-pink-400', 'bg-purple-700', 'bg-indigo-500'];

  const generateChartPath = () => {
    if (!stats.userGrowth || stats.userGrowth.length === 0) {
      return {
        path: "M 0 150 Q 50 140 100 120 T 200 80 T 300 140 T 400 40 T 500 100",
        fill: "M 0 150 Q 50 140 100 120 T 200 80 T 300 140 T 400 40 T 500 100 L 500 200 L 0 200 Z",
        peakValue: "1.2M",
        peakX: 400,
        peakY: 40
      };
    }

    const data = stats.userGrowth;
    const maxUsers = Math.max(...data.map(d => d.users), 5); // Minimum 5 to avoid flat line at bottom if all counts are 0
    const w = 500;
    const h = 200;
    const paddingY = 40; // padding top and bottom

    let maxPoint = { x: 0, y: 0, val: -1 };

    const points = data.map((d, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * w : w / 2;
      const y = h - paddingY - ((d.users / maxUsers) * (h - paddingY * 2));
      
      if (d.users >= maxPoint.val) {
        maxPoint = { x, y, val: d.users };
      }
      return { x, y };
    });

    // Generate smooth cubic bezier curve
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const controlX = (curr.x + next.x) / 2;
      path += ` C ${controlX} ${curr.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    const fill = `${path} L ${w} ${h} L 0 ${h} Z`;

    return {
      path,
      fill,
      peakValue: maxPoint.val.toLocaleString(),
      peakX: maxPoint.x,
      peakY: maxPoint.y
    };
  };

  const chartData = generateChartPath();

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Platform Overview</h2>
        <p className="text-zinc-400 text-sm max-w-2xl">
          Manage your digital ecosystem with precision. Real-time data curation for the next generation of learners.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-[#1c1c21] p-6 rounded-2xl border border-[#27272a] flex flex-col justify-between h-36">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#25252b] flex items-center justify-center text-purple-400">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="px-2 py-1 rounded-md bg-[#2d1b36] text-[#c084fc] text-xs font-bold flex items-center">
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Growth Trends */}
            <div className="lg:col-span-2 bg-[#1c1c21] rounded-2xl border border-[#27272a] p-6 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-lg font-bold text-white">User Growth Trends</h3>
                  <p className="text-xs text-zinc-400">Active monthly users across all regions</p>
                </div>
              </div>
              <div className="flex-1 min-h-[250px] relative flex items-end justify-between px-2 pb-6">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={chartData.fill} fill="url(#gradient)" />
                  <path d={chartData.path} fill="none" stroke="#d8b4fe" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {stats.userGrowth.length > 0 && (
                    <circle cx={chartData.peakX} cy={chartData.peakY} r="6" fill="#121212" stroke="#d8b4fe" strokeWidth="3" />
                  )}
                </svg>
                
                <div 
                  className="absolute bg-[#d8b4fe] text-purple-950 text-[10px] font-bold px-2 py-1 rounded-md transform -translate-x-1/2 -translate-y-[150%]"
                  style={{ left: `${(chartData.peakX / 500) * 100}%`, top: `${(chartData.peakY / 200) * 100}%` }}
                >
                  Peak: {chartData.peakValue}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-bold text-zinc-500 px-6">
                  {stats.userGrowth.length > 0 ? (
                    stats.userGrowth.map((g, i) => (
                      <span key={i}>{g.month.toUpperCase()}</span>
                    ))
                  ) : (
                    <>
                      <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-[#1c1c21] rounded-2xl border border-[#27272a] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Revenue Breakdown</h3>
                <p className="text-xs text-zinc-400 mb-6">Earnings by course category</p>
                
                <div className="space-y-5">
                  {stats.revenueBreakdown.length > 0 ? (
                    stats.revenueBreakdown.slice(0, 4).map((item, idx) => {
                      const maxAmount = stats.revenueBreakdown[0].amount || 1;
                      const percentage = Math.max((item.amount / maxAmount) * 100, 5);
                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-zinc-300">{item.category}</span>
                            <span className="text-white">₹{formatNumber(item.amount)}</span>
                          </div>
                          <div className="h-2 w-full bg-[#27272a] rounded-full overflow-hidden">
                            <div className={`h-full ${colors[idx % colors.length]} rounded-full`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-zinc-500 text-center mt-10">No revenue data available.</p>
                  )}
                </div>
              </div>
              <button className="w-full mt-8 py-3 bg-[#27272a] hover:bg-[#323238] text-white text-xs font-bold rounded-xl transition-colors">
                Download Full Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Platform Activity */}
            <div className="lg:col-span-2 bg-[#1c1c21] rounded-2xl border border-[#27272a] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Recent Platform Activity</h3>
                <button className="text-xs font-bold text-purple-400 hover:text-purple-300">View All</button>
              </div>
              <div className="space-y-6">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, idx) => {
                    const isLast = idx === stats.recentActivity.length - 1;
                    return (
                      <div key={activity.id} className={`flex gap-4 items-start relative ${!isLast ? "before:content-[''] before:absolute before:left-5 before:top-10 before:w-[1px] before:h-8 before:bg-[#27272a]" : ""}`}>
                        <div className={`w-10 h-10 rounded-xl bg-[#25252b] flex items-center justify-center shrink-0 z-10 border border-[#27272a] ${activity.type === 'course' ? 'text-purple-400' : 'text-indigo-400'}`}>
                          {activity.type === 'course' ? <BookPlus className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{activity.title}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{activity.subtitle} • Status: {activity.status}</p>
                          <p className="text-[10px] font-bold text-zinc-600 mt-2 tracking-wider">{new Date(activity.date).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-zinc-500">No recent activity found.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Editor's Insight */}
              <div className="bg-gradient-to-br from-[#d8b4fe] to-[#c084fc] rounded-2xl p-6 flex flex-col justify-between h-[200px]">
                <div>
                  <p className="text-[10px] font-bold text-purple-900 tracking-widest uppercase mb-3">
                    {stats.latestInsight?.title || "Editor's Insight"}
                  </p>
                  <h3 className="text-xl font-bold text-black leading-tight line-clamp-3">
                    {stats.latestInsight?.description || "Retention rates have increased by 15% following the UI update."}
                  </h3>
                </div>
                <div>
                  <button className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors">
                    Read Analysis
                  </button>
                </div>
              </div>

              {/* Scale to Enterprise */}
              <div className="bg-[#1c1c21] rounded-2xl border border-[#27272a] p-6 flex flex-col items-center justify-center h-[200px] text-center relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-[#2d1b36] border border-[#3b2147] flex items-center justify-center text-purple-400 mb-4">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Scale to Enterprise</h3>
                <p className="text-xs text-zinc-400 px-4">
                  Your platform has reached the top 5% of learning ecosystems.
                </p>
                <div className="flex gap-1 mt-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                </div>
                
                <button className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg shadow-purple-900/50 flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="text-white text-2xl font-light leading-none mb-1">+</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
