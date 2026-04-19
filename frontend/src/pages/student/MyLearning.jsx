import { useState, useEffect } from 'react';
import { Play, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { getMyEnrollments } from '../../services/courseService';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State: which course is open, and which lesson is playing
  const activeCourseId = searchParams.get('course');
  const [activeLesson, setActiveLesson] = useState(null); // { moduleIndex, lessonIndex, lesson, module }

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await getMyEnrollments();
        setEnrollments(data.enrollments || []);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  // Reset lesson when switching courses
  useEffect(() => {
    setActiveLesson(null);
  }, [activeCourseId]);

  if (loading) return <Loader fullScreen text="Loading your courses..." />;

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
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">My Learning</h1>
          <p className="text-zinc-500 text-lg">
            {enrollments.length > 0
              ? `You're enrolled in ${enrollments.length} course${enrollments.length > 1 ? 's' : ''}`
              : 'Your learning journey starts here'}
          </p>
        </div>
        <Button onClick={() => navigate('/student/browse-courses')} variant="secondary" className="shrink-0 flex items-center gap-2">
          Browse Courses <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden flex flex-col group hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=350&fit=crop'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <Play className="w-6 h-6 text-zinc-900 fill-zinc-900 ml-1" />
                    </div>
                  </div>
                  {/* Progress badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 text-xs font-black rounded-lg backdrop-blur-sm ${
                      enrollment.progress === 100
                        ? 'bg-green-500 text-white'
                        : enrollment.progress > 0
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/90 text-zinc-700'
                    }`}>
                      {enrollment.progress === 100 ? '✓ Completed' : enrollment.progress > 0 ? `${enrollment.progress}%` : 'Not started'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {course.instructor?.name?.charAt(0) || 'I'}
                    </div>
                    <span className="text-xs text-zinc-400 font-medium truncate">{course.instructor?.name || 'Instructor'}</span>
                  </div>

                  <h3 className="font-bold text-zinc-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(totalMins)}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {completedCount}/{totalLessons} lessons
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-auto space-y-1.5">
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          enrollment.progress === 100 ? 'bg-green-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-zinc-400 font-semibold">
                      <span>
                        {enrollment.progress === 0
                          ? 'Start learning'
                          : enrollment.progress === 100
                          ? 'Course completed!'
                          : `Module ${(enrollment.currentLesson?.moduleIndex || 0) + 1}, Lesson ${(enrollment.currentLesson?.lessonIndex || 0) + 1}`}
                      </span>
                      <span>{enrollment.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-16 rounded-3xl border border-dashed border-zinc-200 text-center shadow-sm max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-9 h-9 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Your learning journey begins here</h2>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto leading-relaxed">
            Discover new skills and add courses to your learning list. Start exploring our catalog now.
          </p>
          <Button onClick={() => navigate('/student/browse-courses')} className="shadow-md">
            Browse Courses
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyLearning;
