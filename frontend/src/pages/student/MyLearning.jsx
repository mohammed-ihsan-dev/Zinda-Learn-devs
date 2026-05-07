import { useState, useEffect } from 'react';
import { Play, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { getMyEnrollments } from '../../services/courseService';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import Pagination from '../../components/common/Pagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CourseOverview from './CourseOverview';
import CoursePlayer from './CoursePlayer';

// ── Helpers ────────────────────────────────────────────────────────
const formatDuration = (mins) => {
  if (!mins) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// ── Main Component ─────────────────────────────────────────────────
const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 9
  });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State: which course is open, and which lesson is playing
  const activeCourseId = searchParams.get('course');
  const [activeLesson, setActiveLesson] = useState(null); // { moduleIndex, lessonIndex, lesson, module }

  useEffect(() => {
    fetchEnrollments();
  }, [currentPage]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await getMyEnrollments({ page: currentPage, limit: 9 });
      setEnrollments(data.enrollments || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset lesson when switching courses
  useEffect(() => {
    setActiveLesson(null);
  }, [activeCourseId]);

  if (loading && enrollments.length === 0) return <Loader fullScreen text="Loading your courses..." />;

  const activeEnrollment = enrollments.find((e) => e.course._id === activeCourseId);

  // ── STATE: COURSE PLAYER ─────────────────────────────────────────
  if (activeEnrollment && activeLesson) {
    return (
      <CoursePlayer
        course={activeEnrollment.course}
        enrollment={activeEnrollment}
        activeLesson={activeLesson}
        onLessonClick={(lessonInfo) => setActiveLesson(lessonInfo)}
        onBack={() => setActiveLesson(null)}
      />
    );
  }

  // ── STATE: COURSE OVERVIEW ───────────────────────────────────────
  if (activeEnrollment && !activeLesson) {
    return (
      <CourseOverview
        course={activeEnrollment.course}
        enrollment={activeEnrollment}
        onLessonClick={(lessonInfo) => setActiveLesson(lessonInfo)}
      />
    );
  }

  // ── STATE: MY LEARNING LIST (default) ───────────────────────────
  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Learning</h1>
          <p className="text-slate-500 text-lg font-medium">
            {pagination.totalItems > 0
              ? `You're enrolled in ${pagination.totalItems} course${pagination.totalItems > 1 ? 's' : ''}`
              : 'Your learning journey starts here'}
          </p>
        </div>
        <Button onClick={() => navigate('/student/browse-courses')} variant="secondary" className="shrink-0 flex items-center gap-2 rounded-2xl py-3 shadow-lg shadow-slate-100">
          Browse Courses <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {enrollments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;
              const totalMins = course.modules?.reduce(
                (acc, m) => acc + (m.lessons?.reduce((a, l) => a + (l.duration || 0), 0) || 0), 0
              ) || 0;
              const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
              const completedCount = enrollment.completedLessons?.length || 0;

              return (
                <div
                  key={enrollment._id}
                  onClick={() => setSearchParams({ course: course._id })}
                  className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=350&fit=crop'}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <Play className="w-6 h-6 text-slate-900 fill-slate-900 ml-1" />
                      </div>
                    </div>
                    {/* Progress badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl backdrop-blur-md shadow-lg border border-white/20 ${
                        enrollment.progress === 100
                          ? 'bg-emerald-500 text-white'
                          : enrollment.progress > 0
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/90 text-slate-700'
                      }`}>
                        {enrollment.progress === 100 ? '✓ Completed' : enrollment.progress > 0 ? `${enrollment.progress}%` : 'Not started'}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 text-[10px] font-black shrink-0">
                        {course.instructor?.name?.charAt(0) || 'I'}
                      </div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">{course.instructor?.name || 'Instructor'}</span>
                    </div>

                    <h3 className="font-black text-slate-900 text-lg leading-tight mb-4 line-clamp-2 group-hover:text-purple-600 transition-colors tracking-tight">
                      {course.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        {formatDuration(totalMins)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                        {completedCount}/{totalLessons} lessons
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-auto space-y-3">
                      <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            enrollment.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                          }`}
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        <span>
                          {enrollment.progress === 0
                            ? 'Start learning'
                            : enrollment.progress === 100
                            ? 'Course completed!'
                            : `Module ${(enrollment.currentLesson?.moduleIndex || 0) + 1}, Lesson ${(enrollment.currentLesson?.lessonIndex || 0) + 1}`}
                        </span>
                        <span className="text-purple-600">{enrollment.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Pagination 
            pagination={pagination} 
            onPageChange={handlePageChange} 
          />
        </>
      ) : (
        <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center shadow-sm max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-purple-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
            <Play className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Your learning journey begins here</h2>
          <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed font-medium">
            Discover new skills and add courses to your learning list. Start exploring our catalog now and level up your career.
          </p>
          <Button onClick={() => navigate('/student/browse-courses')} className="px-10 py-4 shadow-xl shadow-purple-200 rounded-2xl">
            Browse All Courses
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyLearning;
