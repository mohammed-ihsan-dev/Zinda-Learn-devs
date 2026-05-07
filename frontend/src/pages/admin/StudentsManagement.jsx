import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserPlus, GraduationCap, Search, Filter, 
  MoreVertical, Eye, Lock, Unlock, Mail, ShieldAlert, BookOpen, 
  TrendingUp, Clock, CreditCard
} from 'lucide-react';
import { getStudents, getStudentStats, blockUser, unblockUser } from '../../services/adminService';
import DataTable from '../../components/admin/shared/DataTable';
import AnalyticsCard from '../../components/admin/shared/AnalyticsCard';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents({ 
        search: searchTerm, 
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: currentPage,
        limit: 10
      });
      setStudents(data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getStudentStats();
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, statusFilter, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleBlockToggle = async (student) => {
    try {
      if (student.isBlocked) {
        await unblockUser(student._id);
        toast.success('Student unblocked');
      } else {
        await blockUser(student._id);
        toast.success('Student blocked');
      }
      fetchStudents();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns = [
    {
      header: 'Student',
      cell: (student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#27272a] overflow-hidden">
            <img 
              src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-zinc-100">{student.name}</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Joined {new Date(student.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      className: 'hidden md:table-cell'
    },
    {
      header: 'Enrolled Courses',
      cell: (student) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold">{student.enrolledCount || 0} Courses</span>
        </div>
      )
    },
    {
      header: 'Learning Progress',
      cell: (student) => (
        <div className="w-full max-w-[120px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-zinc-500">{student.avgProgress || 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#27272a] rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all duration-500" 
              style={{ width: `${student.avgProgress || 0}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: 'Total Spent',
      cell: (student) => (
        <div className="font-bold text-zinc-100">
          ₹{(student.totalSpent || 0).toLocaleString()}
        </div>
      )
    },
    {
      header: 'Status',
      cell: (student) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
          student.isBlocked 
            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
        }`}>
          {student.isBlocked ? 'Blocked' : 'Active'}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (student) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors" title="View Profile">
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleBlockToggle(student)}
            className={`p-2 hover:bg-white/5 rounded-lg transition-colors ${student.isBlocked ? 'text-emerald-400 hover:text-emerald-300' : 'text-rose-400 hover:text-rose-300'}`}
            title={student.isBlocked ? 'Unblock Student' : 'Block Student'}
          >
            {student.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Students Management</h1>
        <p className="text-zinc-500 font-medium">Manage enrolled students, monitor learning activity, and control student access.</p>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard 
          title="Total Students" 
          value={stats?.totalStudents || 0} 
          icon={Users} 
          color="purple"
        />
        <AnalyticsCard 
          title="Active Students" 
          value={stats?.activeStudents || 0} 
          icon={UserCheck} 
          color="emerald"
        />
        <AnalyticsCard 
          title="New This Month" 
          value={stats?.newStudents || 0} 
          icon={UserPlus} 
          color="blue"
        />
        <AnalyticsCard 
          title="Avg. Completion" 
          value={`${stats?.avgCompletion || 0}%`} 
          icon={TrendingUp} 
          color="amber"
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1c1c21] p-4 rounded-3xl border border-[#27272a]">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-zinc-200 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-[#0a0a0b] border border-[#27272a] rounded-2xl p-1.5">
            {['all', 'active', 'blocked'].map((status) => (
              <button 
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
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
      <div className="bg-[#1c1c21] rounded-[40px] border border-[#27272a] overflow-hidden shadow-2xl">
        <DataTable 
          columns={columns} 
          data={students} 
          loading={loading}
          emptyMessage="No students found"
        />
        
        <div className="p-8 border-t border-[#27272a] bg-[#1c1c21]">
          <Pagination 
            pagination={pagination} 
            onPageChange={handlePageChange} 
          />
        </div>
      </div>

      {/* Results Info */}
      {!loading && students.length > 0 && (
        <div className="flex items-center justify-center">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-[#1c1c21] px-4 py-2 rounded-full border border-[#27272a]">
              Showing {students.length} of {pagination.totalItems} students
           </p>
        </div>
      )}
    </div>
  );
};

export default StudentsManagement;
