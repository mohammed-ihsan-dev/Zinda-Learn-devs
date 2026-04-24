import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/adminService';
import { Users, GraduationCap, BookOpen, DollarSign, ArrowUp, Rocket, BookPlus, ShieldCheck, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: '1.2M',
    totalCourses: '128.5K',
    pendingApprovals: '15.4K', // mapped to Tutors for design
    revenue: '$2.4M'
  });
  const [loading, setLoading] = useState(false); // Design shows loaded state

  // Keeping original fetch logic commented/mocked to match design numbers exactly
  /*
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
          pendingApprovals: data.totalApprovedInstructors || 0,
          revenue: 12000
        });
      }
    } catch (error) {
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };
  */

  const statCards = [
    { label: 'TOTAL USERS', value: stats.totalUsers, icon: Users, change: '+12.5%' },
    { label: 'TUTORS', value: stats.pendingApprovals, icon: GraduationCap, change: '+4.2%' },
    { label: 'COURSES', value: stats.totalCourses, icon: BookOpen, change: '+18.1%' },
    { label: 'REVENUE', value: stats.revenue, icon: DollarSign, change: '+24.0%' },
  ];

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
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
                <div className="flex bg-[#121212] rounded-lg p-1 border border-[#27272a]">
                  <button className="px-3 py-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors">12M</button>
                  <button className="px-3 py-1 text-xs font-medium bg-[#27272a] text-white rounded-md">6M</button>
                  <button className="px-3 py-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors">30D</button>
                </div>
              </div>
              <div className="flex-1 min-h-[250px] relative flex items-end justify-between px-2 pb-6">
                {/* SVG Curve Mockup */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 150 Q 50 140 100 120 T 200 80 T 300 140 T 400 40 T 500 100 L 500 200 L 0 200 Z" fill="url(#gradient)" />
                  <path d="M 0 150 Q 50 140 100 120 T 200 80 T 300 140 T 400 40 T 500 100" fill="none" stroke="#d8b4fe" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Peak Marker */}
                  <circle cx="400" cy="40" r="6" fill="#121212" stroke="#d8b4fe" strokeWidth="3" />
                </svg>
                {/* Label Peak */}
                <div className="absolute top-[10%] right-[16%] bg-[#d8b4fe] text-purple-950 text-[10px] font-bold px-2 py-1 rounded-md">
                  Peak: 1.2M
                </div>
                
                {/* X Axis Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-bold text-zinc-500 px-6">
                  <span>JAN</span>
                  <span>MAR</span>
                  <span>MAY</span>
                  <span>JUL</span>
                  <span>SEP</span>
                  <span>NOV</span>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-[#1c1c21] rounded-2xl border border-[#27272a] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Revenue Breakdown</h3>
                <p className="text-xs text-zinc-400 mb-6">Earnings by course category</p>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-zinc-300">Design & UI</span>
                      <span className="text-white">$940K</span>
                    </div>
                    <div className="h-2 w-full bg-[#27272a] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-zinc-300">Programming</span>
                      <span className="text-white">$720K</span>
                    </div>
                    <div className="h-2 w-full bg-[#27272a] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-zinc-300">Business</span>
                      <span className="text-white">$410K</span>
                    </div>
                    <div className="h-2 w-full bg-[#27272a] rounded-full overflow-hidden">
                      <div className="h-full bg-pink-400 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-zinc-300">Marketing</span>
                      <span className="text-white">$330K</span>
                    </div>
                    <div className="h-2 w-full bg-[#27272a] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-700 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
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
                <div className="flex gap-4 items-start relative before:content-[''] before:absolute before:left-5 before:top-10 before:w-[1px] before:h-8 before:bg-[#27272a]">
                  <div className="w-10 h-10 rounded-xl bg-[#25252b] flex items-center justify-center text-purple-400 shrink-0 z-10 border border-[#27272a]">
                    <BookPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">New Course Published: <span className="text-purple-400 font-normal">UI Mastery</span></p>
                    <p className="text-xs text-zinc-500 mt-0.5">Instructor: Jordan Smith • Category: Design</p>
                    <p className="text-[10px] font-bold text-zinc-600 mt-2 tracking-wider">12 MINUTES AGO</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start relative before:content-[''] before:absolute before:left-5 before:top-10 before:w-[1px] before:h-8 before:bg-[#27272a]">
                  <div className="w-10 h-10 rounded-xl bg-[#25252b] flex items-center justify-center text-indigo-400 shrink-0 z-10 border border-[#27272a]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">New Tutor Verified: <span className="text-indigo-400 font-normal">Elena Vance</span></p>
                    <p className="text-xs text-zinc-500 mt-0.5">Background: Senior Product Designer at Vertex</p>
                    <p className="text-[10px] font-bold text-zinc-600 mt-2 tracking-wider">2 HOURS AGO</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start relative">
                  <div className="w-10 h-10 rounded-xl bg-[#25252b] flex items-center justify-center text-pink-400 shrink-0 z-10 border border-[#27272a]">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">System Maintenance Scheduled</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Estimated downtime: 45 minutes on Sunday 2:00 AM UTC</p>
                    <p className="text-[10px] font-bold text-zinc-600 mt-2 tracking-wider">5 HOURS AGO</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Editor's Insight */}
              <div className="bg-gradient-to-br from-[#d8b4fe] to-[#c084fc] rounded-2xl p-6 flex flex-col justify-between h-[200px]">
                <div>
                  <p className="text-[10px] font-bold text-purple-900 tracking-widest uppercase mb-3">Editor's Insight</p>
                  <h3 className="text-xl font-bold text-black leading-tight">
                    Retention rates have increased by 15% following the UI update.
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
