import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, GripVertical, Edit2, Trash2, PlayCircle, FileText, ChevronDown, ChevronRight, X } from 'lucide-react';

// ── Create Test Modal ─────────────────────────────────────────────────────────
const CreateTestModal = ({ onClose }) => {
  const [questions, setQuestions] = useState([{ id: 1, text: '', options: ['', '', '', ''] }]);

  const addQuestion = () =>
    setQuestions(prev => [...prev, { id: prev.length + 1, text: '', options: ['', '', '', ''] }]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 pb-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Create New Test</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">TEST TITLE</label>
            <input
              type="text"
              placeholder="e.g. Behavioral Psychology Quiz"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
            />
          </div>

          {questions.map((q, qi) => (
            <div key={q.id}>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-800">Question {qi + 1}</label>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multiple Choice</span>
              </div>
              <textarea
                placeholder="Enter your question here..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors resize-none mb-3"
              />
              <div className="space-y-2">
                {['Option A', 'Option B', 'Option C', 'Option D'].map((opt) => (
                  <input
                    key={opt}
                    type="text"
                    placeholder={opt}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                  />
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Another Question
          </button>
        </div>

        <div className="flex items-center justify-end gap-4 p-8 pt-0">
          <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Discard
          </button>
          <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-200 transition-all">
            Save Test
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Create Coupon Modal ───────────────────────────────────────────────────────
const CreateCouponModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-scale-in">
      <div className="flex items-center justify-between p-8 pb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Create New Coupon</h3>
          <p className="text-xs text-slate-500 mt-1">Design a promotional incentive for your potential students.</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="px-8 pb-8 space-y-5">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">COUPON CODE</label>
          <input type="text" placeholder="e.g. SUMMER50" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">DISCOUNT TYPE</label>
            <div className="relative">
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-purple-500 focus:bg-white transition-colors">
                <option>Percentage</option>
                <option>Fixed Amount</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">DISCOUNT VALUE</label>
            <input type="number" placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">MAX USAGE</label>
            <input type="number" placeholder="e.g. 100" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">EXPIRY DATE</label>
            <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button onClick={onClose} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors">
            Cancel
          </button>
          <button className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-200 transition-all">
            Save Coupon
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Content Tab ───────────────────────────────────────────────────────────────
const ContentTab = ({ courseTitle }) => {
  const [openModule, setOpenModule] = useState(0);
  const modules = [
    {
      title: 'Module 01: Foundations',
      subtitle: 'Manage course sub-issues for this section',
      lessons: [
        { title: '1.1 Introduction to Design Atlas', meta: 'VIDEO • 22min 15sec' },
        { title: '1.2 Theoretical Framework of Atomic Design', meta: 'READING • 20 min read' },
        { title: '1.3 Setting up the Base UI in Figma', meta: 'VIDEO • 4h 44min 56sec' },
        { title: '1.4 Typography Scales & Accessibility', meta: 'VIDEO • 44min' },
      ]
    },
    {
      title: 'Module 02: Advanced Auto-Layout and Variants',
      subtitle: '',
      lessons: []
    },
    {
      title: 'Module 03: Prototyping Complex Micro-Interactions',
      subtitle: '',
      lessons: []
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left — Modules list */}
      <div className="lg:col-span-1 space-y-3">
        {modules.map((mod, i) => (
          <div
            key={i}
            className={`border rounded-2xl overflow-hidden transition-all ${openModule === i ? 'border-purple-200 bg-purple-50/50' : 'border-slate-100 bg-white'}`}
          >
            <button
              onClick={() => setOpenModule(openModule === i ? -1 : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div>
                <p className={`text-xs font-bold ${openModule === i ? 'text-purple-700' : 'text-slate-800'}`}>{mod.title}</p>
                {mod.subtitle && <p className="text-[10px] text-slate-400 mt-1">{mod.subtitle}</p>}
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 flex-shrink-0 ml-2 transition-transform ${openModule === i ? 'rotate-90 text-purple-500' : ''}`} />
            </button>
            {openModule === i && mod.lessons.length > 0 && (
              <div className="border-t border-purple-100 px-4 pb-4 pt-2 space-y-2">
                {mod.lessons.map((l, j) => (
                  <div key={j} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-purple-100/50 cursor-pointer">
                    <PlayCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">{l.title}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">{l.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add New Section
        </button>
      </div>

      {/* Right — Module detail / summary */}
      <div className="lg:col-span-2">
        {openModule >= 0 && modules[openModule] ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">{modules[openModule].title}</h3>
              <button className="flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 px-4 py-2 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                <Plus className="w-4 h-4" /> Add Lecture
              </button>
            </div>

            {modules[openModule].lessons.map((l, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab flex-shrink-0" />
                <PlayCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{l.title}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{l.meta}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-slate-400 hover:text-purple-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {/* Module Summary */}
            <div className="mt-6 bg-purple-50 border border-purple-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-bold text-purple-900">Module Summary & Goals</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                By the end of this module, students will understand the reasoning between designers, and be able to define a design system architecture with a structured, scalable foundation.
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PREREQUISITES</p>
                  <p className="text-xs font-bold text-slate-700 mt-1">None</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Foundation: Not Required</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
            <PlayCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-400">Select a module to view its content</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Tests Tab ─────────────────────────────────────────────────────────────────
const TestsTab = () => {
  const [showModal, setShowModal] = useState(false);
  const tests = [
    { icon: '📘', title: 'Midterm Cognitive Evaluation', questions: 25, attempts: 142 },
    { icon: '🎯', title: 'Pedagogy Fundamentals Quiz', questions: 15, attempts: 88 },
    { icon: '🏆', title: 'Final Certification Exam', questions: 50, attempts: 12 },
  ];

  return (
    <>
      {showModal && <CreateTestModal onClose={() => setShowModal(false)} />}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Course Assessments</h3>
            <p className="text-xs text-slate-500 mt-1">3 active tests assigned to this course.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-200 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Test
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tests.map((test, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-purple-100 transition-all cursor-pointer group">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:bg-purple-100 transition-colors">
                {test.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 leading-snug">{test.title}</h4>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                  <FileText className="w-3.5 h-3.5" />
                  {test.questions} Questions
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {test.attempts} Attempts
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ── Coupons Tab ───────────────────────────────────────────────────────────────
const CouponsTab = () => {
  const [showModal, setShowModal] = useState(false);
  const coupons = [
    { code: 'EARLYBIRD50', discount: '50% OFF', used: 20, max: 100, expiry: 'Dec 31, 2024', color: 'bg-purple-500' },
    { code: 'WINTERSALE', discount: '25% OFF', used: 85, max: 100, expiry: 'Jan 15, 2025', color: 'bg-indigo-500' },
    { code: 'VIPACCESS', discount: '$100 OFF', used: 42, max: 50, expiry: 'Nov 30, 2024', color: 'bg-violet-600' },
  ];

  return (
    <>
      {showModal && <CreateCouponModal onClose={() => setShowModal(false)} />}
      <div>
        {/* Table header */}
        <div className="grid grid-cols-5 px-4 pb-3 mb-2">
          {['COUPON CODE', 'DISCOUNT', 'USAGE', 'EXPIRY DATE', 'ACTIONS'].map((h) => (
            <p key={h} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{h}</p>
          ))}
        </div>

        <div className="space-y-3 mb-8">
          {coupons.map((c, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl px-4 py-4 grid grid-cols-5 items-center shadow-sm hover:shadow-md hover:border-purple-100 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-slate-800">{c.code}</span>
              </div>
              <div>
                <span className="px-2.5 py-1 bg-purple-500 text-white text-[10px] font-bold rounded-lg">
                  {c.discount}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 mb-1.5">{c.used} / {c.max}</p>
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(c.used / c.max) * 100}%` }}></div>
                </div>
              </div>
              <p className="text-xs text-slate-500">{c.expiry}</p>
              <div className="flex items-center gap-3">
                <button className="text-slate-400 hover:text-purple-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Strategy tip */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Campaign Strategy Tip</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Courses with active coupons during launch week typically see a <span className="font-bold text-purple-600">40% higher</span> conversion rate. Use timed urgency to boost enrolment.
            </p>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-600 flex-shrink-0 ml-6 overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop" alt="tip" className="w-full h-full object-cover" />
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-200 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>
    </>
  );
};

// ── Course Detail Main ────────────────────────────────────────────────────────
const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState('Content');
  const courseTitle = 'Mastering UI/UX with Advanced Figma';
  const tabs = ['Content', 'Tests', 'Coupons'];

  return (
    <div className="animate-fade-in pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6">
        <Link to="/instructor/my-courses" className="hover:text-purple-600 transition-colors">Courses</Link>
        <span>/</span>
        <span className="text-slate-600">Management</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">{courseTitle}</h1>
          <p className="text-sm text-slate-500">Course Management & Curriculum</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-sm">
            Draft
          </button>
          <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-sm">
            Published
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-200 transition-all">
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-slate-100 p-1 rounded-full w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Content' && <ContentTab courseTitle={courseTitle} />}
      {activeTab === 'Tests' && <TestsTab />}
      {activeTab === 'Coupons' && <CouponsTab />}
    </div>
  );
};

export default CourseDetail;
