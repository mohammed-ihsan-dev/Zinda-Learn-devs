import { useState, useEffect } from 'react';
import { getInstructorCourses, deleteCourse } from '../../services/instructorService';
import { 
  Users, 
  Search, 
  ChevronDown, 
  Plus, 
  ArrowRight,
  BookOpen,
  MoreVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/currencyFormatter';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getInstructorCourses();
      setCourses(data.courses);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Published') return course.status === 'published';
    if (activeTab === 'Draft') return course.status === 'draft';
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500 mt-1">Manage and track all your courses</p>
        </div>
        <button 
          onClick={() => navigate('/instructor/create-course')}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Course
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full lg:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filter by title..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-2xl w-full lg:w-auto overflow-x-auto scrollbar-hide">
          {['All', 'Published', 'Draft'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 lg:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-auto">
          <button className="w-full lg:w-auto flex items-center justify-between gap-8 px-5 py-2.5 bg-slate-50 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
            Newest First
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-[32px] p-4 border border-slate-100 animate-pulse h-[400px]">
              <div className="bg-slate-100 rounded-2xl h-48 mb-4"></div>
              <div className="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          <>
            {filteredCourses.map((course) => (
              <div key={course._id} className="group bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
                <div className="relative mb-5">
                  <img 
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"} 
                    alt={course.title} 
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      course.status === 'published' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-900 text-white'
                    }`}>
                      {course.status || 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="px-1 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-slate-900 leading-tight group-hover:text-purple-600 transition-colors line-clamp-2 min-h-[44px]">
                      {course.title}
                    </h3>
                    <span className="text-xl font-bold text-purple-600">
                      {formatCurrency(course.price || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-bold">{course.totalStudents || 0} Students</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-xs font-bold">{course.totalLessons || 0} Lessons</span>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <Link 
                      to={`/instructor/courses/${course._id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs transition-colors"
                    >
                      Manage Course
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(course._id)}
                      className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Course Card */}
            <button 
              onClick={() => navigate('/instructor/create-course')}
              className="group flex flex-col items-center justify-center gap-4 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all p-8 h-full min-h-[400px]"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-purple-500 group-hover:scale-110 transition-all shadow-sm">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-900 mb-1">Add New Course</p>
                <p className="text-xs text-slate-500 px-4">Start creating your next learning masterpiece</p>
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
