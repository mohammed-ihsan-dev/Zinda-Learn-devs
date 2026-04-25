import { useState } from 'react';
import { AlertCircle, Clock, CheckCircle2, MoreVertical, Plus } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="animate-fade-in pb-10 relative min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Support</h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Manage system inquiries and technical issues. High-priority tickets are highlighted for immediate attention.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & Alerts */}
        <div className="space-y-6">
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">TOTAL OPEN TICKETS</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-white leading-none">42</span>
              <span className="text-xs font-bold text-purple-400 mb-1 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">+12%</span>
            </div>
          </div>
          
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">AVERAGE RESOLVE TIME</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-white leading-none">4.2</span>
              <span className="text-sm font-medium text-zinc-400 mb-1">hours</span>
            </div>
          </div>

          <div className="bg-[#2d1b36] border border-[#4c1d95] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-purple-100">Critical Outage</h3>
            </div>
            <p className="text-xs text-purple-200/70 leading-relaxed mb-6">
              Course playback server reporting 502 errors in Asia-Pacific region.
            </p>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors w-full">
              Emergency Action
            </button>
          </div>
        </div>

        {/* Right Column - Lists */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Open Complaints */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                <h2 className="text-sm font-bold text-white">Open Complaints</h2>
              </div>
              <div className="flex gap-2">
                <button className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest bg-[#1c1c21] px-3 py-1.5 rounded-lg border border-[#27272a] transition-colors">Newest</button>
                <button className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest bg-[#1c1c21] px-3 py-1.5 rounded-lg border border-[#27272a] transition-colors">Filter</button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#1c1c21] border border-[#27272a] rounded-xl p-4 flex items-center justify-between group hover:border-[#3f3f46] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="px-2 py-1 bg-[#121212] rounded text-[10px] font-mono text-zinc-500 border border-[#27272a]">
                    CMP-8285
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200">Incorrect billing for Premium Plan</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      By Elena Rodriguez • 1h ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[9px] font-bold uppercase tracking-wider rounded border border-red-500/20">HIGH PRIORITY</span>
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-400 hover:text-white transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                    <button className="text-zinc-400 hover:text-white transition-colors"><Clock className="w-4 h-4" /></button>
                    <button className="text-zinc-400 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c1c21] border border-[#27272a] rounded-xl p-4 flex items-center justify-between group hover:border-[#3f3f46] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="px-2 py-1 bg-[#121212] rounded text-[10px] font-mono text-zinc-500 border border-[#27272a]">
                    CMP-8042
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200">Tutor did not show up for live session</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      By Marcus Chen • 2h ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[9px] font-bold uppercase tracking-wider rounded border border-orange-500/20">MED PRIORITY</span>
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-400 hover:text-white transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                    <button className="text-zinc-400 hover:text-white transition-colors"><Clock className="w-4 h-4" /></button>
                    <button className="text-zinc-400 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Tickets */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div>
              <h2 className="text-sm font-bold text-white">Technical Tickets</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-[#1c1c21] border border-[#27272a] rounded-xl p-4 flex items-center justify-between group hover:border-[#3f3f46] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="px-2 py-1 bg-[#121212] rounded text-[10px] font-mono text-zinc-500 border border-[#27272a]">
                    TCH-1024
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200">Mobile app crashes on video upload</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      By Sarah Jenkins • 45m ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[9px] font-bold uppercase tracking-wider rounded border border-red-500/20">HIGH PRIORITY</span>
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-400 hover:text-white transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                    <button className="text-zinc-400 hover:text-white transition-colors"><Clock className="w-4 h-4" /></button>
                    <button className="text-zinc-400 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c1c21] border border-[#27272a] rounded-xl p-4 flex items-center justify-between group hover:border-[#3f3f46] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="px-2 py-1 bg-[#121212] rounded text-[10px] font-mono text-zinc-500 border border-[#27272a]">
                    TCH-0590
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200">Subtitles out of sync in Advanced Python</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      By David Miller • 3h ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-2 py-1 bg-zinc-500/10 text-zinc-400 text-[9px] font-bold uppercase tracking-wider rounded border border-zinc-500/20">LOW PRIORITY</span>
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-400 hover:text-white transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                    <button className="text-zinc-400 hover:text-white transition-colors"><Clock className="w-4 h-4" /></button>
                    <button className="text-zinc-400 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center text-white hover:scale-105 transition-transform z-10">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Analytics;
