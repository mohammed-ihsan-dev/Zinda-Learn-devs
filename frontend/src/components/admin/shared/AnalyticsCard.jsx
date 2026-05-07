import React from 'react';

const AnalyticsCard = ({ title, value, icon: Icon, trend, color = "purple" }) => {
  const colorMap = {
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  const selectedColor = colorMap[color] || colorMap.purple;

  return (
    <div className="bg-[#1c1c21] p-6 rounded-[24px] border border-[#27272a] shadow-sm relative overflow-hidden group hover:border-[#3f3f46] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl border ${selectedColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
            <svg className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        )}
      </div>
      <div>
        <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-1">{title}</h4>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
      </div>
      
      {/* Decorative gradient */}
      <div className={`absolute -bottom-12 -right-12 w-24 h-24 rounded-full blur-[60px] opacity-20 ${selectedColor.split(' ')[1]}`} />
    </div>
  );
};

export default AnalyticsCard;
