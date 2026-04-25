import { Star, ThumbsUp, MessageSquare, TrendingUp } from 'lucide-react';

const reviews = [
  { name: 'Sarah Jenkins', course: 'Mastering React & Next.js', rating: 5, comment: 'Absolutely world-class content. The project-based approach really helped things click. Mohammed is an exceptional instructor!', date: 'Oct 24, 2024', avatar: 'https://i.pravatar.cc/150?u=31', helpful: 14 },
  { name: 'Marcus Chen', course: 'Python for Data Science', rating: 4, comment: 'Very thorough and well-structured. A few sections could use updated examples but overall fantastic — already recommended it to my team.', date: 'Oct 18, 2024', avatar: 'https://i.pravatar.cc/150?u=32', helpful: 8 },
  { name: 'Priya Sharma', course: 'Mastering React & Next.js', rating: 5, comment: 'This course changed my career trajectory. I landed a job at a startup within 2 weeks of completing it. Thank you!', date: 'Oct 5, 2024', avatar: 'https://i.pravatar.cc/150?u=33', helpful: 22 },
  { name: 'David Miller', course: 'Python for Data Science', rating: 3, comment: 'Good content overall but the audio in module 3 could be improved. Looking forward to the updated version!', date: 'Sep 30, 2024', avatar: 'https://i.pravatar.cc/150?u=34', helpful: 3 },
];

const Reviews = () => {
  const avg = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map(s => ({ star: s, count: reviews.filter(r => r.rating === s).length, pct: Math.round(reviews.filter(r => r.rating === s).length / reviews.length * 100) }));

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reviews</h1>
        <p className="text-slate-500 text-sm">Student feedback and ratings across all your courses.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-8 flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center justify-center text-center flex-shrink-0 w-44">
          <h2 className="text-7xl font-black text-slate-900 leading-none">{avg}</h2>
          <div className="flex items-center gap-1 my-3">
            {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Course Rating</p>
          <p className="text-[10px] text-slate-400 mt-1">{reviews.length} reviews</p>
        </div>

        <div className="flex-1 space-y-3">
          {dist.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-4">
              <div className="flex items-center gap-1 w-12">
                <span className="text-xs font-bold text-slate-600">{star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-400 w-4">{count}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
          <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
            <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-slate-900">+12%</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">This month</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
            <ThumbsUp className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-slate-900">96%</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Positive</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-purple-100 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full border-2 border-white shadow-sm object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{rev.name}</h4>
                  <p className="text-[10px] text-purple-600 font-bold mt-0.5">{rev.course}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, si) => <Star key={si} className={`w-4 h-4 ${si < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{rev.date}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mt-4 mb-4">{rev.comment}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-purple-600 transition-colors">
                <ThumbsUp className="w-4 h-4" /> Helpful ({rev.helpful})
              </button>
              <button className="flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 px-4 py-2 bg-purple-50 rounded-lg border border-purple-100 transition-colors">
                <MessageSquare className="w-4 h-4" /> Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
