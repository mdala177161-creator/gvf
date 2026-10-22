import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { PaymentMethod, Order } from '../types';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  Copy, 
  Check, 
  AlertCircle,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const {
    language,
    cart,
    clearCart,
    finalTotal,
    discountAmount,
    appliedCoupon,
    settings,
    setCurrentView,
    setLastCreatedOrder,
    lastCreatedOrder,
    showToast,
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const [copiedBkash, setCopiedBkash] = useState(false);
  const [copiedNagad, setCopiedNagad] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already placed order and viewing confirmation
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handleCopyNumber = (num: string, type: 'bkash' | 'nagad') => {
    const rawNumber = num.split(' ')[0].replace(/[^0-9]/g, '');
    navigator.clipboard.writeText(rawNumber);
    if (type === 'bkash') {
      setCopiedBkash(true);
      setTimeout(() => setCopiedBkash(false), 2000);
    } else {
      setCopiedNagad(true);
      setTimeout(() => setCopiedNagad(false), 2000);
    }
    showToast(language === 'bn' ? 'নম্বর কপি করা হয়েছে' : 'Number copied', 'info');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন' : 'Please fill all required fields', 'error');
      return;
    }

    if (paymentMethod !== 'whatsapp' && (!transactionId.trim() || !senderPhone.trim())) {
      showToast(
        language === 'bn' 
          ? 'অনুগ্রহ করে প্রেরক নম্বর ও ট্রানজেকশন আইডি (TrxID) প্রদান করুন' 
          : 'Please provide sender phone and Transaction ID (TrxID)', 
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const order = storageService.createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        whatsappNumber: whatsappNumber.trim() || customerPhone.trim(),
        items: [...cart],
        totalAmount: finalTotal,
        discountAmount,
        appliedCoupon: appliedCoupon || undefined,
        paymentMethod,
        senderPhone: senderPhone.trim() || undefined,
        transactionId: transactionId.trim().toUpperCase() || undefined,
        customerNote: customerNote.trim() || undefined,
      });

      setPlacedOrder(order);
      setLastCreatedOrder(order);
      clearCart();
      showToast(
        language === 'bn' 
          ? `অর্ডার রিকোয়েস্ট সফল হয়েছে! অর্ডার নং: ${order.orderNumber}` 
          : `Order submitted successfully! Order #: ${order.orderNumber}`, 
        'success'
      );
    } catch (err) {
      console.error(err);
      showToast('Error creating order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is submitted, display the transparent, real confirmation state
  if (placedOrder) {
    const waText = encodeURIComponent(
      `Hello Haque Graphy, I submitted Order #${placedOrder.orderNumber} for ৳${placedOrder.totalAmount}.\nTrxID: ${placedOrder.transactionId || 'N/A'}\nPlease verify my payment and release download link.`
    );
    const waLink = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${waText}`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0B1325] border border-amber-500/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold block mb-1">
              {language === 'bn' ? 'অর্ডার রিকোয়েস্ট গৃহীত হয়েছে' : 'Order Request Received'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {language === 'bn' ? 'পেমেন্ট ভেরিফিকেশন পেন্ডিং' : 'Manual Payment Verification Pending'}
            </h1>
          </div>

          {/* Transparent Notice */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed font-bengali text-left space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {language === 'bn' ? 'ম্যানুয়াল ভেরিফিকেশন প্রক্রিয়া:' : 'Manual Verification Process:'}
              </span>
            </div>
            <p>
              {language === 'bn'
                ? `আপনার অর্ডার নং: ${placedOrder.orderNumber}। আমরা কোনো স্বয়ংক্রিয় বা ভুয়া কার্ড চার্জ করি না। আপনার প্রেরিত বিকাশ/নগদ ট্রানজেকশন আইডি (${placedOrder.transactionId || 'N/A'}) যাচাই করার সাথে সাথেই প্রিমিয়াম ডাউনলোড লিঙ্ক কার্যকর হবে (সাধারণত ১০ থেকে ৩০ মিনিটের মধ্যে)।`
                : `Order #${placedOrder.orderNumber} has been recorded. Premium downloads will unlock immediately once our admin verifies your Transaction ID (${placedOrder.transactionId || 'N/A'}) against our bank statement (usually 10–30 minutes).`}
            </p>
          </div>

          {/* Order Details Card */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">{language === 'bn' ? 'অর্ডার নম্বর' : 'Order Number'}</span>
              <span className="font-mono font-bold text-amber-400">{placedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">{language === 'bn' ? 'গ্রাহকের নাম' : 'Customer'}</span>
              <span className="text-white font-medium">{placedOrder.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">{language === 'bn' ? 'ডেলিভারি ইমেইল' : 'Email'}</span>
              <span className="text-white font-medium">{placedOrder.customerEmail}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">{language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}</span>
              <span className="text-white font-mono uppercase">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-baseline pt-1 text-sm font-bold">
              <span className="text-slate-300">{language === 'bn' ? 'মোট পরিশোধযোগ্য' : 'Total Payable'}</span>
              <span className="text-amber-400 font-mono text-lg tabular-nums">৳{placedOrder.totalAmount}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('order_status')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>{language === 'bn' ? 'লাইভ অর্ডার স্ট্যাটাস ও ডাউনলোড পেইজ' : 'Track Status & Download Vault'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'দ্রুত অনুমোদনের জন্য WhatsApp করুন' : 'WhatsApp Admin for Fast Approval'}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no placed order
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">
          {language === 'bn' ? 'চেকআউট করার মতো কোনো আইটেম নেই' : 'No Items to Checkout'}
        </h2>
        <button
          onClick={() => setCurrentView('products')}
          className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
        >
          {language === 'bn' ? 'ডিজাইন ব্রাউজ করুন' : 'Explore Catalog'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <button
          onClick={() => setCurrentView('cart')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 mb-2 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'কার্টে ফিরে যান' : 'Back to Cart'}</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {language === 'bn' ? 'অর্ডার রিকোয়েস্ট ও পেমেন্ট' : 'Checkout & Order Request'}
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-bengali">
          {language === 'bn'
            ? 'সঠিক তথ্য প্রদান করুন। অ্যাডমিন কর্তৃক বিকাশ/নগদ পেমেন্ট ভেরিফাই হলে ফাইল ডাউনলোড সক্রিয় হবে।'
            : 'Provide your contact details and TrxID. Downloads unlock after manual verification.'}
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Customer details & Payment steps */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Contact Details */}
          <div className="p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-mono font-bold">1</span>
              <span>{language === 'bn' ? 'গ্রাহকের তথ্য ও ফাইল ডেলিভারি' : 'Customer & Delivery Contact'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">
                  {language === 'bn' ? 'আপনার নাম *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">
                  {language === 'bn' ? 'ইমেইল অ্যাড্রেস *' : 'Delivery Email *'}
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">
                  {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">
                  {language === 'bn' ? 'WhatsApp নম্বর (জরুরি সাপোর্টের জন্য)' : 'WhatsApp Number'}
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs text-slate-300 font-medium">
                {language === 'bn' ? 'অতিরিক্ত মন্তব্য বা নির্দেশিকা (ঐচ্ছিক)' : 'Order Note (Optional)'}
              </label>
              <textarea
                rows={2}
                value={customerNote}
                onChange={e => setCustomerNote(e.target.value)}
                placeholder={language === 'bn' ? 'কোন বিশেষ ফরম্যাট বা জরুরি প্রয়োজন থাকলে লিখুন...' : 'Any special requests or instructions...'}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>

          {/* Step 2: Payment Instructions & Transaction Verification */}
          <div className="p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-mono font-bold">2</span>
              <span>{language === 'bn' ? 'পেমেন্ট মাধ্যম ও ট্রানজেকশন ভেরিফিকেশন' : 'Payment Method & Verification'}</span>
            </h2>

            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'bkash'
                    ? 'bg-pink-950/30 border-pink-500 text-pink-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">bKash (বিকাশ)</div>
                <div className="text-[10px] opacity-75 mt-0.5">Send Money</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'nagad'
                    ? 'bg-amber-950/30 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">Nagad (নগদ)</div>
                <div className="text-[10px] opacity-75 mt-0.5">Send Money</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('whatsapp')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'whatsapp'
                    ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">WhatsApp Support</div>
                <div className="text-[10px] opacity-75 mt-0.5">Direct Help</div>
              </button>
            </div>

            {/* Instructions box for selected method */}
            {paymentMethod === 'bkash' && (
              <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-900/60 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-pink-300">
                    {language === 'bn' ? 'বিকাশ নম্বর (পার্সোনাল - Send Money):' : 'bKash Personal Number:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber(settings.bkashNumber, 'bkash')}
                    className="flex items-center gap-1 text-[11px] bg-pink-900/40 text-pink-200 px-2 py-0.5 rounded border border-pink-700/50 hover:bg-pink-900/60 transition-colors"
                  >
                    {copiedBkash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBkash ? 'কপি হয়েছে' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-base font-mono font-bold text-white tracking-wider">
                  {settings.bkashNumber}
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-bengali text-[11px] leading-relaxed">
                  <li>আপনার বিকাশ অ্যাপে গিয়ে <strong>Send Money</strong> সিলেক্ট করুন</li>
                  <li>উপরের নম্বরে মোট <strong>৳{finalTotal}</strong> টাকা সেন্ড মানি করুন</li>
                  <li>সেন্ড মানি সফল হলে পাওয়া <strong>TrxID (ট্রানজেকশন আইডি)</strong> নিচের বক্সে লিখুন</li>
                </ol>
              </div>
            )}

            {paymentMethod === 'nagad' && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/60 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-300">
                    {language === 'bn' ? 'নগদ নম্বর (পার্সোনাল - Send Money):' : 'Nagad Personal Number:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber(settings.nagadNumber, 'nagad')}
                    className="flex items-center gap-1 text-[11px] bg-amber-900/40 text-amber-200 px-2 py-0.5 rounded border border-amber-700/50 hover:bg-amber-900/60 transition-colors"
                  >
                    {copiedNagad ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedNagad ? 'কপি হয়েছে' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-base font-mono font-bold text-white tracking-wider">
                  {settings.nagadNumber}
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-bengali text-[11px] leading-relaxed">
                  <li>নগদ অ্যাপ থেকে <strong>Send Money</strong> অপশন বেছে নিন</li>
                  <li>উপরের নম্বরে মোট <strong>৳{finalTotal}</strong> টাকা সেন্ড মানি করুন</li>
                  <li>ফিরতি এসএমএস এর <strong>TrxID</strong> নিচের ইনপুট বক্সে লিখে সাবমিট করুন</li>
                </ol>
              </div>
            )}

            {paymentMethod === 'whatsapp' && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/60 space-y-2 text-xs">
                <div className="font-semibold text-emerald-300">
                  {language === 'bn' ? 'হোয়াটসঅ্যাপ সহায়তা অর্ডার:' : 'WhatsApp Direct Assistance:'}
                </div>
                <p className="text-slate-300 font-bengali text-[11px] leading-relaxed">
                  {language === 'bn'
                    ? 'আপনি অর্ডার সাবমিট করার পর আমাদের প্রতিনিধি আপনাকে সরাসরি হোয়াটসঅ্যাপে পেমেন্ট ইনভয়েস ও কিউআর কোড প্রদান করবেন।'
                    : 'Our representative will communicate with you on WhatsApp with bank or merchant QR details.'}
                </p>
              </div>
            )}

            {/* Verification Inputs */}
            {paymentMethod !== 'whatsapp' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">
                    {language === 'bn' ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender No) *' : 'Sender Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={e => setSenderPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">
                    {language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID) *' : 'Transaction ID (TrxID) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    placeholder="e.g. 9B7X2K4M10"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-5 bg-[#0B1325] border border-slate-800 rounded-2xl p-6 space-y-6 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            {language === 'bn' ? 'অর্ডারের পণ্যসমূহ' : 'Items in Order'}
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map(item => {
              const product = item.product;
              const title = language === 'bn' ? product.titleBn : product.title;
              const price = product.salePrice ?? product.price;

              return (
                <div key={product.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                  <div className="flex-1 pr-3">
                    <div className="text-white font-medium line-clamp-1">{title}</div>
                    <span className="text-[10px] text-amber-400 font-mono">{product.fileType} · {product.fileSize}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">৳{price}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>{language === 'bn' ? 'ডিসকাউন্ট' : 'Discount'}</span>
                <span className="font-mono tabular-nums">-৳{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline text-base font-bold text-white">
              <span>{language === 'bn' ? 'সর্বমোট পরিশোধ' : 'Grand Total'}</span>
              <span className="text-2xl font-black text-amber-400 font-mono tabular-nums">৳{finalTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:translate-y-[-1px]"
          >
            {isSubmitting ? (
              <span>{language === 'bn' ? 'প্রক্রিয়াকরণ হচ্ছে...' : 'Processing...'}</span>
            ) : (
              <>
                <span>{language === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-[11px] text-slate-400 text-center font-bengali">
            {language === 'bn'
              ? 'অর্ডার সাবমিট হওয়ার পর আমাদের অ্যাডমিন ট্রানজেকশন ভেরিফাই করবেন এবং আপনি ডিজিটাল ফাইল আনলক পাবেন।'
              : 'Files unlock immediately following reliable admin verification of your payment.'}
          </div>
        </div>
      </form>
    </div>
  );
};
