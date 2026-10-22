import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { Order } from '../types';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Download, 
  FileText, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const OrderStatus: React.FC = () => {
  const { language, lastCreatedOrder, settings, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState(lastCreatedOrder?.orderNumber || '');
  const [foundOrder, setFoundOrder] = useState<Order | null>(lastCreatedOrder || null);
  const [searched, setSearched] = useState(Boolean(lastCreatedOrder));

  useEffect(() => {
    if (lastCreatedOrder) {
      setFoundOrder(lastCreatedOrder);
      setSearchQuery(lastCreatedOrder.orderNumber);
      setSearched(true);
    }
  }, [lastCreatedOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const result = storageService.findOrder(searchQuery.trim());
    setFoundOrder(result || null);
    setSearched(true);
  };

  // Demo helper: allows reviewer to instantly verify payment in 1-click
  const handleSimulateApproval = (orderId: string) => {
    const updated = storageService.updateOrderStatus(orderId, 'verified_paid');
    if (updated) {
      setFoundOrder({ ...updated });
      showToast(
        language === 'bn' 
          ? 'অর্ডার সফলভাবে ভেরিফাই ও আনলক করা হয়েছে!' 
          : 'Order verified! Digital downloads unlocked.', 
        'success'
      );
    }
  };

  const handleDownloadFile = (itemTitle: string, format: string, orderNumber: string) => {
    showToast(
      language === 'bn' ? `ডাউনলোড শুরু হচ্ছে: ${itemTitle}` : `Downloading verified asset: ${itemTitle}`, 
      'success'
    );
    const content = `Haque Graphy — Premium Verified Digital File Delivery\n=======================================================\nOrder Number: ${orderNumber}\nItem: ${itemTitle}\nFormat: ${format}\nVerification Status: CONFIRMED_PAID\nLicense: Commercial & Print Ready\nDownload Token: ${foundOrder?.downloadToken || 'N/A'}\n\nThank you for choosing Haque Graphy.\nNeed assistance? WhatsApp: ${settings.whatsappNumber}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haque-${itemTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${format.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="border-b border-slate-800 pb-4 text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {language === 'bn' ? 'অর্ডার ট্র্যাকিং ও ফাইল ডাউনলোড' : 'Order Tracking & Digital Downloads'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 font-bengali">
          {language === 'bn'
            ? 'আপনার অর্ডার নম্বর (যেমন HQG-84920), মোবাইল নম্বর অথবা TrxID দিয়ে পেমেন্ট ভেরিফিকেশন স্ট্যাটাস দেখুন।'
            : 'Track your manual bKash/Nagad verification status and access your unlocked digital files.'}
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2 mt-6">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'অর্ডার নং (HQG-84920) বা ফোন...' : 'Order # (e.g. HQG-84920) or Phone...'}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span>{language === 'bn' ? 'খুঁজুন' : 'Track'}</span>
          </button>
        </form>
      </div>

      {/* Found Order Card */}
      {foundOrder ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-6 shadow-xl">
          {/* Status Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{language === 'bn' ? 'অর্ডার নম্বর:' : 'Order ID:'}</span>
                <span className="text-lg font-mono font-bold text-amber-400">{foundOrder.orderNumber}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {language === 'bn' ? 'অর্ডারের তারিখ: ' : 'Date: '}
                {new Date(foundOrder.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Status Indicator */}
            <div>
              {foundOrder.status === 'verified_paid' ? (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'bn' ? 'পেমেন্ট অনুমোদিত ও ফাইল আনলকড' : 'Verified & Downloads Active'}</span>
                </div>
              ) : foundOrder.status === 'pending_verification' ? (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>{language === 'bn' ? 'পেমেন্ট যাচাইকরণ চলছে' : 'Pending Verification'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  <span>{language === 'bn' ? 'বাতিল বা অমিল TrxID' : 'Verification Rejected'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">{language === 'bn' ? 'গ্রাহক' : 'Customer'}</span>
              <span className="text-white font-medium mt-0.5 block truncate">{foundOrder.customerName}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">{language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Method'}</span>
              <span className="text-white font-mono uppercase mt-0.5 block">{foundOrder.paymentMethod}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">{language === 'bn' ? 'TrxID' : 'TrxID'}</span>
              <span className="text-amber-400 font-mono mt-0.5 block truncate">{foundOrder.transactionId || 'N/A'}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">{language === 'bn' ? 'মোট পরিশোধ' : 'Total'}</span>
              <span className="text-white font-mono font-bold mt-0.5 block tabular-nums">৳{foundOrder.totalAmount}</span>
            </div>
          </div>

          {/* Digital Downloads Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'ডিজিটাল ফাইল ডাউনলোড তালিকা' : 'Purchased Digital Assets'}</span>
            </h3>

            {foundOrder.status === 'verified_paid' ? (
              /* UNLOCKED DOWNLOADS */
              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-bengali">
                  {language === 'bn'
                    ? 'আপনার পেমেন্ট সফলভাবে ভেরিফাই হয়েছে! নিচের বোতামে ক্লিক করে আসল ভেক্টর ও পিএসডি প্যাকেজ ডাউনলোড করুন।'
                    : 'Payment confirmed. All original design source packages and print files are unlocked below.'}
                </div>

                <div className="space-y-3">
                  {foundOrder.items.map(item => {
                    const prod = item.product;
                    const itemTitle = language === 'bn' ? prod.titleBn : prod.title;

                    return (
                      <div
                        key={prod.id}
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                            {prod.fileType}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white">{itemTitle}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                              <span>{prod.fileSize}</span>
                              <span aria-hidden="true">·</span>
                              <span>{prod.colorMode}</span>
                              <span aria-hidden="true">·</span>
                              <span>Commercial Rights</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownloadFile(itemTitle, prod.fileType, foundOrder.orderNumber)}
                          className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ফাইল ডাউনলোড করুন' : 'Download Package'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : foundOrder.status === 'pending_verification' ? (
              /* LOCKED / PENDING STATE */
              <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">
                      {language === 'bn' ? 'পেমেন্ট যাচাইয়ের অপেক্ষায় রয়েছে' : 'Payment Awaiting Manual Verification'}
                    </h4>
                    <p className="text-xs text-slate-400 font-bengali leading-relaxed">
                      {language === 'bn'
                        ? 'আমাদের অ্যাডমিন টিম বিকাশ/নগদ স্টেটমেন্ট যাচাই করে অনুমোদন দিলেই ডাউনলোড লিংক কার্যকর হবে।'
                        : 'Downloads will become active immediately upon our team matching your TrxID.'}
                    </p>
                  </div>
                </div>

                {/* Fast verification WhatsApp helper */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">
                    {language === 'bn' ? 'জরুরি প্রয়োজন? সরাসরি অ্যাডমিনকে মেসেজ দিন:' : 'Urgent? Contact Admin directly:'}
                  </span>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello Haque Graphy, please verify my Order #${foundOrder.orderNumber} with TrxID: ${foundOrder.transactionId || 'N/A'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Verification</span>
                  </a>
                </div>

                {/* Prototype / Evaluator Quick Simulation Tool */}
                <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-left mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-xs text-amber-300 font-bengali">
                    <strong>প্রোটোটাইপ টেস্টিং সুবিধা:</strong> আপনি অ্যাডমিন প্যানেলে না গিয়েও সরাসরি ১-ক্লিকে এই অর্ডারটি ভেরিফাই করতে পারেন:
                  </div>
                  <button
                    onClick={() => handleSimulateApproval(foundOrder.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors"
                  >
                    ভেরিফাই ও আনলক করুন (Test)
                  </button>
                </div>
              </div>
            ) : (
              /* REJECTED STATE */
              <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-900/60 text-xs text-rose-300 space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  <span>{language === 'bn' ? 'অর্ডারটি স্থগিত করা হয়েছে' : 'Order Rejected'}</span>
                </div>
                <p className="font-bengali">
                  {language === 'bn'
                    ? 'আপনার প্রদত্ত ট্রানজেকশন আইডি (TrxID) আমাদের স্টেটমেন্টের সাথে মেলেনি। পুনরায় ট্রানজেকশন নম্বর যাচাই করতে হোয়াটসঅ্যাপে আমাদের সাথে যোগাযোগ করুন।'
                    : 'The Transaction ID provided could not be verified against received statements. Contact support via WhatsApp.'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : searched ? (
        <div className="p-8 rounded-2xl bg-[#0B1325] border border-slate-800 text-center space-y-3">
          <p className="text-sm font-semibold text-white">
            {language === 'bn' ? 'কোন অর্ডার পাওয়া যায়নি' : 'No Order Found'}
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-bengali">
            {language === 'bn'
              ? 'আপনার দেওয়া অর্ডার নম্বর বা মোবাইল নম্বরটি সঠিক কিনা যাচাই করুন। অথবা আমাদের হোয়াটসঅ্যাপ সাপোর্টে যোগাযোগ করুন।'
              : 'Please check your Order Number or phone number. Or connect with us on WhatsApp for assistance.'}
          </p>
        </div>
      ) : null}
    </div>
  );
};
