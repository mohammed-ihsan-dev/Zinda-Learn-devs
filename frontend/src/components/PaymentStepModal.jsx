import { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import Button from './Button';

const PaymentStepModal = ({ course, isOpen, onClose, onPay, isProcessing }) => {
  if (!isOpen) return null;

  const priceToPay = course.discountPrice > 0 ? course.discountPrice : course.price;
  const isFree = priceToPay === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-in">
        <button 
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors z-10 disabled:opacity-50"
        >
          <X className="w-5 h-5 text-zinc-600" />
        </button>

        <div className="p-8">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Secure Checkout</h2>
          
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 mb-6">
            <h4 className="text-sm font-semibold text-zinc-800 mb-1">Order Summary</h4>
            <p className="text-zinc-600 text-sm mb-4 line-clamp-1">{course.title}</p>
            
            <div className="flex justify-between items-center border-t border-zinc-200 pt-4 mt-2">
              <span className="font-bold text-zinc-900">Total</span>
              <span className="text-xl font-extrabold text-primary-600">
                {isFree ? 'Free' : `₹${priceToPay?.toLocaleString()}`}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-semibold text-zinc-800 mb-3">Payment Method</h4>
            <div className="border-2 border-primary-500 bg-primary-50 rounded-xl p-4 flex items-center gap-3 cursor-pointer">
              <div className="w-5 h-5 rounded-full border-[5px] border-primary-500 bg-white"></div>
              <span className="font-medium text-primary-900">Credit / Debit Card (Mock)</span>
            </div>
            <p className="text-xs text-zinc-500 mt-2 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Payments are secure and encrypted.
            </p>
          </div>

          <Button 
            onClick={onPay} 
            loading={isProcessing} 
            className="w-full !py-4 text-base font-bold rounded-xl"
          >
            {isFree ? 'Enroll for Free' : `Pay ₹${priceToPay?.toLocaleString()}`}
          </Button>
          
          {isProcessing && (
            <p className="text-center text-sm text-zinc-500 mt-3 animate-pulse">
              Processing payment... please do not close.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStepModal;
