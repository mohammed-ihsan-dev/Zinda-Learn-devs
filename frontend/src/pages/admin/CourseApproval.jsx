import { useState } from 'react';
import { Plus, Filter, Edit2, Eye, Archive, Trash2, Clock, PlayCircle } from 'lucide-react';

const CourseApproval = () => {
  const [activeTab, setActiveTab] = useState('All Courses');

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Course Management</h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Manage, review and publish educational content across the platform.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
          <Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2 bg-[#1c1c21] p-1 rounded-full border border-[#27272a]">
          {['All Courses', 'Published', 'Pending Review', 'Draft'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors ml-auto">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Large Review Card */}
        <div className="lg:col-span-2 bg-[#1c1c21] border border-[#27272a] rounded-2xl p-5 flex flex-col md:flex-row gap-6 group hover:border-[#3f3f46] transition-colors">
          <div className="w-full md:w-1/3 relative rounded-xl overflow-hidden aspect-video md:aspect-auto">
            <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop" alt="Course" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500/90 text-black text-[9px] font-bold uppercase tracking-widest rounded shadow-lg backdrop-blur-sm">
              IN REVIEW
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">ADVANCED DEVELOPMENT</span>
              <span className="text-lg font-bold text-white">$149.99</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">Mastering React & Framer Motion: Professional UI</h3>
            <div className="flex items-center gap-4 text-xs text-zinc-400 mb-6">
              <span className="flex items-center gap-1.5"><UserIcon /> Sarah Jenkins</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 12.5 Hours</span>
            </div>
            
            <div className="mt-auto flex items-center justify-between">
              <div className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#27272a] text-zinc-300 hover:text-white transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#27272a] text-zinc-300 hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                  Archive
                </button>
                <button className="px-5 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Review Queue List */}
        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-5 flex flex-col">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">REVIEW QUEUE</h3>
          
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#25252b] transition-colors border border-transparent hover:border-[#3f3f46]">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FileIcon />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Data Science 101</p>
                <p className="text-[10px] text-zinc-500">By Dr. Marcus Vane</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#25252b] transition-colors border border-transparent hover:border-[#3f3f46]">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                <FileIcon />
              </div>
              <div>
                <p className="text-sm font-bold text-white">UI/UX Psychology</p>
                <p className="text-[10px] text-zinc-500">By Elena Frost</p>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-3 bg-[#121212] hover:bg-[#27272a] text-purple-400 text-xs font-bold rounded-xl border border-[#27272a] transition-colors">
            View All Queue
          </button>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl overflow-hidden group hover:border-[#3f3f46] transition-colors">
          <div className="relative aspect-video">
            <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop" alt="Python" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-2 py-1 bg-purple-500 text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-lg backdrop-blur-sm">
              PUBLISHED
            </div>
          </div>
          <div className="p-5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">PROGRAMMING</span>
            <div className="flex justify-between items-start mt-1 mb-4">
              <h3 className="text-base font-bold text-white leading-tight">Python for Financial Engineering</h3>
            </div>
            <div className="flex justify-between items-end mb-5">
              <p className="text-[10px] text-zinc-400">Johnathan Price</p>
              <p className="text-sm font-bold text-white">$89.00</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-lg transition-colors">Edit</button>
              <button className="w-10 h-8 flex items-center justify-center bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg transition-colors"><MoreIcon /></button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl overflow-hidden group hover:border-[#3f3f46] transition-colors">
          <div className="relative aspect-video">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" alt="Marketing" className="w-full h-full object-cover grayscale opacity-70" />
            <div className="absolute top-3 left-3 px-2 py-1 bg-zinc-600 text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-lg backdrop-blur-sm">
              DRAFT
            </div>
          </div>
          <div className="p-5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">BUSINESS</span>
            <div className="flex justify-between items-start mt-1 mb-4">
              <h3 className="text-base font-bold text-white leading-tight">Digital Marketing Strategy 2024</h3>
            </div>
            <div className="flex justify-between items-end mb-5">
              <p className="text-[10px] text-zinc-400">Carla Russo</p>
              <p className="text-sm font-bold text-white">$45.00</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-lg transition-colors">Edit</button>
              <button className="w-10 h-8 flex items-center justify-center bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg transition-colors"><MoreIcon /></button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl overflow-hidden group hover:border-[#3f3f46] transition-colors">
          <div className="relative aspect-video">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" alt="Data" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-2 py-1 bg-purple-500 text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-lg backdrop-blur-sm">
              PUBLISHED
            </div>
          </div>
          <div className="p-5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">DATA SCIENCE</span>
            <div className="flex justify-between items-start mt-1 mb-4">
              <h3 className="text-base font-bold text-white leading-tight">Big Data Visualization Techniques</h3>
            </div>
            <div className="flex justify-between items-end mb-5">
              <p className="text-[10px] text-zinc-400">Mike Ross</p>
              <p className="text-sm font-bold text-white">$112.00</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-lg transition-colors">Edit</button>
              <button className="w-10 h-8 flex items-center justify-center bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg transition-colors"><MoreIcon /></button>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-between items-center mt-8">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Showing 1-12 of 148 courses</p>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#27272a] text-zinc-400 hover:text-white transition-colors">‹</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs shadow-[0_0_10px_rgba(147,51,234,0.3)]">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:bg-[#27272a] hover:text-white transition-colors text-xs font-bold">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1c1c21] border border-[#27272a] text-zinc-400 hover:bg-[#27272a] hover:text-white transition-colors text-xs font-bold">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#27272a] text-zinc-400 hover:text-white transition-colors">›</button>
        </div>
      </div>
    </div>
  );
};

// Mini icons for inline use
const UserIcon = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const FileIcon = () => <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const MoreIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>;

export default CourseApproval;
