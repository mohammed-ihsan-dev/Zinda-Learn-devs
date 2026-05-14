import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Search, 
  Filter, 
  ChevronDown, 
  MoreVertical,
  Reply,
  Trash2,
  Flag,
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { getReviewData } from '../../services/instructorDashboardService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Reviews = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  useEffect(() => {
    fetchReviewData();
  }, []);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const res = await getReviewData();
      if (res.success) {
        setData(res);
      }
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const filteredReviews = data?.reviews?.filter(r => {
    const matchesSearch = r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.review?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || r.rating === parseInt(ratingFilter);
    const matchesCourse = courseFilter === 'all' || r.course?._id === courseFilter;
    return matchesSearch && matchesRating && matchesCourse;
  }) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Student Reviews</h2>
        <p className="text-slate-500 text-sm">Monitor and engage with your students' feedback</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Average Rating</p>
          <div className="text-6xl font-black text-slate-900 mb-4">{data?.analytics?.avgRating || 0}</div>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`w-5 h-5 ${s <= Math.round(data?.analytics?.avgRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>
          <p className="text-sm font-bold text-slate-500">Based on {data?.analytics?.totalReviews || 0} reviews</p>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest text-center lg:text-left">Rating Distribution</h3>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating, idx) => {
              const count = data?.analytics?.distribution?.[idx] || 0;
              const percentage = data?.analytics?.totalReviews > 0 
                ? (count / data.analytics.totalReviews) * 100 
                : 0;
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12 shrink-0">
                    <span className="text-sm font-bold text-slate-600">{rating}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-primary-500"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 text-sm font-bold text-slate-600 appearance-none min-w-[160px]"
          >
            <option value="all">All Courses</option>
            {data?.courses?.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
          <select 
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 text-sm font-bold text-slate-600 appearance-none min-w-[140px]"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? filteredReviews.map((review, i) => (
          <motion.div 
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Student Info */}
              <div className="flex md:flex-col items-center md:items-center gap-4 shrink-0 md:w-32">
                <img 
                  src={review.user?.profilePic || review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name}&background=random`} 
                  alt={review.user?.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50"
                />
                <div className="md:text-center">
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{review.user?.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Student</p>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">
                      On <span className="text-slate-900">{review.course?.title}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed italic">
                  "{review.review}"
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                  <button className="flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors">
                    <Flag className="w-4 h-4" />
                    Report
                  </button>
                </div>

                {/* Reply Section (Placeholder) */}
                {review.reply && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-900">Your Response</span>
                    </div>
                    <p className="text-sm text-slate-500 italic">"{review.reply}"</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
            <MessageSquare className="w-16 h-16 text-slate-100 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No reviews found</h3>
            <p className="text-slate-400 max-w-sm mx-auto">Try adjusting your filters or wait for students to leave feedback on your courses.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
