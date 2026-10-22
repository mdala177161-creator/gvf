import React from 'react';
import { useApp } from '../context/AppContext';
import { FileCheck, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';

export const Terms: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {language === 'bn' ? 'ব্যবহারের শর্তাবলী ও লাইসেন্স (Terms & Conditions)' : 'Terms of Service & Licensing'}
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Last Updated: March 2026 · Haque Graphy Digital Marketplace
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed font-bengali">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? '১. লাইসেন্স ও ব্যবহারের অধিকার' : '1. Commercial & Print Rights'}</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'হক গ্রাফি থেকে কেনা সকল পিএসডি (PSD), এআই (AI), ইপিএস (EPS) এবং পিক্সেলল্যাব (PLP) ফাইল ব্যক্তিগত এবং ক্লায়েন্টের বাণিজ্যিক প্রিন্ট/মিডিয়া প্রকল্পে ব্যবহারের জন্য সম্পূর্ণ বৈধ। আপনি আনলিমিটেড কপি প্রিন্ট করতে পারেন।'
              : 'Purchased files include full commercial usage rights for end-products, client commissions, social media marketing, and offset printing.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{language === 'bn' ? '২. পুনঃবিক্রয় ও শেয়ারিং নিষেধাজ্ঞা' : '2. Resale & Re-distribution Prohibited'}</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'হক গ্রাফির মূল সোর্স ফাইল (যেমন সরাসরি PLP, PSD বা AI ফাইল) কোনো সোশ্যাল মিডিয়া গ্রুপ, টেলিগ্রাম বা অন্য কোনো সাইটে ফ্রি বা অর্থের বিনিময়ে পুনরায় বিক্রি বা উন্মুক্ত বিতরণ করা সম্পূর্ণ নিষিদ্ধ এবং আইনত দণ্ডনীয়।'
              : 'Direct resale, sub-licensing, or unauthorized public distribution of raw source templates (PLP/PSD/AI) is strictly prohibited.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? '৩. ডিজিটাল পণ্যের রিফান্ড নীতি' : '3. Digital Goods Refund Policy'}</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'ডিজিটাল সোর্স ফাইল তৎক্ষণাৎ ডাউনলোডযোগ্য হওয়ায় ডাউনলোড লিঙ্ক সক্রিয় হওয়ার পর কোনো সাধারণ রিফান্ড প্রদান করা হয় না। তবে ফাইল ক্ষতিগ্রস্ত হলে বা কাজ না করলে আমাদের টিম ২৪ ঘণ্টার মধ্যে ত্রুটিহীন ফাইল সরবরাহ করতে দায়বদ্ধ।'
              : 'Due to the intangible nature of digital assets, all confirmed downloads are non-refundable once released, except in cases of verified file corruption.'}
          </p>
        </section>
      </div>
    </div>
  );
};
