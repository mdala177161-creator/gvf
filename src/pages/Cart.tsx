import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ArrowRight, ShoppingBag, Tag, ShieldCheck, ArrowLeft } from 'lucide-react';

export const Cart: React.FC = () => {
  const {
    language,
    cart,
    removeFromCart,
    clearCart,
    cartSubtotal,
    discountAmount,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    finalTotal,
    setCurrentView,
    navigateToProduct,
    showToast,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    if (res.success) {
      showToast(res.message, 'success');
      setCouponInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          {language === 'bn' ? 'আপনার শপিং কার্ট খালি' : 'Your Cart is Currently Empty'}
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto font-bengali">
          {language === 'bn'
            ? 'হক গ্রাফির আকর্ষণীয় পিএসডি, এআই, এবং মোবাইল পিক্সেলল্যাব ডিজাইন সংগ্রহ থেকে আপনার পছন্দের টেমপ্লেট বেছে নিন।'
            : 'Explore our catalog of premium Photoshop, Illustrator, and Pixellab templates.'}
        </p>
        <button
          onClick={() => setCurrentView('products')}
          className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <span>{language === 'bn' ? 'ডিজাইন ক্যাটালগ দেখুন' : 'Browse Templates'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {cart.length} {language === 'bn' ? 'টি আইটেম যোগ করা হয়েছে' : 'item(s) in bag'}
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
        >
          {language === 'bn' ? 'কার্ট খালি করুন' : 'Clear All'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => {
            const product = item.product;
            const title = language === 'bn' ? product.titleBn : product.title;
            const price = product.salePrice ?? product.price;

            return (
              <div
                key={product.id}
                className="p-4 sm:p-5 rounded-xl bg-[#0B1325] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => navigateToProduct(product.id)}
                    className="w-20 h-16 rounded-lg bg-slate-900 overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img
                      src={product.previewImage}
                      alt={title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-amber-400 font-mono">
                      <span>{product.fileType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.fileSize}</span>
                    </div>

                    <h3
                      onClick={() => navigateToProduct(product.id)}
                      className="text-sm font-semibold text-white hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {title}
                    </h3>

                    <div className="text-xs text-slate-400 mt-0.5">
                      {language === 'bn' ? 'লাইসেন্স: বাণিজ্যিক ও প্রিন্ট ব্যবহারের পূর্ণ অধিকার' : 'Commercial & Print Use License'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-base font-bold text-amber-400 font-mono tabular-nums">
                      ৳{price}
                    </span>
                    {product.salePrice && (
                      <span className="text-xs text-slate-500 line-through block font-mono tabular-nums">
                        ৳{product.price}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => setCurrentView('products')}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আরও ডিজাইন ব্রাউজ করুন' : 'Continue Shopping'}</span>
            </button>
          </div>
        </div>

        {/* Order Summary & Coupon box */}
        <div className="lg:col-span-4 bg-[#0B1325] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            {language === 'bn' ? 'অর্ডার সারাংশ' : 'Order Summary'}
          </h2>

          {/* Coupon Code Input */}
          <div>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
                placeholder={language === 'bn' ? 'কুপন কোড (যেমন: HAQUE20)' : 'Coupon Code (e.g. HAQUE20)'}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
              >
                {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg mt-2 font-mono">
                <span>Code: {appliedCoupon} applied</span>
                <button onClick={removeCoupon} className="text-rose-400 hover:underline">
                  {language === 'bn' ? 'মুছুন' : 'Remove'}
                </button>
              </div>
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
              <span className="font-mono tabular-nums text-white">৳{cartSubtotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>{language === 'bn' ? 'ডিসকাউন্ট' : 'Discount'}</span>
                <span className="font-mono tabular-nums">-৳{discountAmount}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline text-sm font-bold text-white">
              <span>{language === 'bn' ? 'মোট প্রদেয়' : 'Total Amount'}</span>
              <span className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                ৳{finalTotal}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => setCurrentView('checkout')}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:translate-y-[-1px]"
          >
            <span>{language === 'bn' ? 'চেকআউট ও পেমেন্ট রিকোয়েস্ট' : 'Proceed to Checkout'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Payment reassurance */}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              {language === 'bn'
                ? 'বিকাশ ও নগদ পার্সোনাল/মার্চেন্ট সেন্ড মানি ভেরিফিকেশনের মাধ্যমে ১০০% নিরাপদ পেমেন্ট নিশ্চিত করা হয়।'
                : 'Manual bKash/Nagad verification ensures guaranteed delivery with verified download tokens.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
