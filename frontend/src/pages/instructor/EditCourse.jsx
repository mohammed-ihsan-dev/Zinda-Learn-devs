import { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  Video, 
  FileText, 
  Image as ImageIcon,
  ChevronDown,
  Clock,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { getCourseById, updateCourse } from '../../services/courseService';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const EditCourse = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'development',
    level: 'Beginner',
    price: 99,
    thumbnail: '',
    currency: 'INR',
    isFree: false,
    discountPrice: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const data = await getCourseById(id);
      const course = data.course;
      
      // Authorization check (frontend)
      const userId = user.id || user._id;
      const instructorId = course.instructor._id || course.instructor;

      if (user.role !== 'admin' && instructorId !== userId) {
        toast.error('Not authorized to edit this course');
        navigate('/instructor/my-courses');
        return;
      }

      setFormData({
        title: course.title || '',
        description: course.description || '',
        shortDescription: course.shortDescription || '',
        category: course.category || 'development',
        level: course.level || 'Beginner',
        price: course.price || 0,
        thumbnail: course.thumbnail || '',
        currency: course.currency || 'INR',
        isFree: course.isFree || false,
        discountPrice: course.discountPrice || 0
      });
    } catch (error) {
      toast.error('Failed to fetch course details');
      navigate('/instructor/my-courses');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return toast.error('Please fix the errors in the form');
    }

    try {
      setSaving(true);
      await updateCourse(id, {
        ...formData,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice || 0),
        category: formData.category.toLowerCase()
      });
      toast.success('Course updated successfully!');
      navigate(`/instructor/courses/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-10">
        <Link to={`/instructor/courses/${id}`} className="flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors text-xs font-bold uppercase tracking-widest mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Course Detail
        </Link>
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Edit Course</h1>
        <p className="text-slate-500 text-base">
          Update your course details and maintain your learning experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        
        {/* Course Essentials */}
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Course Essentials</h2>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Course Title *</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Advanced Editorial Design for Digital Media" 
                className={`w-full bg-slate-50/50 border ${errors.title ? 'border-red-500' : 'border-slate-100'} rounded-[18px] px-6 py-4 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-2 font-medium">{errors.title}</p>}
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Full Description *</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Comprehensive details about what students will learn..." 
                rows="5"
                className={`w-full bg-slate-50/50 border ${errors.description ? 'border-red-500' : 'border-slate-100'} rounded-[18px] px-6 py-4 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner resize-y`}
              ></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-2 font-medium">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Short Description</label>
              <textarea 
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="A brief hook that summarizes your course in 2 sentences..." 
                rows="3"
                className="w-full bg-slate-50/50 border border-slate-100 rounded-[18px] px-6 py-4 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Category *</label>
                <div className="relative">
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full bg-slate-50/50 border ${errors.category ? 'border-red-500' : 'border-slate-100'} rounded-[18px] px-6 py-4 text-sm appearance-none focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner`}
                  >
                    <option value="development">Development</option>
                    <option value="business">Business</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="it">IT</option>
                    <option value="finance">Finance</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {errors.category && <p className="text-red-500 text-xs mt-2 font-medium">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Difficulty Level</label>
                <div className="flex bg-slate-50 p-1.5 rounded-[18px] border border-slate-100 shadow-inner overflow-x-auto">
                  {['Beginner', 'Intermediate', 'Expert', 'All Levels'].map((l) => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => setFormData(prev => ({ ...prev, level: l }))}
                      className={`flex-1 py-2.5 text-[11px] font-bold rounded-xl transition-all duration-300 ${
                        formData.level === l 
                          ? 'bg-white text-purple-600 shadow-lg' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media & Branding */}
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Media & Branding</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Course Thumbnail URL</label>
              <input 
                type="text" 
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="Paste image URL here..." 
                className="w-full bg-slate-50/50 border border-slate-100 rounded-[18px] px-6 py-4 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner mb-4"
              />
              <div className="group border-2 border-dashed border-slate-100 rounded-[28px] h-32 flex flex-col items-center justify-center text-center p-4 hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer relative overflow-hidden">
                <UploadCloud className="w-6 h-6 text-slate-300 mb-2" />
                <p className="text-[10px] text-slate-400 font-medium tracking-tight">Direct upload coming soon</p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Promo Video (Coming Soon)</label>
              <div className="relative h-52 bg-slate-100 rounded-[28px] overflow-hidden flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200">
                <Video className="w-10 h-10 text-slate-200 mb-4" />
                <p className="text-xs font-bold text-slate-400">Video preview management coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Access */}
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">₹</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Pricing & Access</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Currency</label>
              <div className="relative">
                <select 
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-[18px] px-6 py-4 text-sm appearance-none focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner"
                >
                  <option value="INR">INR (₹)</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Price Amount</label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-100 rounded-[18px] px-6 py-4 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Discount Price</label>
              <input 
                type="number" 
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full bg-slate-50/50 border border-slate-100 rounded-[18px] px-6 py-4 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 rounded-[18px] px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors shadow-inner">
                <input 
                  type="checkbox" 
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-lg border-slate-200 text-purple-600 focus:ring-purple-500 transition-all" 
                />
                <span className="text-sm font-bold text-slate-700">Free Course</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-10 gap-6 border-t border-slate-100">
          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 bg-slate-50 px-5 py-2.5 rounded-xl">
            <Clock className="w-4 h-4" />
            Last updated just now
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              type="button"
              onClick={() => navigate(`/instructor/courses/${id}`)}
              className="flex-1 sm:flex-none px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none px-12 py-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Saving Changes...' : 'Update Course'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditCourse;
