import { useState } from 'react';
import { UploadCloud, Plus, GripVertical, Edit2, Trash2, Video, FileText, Image as ImageIcon } from 'lucide-react';

const CreateCourse = () => {
  const [level, setLevel] = useState('Beginner');

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Course</h1>
        <p className="text-slate-500 text-sm">
          Every great course starts with a solid foundation. Fill in the details below to bring your expertise to life.
        </p>
      </div>

      <div className="max-w-4xl space-y-8">
        
        {/* Course Essentials */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Course Essentials</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Course Title</label>
              <input 
                type="text" 
                placeholder="e.g. Advanced Editorial Design for Digital Media" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Short Description</label>
              <textarea 
                placeholder="A brief hook that summarizes your course in 2 sentences..." 
                rows="3"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-purple-500 focus:bg-white transition-colors">
                    <option>Design & Arts</option>
                    <option>Development</option>
                    <option>Business</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Difficulty Level</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {['Beginner', 'Intermediate', 'Expert'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                        level === l ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media & Branding */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Media & Branding</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Course Thumbnail</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl h-48 flex flex-col items-center justify-center text-center p-6 hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
                <p className="text-sm font-bold text-slate-700 mb-1">Drag and drop image here</p>
                <p className="text-[10px] text-slate-500">16:9 Aspect ratio recommended (Max 2MB)</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Promo Video (Preview)</label>
              <div className="relative h-48 bg-slate-900 rounded-2xl overflow-hidden group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=800&auto=format&fit=crop" alt="Video Preview" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4l12 6-12 6V4z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3">
                  <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-white/20 transition-colors">
                    <Video className="w-3 h-3" /> Change Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Builder */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Video className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Curriculum Builder</h2>
            </div>
            <button className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Section
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                <h3 className="text-sm font-bold text-slate-800">Section 1: The Design Mindset</h3>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-slate-400 hover:text-purple-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">1.1 Introduction to Color Theory</p>
                  <p className="text-[10px] text-slate-500">Video • 12:45</p>
                </div>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">1.2 Visual Hierarchy Principles</p>
                  <p className="text-[10px] text-slate-500">Video • 18:20</p>
                </div>
              </div>

              <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 mt-4">
                <Plus className="w-4 h-4" /> Add New Lesson
              </button>
            </div>
          </div>
        </div>

        {/* Pricing & Access */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-bold">$</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Pricing & Access</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-6">
            <div className="w-full sm:w-1/3">
              <label className="block text-xs font-bold text-slate-700 mb-2">Currency</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-purple-500 focus:bg-white transition-colors">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/3">
              <label className="block text-xs font-bold text-slate-700 mb-2">Price Amount</label>
              <input 
                type="text" 
                defaultValue="$ 99.00" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="w-full sm:w-1/3 flex items-center h-[46px] bg-slate-50 rounded-xl border border-slate-200 px-4">
              <label className="flex items-center gap-3 cursor-pointer w-full">
                <input type="checkbox" className="w-4 h-4 rounded-full border-slate-300 text-purple-600 focus:ring-purple-500" />
                <span className="text-xs font-bold text-slate-700">Make this course free</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Auto-saved as draft at 14:23 PM
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
              Save as Draft
            </button>
            <button className="flex-1 sm:flex-none px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-200 transition-all">
              Publish Course
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateCourse;
