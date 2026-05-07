import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Clock, Star } from 'lucide-react';
import { useCourses } from '../../hooks/useCourses';
import CourseCard from '../../components/CourseCard';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design', 'DevOps'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const BrowseCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { courses, loading, error, pagination } = useCourses({
    search: debouncedSearch,
    category: selectedCategory === 'All' ? '' : selectedCategory,
    level: selectedLevel === 'All' ? '' : selectedLevel,
    page: currentPage,
    limit: 9
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleLevelChange = (lvl) => {
    setSelectedLevel(lvl);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-2">Failed to load courses</h3>
        <p className="text-zinc-500 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-10 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Browse Courses</h1>
        <p className="text-slate-500 text-lg font-medium">Discover new skills from our growing catalog of expert-led courses.</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
          <input
            type="text"
            placeholder="Search for courses, topics, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:bg-white focus:border-purple-200 transition-all text-slate-800 font-medium placeholder-slate-400"
          />
        </div>

        {/* Category Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
              <Filter className="w-3.5 h-3.5" /> Category
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
              <BookOpen className="w-3.5 h-3.5" /> Level
            </span>
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedLevel === lvl
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-bold">
          Showing <span className="text-purple-600">{pagination.totalItems}</span> courses
          {debouncedSearch && <> for "<span className="text-purple-600">{debouncedSearch}</span>"</>}
        </p>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 h-80 animate-pulse"></div>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination 
            pagination={pagination} 
            onPageChange={handlePageChange} 
          />
        </>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 py-24 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
            Try adjusting your search or clearing the filters to find what you're looking for.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedLevel('All'); }}
            className="px-8 py-3 bg-purple-50 text-purple-600 font-bold rounded-2xl hover:bg-purple-100 transition-all active:scale-95"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
