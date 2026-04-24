import { useState } from 'react';
import { createCourse } from '../../services/instructorService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: 0,
    category: 'Web Development',
    level: 'Beginner'
  });

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const coursePayload = {
        ...formData,
        status: 'pending',
        isPublished: false,
        isApproved: false
      };
      await createCourse(coursePayload);
      toast.success('Course created and sent for review!');
      navigate('/instructor/my-courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Create New Course</h2>
        <p className="text-surface-500">Fill in the details to submit a new course for review.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6 lg:p-8">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700">Course Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="e.g. Mastering React"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700">Short Description</label>
            <input
              required
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Brief summary of the course"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700">Full Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Detailed course content"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700">Price ($)</label>
              <input
                required
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option>Web Development</option>
                <option>Mobile Development</option>
                <option>Data Science</option>
                <option>UI/UX Design</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700">Level</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>All Levels</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 gradient-primary text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all hover:scale-[1.02]"
          >
            Submit Course for Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
