import { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Star } from 'lucide-react';
import { useCourses } from '../../hooks/useCourses';
import { enrollCourse } from '../../services/courseService';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design', 'DevOps'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const BrowseCourses = () => {
  const { courses, loading, error } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [enrollingId, setEnrollingId] = useState(null);
  const navigate = useNavigate();

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleEnroll = async (e, courseId) => {
    e.stopPropagation();
    setEnrollingId(courseId);
    try {
      await enrollCourse(courseId);
      toast.success('Successfully enrolled! 🎉');
      navigate('/student/my-learning');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) return <Loader fullScreen text="Loading courses..." />;

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
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Browse Courses</h1>
        <p className="text-zinc-500 text-lg">Discover new skills from our growing catalog of expert-led courses.</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search for courses, topics, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-zinc-800 placeholder-zinc-400"
          />
        </div>

        {/* Category Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest shrink-0">
              <Filter className="w-3.5 h-3.5" /> Category
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest shrink-0">
              <BookOpen className="w-3.5 h-3.5" /> Level
            </span>
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedLevel === lvl
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-zinc-500 font-medium -mt-4">
        Showing <span className="text-zinc-900 font-bold">{filteredCourses.length}</span> courses
        {searchTerm && <> for "<span className="text-primary-600">{searchTerm}</span>"</>}
      </p>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const totalLessons = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;
            const totalMins = course.modules?.reduce(
              (acc, mod) => acc + (mod.lessons?.reduce((a, l) => a + (l.duration || 0), 0) || 0), 0
            ) || 0;
            const hours = Math.floor(totalMins / 60);
            const mins = totalMins % 60;

            return (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden flex flex-col group hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=350&fit=crop'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-bold bg-white/90 backdrop-blur-sm text-primary-700 rounded-lg">
                      {course.category}
                    </span>
                  </div>
                  {/* Rating pill */}
                  {course.rating && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white rounded-full shadow-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-zinc-900">{course.rating}</span>
                      {course.totalRatings && (
                        <span className="text-[10px] text-zinc-400">({course.totalRatings?.toLocaleString()})</span>
                      )}
                    </div>
                  )}
                  {/* Level badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      course.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {course.instructor?.name?.charAt(0) || 'Z'}
                    </div>
                    <span className="text-xs text-zinc-500 font-medium truncate">
                      {course.instructor?.name || 'Instructor'}
                    </span>
                  </div>

                  <h3 className="font-bold text-zinc-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-zinc-400 mb-5">
                    {(hours > 0 || mins > 0) && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
                      </span>
                    )}
                    {totalLessons > 0 && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {totalLessons} lessons
                      </span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-100">
                    <div>
                      {course.discountPrice > 0 && course.discountPrice < course.price ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-zinc-400 line-through">₹{course.price?.toLocaleString()}</span>
                          <span className="font-bold text-primary-600 text-xl">₹{course.discountPrice?.toLocaleString()}</span>
                        </div>
                      ) : course.price === 0 ? (
                        <span className="font-bold text-green-600 text-xl">Free</span>
                      ) : (
                        <span className="font-bold text-zinc-900 text-xl">₹{course.price?.toLocaleString()}</span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      loading={enrollingId === course._id}
                      onClick={(e) => handleEnroll(e, course._id)}
                      className="rounded-xl shadow-sm hover:shadow-md shrink-0"
                    >
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-zinc-200 py-24 text-center shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No courses found</h3>
          <p className="text-zinc-500 max-w-sm mx-auto mb-6">
            Try adjusting your search or clearing the filters.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedLevel('All'); }}
            className="px-6 py-2.5 bg-primary-50 text-primary-600 font-bold rounded-xl hover:bg-primary-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
