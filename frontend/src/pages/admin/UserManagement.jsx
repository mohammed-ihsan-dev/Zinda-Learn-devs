import { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/adminService';
import { Shield, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers();
      setUsers(data || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Admin</span>;
      case 'instructor':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Instructor</span>;
      default:
        return <span className="px-2 py-1 bg-surface-100 text-surface-700 rounded-full text-xs font-bold uppercase">User</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">User Management</h2>
        <p className="text-surface-500">View and manage all registered users on the platform</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
            <UserIcon className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No users found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-50 border-b border-surface-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase">User</th>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase">Role</th>
                    <th className="px-6 py-4 text-sm font-bold text-surface-700 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-surface-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center text-surface-600 font-bold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-surface-900">{user.name}</p>
                            <p className="text-xs text-surface-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-600">
                        {new Date(user.createdAt).toLocaleDateString()}
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

export default UserManagement;
