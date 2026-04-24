import { useState, useEffect } from 'react';
import { getPendingCourses, approveCourse, rejectCourse } from '../../services/adminService';
import { Check, X, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CourseApproval = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await getPendingCourses();
      setCourses(data || []);
    } catch (error) {
      toast.error('Failed to fetch pending courses');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveCourse(id);
      toast.success('Course approved!');
      fetchCourses();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCourse(id);
      toast.success('Course rejected');
      fetchCourses();
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Course Approvals</h2>
        <p className="text-surface-500">Review courses submitted by instructors</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No pending courses to review.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-50 border-b border-surface-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase">Course Info</th>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase">Instructor</th>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase">Submitted On</th>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-surface-50 transition-colors bg-yellow-50/10">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-semibold text-surface-900">{course.title}</p>
                            <p className="text-xs text-surface-500">{course.category} • ${course.price}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-surface-700 font-medium">
                          {course.instructor?.name || 'Unknown'}
                        </div>
                        <p className="text-[10px] text-surface-500">{course.instructor?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-600">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(course._id)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(course._id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseApproval;
