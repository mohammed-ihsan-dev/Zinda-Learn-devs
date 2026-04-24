import { useState, useEffect } from 'react';
import { getInstructorCourses } from '../../services/instructorService';
import { Users } from 'lucide-react';

const Students = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getInstructorCourses();
      setCourses(data.courses || []);
    } catch (error) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Students</h2>
        <p className="text-surface-500">View student enrollments across your courses</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-50 border-b border-surface-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase tracking-wider text-right">Enrolled Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center text-surface-500">
                    No courses available yet.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-surface-900">{course.title}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        <Users className="w-4 h-4" />
                        {course.totalStudents || 0}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;
