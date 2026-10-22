import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { ProductCard } from '../components/ProductCard';
import { heroImg } from '../data/mockData';
import { Category } from '../types';
import { 
  ArrowRight, 
  Sparkles, 
  Download, 
  Search, 
  Layers, 
  ShieldCheck, 
  Palette, 
  Smartphone, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const Home: React.FC = () => {
  const { language, setCurrentView, navigateToCategory, setSearchQuery } = useApp();
  const products = storageService.getProducts().filter(p => p.isPublished);

  const [trackInput, setTrackInput] = useState('');

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const freeProducts = products.filter(p => p.isFree).slice(0, 3);
  const premiumProducts = products.filter(p => !p.isFree).slice(0, 4);

  const categories: { id: Category; labelEn: string; labelBn: string; count: number }[] = [
    { id: 'islamic_eid', labelEn: 'Islamic & Eid', labelBn: 'ইসলামিক ও ঈদ', count: 18 },
    { id: 'typography', labelEn: 'Bangla Typography', labelBn: 'বাংলা টাইপোগ্রাফি', count: 24 },
    { id: 'social_media', labelEn: 'Social Media & PLP', labelBn: 'সোশ্যাল ব্যানার ও PLP', count: 32 },
    { id: 'branding', labelEn: 'Brand Identity', labelBn: 'ব্র্যান্ডিং ও স্টেশনারি', count: 15 },
    { id: 'wedding', labelEn: 'Wedding & Biye Card', labelBn: 'ওয়েডিং ও বিয়ের কার্ড', count: 12 },
    { id: 'print_packaging', labelEn: 'Print & Packaging', labelBn: 'প্রেস প্রিন্ট ও প্যাকেজিং', count: 20 },
  ];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      setCurrentView('order_status');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Storefront Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#080D19] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {language === 'bn' 
                    ? 'বাংলাদেশের বিশ্বস্ত ডিজিটাল ডিজাইন প্ল্যাটফর্ম' 
                    : 'Bangladesh’s Premier Digital Design Marketplace'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {language === 'bn' ? (
                  <>
                    রুচিশীল ডিজাইন ও <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">
                      নিখুঁত প্রিন্ট ফাইল
                    </span>
                  </>
                ) : (
                  <>
                    Refined Design & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">
                      Flawless Print Files
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-bengali max-w-xl">
                {language === 'bn'
                  ? 'প্রফেশনাল পিএসডি (PSD), ইলাস্ট্রেটর (AI), ভেক্টর (EPS), মোবাইল পিক্সেলল্যাব (PLP) এবং শতভাগ প্রিন্ট-রেডি প্রেস ফাইল। সহজ বিকাশ ও নগদ পেমেন্ট ভেরিফিকেশনে নিরাপদ ডাউনলোড।'
                  : 'Premium layered PSD, scalable Illustrator AI, vector EPS, mobile Pixellab PLP, and press-ready CMYK PDFs. Securely order via bKash & Nagad with instant verified delivery.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('products')}
                  className="px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:translate-y-[-1px]"
                >
                  <span>{language === 'bn' ? 'সকল ডিজাইন দেখুন' : 'Explore All Designs'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentView('free')}
                  className="px-6 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 font-semibold text-sm flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'bn' ? 'ফ্রি ডিজাইন ডাউনলোড' : 'Free Downloads'}</span>
                </button>
              </div>

              {/* Reassurance points */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{language === 'bn' ? '৩০০ DPI CMYK প্রিন্ট' : '300 DPI CMYK Print'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{language === 'bn' ? 'পিক্সেলল্যাব (.PLP) মোবাইল' : 'Pixellab (.PLP) Mobile'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{language === 'bn' ? 'বিকাশ/নগদ ম্যানুয়াল ভেরিফিকেশন' : 'bKash/Nagad Verified'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-950/40 group">
                <img
                  src={heroImg}
                  alt="Haque Graphy Digital Design Showcase"
                  referrerPolicy="no-referrer"
                  className="w-full h-full aspect-[16/9] object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
                      Studio Collection 2026
                    </span>
                    <h3 className="text-lg font-bold">
                      {language === 'bn' ? 'বাঙালি ঐতিহ্য ও আন্তর্জাতিক মান' : 'Heritage Bengali Craft & Modern Precision'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Exploration Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
              {language === 'bn' ? 'ডিজাইন ক্যাটাগরি' : 'Categories'}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {language === 'bn' ? 'আপনার প্রয়োজনীয় ডিজাইন খুঁজুন' : 'Find Your Target Template'}
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('categories')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>{language === 'bn' ? 'সব ক্যাটাগরি' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigateToCategory(cat.id)}
              className="p-4 rounded-xl bg-[#0B1325] border border-slate-800/90 hover:border-amber-500/50 hover:bg-[#0F1A30] text-left transition-all group flex flex-col justify-between"
            >
              <div className="text-amber-400 font-semibold text-sm group-hover:translate-x-0.5 transition-transform font-bengali">
                {language === 'bn' ? cat.labelBn : cat.labelEn}
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-mono">
                {cat.count}+ {language === 'bn' ? 'ফাইল' : 'files'}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Premium Designs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
              {language === 'bn' ? 'হট রিলিজ' : 'Handpicked'}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {language === 'bn' ? 'জনপ্রিয় প্রিমিয়াম কালেকশন' : 'Featured Premium Designs'}
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('premium')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>{language === 'bn' ? 'আরও প্রিমিয়াম ফাইল' : 'Browse All Premium'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Free Designs Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-[#0B1325] border border-emerald-500/30 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? '১০০% ফ্রি কালেকশন' : '100% Free Downloads'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'bn'
                ? 'নতুন ডিজাইনারদের জন্য সম্পূর্ণ ফ্রি টেমপ্লেট ও রিসোর্স'
                : 'Free Templates & Assets for Designers and Content Creators'}
            </h3>
            <p className="text-sm text-slate-300 font-bengali leading-relaxed">
              {language === 'bn'
                ? 'কোনপ্রকার ক্রেডিট কার্ড বা জটিলতা ছাড়াই ডাউনলোড করুন বাংলা টাইপোগ্রাফি, ঈদের পিএলপি এবং সোশ্যাল মিডিয়া পোস্টার।'
                : 'Direct downloads with zero friction. Pixellab PLP files, vector Bengali typography, and high-res assets ready for instant creation.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('free')}
                className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg transition-colors"
              >
                <span>{language === 'bn' ? 'ফ্রি ফাইলসমূহ দেখুন' : 'Browse Free Vault'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Free Designs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-1">
              {language === 'bn' ? 'জিরো কস্ট' : 'Zero Cost'}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {language === 'bn' ? 'সেরা ফ্রি ডিজাইনসমূহ' : 'Latest Free Downloads'}
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('free')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>{language === 'bn' ? 'সব ফ্রি ফাইল' : 'View All Free'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Craftsmanship & Print Quality Story */}
      <section className="bg-[#090F1E] border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              {language === 'bn' ? 'কেন হক গ্রাফি?' : 'Our Quality Standard'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {language === 'bn' ? 'ডিজাইনার ও প্রিন্টিং প্রেসের নিখুঁত পার্টনার' : 'Engineered for Flawless Print & High Engagement'}
            </h2>
            <p className="text-sm text-slate-400 mt-3 font-bengali">
              {language === 'bn'
                ? 'প্রতিটি ফাইল প্রিন্টিং মেশিনে টেস্টেড এবং মোবাইলে এডিটের উপযোগী করে তৈরি করা হয়েছে।'
                : 'Every design asset is tested for color fidelity, vector sharpness, and ease of modification.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[#0B1325] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'সিএমওয়াইকে (CMYK) ও ফয়েল রেডি' : 'CMYK & Foil Ready'}
              </h3>
              <p className="text-xs text-slate-400 font-bengali leading-relaxed">
                {language === 'bn'
                  ? 'কালার শিফট বা ফেটে যাওয়ার ভয় নেই। প্রেস মেশিনের সঠিক কালার প্রোফাইল ও গোল্ড ফয়েল ডাই-কাট লেয়ার সহ সরবরাহ করা হয়।'
                  : 'True CMYK separation with no color shifts during offset press runs. Includes spot-UV and hot-stamp foil channels.'}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B1325] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'মোবাইল পিক্সেলল্যাব (.PLP)' : 'Mobile Pixellab (.PLP)'}
              </h3>
              <p className="text-xs text-slate-400 font-bengali leading-relaxed">
                {language === 'bn'
                  ? 'ল্যাপটপ বা কম্পিউটার ছাড়াও শুধুমাত্র স্মার্টফোন দিয়ে ২ মিনিটে কাস্টমাইজ করে সামাজিক যোগাযোগ মাধ্যমে শেয়ার করুন।'
                  : 'Tailored for smartphone creators. Import clean .PLP files into Pixellab and customize text, photos, and colors on the fly.'}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B1325] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'নিরাপদ বিকাশ ও নগদ ভেরিফিকেশন' : 'Verified bKash & Nagad Payments'}
              </h3>
              <p className="text-xs text-slate-400 font-bengali leading-relaxed">
                {language === 'bn'
                  ? 'কোন ফেক গেটওয়ে নয়। সরাসরি বিকাশ ও নগদ সেন্ড মানি করে ট্রানজেকশন আইডি দিন, অ্যাডমিন ভেরিফাই করলেই ফাইল আনলক।'
                  : 'No fake card gateways. Complete transparent Send Money via bKash or Nagad; downloads unlock immediately upon admin verification.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Quick Order Verification Strip */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-2xl bg-[#0B1325] border border-slate-800 text-center space-y-4">
          <h3 className="text-lg font-bold text-white">
            {language === 'bn' ? 'ইতিমধ্যে অর্ডার করেছেন? আপনার ফাইল ডাউনলোড করুন' : 'Already Placed an Order? Retrieve Your Files'}
          </h3>
          <p className="text-xs text-slate-400 font-bengali max-w-lg mx-auto">
            {language === 'bn'
              ? 'আপনার অর্ডার নম্বর (যেমন HQG-84920) অথবা ফোন নম্বর দিয়ে সরাসরি অর্ডারের বর্তমান অবস্থা জানুন এবং ডাউনলোড লিংক পান।'
              : 'Enter your Order Number (e.g. HQG-84920) or Phone number to check payment verification status and access premium downloads.'}
          </p>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="text"
              value={trackInput}
              onChange={e => setTrackInput(e.target.value)}
              placeholder={language === 'bn' ? 'অর্ডার নম্বর বা ফোন...' : 'Order Number or Phone...'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors"
            >
              {language === 'bn' ? 'স্ট্যাটাস দেখুন' : 'Check Status'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
