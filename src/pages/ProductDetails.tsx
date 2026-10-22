import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { ProductCard } from '../components/ProductCard';
import { 
  ShoppingBag, 
  Download, 
  ArrowLeft, 
  MessageCircle, 
  CheckCircle2, 
  FileCode, 
  Layers, 
  Monitor, 
  ShieldCheck, 
  Printer, 
  HelpCircle,
  Share2,
  Copy,
  Check
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const {
    language,
    selectedProductId,
    setCurrentView,
    addToCart,
    settings,
    showToast,
  } = useApp();

  const [licenseType, setLicenseType] = useState<'standard' | 'commercial'>('standard');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);

  const product = selectedProductId ? storageService.getProductById(selectedProductId) : null;
  const allProducts = storageService.getProducts().filter(p => p.isPublished);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">
          {language === 'bn' ? 'ডিজাইনটি পাওয়া যায়নি' : 'Product Not Found'}
        </h2>
        <button
          onClick={() => setCurrentView('products')}
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
        >
          {language === 'bn' ? 'সকল ডিজাইনে ফিরে যান' : 'Back to Catalog'}
        </button>
      </div>
    );
  }

  const title = language === 'bn' ? product.titleBn : product.title;
  const description = language === 'bn' ? product.descriptionBn : product.description;
  const categoryName = language === 'bn' ? product.categoryNameBn : product.categoryNameEn;
  const features = language === 'bn' ? product.featuresBn : product.features;

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.fileType === product.fileType))
    .slice(0, 3);

  // WhatsApp order link
  const waMessage = encodeURIComponent(
    `Hello Haque Graphy! I want to purchase this design:\nTitle: ${product.title}\nID: ${product.id}\nPrice: ৳${product.salePrice ?? product.price}\nPlease send bKash/Nagad details.`
  );
  const waUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${waMessage}`;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast(language === 'bn' ? 'লিংক কপি করা হয়েছে' : 'Product link copied', 'info');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDirectFreeDownload = () => {
    storageService.incrementDownload(product.id);
    showToast(
      language === 'bn' ? `ডাউনলোড শুরু হয়েছে: ${product.titleBn}` : `Free download started: ${product.title}`, 
      'success'
    );

    // Create a realistic sample text file download representing the package readme & assets
    const content = `Haque Graphy Digital Asset Delivery\n------------------------------------\nProduct: ${product.title}\nCategory: ${product.categoryNameEn}\nFormat: ${product.fileType}\nSpecs: ${product.dimensions} | ${product.colorMode} | ${product.dpi} DPI\n\nThank you for downloading from Haque Graphy.\nVisit: https://haquegraphy.com`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.slug}-${product.fileType.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('products')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সকল ডিজাইনে ফিরে যান' : 'Back to Catalog'}</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedLink ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'শেয়ার' : 'Share')}</span>
        </button>
      </div>

      {/* Main Two-Column Contiguous Purchase Module PDP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Preview Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/3] group shadow-2xl">
            <img
              src={product.previewImage}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />

            {/* Subtle Watermark Overlay if active */}
            {showWatermark && !product.isFree && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="text-white/25 text-3xl sm:text-4xl font-extrabold tracking-widest font-display rotate-[-25deg] select-none border-2 border-dashed border-white/20 p-6 rounded-2xl">
                  HAQUE GRAPHY PREVIEW
                </div>
              </div>
            )}

            {/* Preview controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md text-amber-400 border border-slate-700">
                {product.fileType} · {product.dimensions} · {product.colorMode}
              </span>

              {!product.isFree && (
                <button
                  onClick={() => setShowWatermark(!showWatermark)}
                  className="text-[10px] bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-white border border-slate-700 px-2 py-1 rounded transition-colors"
                >
                  {showWatermark 
                    ? (language === 'bn' ? 'ওয়াটারমার্ক লুকান' : 'Hide Watermark') 
                    : (language === 'bn' ? 'ওয়াটারমার্ক দেখান' : 'Show Watermark')}
                </button>
              )}
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#0B1325] border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{language === 'bn' ? 'সফটওয়্যার' : 'Software'}</span>
              <span className="text-xs font-semibold text-white mt-0.5 block truncate">{product.softwareVersion}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1325] border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{language === 'bn' ? 'কালার মোড' : 'Color Mode'}</span>
              <span className="text-xs font-semibold text-white mt-0.5 block font-mono">{product.colorMode}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1325] border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{language === 'bn' ? 'রেজোলিউশন' : 'Resolution'}</span>
              <span className="text-xs font-semibold text-white mt-0.5 block font-mono">{product.dpi} DPI</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1325] border border-slate-800 col-span-3 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{language === 'bn' ? 'সাইজ' : 'File Size'}</span>
              <span className="text-xs font-semibold text-amber-400 mt-0.5 block font-mono">{product.fileSize}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-[#0B1325] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
          <div>
            {/* Unboxed Metadata with · separator */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2">
              <span className="text-amber-400">{categoryName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{product.fileType}</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'bn' ? '১০০% এডিটেবল' : 'Fully Editable'}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {title}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">{language === 'bn' ? 'নির্ধারিত মূল্য' : 'Price'}</span>
              {product.isFree ? (
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {language === 'bn' ? '৳০ (সম্পূর্ণ ফ্রি)' : '৳0 Free'}
                </div>
              ) : (
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-amber-400 font-mono tabular-nums">
                    ৳{product.salePrice ?? product.price}
                  </span>
                  {product.salePrice && (
                    <span className="text-sm text-slate-500 line-through font-mono tabular-nums">
                      ৳{product.price}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded font-semibold block">
                {product.isFree ? (language === 'bn' ? 'তাত্ক্ষণিক ডাউনলোড' : 'Direct Access') : (language === 'bn' ? 'স্টক এভেইলেবল' : 'Instant License')}
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-1">
            {product.isFree ? (
              <button
                onClick={handleDirectFreeDownload}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'bn' ? 'বিনামূল্যে সরাসরি ডাউনলোড করুন' : 'Download Free Package'}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => addToCart(product, licenseType)}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{language === 'bn' ? 'কার্টে যোগ করুন ও অর্ডার করুন' : 'Add to Cart & Checkout'}</span>
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন' : 'Order Directly on WhatsApp'}</span>
                </a>
              </>
            )}
          </div>

          {/* Reassurance list */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{language === 'bn' ? 'বিকাশ ও নগদ পার্সোনাল/মার্চেন্ট সেন্ড মানি ভেরিফিকেশন' : 'Verified via bKash / Nagad Send Money'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{language === 'bn' ? 'প্রিন্ট ও সোশ্যাল মিডিয়া ব্যবহারের পূর্ণ লাইসেন্স' : 'Full commercial & offset printing rights'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{language === 'bn' ? 'ফন্ট লিঙ্ক ও ব্যবহারের বিস্তারিত গাইড অন্তর্ভুক্ত' : 'Font download links and readme guide included'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Detailed Feature Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-slate-800 pt-10">
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              {language === 'bn' ? 'ডিজাইনের বিস্তারিত বিবরণ' : 'Description & Specifications'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-bengali">
              {description}
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3">
              {language === 'bn' ? 'ফাইল ও ডিজাইনের মূল বৈশিষ্ট্যসমূহ' : 'Key Package Highlights'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feat, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-[#0B1325] border border-slate-800/80 flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="text-xs text-slate-300 font-bengali leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Support Box */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#090F1E] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? 'সাপোর্ট বা কাস্টম ডিজাইন দরকার?' : 'Need Assistance or Customization?'}</span>
          </h3>
          <p className="text-xs text-slate-400 font-bengali leading-relaxed">
            {language === 'bn'
              ? 'ফাইল ওপেন বা এডিটিং নিয়ে কোন সমস্যা হলে অথবা আপনার নিজের প্রতিষ্ঠানের জন্য কাস্টম ডিজাইন অর্ডার করতে আমাদের সাথে হোয়াটসঅ্যাপে কথা বলুন।'
              : 'Our design studio provides 1-on-1 assistance for opening files, fonts installation, or custom printing die-lines.'}
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300"
          >
            <span>WhatsApp: {settings.whatsappNumber}</span>
          </a>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-800 pt-10 space-y-6">
          <h3 className="text-xl font-bold text-white">
            {language === 'bn' ? 'সম্পর্কিত অন্যান্য ডিজাইন' : 'Related Designs'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
