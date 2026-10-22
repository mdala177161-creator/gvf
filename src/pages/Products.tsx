import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { ProductCard } from '../components/ProductCard';
import { Category, FileFormat } from '../types';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

interface ProductsPageProps {
  initialTypeFilter?: 'all' | 'free' | 'premium';
}

export const Products: React.FC<ProductsPageProps> = ({ initialTypeFilter = 'all' }) => {
  const {
    language,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedFormat,
    setSelectedFormat,
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<'all' | 'free' | 'premium'>(initialTypeFilter);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price_asc' | 'price_desc'>('newest');

  const allProducts = storageService.getProducts().filter(p => p.isPublished);

  const categories: { id: Category | 'all'; labelEn: string; labelBn: string }[] = [
    { id: 'all', labelEn: 'All Categories', labelBn: 'সকল ক্যাটাগরি' },
    { id: 'islamic_eid', labelEn: 'Islamic & Eid', labelBn: 'ইসলামিক ও ঈদ' },
    { id: 'typography', labelEn: 'Bangla Typography', labelBn: 'বাংলা টাইপোগ্রাফি' },
    { id: 'social_media', labelEn: 'Social Media & PLP', labelBn: 'সোশ্যাল ব্যানার ও PLP' },
    { id: 'branding', labelEn: 'Brand Identity', labelBn: 'ব্র্যান্ডিং ও স্টেশনারি' },
    { id: 'wedding', labelEn: 'Wedding & Biye Card', labelBn: 'ওয়েডিং ও বিয়ের কার্ড' },
    { id: 'print_packaging', labelEn: 'Print & Packaging', labelBn: 'প্রেস প্রিন্ট ও প্যাকেজিং' },
  ];

  const formats: (FileFormat | 'all')[] = ['all', 'PLP', 'PSD', 'AI', 'EPS', 'ZIP', 'PDF'];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(p => {
        // Free / Premium filter
        if (typeFilter === 'free' && !p.isFree) return false;
        if (typeFilter === 'premium' && p.isFree) return false;

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

        // File format filter
        if (selectedFormat !== 'all' && p.fileType !== selectedFormat) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q) || p.titleBn.toLowerCase().includes(q);
          const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
          const matchSoftware = p.softwareVersion.toLowerCase().includes(q);
          const matchFormat = p.fileType.toLowerCase().includes(q);
          if (!matchTitle && !matchTag && !matchSoftware && !matchFormat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'popular') {
          const scoreA = (a.salesCount || 0) * 2 + (a.downloadCount || 0);
          const scoreB = (b.salesCount || 0) * 2 + (b.downloadCount || 0);
          return scoreB - scoreA;
        }
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;
        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        return 0;
      });
  }, [allProducts, typeFilter, selectedCategory, selectedFormat, searchQuery, sortBy]);

  const resetFilters = () => {
    setTypeFilter('all');
    setSelectedCategory('all');
    setSelectedFormat('all');
    setSearchQuery('');
  };

  const hasActiveFilters = typeFilter !== 'all' || selectedCategory !== 'all' || selectedFormat !== 'all' || searchQuery !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header and Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {typeFilter === 'free'
                ? (language === 'bn' ? 'ফ্রি ডিজাইন কালেকশন' : 'Free Design Vault')
                : typeFilter === 'premium'
                ? (language === 'bn' ? 'প্রিমিয়াম ডিজাইন টেমপ্লেট' : 'Premium Design Catalog')
                : (language === 'bn' ? 'সকল ডিজিটাল ডিজাইন' : 'All Digital Design Assets')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-bengali">
              {language === 'bn'
                ? 'পিক্সেলল্যাব (.PLP), ফটোশপ (.PSD), ইলাস্ট্রেটর (.AI) এবং ভেক্টর (.EPS) ফাইল ব্রাউজ করুন।'
                : 'Showing curated production-tested assets with full commercial and print license options.'}
            </p>
          </div>

          {/* Type Toggle: Functional button segmented control */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0 self-start md:self-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                typeFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'সকল' : 'All'}
            </button>
            <button
              onClick={() => setTypeFilter('free')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                typeFilter === 'free'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'ফ্রি ফাইল' : 'Free Files'}
            </button>
            <button
              onClick={() => setTypeFilter('premium')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                typeFilter === 'premium'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'প্রিমিয়াম' : 'Premium'}
            </button>
          </div>
        </div>

        {/* Search & Sub-filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'টাইপোগ্রাফি, পিএলপি বা ট্যাগ খুঁজুন...' : 'Search designs, tags, or PLP...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown/Selector */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {language === 'bn' ? c.labelBn : c.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Format Tabs / Pill-free buttons */}
          <div className="lg:col-span-3 flex items-center gap-1 overflow-x-auto py-1">
            {formats.map(f => (
              <button
                key={f}
                onClick={() => setSelectedFormat(f)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors whitespace-nowrap ${
                  selectedFormat === f
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {f === 'all' ? (language === 'bn' ? 'সব ফরম্যাট' : 'All') : f}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="newest">{language === 'bn' ? 'নতুন রিলিজ' : 'Newest'}</option>
              <option value="popular">{language === 'bn' ? 'জনপ্রিয়' : 'Most Popular'}</option>
              <option value="price_asc">{language === 'bn' ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
              <option value="price_desc">{language === 'bn' ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <span>{language === 'bn' ? 'ফিল্টার সক্রিয়:' : 'Active filters:'}</span>
            <span className="text-white font-mono">{filteredProducts.length}</span>
            <span>{language === 'bn' ? 'টি ডিজাইন পাওয়া গেছে' : 'items found'}</span>
            <button
              onClick={resetFilters}
              className="text-amber-400 hover:underline ml-2"
            >
              {language === 'bn' ? 'সব মুছুন' : 'Reset all'}
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center rounded-2xl bg-[#0B1325] border border-slate-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 text-slate-400 flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {language === 'bn' ? 'কোন ডিজাইন পাওয়া যায়নি' : 'No Designs Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-bengali">
            {language === 'bn'
              ? 'আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোন পণ্য পাওয়া যায়নি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।'
              : 'No matching items found for the current combination of search and filters.'}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
          >
            {language === 'bn' ? 'সকল ফিল্টার রিসেট করুন' : 'Clear All Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
