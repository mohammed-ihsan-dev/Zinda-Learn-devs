import { useState } from 'react';
import { Star, Users, Clock, BookOpen, CheckCircle2, ChevronDown, Play, Award } from 'lucide-react';
import ModuleAccordion from '../../components/ModuleAccordion';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CoursePurchaseModal from '../../components/CoursePurchaseModal';
import PaymentStepModal from '../../components/PaymentStepModal';
import { createPaymentOrder, verifyPayment } from '../../services/paymentService';
import { formatCurrency } from '../../utils/currencyFormatter';

const formatDuration = (mins) => {
  if (!mins) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const CourseOverview = ({ course, enrollment, onLessonClick }) => {
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);
  const isEnrolled = !!enrollment;

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const totalMins = course.modules?.reduce(
    (acc, m) => acc + (m.lessons?.reduce((a, l) => a + (l.duration || 0), 0) || 0), 0
  ) || 0;

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleEnrollClick = () => {
    setIsPurchaseModalOpen(true);
  };

  const handleProceedToPayment = async () => {
    setIsPurchaseModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async () => {
    setEnrolling(true);
    try {
      // 1. Create order
      const orderData = await createPaymentOrder(course._id);
      
      // 2. Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 3. Verify payment (mocking Razorpay success)
      await verifyPayment({
        paymentId: 'mock_payment_' + Math.random().toString(36).substr(2, 9),
        orderId: orderData.orderId,
        signature: 'mock_signature',
        courseId: course._id
      });

      toast.success('Payment Successful! 🎉');
      setTimeout(() => {
        toast.success('Enrollment Completed');
        navigate('/student/my-learning');
      }, 1000);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setEnrolling(false);
      setIsPaymentModalOpen(false);
    }
  };

  const handleContinue = () => {
    if (!course.modules?.length) return;
    const m = enrollment?.currentLesson?.moduleIndex || 0;
    const l = enrollment?.currentLesson?.lessonIndex || 0;
    const module = course.modules[m];
    const lesson = module?.lessons?.[l];
    if (lesson) onLessonClick({ moduleIndex: m, lessonIndex: l, lesson, module });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ── HERO CARD ── */}
      <div className="bg-white rounded-3xl shadow-md border border-zinc-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left content */}
          <div className="flex-1 p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-black uppercase tracking-widest rounded-lg">
                {course.category}
              </span>
              <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-lg ${
                course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                course.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {course.level}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 leading-tight mb-4">
              {course.title}
            </h1>
            <p className="text-zinc-500 text-lg leading-relaxed mb-6">
              {course.shortDescription || course.description?.slice(0, 180) + '...'}
            </p>

            {/* Instructor */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {course.instructor?.name?.charAt(0) || 'I'}
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">Instructor</p>
                <p className="font-bold text-zinc-900">{course.instructor?.name || 'Expert Instructor'}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-5 mb-8 text-sm">
              {course.rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-zinc-900">{course.rating}</span>
                  {course.totalRatings > 0 && (
                    <span className="text-zinc-400">({course.totalRatings?.toLocaleString()} ratings)</span>
                  )}
                </div>
              )}
              {course.totalStudents > 0 && (
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Users className="w-4 h-4" />
                  <span>{course.totalStudents?.toLocaleString()} students</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(totalMins)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500">
                <BookOpen className="w-4 h-4" />
                <span>{totalLessons} lessons</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              {isEnrolled ? (
                <Button onClick={handleContinue} className="!px-8 !py-3.5 text-base font-bold rounded-xl flex items-center gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  Continue Learning
                </Button>
              ) : (
                <Button onClick={handleEnrollClick} loading={enrolling} className="!px-8 !py-3.5 text-base font-bold rounded-xl">
                  Enroll Now — {course.discountPrice > 0 ? formatCurrency(course.discountPrice) : course.price === 0 ? 'Free' : formatCurrency(course.price)}
                </Button>
              )}
              <button className="px-6 py-3.5 border-2 border-zinc-200 text-zinc-700 font-bold rounded-xl hover:border-primary-400 hover:text-primary-600 transition-colors">
                ♡ Wishlist
              </button>
            </div>
          </div>

          {/* Right — preview + price */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 p-6 lg:border-l border-zinc-100 bg-zinc-50 flex flex-col gap-5">
            {/* Thumbnail preview */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-200 group cursor-pointer">
              <img
                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=350&fit=crop'}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 text-zinc-900 fill-zinc-900 ml-1" />
                </div>
              </div>
              <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                Preview
              </span>
            </div>

            {/* Price box */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                {course.discountPrice > 0 && course.discountPrice < course.price ? (
                  <>
                    <span className="text-3xl font-extrabold text-zinc-900">{formatCurrency(course.discountPrice)}</span>
                    <span className="text-lg text-zinc-400 line-through">{formatCurrency(course.price)}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-black rounded-lg">
                      {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
                    </span>
                  </>
                ) : course.price === 0 ? (
                  <span className="text-3xl font-extrabold text-green-600">Free</span>
                ) : (
                  <span className="text-3xl font-extrabold text-zinc-900">{formatCurrency(course.price)}</span>
                )}
              </div>
              {isEnrolled ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-700 text-sm">You're enrolled</span>
                </div>
              ) : (
                <Button onClick={handleEnrollClick} loading={enrolling} fullWidth className="!py-3.5 text-base font-bold rounded-xl">
                  Enroll Now
                </Button>
              )}
              <p className="text-xs text-zinc-400 text-center mt-3">30-day money-back guarantee</p>
            </div>

            {/* Includes */}
            <div className="space-y-2 px-1">
              {[
                `${totalLessons} on-demand lessons`,
                `${formatDuration(totalMins)} of content`,
                'Full lifetime access',
                'Certificate of completion',
                'Access on mobile & desktop',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WHAT YOU WILL LEARN ── */}
      {course.whatYouWillLearn?.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">What You'll Learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {course.whatYouWillLearn.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span className="text-zinc-700 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── REQUIREMENTS ── */}
      {course.requirements?.length > 0 && (
        <div className="bg-zinc-50 rounded-2xl border border-zinc-100 p-7">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">Requirements</h2>
          <ul className="space-y-2">
            {course.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── CURRICULUM ── */}
      {course.modules?.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900">Course Curriculum</h2>
            <span className="text-sm text-zinc-400">{course.modules.length} modules · {totalLessons} lessons · {formatDuration(totalMins)}</span>
          </div>
          <ModuleAccordion
            modules={course.modules}
            completedLessons={enrollment?.completedLessons || []}
            activeLesson={enrollment?.currentLesson}
            onLessonClick={onLessonClick}
            isEnrolled={isEnrolled}
          />
        </div>
      )}

      {/* ── INSTRUCTOR ── */}
      {course.instructor && (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Your Instructor</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-4xl font-bold shrink-0">
              {course.instructor?.name?.charAt(0) || 'I'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-zinc-900 mb-1">{course.instructor.name}</h3>
              <p className="text-primary-600 font-semibold mb-4">Expert Instructor</p>
              <div className="flex flex-wrap gap-5 mb-4">
                {course.rating > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-zinc-600">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-zinc-900">{course.rating}</span> Rating
                  </div>
                )}
                {course.totalStudents > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-zinc-600">
                    <Users className="w-4 h-4" />
                    {course.totalStudents?.toLocaleString()} students
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-zinc-600">
                  <Award className="w-4 h-4" />
                  Expert Level
                </div>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {course.instructor.bio || 'An expert instructor with years of industry experience, dedicated to helping students achieve their learning goals through practical, project-based teaching.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── REVIEWS ── */}
      {course.rating > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Student Reviews</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Overall rating */}
            <div className="flex flex-col items-center justify-center text-center shrink-0 bg-zinc-50 rounded-2xl px-10 py-8">
              <p className="text-7xl font-extrabold text-zinc-900 leading-none">{course.rating}</p>
              <div className="flex items-center gap-1 my-2">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-5 h-5 ${s <= Math.round(course.rating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                ))}
              </div>
              <p className="text-sm text-zinc-500 font-medium">Course Rating</p>
            </div>
            {/* Rating bars */}
            <div className="flex-1 space-y-3 w-full">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = star === Math.round(course.rating) ? 70 : star === Math.round(course.rating) - 1 ? 20 : 5;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-20 shrink-0 justify-end">
                      {[...Array(star)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="flex-1 bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-zinc-400 w-8 shrink-0">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sample reviews */}
          <div className="mt-8 space-y-6 border-t border-zinc-100 pt-6">
            {[{ name: 'Alex T.', text: 'Excellent course with clear explanations. Highly recommended!' }, { name: 'Priya M.', text: 'Practical content that I could apply immediately at work.' }].map((r) => (
              <div key={r.name} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-zinc-900 text-sm">{r.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-zinc-500 text-sm">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* MODALS */}
      {isPurchaseModalOpen && (
        <CoursePurchaseModal
          course={course}
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}
      
      {isPaymentModalOpen && (
        <PaymentStepModal
          course={course}
          isOpen={isPaymentModalOpen}
          onClose={() => !enrolling && setIsPaymentModalOpen(false)}
          onPay={handlePayment}
          isProcessing={enrolling}
        />
      )}
    </div>
  );
};

export default CourseOverview;
