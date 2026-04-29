import React, { useState } from 'react';
import { Star, Clock, Users, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from './Button';
import CoursePurchaseModal from './CoursePurchaseModal';
import PaymentStepModal from './PaymentStepModal';
import { createPaymentOrder, verifyPayment } from '../services/paymentService';
import { formatCurrency } from '../utils/currencyFormatter';

const CourseCard = ({ course, enrolled = false }) => {
  const navigate = useNavigate();
  const {
    _id,
    title,
    price,
    discountPrice,
    thumbnail,
    category,
    level,
    rating,
    totalRatings,
    totalStudents,
    instructor,
    modules = [],
  } = course;

  const totalLessons = modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);
  const totalDuration = modules.reduce(
    (acc, mod) => acc + (mod.lessons?.reduce((a, l) => a + (l.duration || 0), 0) || 0),
    0
  );
  const hours = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPurchaseModalOpen(true);
  };

  const handleProceedToPayment = () => {
    setIsPurchaseModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async () => {
    setIsEnrolling(true);
    try {
      const orderData = await createPaymentOrder(_id);
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      
      await verifyPayment({
        paymentId: 'mock_payment_' + Math.random().toString(36).substr(2, 9),
        orderId: orderData.orderId,
        signature: 'mock_signature',
        courseId: _id
      });

      toast.success('Payment Successful!');
      setTimeout(() => {
        toast.success('Enrollment Completed');
        navigate('/student/my-learning');
      }, 1000);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsEnrolling(false);
      setIsPaymentModalOpen(false);
    }
  };

  const handleCardClick = () => {
    navigate(enrolled ? `/student/courses/${_id}/learn` : `/courses/${_id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Rating floating badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white rounded-full shadow-md z-10">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-surface-900">{rating}</span>
          <span className="text-[10px] text-surface-400 font-medium">({totalRatings?.toLocaleString()})</span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-primary-700 rounded-lg">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
            {instructor?.name?.charAt(0) || 'Z'}
          </div>
          <span className="text-xs text-surface-500 font-medium">{instructor?.name || 'Instructor'}</span>
        </div>

        <h3 className="font-bold text-surface-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
          {title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-surface-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {totalLessons} lessons
          </span>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between pt-4 border-t border-surface-100">
            <div className="text-right">
              {discountPrice > 0 && discountPrice < price ? (
                <>
                  <span className="text-xs text-surface-400 line-through">{formatCurrency(price)}</span>
                  <span className="font-bold text-primary-600 text-lg">{formatCurrency(discountPrice)}</span>
                </>
              ) : price === 0 ? (
                <span className="font-bold text-emerald-500 text-lg">Free</span>
              ) : (
                <span className="font-bold text-surface-900 text-lg">{formatCurrency(price)}</span>
              )}
            </div>

            {!enrolled ? (
              <Button 
                onClick={handleEnrollClick}
                disabled={isEnrolling}
                size="sm" 
                className="rounded-xl shadow-sm hover:shadow-md"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </Button>
            ) : (
              <Button 
                variant="secondary"
                size="sm"
                className="rounded-xl"
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* MODALS (stops propagation to prevent card click) */}
      <div onClick={(e) => e.stopPropagation()}>
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
            onClose={() => !isEnrolling && setIsPaymentModalOpen(false)}
            onPay={handlePayment}
            isProcessing={isEnrolling}
          />
        )}
      </div>
    </div>
  );
};

export default CourseCard;
