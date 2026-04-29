import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, Clock, BookOpen, Star, Loader2 } from 'lucide-react';
import Button from './Button';
import { formatCurrency } from '../utils/currencyFormatter';

const CoursePurchaseModal = ({ course, isOpen, onClose, onProceedToPayment }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const totalMins = course.modules?.reduce(
    (acc, m) => acc + (m.lessons?.reduce((a, l) => a + (l.duration || 0), 0) || 0), 0
  ) || 0;
  const formatDuration = (mins) => {
    if (!mins) return '0m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-zinc-600" />
        </button>
        
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Image & Info */}
          <div className="md:w-5/12 bg-zinc-50 border-r border-zinc-100 p-6 flex flex-col justify-between">
            <div>
              <div className="aspect-video rounded-xl overflow-hidden mb-5">
                <img 
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=350&fit=crop'} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-xl text-zinc-900 leading-tight mb-2">
                {course.title}
              </h3>
              <p className="text-zinc-500 text-sm mb-4">
                By <span className="font-semibold text-zinc-800">{course.instructor?.name || 'Expert Instructor'}</span>
              </p>
              
              <div className="flex flex-wrap gap-3 text-xs text-zinc-600">
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-md border border-zinc-200">
                  <Clock className="w-3.5 h-3.5 text-primary-500" />
                  {formatDuration(totalMins)}
                </div>
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-md border border-zinc-200">
                  <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                  {totalLessons} lessons
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-2">Total Price</p>
              <div className="flex items-end gap-3">
                {course.discountPrice > 0 && course.discountPrice < course.price ? (
                  <>
                    <span className="text-3xl font-extrabold text-zinc-900">{formatCurrency(course.discountPrice)}</span>
                    <span className="text-lg text-zinc-400 line-through mb-1">{formatCurrency(course.price)}</span>
                  </>
                ) : course.price === 0 ? (
                  <span className="text-3xl font-extrabold text-emerald-500">Free</span>
                ) : (
                  <span className="text-3xl font-extrabold text-zinc-900">{formatCurrency(course.price)}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Details & Action */}
          <div className="md:w-7/12 p-8 flex flex-col">
            <h4 className="text-lg font-bold text-zinc-900 mb-4">What you'll get</h4>
            <div className="space-y-3 mb-8 flex-1">
              {[
                'Full lifetime access',
                'Access on mobile and desktop',
                'Certificate of completion',
                `${totalLessons} high-quality lessons`,
                'Premium instructor support'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                  <span className="text-zinc-700">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col gap-3 mt-auto">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onProceedToPayment();
                }} 
                className="!py-4 text-base font-bold rounded-xl w-full"
              >
                Continue to Payment
              </Button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }} 
                className="py-4 text-zinc-500 font-medium hover:text-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const portalRoot = document.getElementById('modal-root');
  if (!portalRoot) return modalContent; // Fallback if modal-root doesn't exist

  return createPortal(modalContent, portalRoot);
};

export default CoursePurchaseModal;
