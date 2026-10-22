import React from 'react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';
import { storageService } from '../services/storageService';
import { ArrowRight, Layers, Smartphone, Printer, Sparkles, HeartHandshake, PenTool } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { language, navigateToCategory } = useApp();
  const products = storageService.getProducts();

  const categoryConfigs: {
    id: Category;
    titleEn: string;
    titleBn: string;
    descriptionEn: string;
    descriptionBn: string;
    icon: any;
    format: string;
  }[] = [
    {
      id: 'islamic_eid',
      titleEn: 'Islamic & Eid Festival',
      titleBn: 'ইসলামিক ও পবিত্র ঈদ কালেকশন',
      descriptionEn: 'Opulent Eid Mubarak banners, Ramadan Mubarak posters, Islamic calligraphy, and crescent vector elements.',
      descriptionBn: 'ঈদ মোবারক পোস্টার, মাহে রমজান ব্যানার, ইসলামিক ক্যালিগ্রাফি ও সোশ্যাল মিডিয়া রেডি গ্রাফিক্স।',
      icon: Sparkles,
      format: 'PSD · AI · PLP',
    },
    {
      id: 'typography',
      titleEn: 'Bangla Typography & Hand Lettering',
      titleBn: 'বাংলা টাইপোগ্রাফি ও ক্যালিগ্রাফি',
      descriptionEn: 'Custom hand-lettered Bengali quotes, patriotic typographic emblems, and artistic lettering vectors.',
      descriptionBn: 'হাতে আঁকা বিশেষ বাংলা ক্যালিগ্রাফি, টি-শার্ট ভেক্টর প্রিন্ট ও অনুপ্রেরণামূলক উক্তি।',
      icon: PenTool,
      format: 'AI · EPS · PNG · PLP',
    },
    {
      id: 'social_media',
      titleEn: 'Social Media & Mobile PLP',
      titleBn: 'সোশ্যাল মিডিয়া ও মোবাইল PLP',
      descriptionEn: 'High conversion ad banners, carousel packs, YouTube thumbnails, and direct Pixellab projects for smartphones.',
      descriptionBn: 'বিজ্ঞাপন ব্যানার, ফেসবুক ও ইনস্টাগ্রাম পোস্ট, এবং স্মার্টফোনে এডিটযোগ্য পিক্সেলল্যাব ফাইল।',
      icon: Smartphone,
      format: 'PLP · PSD · PNG',
    },
    {
      id: 'branding',
      titleEn: 'Corporate Brand Identity & Stationery',
      titleBn: 'ব্র্যান্ড আইডেন্টিটি ও স্টেশনারি',
      descriptionEn: 'Full identity packages: business cards, letterhead, corporate presentations, envelopes, and brand style guides.',
      descriptionBn: 'কর্পোরেট ভিজিটিং কার্ড, প্যাড, ইনভেলাপ, ফোল্ডার এবং প্রফেশনাল প্রেজেন্টেশন কিট।',
      icon: Layers,
      format: 'AI · EPS · PSD',
    },
    {
      id: 'wedding',
      titleEn: 'Royal Wedding & Invitation Suite',
      titleBn: 'বাঙালি বিয়ে ও ওয়েডিং কার্ড',
      descriptionEn: 'Royal South Asian wedding invitations, laser-cut die folds, Shuvo Bibaho calligraphy, and festive card templates.',
      descriptionBn: 'শুভ বিবাহ ক্যালিগ্রাফি, রয়্যাল গোল্ডেন লেজার-কাট কার্ড, খাম ও সুদৃশ্য ইনভিটেশন টেমপ্লেট।',
      icon: HeartHandshake,
      format: 'AI · PSD · PDF',
    },
    {
      id: 'print_packaging',
      titleEn: 'Print, Menus & Product Packaging',
      titleBn: 'প্রেস প্রিন্ট, মেনু ও প্যাকেজিং',
      descriptionEn: 'Industrial packaging die-lines, foil embossing layers, food menu flyers, and 300 DPI offset print designs.',
      descriptionBn: 'রেস্টুরেন্ট মেনু, ফ্লায়ার, বক্স প্যাকেজিং এবং গোল্ড ফয়েল ও ইউভি কোটিং সেপারেশন ফাইল।',
      icon: Printer,
      format: 'CMYK PSD · AI · EPS · PDF',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-slate-800 pb-6 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {language === 'bn' ? 'ডিজাইন ক্যাটাগরি অনুসন্ধান' : 'Explore Design Categories'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 font-bengali">
          {language === 'bn'
            ? 'হক গ্রাফির প্রতিটি ক্যাটাগরিতে রয়েছে বিভিন্ন সফটওয়্যার উপযোগী ফাইল। আপনি আপনার প্রয়োজন অনুযায়ী ক্যাটাগরি বেছে নিন।'
            : 'Select from our rigorously tested design categories, engineered for maximum aesthetic fidelity and press reliability.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryConfigs.map(cat => {
          const Icon = cat.icon;
          const count = products.filter(p => p.category === cat.id).length;

          return (
            <div
              key={cat.id}
              onClick={() => navigateToCategory(cat.id)}
              className="p-6 rounded-2xl bg-[#0B1325] border border-slate-800 hover:border-amber-500/50 hover:bg-[#0F1B33] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
                    {count}+ {language === 'bn' ? 'ফাইল' : 'items'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors font-bengali">
                    {language === 'bn' ? cat.titleBn : cat.titleEn}
                  </h3>
                  <div className="text-[11px] font-mono text-amber-400/80 mt-1">
                    {cat.format}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-bengali leading-relaxed">
                    {language === 'bn' ? cat.descriptionBn : cat.descriptionEn}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-amber-400 transition-colors">
                <span>{language === 'bn' ? 'ক্যাটাগরির ডিজাইন দেখুন' : 'Explore Category'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
