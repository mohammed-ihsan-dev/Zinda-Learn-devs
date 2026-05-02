import { useState } from 'react';
import {
  Play, ChevronLeft, ChevronRight, CheckCircle2, CheckCircle,
  Clock, BarChart2, Eye, Lock, Lightbulb, Wrench,
  Video, Calendar, Users, ChevronDown, ChevronUp
} from 'lucide-react';
import { updateProgress } from '../../services/courseService';
import toast from 'react-hot-toast';

// ─── Helper ──────────────────────────────────────────────────────────────────
const fmtDuration = (mins) => {
  if (!mins) return '0:00';
  const h = Math.floor(mins / 60);
  const m = String(mins % 60).padStart(2, '0');
  return h > 0 ? `${h}:${m}:00` : `${mins}:00`;
};

// ─── Sub-component: Tab Bar ───────────────────────────────────────────────────
const TABS = ['Overview', 'Notes', 'Q&A', 'Resources', 'Tests'];

const TabBar = ({ active, onChange }) => (
  <div className="flex gap-1 border-b border-zinc-200 mb-8">
    {TABS.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-4 py-3 text-sm font-semibold transition-all relative ${active === tab
            ? 'text-primary-600'
            : 'text-zinc-500 hover:text-zinc-800'
          }`}
      >
        {tab}
        {active === tab && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
        )}
      </button>
    ))}
  </div>
);

// ─── Sub-component: Module Accordion Row ────────────────────────────────────
const ModuleRow = ({ module, moduleIndex, activeLesson, completedLessons, onLessonClick }) => {
  const [open, setOpen] = useState(
    moduleIndex === (activeLesson?.moduleIndex ?? 0)
  );

  return (
    <div>
      {/* Module header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="text-sm font-bold text-zinc-800 group-hover:text-primary-600 transition-colors leading-snug">
          {module.title}
        </span>
        {open
          ? <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
        }
      </button>

      {open && (
        <div className="space-y-1 mb-2">
          {module.lessons?.map((lesson, lessonIndex) => {
            const lessonId = lesson._id || `${moduleIndex}-${lessonIndex}`;
            const isActive = activeLesson?.moduleIndex === moduleIndex && activeLesson?.lessonIndex === lessonIndex;
            const isCompleted = completedLessons?.includes(lessonId);

            return (
              <button
                key={lessonId}
                onClick={() => onLessonClick({ moduleIndex, lessonIndex, lesson, module })}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${isActive ? 'bg-primary-100' : 'hover:bg-zinc-50'
                  }`}
              >
                {/* Status icon */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                      <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-snug truncate ${isActive ? 'text-primary-700' : isCompleted ? 'text-zinc-500' : 'text-zinc-700'
                    }`}>
                    {String(lessonIndex + 1).padStart(2, '0')}. {lesson.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-zinc-400">{fmtDuration(lesson.duration)}</span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-primary-600">• In Progress</span>
                    )}
                    {!lesson.isFree && !isCompleted && !isActive && (
                      <Lock className="w-3 h-3 text-zinc-300" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CoursePlayer = ({ course, enrollment, activeLesson, onLessonClick, onBack }) => {
  const { moduleIndex, lessonIndex, lesson, module } = activeLesson;
  const [activeTab, setActiveTab] = useState('Overview');
  const [savingProgress, setSavingProgress] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(
    enrollment?.completedLessons?.includes(lesson?._id) || false
  );

  const completedLessons = enrollment?.completedLessons || [];
  const progress = enrollment?.progress || 0;

  const allLessons = course.modules?.flatMap((mod, mIdx) =>
    mod.lessons?.map((l, lIdx) => ({ moduleIndex: mIdx, lessonIndex: lIdx, lesson: l, module: mod })) || []
  ) || [];

  const currentFlatIdx = allLessons.findIndex(
    al => al.moduleIndex === moduleIndex && al.lessonIndex === lessonIndex
  );
  const prevLesson = currentFlatIdx > 0 ? allLessons[currentFlatIdx - 1] : null;
  const nextLesson = currentFlatIdx < allLessons.length - 1 ? allLessons[currentFlatIdx + 1] : null;

  const totalLessons = allLessons.length;
  const completedCount = completedLessons.length;

  const handleMarkComplete = async () => {
    if (localCompleted || savingProgress || !enrollment?._id) return;
    setSavingProgress(true);
    try {
      await updateProgress(enrollment._id, { lessonId: lesson?._id, moduleIndex, lessonIndex });
      setLocalCompleted(true);
      toast.success('Lesson marked as complete! ✅');
    } catch {
      toast.error('Could not save progress.');
    } finally {
      setSavingProgress(false);
    }
  };

  const handleNavigate = async (target) => {
    if (!localCompleted && enrollment?._id && lesson?._id) {
      try {
        await updateProgress(enrollment._id, {
          lessonId: lesson._id,
          moduleIndex: target.moduleIndex,
          lessonIndex: target.lessonIndex,
        });
      } catch (_) { }
    }
    onLessonClick(target);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Course
      </button>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ══ LEFT: Video + Content ══ */}
        <div className="lg:col-span-2 space-y-5">

          {/* 1. VIDEO PLAYER */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg bg-zinc-900 aspect-video group cursor-pointer">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={lesson?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
            )}
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary-600 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-500">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
            {/* Lesson badge */}
            <div className="absolute bottom-4 left-4 text-white text-sm font-semibold bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg">
              {String(lessonIndex + 1).padStart(2, '0')}. {lesson?.title}
            </div>
          </div>

          {/* 2. NAVIGATION BUTTONS */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => prevLesson && handleNavigate(prevLesson)}
              disabled={!prevLesson}
              className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-zinc-200 text-sm font-bold text-zinc-700 hover:border-primary-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Lesson
            </button>
            <button
              onClick={() => nextLesson && handleNavigate(nextLesson)}
              disabled={!nextLesson}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-primary-500/30"
            >
              Next Lesson
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. MARK AS COMPLETED */}
          <button
            onClick={handleMarkComplete}
            disabled={localCompleted || savingProgress}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold transition-all ${localCompleted
                ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                : 'bg-zinc-100 text-zinc-700 hover:bg-primary-50 hover:text-primary-700'
              }`}
          >
            <CheckCircle2 className={`w-5 h-5 ${localCompleted ? 'text-green-500' : 'text-zinc-400'}`} />
            {savingProgress ? 'Saving...' : localCompleted ? 'Completed ✓' : 'Mark as Completed'}
          </button>

          {/* Divider */}
          <hr className="border-zinc-200" />

          {/* 4. TAB BAR */}
          <TabBar active={activeTab} onChange={setActiveTab} />

          {/* 5. LESSON CONTENT (Overview tab) */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-zinc-900 mb-4 leading-tight">
                  {String(lessonIndex + 1).padStart(2, '0')}. {lesson?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-5">
                  {lesson?.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {lesson.duration} mins
                    </span>
                  )}
                  {course.level && (
                    <span className="flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4" />
                      {course.level}
                    </span>
                  )}
                  {course.totalStudents > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      {course.totalStudents?.toLocaleString()} students
                    </span>
                  )}
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  {lesson?.description || course.description || 'In this lesson, we dive deep into the core concepts and practical implementation. Follow along and build your understanding step by step with hands-on examples.'}
                </p>
              </div>

              {/* 6. INFO CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Key Takeaways */}
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-primary-500" />
                    <h3 className="font-bold text-zinc-800">Key Takeaways</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {(course.whatYouWillLearn?.slice(0, 3) || [
                      'Core concepts made simple',
                      'Hands-on practical skills',
                      'Real-world application',
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                        <span className="text-zinc-400 mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Tools */}
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-5 h-5 text-primary-500" />
                    <h3 className="font-bold text-zinc-800">Required Tools</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {(course.requirements?.slice(0, 3) || [
                      'A modern web browser',
                      'Text editor (VS Code)',
                      'Node.js installed',
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                        <span className="text-zinc-400 mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Notes tab */}
          {activeTab === 'Notes' && (
            <div className="space-y-4">
              <textarea
                rows={8}
                placeholder="Write your notes here..."
                className="w-full border border-zinc-200 rounded-xl p-4 text-sm text-zinc-700 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none"
              />
              <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors">
                Save Note
              </button>
            </div>
          )}

          {/* Q&A tab */}
          {activeTab === 'Q&A' && (
            <div className="space-y-5">
              <textarea
                rows={4}
                placeholder="Ask a question about this lesson..."
                className="w-full border border-zinc-200 rounded-xl p-4 text-sm text-zinc-700 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none"
              />
              <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors">
                Post Question
              </button>
              <div className="text-center py-10 text-zinc-400 text-sm">
                No questions yet. Be the first to ask!
              </div>
            </div>
          )}

          {/* Resources tab */}
          {activeTab === 'Resources' && (
            <div className="text-center py-10 text-zinc-400 text-sm">
              No resources attached to this lesson.
            </div>
          )}

          {/* Tests tab */}
          {activeTab === 'Tests' && (
            <div className="text-center py-10 text-zinc-400 text-sm">
              No tests available for this lesson yet.
            </div>
          )}
        </div>

        {/* ══ RIGHT: Course Sidebar ══ */}
        <div className="space-y-5">

          {/* 1. INSTRUCTOR CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {course.instructor?.name?.charAt(0) || 'I'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-zinc-900 text-sm truncate">{course.instructor?.name || 'Instructor'}</p>
                <p className="text-xs text-zinc-400 truncate">Expert Instructor, Zinda Learn</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-zinc-900 mb-3 leading-snug">{course.title}</p>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
              <span className="font-bold text-zinc-700">Course Progress</span>
              <span className="font-black text-primary-600 text-base">{progress}%</span>
            </div>
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 2. COURSE CONTENT */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-900">Course Content</h3>
              <span className="text-xs text-zinc-400 font-semibold">
                {completedCount} / {totalLessons} Lessons
              </span>
            </div>
            <div className="px-4 py-2 max-h-[480px] overflow-y-auto divide-y divide-zinc-100">
              {course.modules?.map((mod, mIdx) => (
                <ModuleRow
                  key={mod._id || mIdx}
                  module={mod}
                  moduleIndex={mIdx}
                  activeLesson={{ moduleIndex, lessonIndex }}
                  completedLessons={completedLessons}
                  onLessonClick={onLessonClick}
                />
              ))}
            </div>
          </div>

          {/* 3. LIVE SESSION CARD */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-600 to-orange-500 p-6 shadow-lg">
            <div className="absolute top-4 left-4">
              <span className="px-2.5 py-1 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-md backdrop-blur-sm">
                Live Event
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-white font-bold text-lg mb-1">Portfolio Critique Live</h3>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                Join your instructor for a live Q&A session. Get your doubts cleared in real time.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  {['A', 'B', 'C'].map((l, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-white text-[10px] font-bold">
                      {l}
                    </div>
                  ))}
                </div>
                <span className="text-white/70 text-xs font-semibold">+142 others</span>
              </div>
              <button className="w-full py-2.5 bg-white text-amber-700 font-bold rounded-xl hover:bg-amber-50 transition-colors text-sm shadow-md">
                Join Live Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
