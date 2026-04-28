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
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 border-b border-slate-100">
           <h3 className="text-lg font-bold text-slate-900">Student Enrollment</h3>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search students..." className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20" />
           </div>
        </div>

        <div className="p-20 text-center">
            <Users className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No students enrolled yet</p>
        </div>
      </div>
    </div>
  );
};

export default Students;
