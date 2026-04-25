import { useState } from 'react';
import { Plus, Download, FileText, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const InstructorManagement = () => {
  const pendingRequests = [
    {
      id: 1,
      name: 'Sarah Chan',
      title: 'Data Science Expert',
      time: '1H AGO',
      description: 'PhD candidate at Stanford with 5+ years of experience in Machine Learning. Previously led curriculum...',
      file: 'resume_sarah_chan.pdf',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
      id: 2,
      name: 'Marcus Aurelio',
      title: 'UX Design Lead',
      time: '3H AGO',
      description: 'Specialized in Design Systems and Accessibility. Has mentored over 200+ junior designers through community...',
      file: 'portfolio_v2_2024.pdf',
      avatar: 'https://i.pravatar.cc/150?u=marcus'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      title: 'Spanish Literature',
      time: 'YESTERDAY',
      description: 'Native speaker with a Master\'s in Applied Linguistics. Developed a unique conversational method for non-native...',
      file: 'cv_elena_rod.pdf',
      avatar: 'https://i.pravatar.cc/150?u=elena'
    }
  ];

  const activeTutors = [
    { id: 1, name: 'Dr. Julian Velez', title: 'Quantum Physics', rating: '4.92', reviews: '4.2k reviews', courses: 12, revenue: '$14,200.00', avatar: 'https://i.pravatar.cc/150?u=julian' },
    { id: 2, name: 'Sophia Miller', title: 'Creative Writing', rating: '4.85', reviews: '1.8k reviews', courses: 5, revenue: '$8,540.50', avatar: 'https://i.pravatar.cc/150?u=sophia' },
    { id: 3, name: 'David Zhang', title: 'Full Stack Dev', rating: '4.90', reviews: '8.4k reviews', courses: 28, revenue: '$32,190.00', avatar: 'https://i.pravatar.cc/150?u=david' },
  ];

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tutor Management</h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Oversee pending applications and monitor active tutor performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-[#1c1c21] hover:bg-[#27272a] text-white text-xs font-bold rounded-xl border border-[#27272a] transition-colors">
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center gap-2">
            Add New Tutor
          </button>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div>
          <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PENDING REQUESTS (3)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingRequests.map(req => (
            <div key={req.id} className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-5 flex flex-col hover:border-[#3f3f46] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full object-cover border border-[#27272a]" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{req.name}</h3>
                    <p className="text-[10px] text-purple-400 font-bold tracking-wider">{req.title}</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-zinc-500 bg-[#121212] px-2 py-1 rounded-md border border-[#27272a]">
                  {req.time}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4 flex-1">
                {req.description}
              </p>
              <div className="flex items-center gap-2 bg-[#121212] p-2.5 rounded-lg border border-[#27272a] mb-5">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-bold text-zinc-300 truncate">{req.file}</span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-[#121212] hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl border border-[#27272a] transition-colors">
                  Reject
                </button>
                <button className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-[0_0_10px_rgba(147,51,234,0.3)] transition-colors">
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Tutors */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ACTIVE TUTORS (142)</h2>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            SORT BY: <span className="text-white cursor-pointer hover:text-purple-400 transition-colors">Performance</span>
          </div>
        </div>

        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#121212]/50">
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TUTOR DETAILS</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">AVG RATING</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">COURSES PUBLISHED</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">REVENUE SHARE</th>
                <th className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {activeTutors.map(tutor => (
                <tr key={tutor.id} className="hover:bg-[#25252b] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img src={tutor.avatar} alt={tutor.name} className="w-10 h-10 rounded-full object-cover border border-[#27272a]" />
                      <div>
                        <p className="text-sm font-bold text-white">{tutor.name}</p>
                        <p className="text-[10px] text-zinc-500">{tutor.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-white flex items-center gap-1">
                        <span className="text-purple-500">★</span> {tutor.rating}
                      </span>
                      <span className="text-[9px] text-zinc-500 uppercase">{tutor.reviews}</span>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-full">
                      {tutor.courses} Courses
                    </span>
                  </td>
                  <td className="p-5 text-right font-mono text-sm text-zinc-300">
                    {tutor.revenue}
                  </td>
                  <td className="p-5 text-right">
                    <button className="text-zinc-500 hover:text-white transition-colors p-2">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-[#27272a] bg-[#121212]/30 flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Showing 1 to 10 of 142 active tutors</span>
            <div className="flex items-center gap-2">
              <button className="w-6 h-6 flex items-center justify-center rounded bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:text-white transition-colors"><ChevronLeft className="w-3 h-3" /></button>
              <button className="w-6 h-6 flex items-center justify-center rounded bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:text-white transition-colors"><ChevronRight className="w-3 h-3" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorManagement;
