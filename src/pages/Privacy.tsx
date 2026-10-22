import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const Privacy: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {language === 'bn' ? 'গোপনীয়তা নীতিমালা (Privacy Policy)' : 'Privacy Policy'}
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Last Updated: March 2026 · Haque Graphy Digital Marketplace
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed font-bengali">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? '১. সংগৃহীত তথ্য' : '1. Information We Collect'}</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'হক গ্রাফি শুধুমাত্র ডিজিটাল ফাইল ডেলিভারি ও পেমেন্ট ভেরিফিকেশনের জন্য প্রয়োজনীয় তথ্য (আপনার নাম, ইমেইল অ্যাড্রেস, ফোন নম্বর এবং বিকাশ/নগদ ট্রানজেকশন আইডি) সংগ্রহ করে। আমরা কোনো অপ্রয়োজনীয় ব্যক্তিগত তথ্য বা ক্রেডিট কার্ডের তথ্য সংগ্রহ করি না।'
              : 'Haque Graphy collects only the essential information necessary to verify bKash/Nagad transactions and deliver digital assets (Name, Email, Phone number, and TrxID).'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? '২. তথ্যের নিরাপত্তা ও ব্যবহার' : '2. Data Usage & Security'}</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'আপনার সংগৃহীত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না। গ্রাহকের ট্রানজেকশন আইডি শুধুমাত্র পেমেন্ট কনফার্মেশনের জন্য অ্যাডমিন কর্তৃক নিরাপদে যাচাই করা হয় এবং ডাউনলোড টোকেন তৈরি করা হয়।'
              : 'Your information is strictly utilized to release authorized download tokens. We never sell, monetize, or distribute customer details.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? '৩. ফাইল সংরক্ষণ ও ডাউনলোড মেয়াদ' : '3. File Delivery & Token Validity'}</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'একবার অর্ডার ভেরিফাই হলে গ্রাহক যে কোন সময় তাঁর অর্ডার নম্বর ও ফোন নম্বর দিয়ে আমাদের সাইট থেকে পুনরায় ফাইল ডাউনলোড করতে পারবেন। ক্লাউড স্টোরেজে সুরক্ষিতভাবে সংরক্ষিত ফাইলগুলো নিশ্চিত করে নিরাপদ ডেলিভারি।'
              : 'Once verified, digital download access tokens remain permanently attached to the order number for retrieval.'}
          </p>
        </section>
      </div>
    </div>
  );
};
