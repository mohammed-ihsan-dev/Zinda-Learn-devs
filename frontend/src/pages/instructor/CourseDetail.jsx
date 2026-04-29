import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getInstructorCourses, submitCourse } from '../../services/instructorService';
import { toast } from 'react-hot-toast';
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
  Trophy,
  Send,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

// ── Create Module Modal ───────────────────────────────────────────────────────
const CreateModuleModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Module title is required');
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl animate-scale-in overflow-hidden">
        <div className="flex items-center justify-between p-8 pb-6 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Add New Section</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Section Title</label>
            <input 
              autoFocus
              type="text"
              placeholder="e.g. Getting Started with React"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-slate-900 placeholder:text-slate-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description (Optional)</label>
            <textarea 
              rows="3"
              placeholder="Briefly describe what this section covers..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-slate-900 placeholder:text-slate-300 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all">
              Create Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Create Test Modal ─────────────────────────────────────────────────────────
const CreateTestModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ title: '', duration: 30, passScore: 70 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl animate-scale-in overflow-hidden">
        <div className="flex items-center justify-between p-8 pb-6 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Create New Test</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Test Title</label>
            <input 
              type="text"
              placeholder="e.g. Final Assessment"
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Duration (Mins)</label>
              <input type="number" defaultValue="30" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Pass Score (%)</label>
              <input type="number" defaultValue="70" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all font-medium" />
            </div>
          </div>

          <div className="p-10 border-2 border-dashed border-slate-100 rounded-[24px] text-center">
            <Plus className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question builder coming soon</p>
          </div>

          <button onClick={onClose} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all">
            Save Test
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Create Coupon Modal ───────────────────────────────────────────────────────
const CreateCouponModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl animate-scale-in overflow-hidden">
        <div className="flex items-center justify-between p-8 pb-6 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Create Coupon</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Coupon Code</label>
            <input 
              type="text"
              placeholder="e.g. SUMMER50"
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all font-bold uppercase placeholder:normal-case"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Discount (%)</label>
              <input type="number" defaultValue="10" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Limit</label>
              <input type="number" placeholder="100" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all font-medium" />
            </div>
          </div>

          <button onClick={onClose} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all">
            Active Coupon
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Content Tab ───────────────────────────────────────────────────────────────
const ContentTab = () => {
  const [selectedModule, setSelectedModule] = useState(0);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [modules, setModules] = useState([]);

  const handleAddModule = (newMod) => {
    setModules(prev => [...prev, { ...newMod, id: prev.length + 1, lessons: [] }]);
    toast.success('Section added successfully');
  };

  return (
    <>
      {showModuleModal && (
        <CreateModuleModal 
          onClose={() => setShowModuleModal(false)} 
          onSave={handleAddModule} 
        />
      )}
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
                key={i}
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

          <button 
            onClick={() => setShowModuleModal(true)}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[24px] text-xs font-bold text-slate-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Section
          </button>
        </div>

        {/* Right — Module detail */}
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-12">
            {modules.length > 0 ? (
              <div className="w-full text-left">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">{modules[selectedModule].title}</h3>
                  <div className="flex items-center gap-2">
                    <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-12 border-2 border-dashed border-slate-100 rounded-[32px] text-center">
                  <PlayCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-sm text-slate-500">No lessons in this section yet</p>
                  <button className="mt-4 px-6 py-2 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-100">Add Lesson</button>
                </div>
              </div>
            ) : (
              <>
                <PlayCircle className="w-16 h-16 text-slate-100 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Build your curriculum</h3>
                <p className="text-sm text-slate-500 max-w-xs">Start by adding your first section and uploading your lessons to get started.</p>
                <button 
                  onClick={() => setShowModuleModal(true)}
                  className="mt-8 flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-200"
                >
                  <Plus className="w-5 h-5" /> Add First Section
                </button>
              </>
            )}
        </div>
      </div>
    </>
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
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmitForReview = async () => {
    try {
      setSubmitting(true);
      await submitCourse(id);
      toast.success('Course submitted for admin review!');
      fetchCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit course');
    } finally {
      setSubmitting(false);
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
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
             {['draft', 'pending', 'published', 'declined'].map(status => (
               <div
                key={status}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-extrabold transition-all duration-300 uppercase tracking-widest flex items-center gap-2 ${
                  (course.status || 'draft') === status 
                    ? status === 'published' ? 'bg-emerald-500 text-white shadow-lg' :
                      status === 'pending' ? 'bg-amber-500 text-white shadow-lg' :
                      status === 'declined' ? 'bg-rose-500 text-white shadow-lg' :
                      'bg-white text-slate-900 shadow-lg'
                    : 'text-slate-400 opacity-40 cursor-default'
                }`}
               >
                 {status === 'published' && <CheckCircle2 className="w-3 h-3" />}
                 {status === 'pending' && <Clock className="w-3 h-3" />}
                 {status === 'declined' && <AlertTriangle className="w-3 h-3" />}
                 {status}
               </div>
             ))}
          </div>

          {course.status === 'draft' || course.status === 'declined' ? (
            <button 
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="flex items-center gap-2.5 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all active:scale-95 group"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
              Submit for Review
            </button>
          ) : (
            <button className="flex items-center gap-2.5 px-8 py-3.5 bg-slate-100 text-slate-400 font-bold rounded-2xl border border-slate-200 cursor-not-allowed">
              <CheckCircle2 className="w-4 h-4" />
              In Review
            </button>
          )}

          <button className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-2xl transition-all active:scale-95 group">
            <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Save Draft
          </button>
        </div>
      </div>

      {course.status === 'declined' && course.declineReason && (
        <div className="mb-10 p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-4 animate-bounce-subtle">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-rose-900 font-bold text-lg">Course Declined by Admin</h4>
            <p className="text-rose-700 mt-1 font-medium leading-relaxed">
              Reason: <span className="italic">"{course.declineReason}"</span>
            </p>
            <p className="text-rose-600 text-xs mt-3">Please address the feedback above and click "Submit for Review" again.</p>
          </div>
        </div>
      )}

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
