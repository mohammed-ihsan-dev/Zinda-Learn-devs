import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Video, 
  Calendar, 
  Clock, 
  Link as LinkIcon, 
  FileText, 
  BookOpen,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import liveClassService from '../services/liveClassService';
import { getInstructorCourses } from '../../../services/instructorService';

const EditLiveClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    meetingLink: '',
    scheduledDate: '',
    startTime: '',
    duration: 60,
    thumbnail: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setFetching(true);
      const [coursesRes, classRes] = await Promise.all([
        getInstructorCourses(),
        liveClassService.getLiveClassById(id)
      ]);

      setCourses(coursesRes.courses || []);
      
      if (classRes.success) {
        const liveClass = classRes.data;
        setFormData({
          title: liveClass.title,
          description: liveClass.description,
          courseId: liveClass.course?._id || liveClass.course,
          meetingLink: liveClass.meetingLink,
          scheduledDate: new Date(liveClass.scheduledDate).toISOString().split('T')[0],
          startTime: liveClass.startTime,
          duration: liveClass.duration,
          thumbnail: liveClass.thumbnail || ''
        });
      }
    } catch (error) {
      toast.error('Failed to fetch class details');
      navigate('/instructor/live-classes');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const response = await liveClassService.updateLiveClass(id, formData);
      if (response.success) {
        toast.success('Live class updated successfully!');
        navigate('/instructor/live-classes');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update live class');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
        <div className="p-8 bg-indigo-600">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Video size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Live Class</h1>
              <p className="text-indigo-100">Update the details of your interactive session</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText size={16} /> Class Title *
              </label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Weekly Q&A Session - Week 1"
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <BookOpen size={16} /> Select Course *
              </label>
              <select 
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              >
                <option value="">Choose a course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.title}</option>
                ))}
              </select>
            </div>

            {/* Meeting Link */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <LinkIcon size={16} /> Meeting Link (Zoom/GMeet) *
              </label>
              <input 
                type="url"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar size={16} /> Scheduled Date *
              </label>
              <input 
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Clock size={16} /> Start Time *
              </label>
              <input 
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Clock size={16} /> Duration (minutes) *
              </label>
              <input 
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <ImageIcon size={16} /> Thumbnail URL (Optional)
              </label>
              <input 
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://image-url.com/..."
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText size={16} /> Description *
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What will students learn in this session?"
                rows="4"
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-8 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={18} />
                  Update Class
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLiveClass;
