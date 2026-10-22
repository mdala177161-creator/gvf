import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const { language, settings, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Custom Design Order');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে সকল ঘর পূরণ করুন' : 'Please fill all required fields', 'error');
      return;
    }

    setSubmitted(true);
    showToast(language === 'bn' ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message sent successfully!', 'success');
  };

  const waUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Haque Graphy! I want to inquire about custom graphic design services.`
  )}`;

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
          <div className="p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'bn' ? 'আমাদের অফিস ও স্টুডিও' : 'Studio Location'}
            </h3>
            <div className="space-y-4 text-xs text-slate-300 font-bengali">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{language === 'bn' ? settings.studioAddressBn : settings.studioAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-sans">{settings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">{settings.bkashNumber.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B1325] border border-emerald-500/30 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Direct Hotline</span>
            </h3>
            <p className="text-xs text-slate-300 font-bengali leading-relaxed">
              {language === 'bn'
                ? 'তাত্ক্ষণিক উত্তর পেতে এবং ফাইল সংক্রান্ত যেকোনো জরুরি সহায়তায় আমাদের অফিসিয়াল হোয়াটসঅ্যাপে মেসেজ পাঠান।'
                : 'For priority order support and instant replies, connect directly via official WhatsApp.'}
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#0B1325] border border-slate-800">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'bn' ? 'ধন্যবাদ! আপনার বার্তা গৃহীত হয়েছে।' : 'Thank You! Message Received.'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-bengali">
                {language === 'bn'
                  ? 'আমাদের টিম খুব দ্রুত আপনার সাথে ইমেইল অথবা ফোনে যোগাযোগ করবে।'
                  : 'Our design studio team will respond to your inquiry promptly.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                {language === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">
                {language === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Send Us a Message'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">
                    {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Asif Mahmud"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">
                    {language === 'bn' ? 'ইমেইল অ্যাড্রেস *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="asif@gmail.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">
                    {language === 'bn' ? 'বিষয়' : 'Subject'}
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
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
                  placeholder={language === 'bn' ? 'আপনার প্রয়োজন বিস্তারিত লিখুন...' : 'Describe your project requirements...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
