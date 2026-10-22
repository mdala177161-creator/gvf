import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Mail, MapPin, Phone, Send, CheckCircle2, RotateCcw, ExternalLink, Info } from 'lucide-react';

export const Contact: React.FC = () => {
  const { language, showToast } = useApp();

  // Requested default values (editable by user)
  const defaultName = 'Haque Graphy';
  const defaultEmail = 'haquegraphydesign@gmail.com';
  const defaultPhone = '01792124279';

  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [subject, setSubject] = useState('Custom Design Order');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');

  // Official contact information
  const officialAddressBn = 'মাছুম বাজার, বীরশ্রী, জকিগঞ্জ, সিলেট, বাংলাদেশ';
  const officialAddressEn = 'Machum Bazar, Birshree, Zakiganj, Sylhet, Bangladesh';
  const officialEmail = 'haquegraphydesign@gmail.com';
  const officialPhone = '01792124279';
  const officialPhoneFormatted = '+8801792124279';

  const waUrl = `https://wa.me/8801792124279?text=${encodeURIComponent(
    `Hello Haque Graphy! I want to inquire about custom graphic design & print services.`
  )}`;

  const handleResetDefaults = () => {
    setName(defaultName);
    setEmail(defaultEmail);
    setPhone(defaultPhone);
    setSubject('Custom Design Order');
    setMessage('');
    showToast(language === 'bn' ? 'ডিফল্ট তথ্য রিসেট করা হয়েছে' : 'Reset to default contact info', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে প্রয়োজনীয় সকল ঘর পূরণ করুন' : 'Please fill all required fields', 'error');
      return;
    }

    // Build real mailto link to haquegraphydesign@gmail.com
    const emailSubject = `[Haque Graphy Contact] ${subject} - from ${name.trim()}`;
    const emailBody = `Name: ${name.trim()}\nEmail: ${email.trim()}\nPhone / WhatsApp: ${phone.trim() || 'N/A'}\nSubject: ${subject}\n\nMessage:\n${message.trim()}\n\n---\nSent via Haque Graphy Website`;

    const mailto = `mailto:${officialEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    setLastMailtoUrl(mailto);

    // Open user's default email client pre-addressed to haquegraphydesign@gmail.com
    try {
      window.location.href = mailto;
    } catch {
      // ignore
    }

    setSubmitted(true);
    showToast(
      language === 'bn' 
        ? 'আপনার বার্তা প্রস্তুত হয়েছে! আপনার ইমেইল ক্লায়েন্টে ড্রাফট ওপেন হচ্ছে।' 
        : 'Message prepared! Opening draft in your email client.', 
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="border-b border-slate-800 pb-6 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {language === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact & Studio Support'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 font-bengali">
          {language === 'bn'
            ? 'ডিজাইন কাস্টমাইজেশন, প্রিন্টিং প্রেস সাপোর্ট বা যেকোনো প্রশ্নের জন্য সরাসরি আমাদের সাথে যুক্ত হোন।'
            : 'Reach out for custom design projects, press layout assistance, or order verification.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'bn' ? 'আমাদের অফিস ও স্টুডিও' : 'Studio Location & Contact'}
            </h3>
            <div className="space-y-4 text-xs text-slate-300 font-bengali">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {language === 'bn' ? officialAddressBn : officialAddressEn}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a 
                  href={`mailto:${officialEmail}`}
                  className="font-mono text-white hover:text-amber-400 transition-colors"
                >
                  {officialEmail}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a 
                  href={`tel:${officialPhone}`}
                  className="font-mono text-white hover:text-amber-400 transition-colors"
                >
                  {officialPhone} ({officialPhoneFormatted})
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Card */}
          <div className="p-6 rounded-2xl bg-[#0B1325] border border-emerald-500/30 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Direct Hotline</span>
            </h3>
            <p className="text-xs text-slate-300 font-bengali leading-relaxed">
              {language === 'bn'
                ? 'তাত্ক্ষণিক উত্তর পেতে এবং যেকোনো জরুরি ফাইল সহায়তায় আমাদের অফিসিয়াল হোয়াটসঅ্যাপে (01792124279) মেসেজ পাঠান।'
                : 'For priority order support and instant replies, connect directly via official WhatsApp (01792124279).'}
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন (01792124279)' : 'Chat on WhatsApp (01792124279)'}</span>
            </a>
          </div>

          {/* Backend Email Integration Status Card */}
          <div className="p-5 rounded-2xl bg-[#080d19] border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Info className="w-4 h-4" />
              <span>{language === 'bn' ? 'ইমেইল ব্যাকএন্ড সংক্রান্ত তথ্য' : 'Email Backend Status'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-bengali">
              {language === 'bn'
                ? 'মেসেজ সাবমিট করলে সরাসরি আপনার ব্রাউজার/ডিভাইসের ইমেইল ক্লায়েন্টে haquegraphydesign@gmail.com বরাবরে মেসেজ ড্রাফট হয়ে যাবে। ব্যাকগ্রাউন্ডে স্বয়ংক্রিয়ভাবে সরাসরি সার্ভারবিহীন ইমেইল ডেলিভারির জন্য Netlify Forms অথবা একটি ইমেইল API (যেমন Resend বা EmailJS) কনফিগার করা বাকি রয়েছে।'
                : 'Submitting prepares a direct mail draft to haquegraphydesign@gmail.com. For automated server-side email routing, Netlify Forms or an email API service (like Resend or EmailJS) can be connected.'}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#0B1325] border border-slate-800 shadow-xl">
          {submitted ? (
            <div className="text-center py-10 space-y-5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'bn' ? 'ধন্যবাদ! আপনার বার্তা তৈরি হয়েছে।' : 'Thank You! Message Prepared.'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-bengali leading-relaxed">
                {language === 'bn'
                  ? `আপনার বার্তাটি "${officialEmail}" ঠিকানায় পাঠানোর জন্য প্রস্তুত করা হয়েছে। যদি আপনার ইমেইল অ্যাপ স্বয়ংক্রিয়ভাবে না খুলে থাকে, তবে নিচের বাটনে ক্লিক করুন:`
                  : `Your message has been prepared for "${officialEmail}". If your email app did not open automatically, click the button below:`}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {lastMailtoUrl && (
                  <a
                    href={lastMailtoUrl}
                    className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ইমেইল অ্যাপে ওপেন করুন' : 'Open in Email Client'}</span>
                  </a>
                )}
                <a
                  href={`https://wa.me/8801792124279?text=${encodeURIComponent(
                    `Hello Haque Graphy! Here is my inquiry from ${name}:\nSubject: ${subject}\nMessage: ${message}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'হোয়াটসঅ্যাপেও পাঠান' : 'Send via WhatsApp'}</span>
                </a>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                >
                  {language === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">
                  {language === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Send Us a Message'}
                </h3>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 font-bengali transition-colors"
                  title="ডিফল্ট তথ্যে ফিরে যান"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'bn' ? 'ডিফল্ট রিসেট' : 'Reset Defaults'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-slate-300 font-medium">
                      {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                    </label>
                    <span className="text-[10px] text-amber-400/80 font-bengali">ডিফল্ট: Haque Graphy</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Haque Graphy"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-slate-300 font-medium">
                      {language === 'bn' ? 'ইমেইল অ্যাড্রেস *' : 'Email Address *'}
                    </label>
                    <span className="text-[10px] text-amber-400/80 font-mono">haquegraphydesign@gmail.com</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="haquegraphydesign@gmail.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-slate-300 font-medium">
                      {language === 'bn' ? 'মোবাইল নম্বর / WhatsApp' : 'Phone / WhatsApp'}
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">01792124279</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01792124279"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">
                    {language === 'bn' ? 'বিষয়' : 'Subject'}
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="Custom Design Order">{language === 'bn' ? 'কাস্টম ডিজাইন অর্ডার' : 'Custom Design Order'}</option>
                    <option value="File Support">{language === 'bn' ? 'ফাইল এডিটিং সাপোর্ট' : 'File Editing Support'}</option>
                    <option value="Payment Verification">{language === 'bn' ? 'পেমেন্ট ভেরিফিকেশন' : 'Payment Verification'}</option>
                    <option value="Partnership">{language === 'bn' ? 'প্রেস পার্টনারশিপ' : 'Printing Press Partnership'}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">
                  {language === 'bn' ? 'বার্তা লিখুন *' : 'Your Message *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার প্রয়োজন বা ডিজাইন রিকোয়েস্ট বিস্তারিত লিখুন...' : 'Describe your design or print requirements...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'বার্তা পাঠান (Send to Email)' : 'Send to Email'}</span>
                </button>

                <span className="text-[11px] text-slate-400 font-bengali">
                  ইমেইল প্রাপক: <strong className="text-amber-400 font-mono">{officialEmail}</strong>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
