import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Plus, 
  GripVertical, 
  Edit2, 
  Trash2, 
  PlayCircle, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  X,
  Save,
  Clock,
  Link as LinkIcon,
  HelpCircle,
  Trophy
} from 'lucide-react';
import { getInstructorCourses } from '../../services/instructorService';
import { toast } from 'react-hot-toast';

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
          <p className="text-sm text-slate-500 text-center py-10 italic">Test creation functionality coming soon</p>
        </div>

        <div className="flex items-center justify-end gap-4 p-8 pt-0">
          <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Close
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
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4 text-slate-600" />
        </button>
      </div>
      <div className="px-8 pb-10 text-center">
         <p className="text-sm text-slate-500 italic">Coupon management coming soon</p>
         <button onClick={onClose} className="mt-6 px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl">Close</button>
      </div>
    </div>
  </div>
);

// ── Content Tab ───────────────────────────────────────────────────────────────
const ContentTab = () => {
  const [selectedModule, setSelectedModule] = useState(0);
  const modules = []; // Removed mock modules

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      {/* Left — Modules list */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Course Modules</h3>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full">{modules.length} Sections</span>
        </div>
        
        {modules.length > 0 ? (
          modules.map((mod, i) => (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(i)}
              className={`w-full text-left p-5 rounded-[24px] border transition-all duration-300 ${
                selectedModule === i 
                  ? 'border-purple-200 bg-white shadow-xl shadow-purple-500/5 border-l-4 border-l-purple-600' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedModule === i ? 'text-purple-600' : 'text-slate-400'}`}>
                  Module {mod.id}
                </span>
                <GripVertical className="w-4 h-4 text-slate-300" />
              </div>
              <h4 className="font-bold text-slate-800 leading-snug mb-3">{mod.title}</h4>
            </button>
          ))
        ) : (
          <div className="p-10 text-center bg-white border border-dashed border-slate-200 rounded-[24px]">
             <Plus className="w-8 h-8 text-slate-200 mx-auto mb-2" />
             <p className="text-xs font-bold text-slate-400">No modules yet</p>
          </div>
        )}

        <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[24px] text-xs font-bold text-slate-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add New Section
        </button>
      </div>

      {/* Right — Module detail */}
      <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-12">
          <PlayCircle className="w-16 h-16 text-slate-100 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Build your curriculum</h3>
          <p className="text-sm text-slate-500 max-w-xs">Start by adding your first section and uploading your lessons to get started.</p>
          <button className="mt-8 flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-200">
            <Plus className="w-5 h-5" /> Add First Section
          </button>
      </div>
    </div>
  );
};

// ── Tests Tab ─────────────────────────────────────────────────────────────────
const TestsTab = () => {
  const [showModal, setShowModal] = useState(false);
  const tests = []; // Removed mock tests

  return (
    <>
      {showModal && <CreateTestModal onClose={() => setShowModal(false)} />}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Course Assessments</h3>
            <p className="text-sm text-slate-500 mt-1">Add quizzes to test your students' knowledge.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all"
          >
            <Plus className="w-5 h-5" /> Create Test
          </button>
        </div>

        <div className="bg-white border border-dashed border-slate-200 rounded-[32px] p-20 text-center shadow-sm">
           <Trophy className="w-16 h-16 text-slate-100 mx-auto mb-4" />
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No tests added yet</p>
        </div>
      </div>
    </>
  );
};

// ── Coupons Tab ───────────────────────────────────────────────────────────────
const CouponsTab = () => {
  const [showModal, setShowModal] = useState(false);
  const coupons = []; // Removed mock coupons

  return (
    <>
      {showModal && <CreateCouponModal onClose={() => setShowModal(false)} />}
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-bold text-slate-900">Active Coupons</h3>
           <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all"
          >
            <Plus className="w-5 h-5" /> Create Coupon
          </button>
        </div>

        <div className="bg-white border border-dashed border-slate-200 rounded-[32px] p-20 text-center shadow-sm">
           <HelpCircle className="w-16 h-16 text-slate-100 mx-auto mb-4" />
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No active coupons</p>
        </div>
      </div>
    </>
  );
};

// ── Course Detail Main ────────────────────────────────────────────────────────
const CourseDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Content');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const tabs = ['Content', 'Tests', 'Coupons'];

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const data = await getInstructorCourses();
      const currentCourse = data.courses.find(c => c._id === id);
      setCourse(currentCourse);
    } catch (error) {
      toast.error('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-20 text-center animate-pulse">Loading course...</div>;
  }

  if (!course) {
    return <div className="p-20 text-center text-slate-500 font-bold">Course not found</div>;
  }

  return (
    <div className="animate-fade-in pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
        <Link to="/instructor/my-courses" className="hover:text-purple-600 transition-colors">Courses</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600">Management</span>
      </div>

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{course.title}</h1>
          <p className="text-base text-slate-500">Course Management & Curriculum</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
             {['draft', 'published'].map(status => (
               <button
                key={status}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 capitalize ${
                  (course.status || 'draft') === status 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'text-slate-500 opacity-50 cursor-not-allowed'
                }`}
               >
                 {status}
               </button>
             ))}
          </div>

          <button className="flex items-center gap-2.5 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all active:scale-95 group">
            <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-full text-xs font-bold transition-all duration-300 border-2 whitespace-nowrap ${
              activeTab === tab
                ? 'bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-500/20'
                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-500">
        {activeTab === 'Content' && <ContentTab />}
        {activeTab === 'Tests' && <TestsTab />}
        {activeTab === 'Coupons' && <CouponsTab />}
      </div>
    </div>
  );
};

export default CourseDetail;
