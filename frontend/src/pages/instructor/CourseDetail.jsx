import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getInstructorCourses, submitCourse } from '../../services/instructorService';
import { getCourseById, updateCourse, addSection as addSectionAPI, updateSection as updateSectionAPI, deleteSection as deleteSectionAPI, addLessonToSection, updateLessonInSection, deleteLessonFromSection } from '../../services/courseService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
import VideoUpload from '../../components/instructor/VideoUpload';

// ── Create Module Modal ───────────────────────────────────────────────────────
const CreateModuleModal = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({ title: initialData?.title || '', description: initialData?.description || '' });

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

// ── Create Lesson Modal ───────────────────────────────────────────────────────
const CreateLessonModal = ({ onClose, onSave, courseId }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl animate-scale-in">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <VideoUpload
            courseId={courseId}
            onUploadSuccess={(video) => {
              onSave({
                title: video.title,
                description: video.description || '',
                videoUrl: video.videoUrl,
                duration: video.duration || 0,
                isFree: false,
                source: video.source
              });
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ── Edit Lesson Modal ────────────────────────────────────────────────────────
const EditLessonModal = ({ lesson, onClose, onSave }) => {
  const [formData, setFormData] = useState({ 
    title: lesson.title, 
    description: lesson.description || '',
    isFree: lesson.isFree || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Title is required');
    onSave({ ...lesson, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl animate-scale-in overflow-hidden">
        <div className="flex items-center justify-between p-8 pb-6 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Edit Lesson</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Lesson Title</label>
            <input
              autoFocus
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all font-medium resize-none"
            />
          </div>

          <div className="flex items-center gap-4 px-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={formData.isFree}
                onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                className="w-5 h-5 rounded-lg border-slate-200 text-purple-600 focus:ring-purple-500 transition-all"
              />
              <span className="text-sm font-bold text-slate-600 group-hover:text-purple-600 transition-colors">Available as Free Preview</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Lesson Preview Modal ──────────────────────────────────────────────────────
const LessonPreviewModal = ({ lesson, onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10">
      <div className="w-full max-w-5xl aspect-video relative bg-black rounded-[32px] overflow-hidden shadow-2xl border border-white/10">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="absolute top-6 left-8 z-10">
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Previewing Lesson</p>
          <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
        </div>

        {lesson.videoUrl ? (
          <video 
            src={lesson.videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
            <p className="font-bold">No video URL found for this lesson</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Content Tab ───────────────────────────────────────────────────────────────
const ContentTab = ({ modules = [], courseId, onCourseUpdate }) => {
  const [selectedModule, setSelectedModule] = useState(0);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [previewingLesson, setPreviewingLesson] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddModule = async (newMod) => {
    setSaving(true);
    try {
      const res = await addSectionAPI(courseId, newMod);
      onCourseUpdate(res.course);
      setSelectedModule(res.course.modules.length - 1);
      toast.success('Section saved ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add section');
    } finally {
      setSaving(false);
    }
  };

  const handleEditModule = async (data) => {
    setSaving(true);
    try {
      const sectionId = modules[editingSection]._id;
      const res = await updateSectionAPI(courseId, sectionId, data);
      onCourseUpdate(res.course);
      setEditingSection(null);
      toast.success('Section updated ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (index) => {
    if (!window.confirm('Delete this section and all its lessons? This cannot be undone.')) return;
    setSaving(true);
    try {
      const sectionId = modules[index]._id;
      const res = await deleteSectionAPI(courseId, sectionId);
      onCourseUpdate(res.course);
      if (selectedModule >= res.course.modules.length) {
        setSelectedModule(Math.max(0, res.course.modules.length - 1));
      }
      toast.success('Section deleted ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete section');
    } finally {
      setSaving(false);
    }
  };

  const handleAddLesson = async (newLesson) => {
    setSaving(true);
    try {
      const sectionId = modules[selectedModule]._id;
      const res = await addLessonToSection(courseId, sectionId, newLesson);
      onCourseUpdate(res.course);
      toast.success('Lesson saved ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLesson = async (updatedLesson) => {
    setSaving(true);
    try {
      const sectionId = modules[selectedModule]._id;
      const lessonId = editingLesson.lesson._id;
      const res = await updateLessonInSection(courseId, sectionId, lessonId, updatedLesson);
      onCourseUpdate(res.course);
      setEditingLesson(null);
      toast.success('Lesson updated ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (index) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    setSaving(true);
    try {
      const sectionId = modules[selectedModule]._id;
      const lessonId = modules[selectedModule].lessons[index]._id;
      const res = await deleteLessonFromSection(courseId, sectionId, lessonId);
      onCourseUpdate(res.course);
      toast.success('Lesson deleted ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lesson');
    } finally {
      setSaving(false);
    }
  };

  // Clamp selectedModule to valid range
  const safeIdx = Math.min(selectedModule, Math.max(modules.length - 1, 0));

  return (
    <>
      {showModuleModal && (
        <CreateModuleModal
          onClose={() => setShowModuleModal(false)}
          onSave={handleAddModule}
        />
      )}
      {editingSection !== null && modules[editingSection] && (
        <CreateModuleModal
          initialData={modules[editingSection]}
          onClose={() => setEditingSection(null)}
          onSave={handleEditModule}
        />
      )}
      {showLessonModal && (
        <CreateLessonModal
          onClose={() => setShowLessonModal(false)}
          onSave={handleAddLesson}
          courseId={courseId}
        />
      )}
      {editingLesson && (
        <EditLessonModal
          lesson={editingLesson.lesson}
          onClose={() => setEditingLesson(null)}
          onSave={handleUpdateLesson}
        />
      )}
      {previewingLesson && (
        <LessonPreviewModal
          lesson={previewingLesson}
          onClose={() => setPreviewingLesson(null)}
        />
      )}

      {/* Saving indicator */}
      {saving && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-2xl animate-fade-in">
          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
        </div>
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
                key={mod._id || i}
                onClick={() => setSelectedModule(i)}
                className={`w-full text-left p-5 rounded-[24px] border transition-all duration-300 ${safeIdx === i
                    ? 'border-purple-200 bg-white shadow-xl shadow-purple-500/5 border-l-4 border-l-purple-600'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${safeIdx === i ? 'text-purple-600' : 'text-slate-400'}`}>
                    Section {i + 1}
                  </span>
                  <GripVertical className="w-4 h-4 text-slate-300" />
                </div>
                <h4 className="font-bold text-slate-800 leading-snug mb-3">{mod.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-md">
                    {mod.lessons?.length || 0} Lessons
                  </span>
                </div>
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
            disabled={saving}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[24px] text-xs font-bold text-slate-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add New Section
          </button>
        </div>

        {/* Right — Module detail */}
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px] p-10">
          {modules.length > 0 && modules[safeIdx] ? (
            <div className="w-full text-left">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Managing Curriculum</span>
                  <h3 className="text-2xl font-bold text-slate-900">{modules[safeIdx].title}</h3>
                  {modules[safeIdx].description && (
                    <p className="text-sm text-slate-500 mt-1">{modules[safeIdx].description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingSection(safeIdx)}
                    disabled={saving}
                    className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 disabled:opacity-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(safeIdx)}
                    disabled={saving}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lessons List */}
              <div className="space-y-3 mb-8">
                {modules[safeIdx].lessons?.length > 0 ? (
                  modules[safeIdx].lessons.map((lesson, idx) => (
                    <div key={lesson._id || idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-slate-200 transition-all">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <button 
                          onClick={() => setPreviewingLesson(lesson)}
                          className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 transition-all shrink-0 active:scale-95"
                        >
                          <PlayCircle className="w-5 h-5" />
                        </button>
                        <div className="overflow-hidden">
                          <h5 className="text-sm font-bold text-slate-700 truncate">{lesson.title}</h5>
                          {lesson.description && (
                            <p className="text-[11px] text-slate-400 truncate max-w-[300px] font-medium mb-1">{lesson.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            <span>{lesson.duration} mins</span>
                            {lesson.isFree && <span className="text-emerald-500">Free Preview</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setEditingLesson({ lesson, index: idx })}
                          className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteLesson(idx)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 border-2 border-dashed border-slate-100 rounded-[32px] text-center">
                    <PlayCircle className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                    <p className="text-sm text-slate-500 font-medium">No lessons in this section yet</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowLessonModal(true)}
                disabled={saving}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" /> Add Lesson to Section
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <PlayCircle className="w-16 h-16 text-slate-100 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Build your curriculum</h3>
              <p className="text-sm text-slate-500 max-w-xs">Start by adding your first section and uploading your lessons to get started.</p>
              <button
                onClick={() => setShowModuleModal(true)}
                disabled={saving}
                className="mt-8 flex items-center gap-2 px-8 py-3.5 bg-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" /> Add First Section
              </button>
            </div>
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
  const { user } = useAuth();
  const navigate = useNavigate();
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
      console.log(`[COURSE_DETAIL] Fetching course with ID: ${id}`);
      const data = await getCourseById(id);
      console.log(`[COURSE_DETAIL] Received data:`, data);
      
      if (data) {
        setCourse(data);
      } else {
        console.error('[COURSE_DETAIL] No course data received');
        toast.error('Course data is empty');
      }
    } catch (error) {
      console.error('[COURSE_DETAIL] Fetch error:', error);
      toast.error('Failed to fetch course details');
      navigate('/instructor/my-courses');
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

  const handleCourseUpdate = (updatedCourse) => {
    setCourse(updatedCourse);
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
                className={`px-6 py-2.5 rounded-xl text-[10px] font-extrabold transition-all duration-300 uppercase tracking-widest flex items-center gap-2 ${(course.status || 'draft') === status
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

          {(user?.role === 'admin' || (course.instructor?._id || course.instructor) === (user?.id || user?._id)) && (
            <button
              onClick={() => navigate(`/instructor/edit-course/${id}`)}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-2xl transition-all active:scale-95 group"
            >
              <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Edit Info
            </button>
          )}

          <div className="flex items-center gap-2.5 px-6 py-3.5 bg-emerald-50 text-emerald-700 font-bold rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            Auto-saved
          </div>
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
            className={`px-8 py-3 rounded-full text-xs font-bold transition-all duration-300 border-2 whitespace-nowrap ${activeTab === tab
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
        {activeTab === 'Content' && <ContentTab modules={course.modules} courseId={id} onCourseUpdate={handleCourseUpdate} />}
        {activeTab === 'Tests' && <TestsTab />}
        {activeTab === 'Coupons' && <CouponsTab />}
      </div>
    </div>
  );
};

export default CourseDetail;
