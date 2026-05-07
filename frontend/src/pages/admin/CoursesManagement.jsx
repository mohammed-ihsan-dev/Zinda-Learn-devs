import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle, Clock, Users, Search, Filter, 
  MoreVertical, Eye, Trash2, Ban, Star, IndianRupee,
  Plus, AlertCircle, TrendingUp, LayoutGrid
} from 'lucide-react';
import { 
  getAllCourses, 
  updateCourseStatus, 
  deleteCourse, 
  getDashboardStats 
} from '../../services/adminService';
import DataTable from '../../components/admin/shared/DataTable';
import AnalyticsCard from '../../components/admin/shared/AnalyticsCard';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getAllCourses({
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: currentPage,
        limit: 10
      });
      setCourses(data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, statusFilter, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateCourseStatus(id, status);
      toast.success(`Course ${status} successfully`);
      fetchCourses();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns = [
    {
      header: 'Course',
      cell: (course) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-10 rounded-lg bg-[#27272a] overflow-hidden border border-[#3f3f46]">
            <img 
              src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=120&fit=crop'} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-zinc-100 line-clamp-1 max-w-[200px]">{course.title}</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{course.category}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Instructor',
      cell: (course) => (
        <div className="flex items-center gap-2">
          <span className="text-zinc-300 font-medium">{course.instructor?.name || 'Unknown'}</span>
        </div>
      ),
      className: 'hidden lg:table-cell'
    },
    {
      header: 'Enrollments',
      cell: (course) => (
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-zinc-500" />
          <span className="font-bold text-zinc-200">{course.totalStudents || 0}</span>
        </div>
      )
    },
    {
      header: 'Revenue',
      cell: (course) => (
        <div className="font-bold text-emerald-400">
          ₹{((course.totalStudents || 0) * (course.price || 0)).toLocaleString()}
        </div>
      )
    },
    {
      header: 'Rating',
      cell: (course) => (
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-zinc-200">{course.rating || 0}</span>
        </div>
      ),
      className: 'hidden md:table-cell'
    },
    {
      header: 'Status',
      cell: (course) => {
        const statusColors = {
          published: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          draft: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
          declined: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
          blocked: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
        };
        return (
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusColors[course.status] || statusColors.draft}`}>
            {course.status}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (course) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {course.status === 'pending' && (
            <>
              <button 
                onClick={() => handleStatusUpdate(course._id, 'published')}
                className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-400 transition-colors" 
                title="Approve Course"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleStatusUpdate(course._id, 'declined')}
                className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-400 transition-colors" 
                title="Decline Course"
              >
                <Ban className="w-4 h-4" />
              </button>
            </>
          )}
          <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors" title="View Course">
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteCourse(course._id)}
            className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-300 transition-colors" 
            title="Delete Course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Courses Management</h1>
          <p className="text-zinc-500 font-medium">Monitor course performance, approve pending submissions, and manage platform content.</p>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard 
          title="Total Courses" 
          value={stats?.totalCourses || 0} 
          icon={BookOpen} 
          color="purple"
        />
        <AnalyticsCard 
          title="Published" 
          value={stats?.totalCourses - (stats?.pendingCoursesCount || 0) || 0} 
          icon={CheckCircle} 
          color="emerald"
        />
        <AnalyticsCard 
          title="Pending Review" 
          value={stats?.pendingCoursesCount || 0} 
          icon={Clock} 
          color="amber"
        />
        <AnalyticsCard 
          title="Total Enrollments" 
          value={stats?.totalEnrollments || 0} 
          icon={Users} 
          color="blue"
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1c1c21] p-4 rounded-3xl border border-[#27272a]">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-zinc-200 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto hide-scrollbar">
          <div className="flex items-center bg-[#0a0a0b] border border-[#27272a] rounded-2xl p-1.5 shrink-0">
            {['all', 'published', 'pending', 'declined', 'draft'].map((status) => (
              <button 
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === status 
                    ? 'bg-[#27272a] text-white shadow-xl' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1c1c21] rounded-[40px] border border-[#27272a] overflow-hidden shadow-2xl shadow-black/20">
        <DataTable 
          columns={columns} 
          data={courses} 
          loading={loading}
          emptyMessage="No courses found"
        />
        
        <div className="p-10 border-t border-[#27272a] bg-[#1c1c21]">
          <Pagination 
            pagination={pagination} 
            onPageChange={handlePageChange} 
          />
        </div>
      </div>

      {/* Results Info */}
      {!loading && courses.length > 0 && (
        <div className="flex items-center justify-center">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-[#1c1c21] px-4 py-2 rounded-full border border-[#27272a]">
              Showing {courses.length} of {pagination.totalItems} courses
           </p>
        </div>
      )}
    </div>
  );
};

export default CoursesManagement;
