import { useState, useEffect } from 'react';
import { getInstructorCourses } from '../../services/instructorService';
import { BookOpen, Users, CheckCircle, Clock3, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getInstructorCourses();
      setCourses(data.courses);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Published</span>;
      case 'pending':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock3 className="w-3 h-3" /> Pending</span>;
      case 'rejected':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-700">Draft</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">My Courses</h2>
        <p className="text-surface-500">Manage and track the status of your courses</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-surface-300 p-12 text-center">
            <BookOpen className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">You haven't created any courses yet.</p>
            <Link
              to="/instructor/create-course"
              className="mt-4 inline-block text-primary-600 font-semibold hover:underline"
            >
              Create your first course
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-50 border-b border-surface-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-surface-900">{course.title}</p>
                        <p className="text-xs text-surface-500">{course.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(course.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-surface-600">
                        <Users className="w-4 h-4" />
                        {course.totalStudents || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-500">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-500 text-right">
                      {/* Placeholder for Edit/Delete buttons */}
                      <button className="text-primary-600 hover:text-primary-700 font-medium mr-3">Edit</button>
                      <button className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
