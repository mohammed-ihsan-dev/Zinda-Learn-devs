import React, { useState } from 'react';
import {
  User,
  Lock,
  CreditCard,
  Bell,
  Shield,
  Trash2,
  Camera,
  Save,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Mail,
  Phone,
  Building2,
  Smartphone
} from 'lucide-react';
import { 
  FaGithub as Github, 
  FaLinkedin as Linkedin, 
  FaTwitter as Twitter 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { updateSettings } from '../../services/instructorDashboardService';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    socialLinks: {
      website: user?.socialLinks?.website || '',
      linkedin: user?.socialLinks?.linkedin || '',
      twitter: user?.socialLinks?.twitter || '',
      github: user?.socialLinks?.github || ''
    },
    paymentDetails: {
      bank: {
        accountNumber: user?.paymentDetails?.bank?.accountNumber || '',
        ifscCode: user?.paymentDetails?.bank?.ifscCode || '',
        bankName: user?.paymentDetails?.bank?.bankName || '',
        accountHolderName: user?.paymentDetails?.bank?.accountHolderName || ''
      },
      upi: {
        upiId: user?.paymentDetails?.upi?.upiId || ''
      }
    },
    notificationPreferences: {
      emailNotifications: user?.notificationPreferences?.emailNotifications ?? true,
      newEnrollments: user?.notificationPreferences?.newEnrollments ?? true,
      newReviews: user?.notificationPreferences?.newReviews ?? true,
      payoutUpdates: user?.notificationPreferences?.payoutUpdates ?? true
    }
  });

  const handleInputChange = (path, value) => {
    const keys = path.split('.');
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [keys[0]]: value }));
    } else if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value }
      }));
    } else if (keys.length === 3) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: { ...prev[keys[0]][keys[1]], [keys[2]]: value }
        }
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateSettings(formData);
      if (res.success) {
        toast.success(res.message);
        updateUser(res.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-sm text-slate-500">Manage your profile, security, and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Navigation Tabs */}
        <div className="w-full lg:w-64 bg-white p-3 rounded-3xl border border-slate-100 shadow-sm flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                  : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <form onSubmit={handleSave} className="p-8 lg:p-10">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <img
                      src={user?.profilePic || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                      alt={user?.name}
                      className="w-32 h-32 rounded-[2rem] object-cover ring-8 ring-slate-50 group-hover:opacity-80 transition-all shadow-xl"
                    />
                    <button type="button" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white">
                      <Camera className="w-8 h-8" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{user?.role?.toUpperCase()} ACCOUNT</p>
                    <button type="button" className="px-5 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    icon={User}
                  />
                  <Input
                    label="Email Address"
                    value={formData.email}
                    onChange={() => { }} // Read-only for now
                    icon={Mail}
                    disabled
                  />
                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    icon={Phone}
                  />
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Instructor Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={e => handleInputChange('bio', e.target.value)}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 h-32 resize-none"
                      placeholder="Tell students about yourself..."
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest">Social Presence</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Website"
                      value={formData.socialLinks.website}
                      onChange={e => handleInputChange('socialLinks.website', e.target.value)}
                      icon={Globe}
                    />
                    <Input
                      label="LinkedIn"
                      value={formData.socialLinks.linkedin}
                      onChange={e => handleInputChange('socialLinks.linkedin', e.target.value)}
                      icon={Linkedin}
                    />
                    <Input
                      label="Twitter"
                      value={formData.socialLinks.twitter}
                      onChange={e => handleInputChange('socialLinks.twitter', e.target.value)}
                      icon={Twitter}
                    />
                    <Input
                      label="Github"
                      value={formData.socialLinks.github}
                      onChange={e => handleInputChange('socialLinks.github', e.target.value)}
                      icon={Github}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
                  <Shield className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-900">Security Recommendation</h4>
                    <p className="text-sm text-amber-700 mt-1">Enhance your account security by enabling Two-Factor Authentication or changing your password regularly.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 max-w-lg">
                  <Input label="Current Password" type="password" value="" onChange={() => { }} icon={Lock} />
                  <Input label="New Password" type="password" value="" onChange={() => { }} icon={Lock} />
                  <Input label="Confirm New Password" type="password" value="" onChange={() => { }} icon={Lock} />
                </div>

                <div className="pt-10 border-t border-slate-50">
                  <h4 className="text-sm font-bold text-red-600 mb-6 uppercase tracking-widest">Danger Zone</h4>
                  <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h5 className="font-bold text-red-900">Delete Account</h5>
                      <p className="text-sm text-red-700">Once deleted, you will lose all access to your courses and earnings. This action is permanent.</p>
                    </div>
                    <button type="button" className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all active:scale-95 whitespace-nowrap">
                      Request Deletion
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-10">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary-600" />
                    Bank Account Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Account Holder Name"
                      value={formData.paymentDetails.bank.accountHolderName}
                      onChange={e => handleInputChange('paymentDetails.bank.accountHolderName', e.target.value)}
                      icon={User}
                    />
                    <Input
                      label="Bank Name"
                      value={formData.paymentDetails.bank.bankName}
                      onChange={e => handleInputChange('paymentDetails.bank.bankName', e.target.value)}
                      icon={Building2}
                    />
                    <Input
                      label="Account Number"
                      value={formData.paymentDetails.bank.accountNumber}
                      onChange={e => handleInputChange('paymentDetails.bank.accountNumber', e.target.value)}
                      icon={CreditCard}
                    />
                    <Input
                      label="IFSC Code"
                      value={formData.paymentDetails.bank.ifscCode}
                      onChange={e => handleInputChange('paymentDetails.bank.ifscCode', e.target.value)}
                      icon={Globe}
                    />
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-50">
                  <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-primary-600" />
                    UPI Details
                  </h4>
                  <div className="max-w-md">
                    <Input
                      label="UPI ID"
                      placeholder="username@bank"
                      value={formData.paymentDetails.upi.upiId}
                      onChange={e => handleInputChange('paymentDetails.upi.upiId', e.target.value)}
                      icon={Smartphone}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest">Email Notifications</h4>
                <div className="space-y-3">
                  <Toggle
                    label="Course Enrollments"
                    description="Get notified whenever a student enrolls in your course"
                    checked={formData.notificationPreferences.newEnrollments}
                    onChange={v => handleInputChange('notificationPreferences.newEnrollments', v)}
                  />
                  <Toggle
                    label="New Reviews"
                    description="Receive an email when students leave feedback"
                    checked={formData.notificationPreferences.newReviews}
                    onChange={v => handleInputChange('notificationPreferences.newReviews', v)}
                  />
                  <Toggle
                    label="Payout Updates"
                    description="Stay informed about your withdrawal status"
                    checked={formData.notificationPreferences.payoutUpdates}
                    onChange={v => handleInputChange('notificationPreferences.payoutUpdates', v)}
                  />
                  <Toggle
                    label="General Platform Updates"
                    description="Important announcements and feature updates"
                    checked={formData.notificationPreferences.emailNotifications}
                    onChange={v => handleInputChange('notificationPreferences.emailNotifications', v)}
                  />
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-black rounded-2xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save All Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        {...props}
        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 transition-all font-bold text-slate-700 disabled:opacity-50"
      />
    </div>
  </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary-100 transition-all">
    <div className="pr-10">
      <h5 className="font-bold text-slate-900 text-sm">{label}</h5>
      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full transition-all relative ${checked ? 'bg-primary-600' : 'bg-slate-300'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

export default Settings;
