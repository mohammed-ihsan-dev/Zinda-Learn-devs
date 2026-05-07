import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserPlus, GraduationCap, Search, Filter, 
  MoreVertical, Eye, Lock, Unlock, Mail, ShieldAlert, BookOpen, 
  TrendingUp, Clock, CreditCard
} from 'lucide-react';
import { getStudents, getStudentStats, blockUser, unblockUser } from '../../services/adminService';
import DataTable from '../../components/admin/shared/DataTable';
import AnalyticsCard from '../../components/admin/shared/AnalyticsCard';
import toast from 'react-hot-toast';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents({ 
        search: searchTerm, 
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: currentPage,
        limit: 10
      });
      setStudents(data.data);
      setTotalStudents(data.total);
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Students Management</h1>
        <p className="text-zinc-500">Manage enrolled students, monitor learning activity, and control student access.</p>
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
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1c1c21] p-4 rounded-2xl border border-[#27272a]">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-[#0a0a0b] border border-[#27272a] rounded-xl p-1">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'all' ? 'bg-[#27272a] text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'active' ? 'bg-[#27272a] text-emerald-400 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setStatusFilter('blocked')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'blocked' ? 'bg-[#27272a] text-rose-400 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Blocked
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={students} 
        loading={loading}
        emptyMessage="No students found"
      />

      {/* Pagination (Simplified for now) */}
      {totalStudents > 10 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
            Showing {students.length} of {totalStudents} students
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 bg-[#1c1c21] border border-[#27272a] rounded-lg text-zinc-400 disabled:opacity-30 transition-all hover:bg-[#27272a]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-bold text-zinc-200 px-4">{currentPage}</span>
            <button 
              disabled={students.length < 10}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 bg-[#1c1c21] border border-[#27272a] rounded-lg text-zinc-400 disabled:opacity-30 transition-all hover:bg-[#27272a]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManagement;
