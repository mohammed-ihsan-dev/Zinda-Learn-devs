import { useState, useEffect } from 'react';
import { getInstructorCourses } from '../../services/instructorService';
import { BookOpen, Users, DollarSign, Activity, TrendingUp, PlusCircle, Eye, UserPlus, ShoppingCart, Star, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const InstructorDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: '12',
    totalStudents: '12,482',
    totalRevenue: '$42,10.0',
    monthlyEarnings: '$12,140.2'
  });
  const [loading, setLoading] = useState(false); // Kept false to show design

  /*
  // Original fetch logic commented out to show exact design mockups
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getInstructorCourses();
      const courses = data.courses || [];
      const totalStudents = courses.reduce((acc, c) => acc + (c.totalStudents || 0), 0);
      const totalEarnings = courses.reduce((acc, c) => acc + ((c.totalStudents || 0) * (c.price || 0)), 0);
      setStats({
        totalCourses: courses.length,
        totalStudents,
        totalRevenue: `$${totalEarnings}`
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };
  */

  const statCards = [
    { label: 'TOTAL COURSES', value: stats.totalCourses, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100', pill: '+2 new', pillColor: 'text-green-700 bg-green-100' },
    { label: 'TOTAL STUDENTS', value: stats.totalStudents, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100', pill: '+4.2%', pillColor: 'text-green-700 bg-green-100' },
    { label: 'TOTAL REVENUE', value: stats.totalRevenue, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100', pill: '+18.5%', pillColor: 'text-green-700 bg-green-100' },
    { label: 'MONTHLY EARNINGS', value: stats.monthlyEarnings, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100', pill: '+12%', pillColor: 'text-green-700 bg-green-100' },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Mohammed</h2>
        <p className="text-slate-500 text-sm">Here's what's happening with your courses today</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center ${stat.pillColor}`}>
                    {stat.pill}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Revenue Overview */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Revenue Overview</h3>
                    <p className="text-xs text-slate-500">Track your earnings performance</p>
                  </div>
                  <div className="flex bg-slate-50 rounded-full p-1 border border-slate-100">
                    <button className="px-4 py-1.5 text-xs font-bold bg-white text-purple-700 rounded-full shadow-sm">Weekly</button>
                    <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Monthly</button>
                    <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Yearly</button>
                  </div>
                </div>
                
                <div className="h-64 flex items-end justify-between px-4 pb-6 pt-4 relative">
                  {/* Chart Bars Mockup */}
                  <div className="w-12 h-[30%] bg-indigo-50 rounded-t-xl"></div>
                  <div className="w-12 h-[50%] bg-indigo-100 rounded-t-xl"></div>
                  <div className="w-12 h-[100%] bg-purple-600 rounded-t-xl shadow-lg shadow-purple-200"></div>
                  <div className="w-12 h-[60%] bg-indigo-100 rounded-t-xl"></div>
                  <div className="w-12 h-[75%] bg-indigo-50 rounded-t-xl"></div>
                  <div className="w-12 h-[45%] bg-indigo-50 rounded-t-xl"></div>
                  <div className="w-12 h-[35%] bg-indigo-50 rounded-t-xl"></div>

                  {/* X Axis */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-bold text-slate-400 px-6">
                    <span>MON</span>
                    <span>TUE</span>
                    <span>WED</span>
                    <span>THU</span>
                    <span>FRI</span>
                    <span>SAT</span>
                    <span>SUN</span>
                  </div>
                </div>
              </div>

              {/* Recent Courses */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Recent Courses</h3>
                  <button className="text-sm font-bold text-purple-600 hover:text-purple-700">View all &gt;</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'UI/UX Mastery...', students: '2,401', img: 'bg-zinc-900' },
                    { title: 'Advanced Pytho...', students: '1,892', img: 'bg-gradient-to-tr from-orange-400 to-green-400' },
                    { title: 'Basic Javascript...', students: '2,401', img: 'bg-zinc-900' },
                    { title: 'Advanced Pytho...', students: '1,892', img: 'bg-gradient-to-tr from-orange-400 to-green-400' }
                  ].map((course, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center group cursor-pointer hover:shadow-md transition-shadow">
                      <div className={`w-20 h-20 rounded-xl shrink-0 ${course.img}`}></div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">PUBLISHED</span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{course.title}</h4>
                        <p className="text-xs text-slate-500 mb-2">{course.students} Students</p>
                        <span className="text-xs font-bold text-purple-600 group-hover:text-purple-800 transition-colors">Manage Course &rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-4">QUICK ACTIONS</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-bold text-sm shadow-md shadow-purple-200">
                    <span className="flex items-center gap-2"><PlusCircle className="w-5 h-5" /> Create Course</span>
                    <span className="text-lg leading-none">&rsaquo;</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors font-bold text-sm">
                    <span className="flex items-center gap-2"><Eye className="w-5 h-5" /> View Courses</span>
                    <span className="text-lg leading-none">&rsaquo;</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:-ml-px before:w-0.5 before:bg-slate-100 z-0">
                  
                  <div className="relative z-10 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border-4 border-white flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 font-medium leading-snug">Sarah Jenkins enrolled in <span className="text-purple-600 font-bold">UI/UX Mastery</span></p>
                      <p className="text-xs text-slate-400 mt-1">2 minutes ago</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-green-50 border-4 border-white flex items-center justify-center text-green-500 shrink-0 shadow-sm">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 font-medium leading-snug">New purchase: <span className="text-purple-600 font-bold">Advanced Python</span></p>
                      <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border-4 border-white flex items-center justify-center text-orange-500 shrink-0 shadow-sm">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 font-medium leading-snug">Michael R. left a 5-star review</p>
                      <div className="mt-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-600 italic">
                        "Brilliant structure, very clear!"
                      </div>
                      <p className="text-xs text-slate-400 mt-2">3 hours ago</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 font-medium leading-snug">New message from Elena Brooks</p>
                      <p className="text-xs text-slate-400 mt-1">Yesterday</p>
                    </div>
                  </div>

                </div>

                <div className="mt-6 text-center">
                  <button className="text-sm font-bold text-purple-600 hover:text-purple-700">See all activity</button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InstructorDashboard;
