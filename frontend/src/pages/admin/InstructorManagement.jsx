import { useState, useEffect } from 'react';
import { getPendingInstructors, approveInstructor, rejectInstructor } from '../../services/adminService';
import { Check, X, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingInstructors();
  }, []);

  const fetchPendingInstructors = async () => {
    try {
      const { data } = await getPendingInstructors();
      setInstructors(data || []);
    } catch (error) {
      toast.error('Failed to fetch instructor requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveInstructor(id);
      toast.success('Instructor approved!');
      fetchPendingInstructors();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectInstructor(id);
      toast.success('Instructor rejected');
      fetchPendingInstructors();
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Instructor Requests</h2>
        <p className="text-surface-500">Review users who requested to become instructors</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : instructors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
            <UserCheck className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No pending instructor requests.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-50 border-b border-surface-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase">Applicant</th>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase">Email</th>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase">Applied On</th>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {instructors.map((instructor) => (
                    <tr key={instructor._id} className="hover:bg-surface-50 transition-colors bg-blue-50/10">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {instructor.name?.charAt(0) || 'I'}
                          </div>
                          <p className="font-semibold text-surface-900">{instructor.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-600">
                        {instructor.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-600">
                        {new Date(instructor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(instructor._id)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(instructor._id)}
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

export default InstructorManagement;
