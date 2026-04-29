import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, MoreVertical, Eye, Edit2, Ban, RefreshCw, Loader2, Trash2, CheckCircle, X, RotateCcw } from 'lucide-react';
import { getAllUsers, createUser, updateUser, deleteUser, blockUser, unblockUser, approveInstructor, restoreUser } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('All Users');
  const [activeUsers, setActiveUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection state
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', role: 'student', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [activeRes, deletedRes] = await Promise.all([
        getAllUsers(false),
        getAllUsers(true)
      ]);
      
      if (activeRes?.data) setActiveUsers(activeRes.data);
      if (deletedRes?.data) setDeletedUsers(deletedRes.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  const handleSelectAll = (filtered) => {
    if (selectedUsers.length === filtered.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filtered.map(u => u._id));
    }
  };

  const handleToggleBlock = async (id, isBlocked) => {
    try {
      if (isBlocked) {
        await unblockUser(id);
        toast.success('User unblocked successfully');
      } else {
        await blockUser(id);
        toast.success('User blocked successfully');
      }
      setActiveUsers(activeUsers.map(u => u._id === id ? { ...u, isBlocked: !isBlocked } : u));
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to move this user to trash?')) return;
    try {
      await deleteUser(id);
      toast.success('User moved to trash');
      
      const userToDelete = activeUsers.find(u => u._id === id);
      if (userToDelete) {
        setActiveUsers(activeUsers.filter(u => u._id !== id));
        setDeletedUsers([{ ...userToDelete, deletedAt: new Date() }, ...deletedUsers]);
      }
      setSelectedUsers(prev => prev.filter(uid => uid !== id));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreUser(id);
      toast.success('User restored successfully');
      
      const userToRestore = deletedUsers.find(u => u._id === id);
      if (userToRestore) {
        setDeletedUsers(deletedUsers.filter(u => u._id !== id));
        setActiveUsers([{ ...userToRestore, deletedAt: null }, ...activeUsers]);
      }
    } catch (error) {
      toast.error('Failed to restore user');
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveInstructor(id);
      toast.success('Instructor approved');
      setActiveUsers(activeUsers.map(u => u._id === id ? { ...u, isApproved: true } : u));
    } catch (error) {
      toast.error('Failed to approve instructor');
    }
  };

  const handleBulkBlock = async () => {
    if (selectedUsers.length === 0) return;
    if (!window.confirm(`Are you sure you want to block ${selectedUsers.length} users?`)) return;
    
    try {
      for (const id of selectedUsers) {
        await blockUser(id);
      }
      toast.success('Bulk block successful');
      setActiveUsers(activeUsers.map(u => selectedUsers.includes(u._id) ? { ...u, isBlocked: true } : u));
      setSelectedUsers([]);
    } catch (error) {
      toast.error('Failed during bulk block operation');
      fetchAllData(); 
    }
  };

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (type === 'edit' && user) {
      setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      setFormData({ name: '', email: '', role: 'student', password: '' });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalType === 'create') {
        const res = await createUser(formData);
        toast.success('User created successfully');
        setActiveUsers([res.data, ...activeUsers]);
      } else if (modalType === 'edit') {
        const updateData = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password) updateData.password = formData.password;
        const res = await updateUser(selectedUser._id, updateData);
        toast.success('User updated successfully');
        setActiveUsers(activeUsers.map(u => u._id === selectedUser._id ? res.data : u));
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentList = activeTab === 'Deleted Users' ? deletedUsers : activeUsers;

  const filteredUsers = currentList.filter((user) => {
    if (activeTab === 'All Users' || activeTab === 'Deleted Users') return true;
    if (activeTab === 'Students') return user.role === 'student';
    if (activeTab === 'Tutors') return user.role === 'instructor';
    if (activeTab === 'Admins') return user.role === 'admin';
    return true;
  });

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Manage your global user community, monitor activity, and handle administrative permissions with surgical precision.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 bg-[#1c1c21] p-1 rounded-full border border-[#27272a] overflow-x-auto max-w-full">
          {['All Users', 'Students', 'Tutors', 'Admins', 'Deleted Users'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedUsers([]); }}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
          <button onClick={() => openModal('create')} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
            <Plus className="w-4 h-4" />
            Create User
          </button>
        </div>
      </div>

      {/* Bulk actions bar */}
      <div className="bg-[#1c1c21] border border-[#27272a] rounded-t-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input 
            type="checkbox" 
            checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length} 
            onChange={() => handleSelectAll(filteredUsers)}
            className="w-4 h-4 rounded border-[#3f3f46] bg-[#0a0a0b] text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer" 
          />
          <span className="text-sm font-bold text-white">{selectedUsers.length} Users Selected</span>
        </div>
        <div className="flex items-center gap-6">
          {selectedUsers.length > 0 && activeTab !== 'Deleted Users' && (
            <button onClick={handleBulkBlock} className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors">Bulk Block</button>
          )}
          <button className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1c1c21] border-x border-b border-[#27272a] rounded-b-xl overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272a]">
              <th className="p-4 w-12"></th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">USER IDENTITY</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">EMAIL ADDRESS</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ROLE</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ACCOUNT STATUS</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]/50">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-16 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto" />
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-16 text-center text-zinc-500 text-sm">
                  {activeTab === 'Deleted Users' ? 'Trash is empty.' : 'No users found matching the criteria.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-[#25252b] transition-colors group">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleToggleSelect(user._id)}
                      className="w-4 h-4 rounded border-[#3f3f46] bg-[#0a0a0b] text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer" 
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3f3f46&color=fff`} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-[#3f3f46] grayscale" />
                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          {user.name} 
                          {user.role === 'instructor' && !user.isApproved && activeTab !== 'Deleted Users' && (
                            <span className="bg-yellow-500/20 text-yellow-500 text-[9px] px-1.5 py-0.5 rounded border border-yellow-500/30">PENDING</span>
                          )}
                          {activeTab === 'Deleted Users' && (
                            <span className="bg-red-500/20 text-red-500 text-[9px] px-1.5 py-0.5 rounded border border-red-500/30">DELETED</span>
                          )}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          {activeTab === 'Deleted Users' && user.deletedAt 
                            ? `Deleted ${new Date(user.deletedAt).toLocaleDateString()}` 
                            : `Joined ${new Date(user.createdAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-zinc-300">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'student' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      user.role === 'instructor' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                    }`}>
                      {user.role === 'instructor' ? 'tutor' : user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {activeTab === 'Deleted Users' ? (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shadow-[0_0_5px_rgba(113,113,122,0.5)]"></div>
                          <span className="text-xs font-bold text-zinc-500">In Trash</span>
                        </>
                      ) : (
                        <>
                          <div className={`w-1.5 h-1.5 rounded-full ${!user.isBlocked ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`}></div>
                          <span className="text-xs font-bold text-zinc-300">{!user.isBlocked ? 'Active' : 'Blocked'}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {activeTab === 'Deleted Users' ? (
                        <>
                          <button onClick={() => openModal('view', user)} className="hover:text-purple-400 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleRestore(user._id)} className="hover:text-emerald-400 transition-colors ml-1" title="Restore User"><RotateCcw className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <>
                          {user.role === 'instructor' && !user.isApproved && (
                            <button onClick={() => handleApprove(user._id)} className="hover:text-emerald-400 transition-colors" title="Approve Tutor"><CheckCircle className="w-4 h-4" /></button>
                          )}
                          <button onClick={() => openModal('view', user)} className="hover:text-purple-400 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => openModal('edit', user)} className="hover:text-blue-400 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          {!user.isBlocked ? (
                            <button onClick={() => handleToggleBlock(user._id, false)} className="hover:text-red-400 transition-colors" title="Block User"><Ban className="w-4 h-4" /></button>
                          ) : (
                            <button onClick={() => handleToggleBlock(user._id, true)} className="hover:text-emerald-400 transition-colors" title="Unblock User"><RefreshCw className="w-4 h-4" /></button>
                          )}
                          <button onClick={() => handleDelete(user._id)} className="hover:text-red-500 transition-colors ml-1" title="Move to Trash"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Showing {filteredUsers.length} users</p>
      </div>

      {/* Modal for Create/Edit/View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b border-[#27272a]">
              <h2 className="text-xl font-bold text-white">
                {modalType === 'create' ? 'Create New User' : modalType === 'edit' ? 'Edit User' : 'User Details'}
              </h2>
            </div>
            
            <div className="p-6">
              {modalType === 'view' && selectedUser ? (
                <div className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <img src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.name}&background=3f3f46&color=fff`} alt={selectedUser.name} className="w-24 h-24 rounded-full border-2 border-purple-500/30 object-cover" />
                  </div>
                  <div><span className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Name</span><p className="text-white text-sm font-medium">{selectedUser.name}</p></div>
                  <div><span className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Email</span><p className="text-white text-sm font-medium">{selectedUser.email}</p></div>
                  <div><span className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Role</span><p className="text-white text-sm font-medium capitalize">{selectedUser.role}</p></div>
                  <div><span className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Status</span><p className="text-white text-sm font-medium">{selectedUser.isBlocked ? 'Blocked' : 'Active'}</p></div>
                  <div><span className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Joined</span><p className="text-white text-sm font-medium">{new Date(selectedUser.createdAt).toLocaleString()}</p></div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#121212] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#121212] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Role</label>
                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#121212] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none">
                      <option value="student">Student</option>
                      <option value="instructor">Tutor (Instructor)</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password {modalType === 'edit' && '(Leave blank to keep current)'}</label>
                    <input required={modalType === 'create'} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-[#121212] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder={modalType === 'create' ? "Secure password" : "New password (optional)"} />
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-[#27272a] hover:bg-[#3f3f46] text-white text-sm font-bold rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {modalType === 'create' ? 'Create User' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
