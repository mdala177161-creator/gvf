import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Download, Smartphone, Printer, MessageCircle, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setCurrentView, settings } = useApp();

  return (
    <footer className="bg-[#060A14] border-t border-slate-800 text-slate-400 text-sm">
      {/* Trust & Guarantee strip */}
      <div className="border-b border-slate-800/80 bg-[#080E1C]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {language === 'bn' ? '১০০% প্রিন্ট-রেডি ফাইল' : '100% Print-Ready Files'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'bn' ? '৩০০ DPI, CMYK কালার প্রোফাইল ও কাটিং ব্লিড সহ নিখুঁত' : '300 DPI, CMYK color and precision trim lines'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {language === 'bn' ? 'পিক্সেলল্যাব (.PLP) সাপোর্ট' : 'Pixellab (.PLP) Ready'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'bn' ? 'কম্পিউটার ছাড়াই স্মার্টফোনে সরাসরি এডিট করার সুবিধা' : 'Edit directly on smartphones without PC required'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {language === 'bn' ? 'তাত্ক্ষণিক ডিজিটাল ডাউনলোড' : 'Instant Digital Delivery'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'bn' ? 'ফ্রি ফাইল সাথে সাথে ও প্রিমিয়াম ফাইল ভেরিফিকেশনে' : 'Direct free downloads & secure verified token access'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {language === 'bn' ? 'বিকাশ ও নগদ ম্যানুয়াল ভেরিফিকেশন' : 'bKash & Nagad Verified'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'bn' ? 'অর্ডার নম্বর ও ট্রানজেকশন আইডি দিয়ে নিরাপদ কেনাকাটা' : 'Reliable manual transaction verification'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg">
                H
              </div>
              <span className="text-lg font-bold text-white font-display">Haque Graphy</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm font-bengali">
              {language === 'bn'
                ? 'হক গ্রাফি — রুচিশীল ডিজাইন ও নিখুঁত প্রিন্ট। বাংলাদেশের গ্রাফিক্স ডিজাইনার, প্রিন্টিং প্রেস এবং কনটেন্ট ক্রিয়েটরদের জন্য প্রিমিয়াম পিএসডি, এআই, ইপিএস ও মোবাইল পিএলপি টেমপ্লেটের বিশ্বস্ত মার্কেটপ্লেস।'
                : 'Haque Graphy is a dedicated digital design marketplace engineered for graphic designers, offset printers, and digital agencies across Bangladesh. High quality PSD, AI, EPS, and mobile Pixellab PLP templates.'}
            </p>
            <div className="pt-2 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{language === 'bn' ? settings.studioAddressBn : settings.studioAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: {settings.whatsappNumber}</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              {language === 'bn' ? 'মার্কেটপ্লেস' : 'Marketplace'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentView('products')} className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'সকল টেমপ্লেট' : 'All Templates'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('free')} className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'ফ্রি ডিজাইন ডাউনলোড' : 'Free Design Downloads'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('premium')} className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'প্রিমিয়াম বান্ডেল' : 'Premium Bundles'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Browse Categories'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('order_status')} className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'অর্ডার ট্র্যাকিং ও ফাইল ডাউনলোড' : 'Track Order & Downloads'}
                </button>
              </li>
            </ul>
          </div>

          {/* Supported formats */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              {language === 'bn' ? 'সাপোর্টেড ফরম্যাট' : 'Supported Formats'}
            </h5>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">Pixellab .PLP</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">Photoshop .PSD</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">Illustrator .AI</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">Vector .EPS</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">Print .PDF</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">Asset .ZIP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 leading-normal">
              {language === 'bn' 
                ? 'সকল ভেক্টর ও সিএমওয়াইকে ফাইল অফসেট ও ডিজিটাল প্রিন্টিং মেশিনে নির্বিঘ্নে প্রিন্ট করা যায়।'
                : 'All CMYK vector files are engineered specifically for commercial offset & digital presses.'}
            </p>
          </div>

          {/* Policy & Legal */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              {language === 'bn' ? 'নীতিমালা ও তথ্য' : 'Legal & Trust'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentView('privacy')} className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'গোপনীয়তা নীতি (Privacy)' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms')} className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'শর্তাবলী ও লাইসেন্স (Terms)' : 'Terms & Licensing'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contact')} className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact & Support'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin')} className="text-slate-400 hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'প্রশাসনিক পোর্টাল (/admin)' : 'Admin Portal (/admin)'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} Haque Graphy. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Netlify & Supabase Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Manual bKash/Nagad Escrow Gateway</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
