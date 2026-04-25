import { useState, useEffect } from 'react';
import { getInstructorCourses } from '../../services/instructorService';
import { Users, Search, Filter, MoreVertical, BookOpen } from 'lucide-react';

const Students = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const data = await getInstructorCourses();
        setCourses(data.courses || []);
      } catch (_) {}
      finally { setLoading(false); }
    })();
  }, []);

  const totalStudents = courses.reduce((a, c) => a + (c.totalStudents || 0), 0);

  const mockStudents = [
    { name: 'Sarah Jenkins', email: 'sarah@example.com', course: 'Mastering React & Next.js', progress: 78, joined: 'Oct 24, 2024', avatar: 'https://i.pravatar.cc/150?u=21' },
    { name: 'Marcus Chen', email: 'marcus@example.com', course: 'Python for Data Science', progress: 45, joined: 'Oct 20, 2024', avatar: 'https://i.pravatar.cc/150?u=22' },
    { name: 'Elena Rodriguez', email: 'elena@example.com', course: 'Mastering React & Next.js', progress: 100, joined: 'Oct 10, 2024', avatar: 'https://i.pravatar.cc/150?u=23' },
    { name: 'David Miller', email: 'david@example.com', course: 'Python for Data Science', progress: 22, joined: 'Oct 8, 2024', avatar: 'https://i.pravatar.cc/150?u=24' },
    { name: 'Priya Sharma', email: 'priya@example.com', course: 'Mastering React & Next.js', progress: 55, joined: 'Sep 30, 2024', avatar: 'https://i.pravatar.cc/150?u=25' },
  ];

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Students</h1>
          <p className="text-slate-500 text-sm">Manage and monitor students enrolled in your courses.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Students</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{loading ? '—' : totalStudents}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Courses</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{loading ? '—' : courses.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Completion</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">60%</p>
          </div>
        </div>
      </div>

      {/* Filter + Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
            {['All', ...courses.slice(0, 3).map(c => c.title?.split(' ').slice(0, 2).join(' ') || '')].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === tab ? 'bg-purple-600 text-white shadow-md shadow-purple-100' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Student', 'Course', 'Progress', 'Joined', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockStudents.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full border border-slate-200 object-cover" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{s.name}</p>
                        <p className="text-[10px] text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-[160px] truncate">{s.course}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.progress === 100 ? 'bg-emerald-500' : 'bg-purple-500'}`}
                          style={{ width: `${s.progress}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-bold ${s.progress === 100 ? 'text-emerald-600' : 'text-slate-600'}`}>
                        {s.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{s.joined}</td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
