import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Search, Menu, X, Shield, Globe, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    currentView,
    setCurrentView,
    cartCount,
    settings,
    isAdminAuthenticated,
    setSearchQuery,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchInput.trim()) {
      setSearchQuery(quickSearchInput.trim());
      setCurrentView('products');
    }
  };

  const navLinks = [
    { id: 'home', labelEn: 'Home', labelBn: 'হোম' },
    { id: 'products', labelEn: 'All Designs', labelBn: 'সকল ডিজাইন' },
    { id: 'free', labelEn: 'Free Designs', labelBn: 'ফ্রি ফাইল' },
    { id: 'premium', labelEn: 'Premium', labelBn: 'প্রিমিয়াম' },
    { id: 'order_status', labelEn: 'Track Order', labelBn: 'অর্ডার ট্র্যাক' },
    { id: 'contact', labelEn: 'Contact', labelBn: 'যোগাযোগ' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B1325]/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Notification Bar if active */}
      {settings.isBannerActive && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 text-xs py-1.5 px-4 font-medium text-center truncate">
          <span>{language === 'bn' ? settings.bannerNoticeBn : settings.bannerNotice}</span>
        </div>
      )}

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element with gold glyph) */}
        <button
          onClick={() => {
            setCurrentView('home');
            setMobileMenuOpen(false);
          }}
          className="group flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            H
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-display">
              <span>Haque Graphy</span>
              <span className="text-[10px] text-amber-400 border border-amber-500/30 px-1 py-0.2 rounded font-sans uppercase tracking-widest font-semibold">
                Studio
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-bengali leading-none">
              {language === 'bn' ? settings.taglineBn : settings.tagline}
            </div>
          </div>
        </button>

        {/* Zone 2: 4-5 Navigation Links (single-line, clean hover underline) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
          {navLinks.map(link => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id as any)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive ? 'text-amber-400 font-semibold' : 'hover:text-white'
                }`}
              >
                {language === 'bn' ? link.labelBn : link.labelEn}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Language, Cart, Admin) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
            <input
              type="text"
              value={quickSearchInput}
              onChange={e => setQuickSearchInput(e.target.value)}
              placeholder={language === 'bn' ? 'ফাইল খুঁজুন (PLP, PSD)...' : 'Search files...'}
              className="bg-slate-900/90 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 w-44 focus:w-56 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          </form>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            aria-label="Toggle Language"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCurrentView('cart')}
            className={`relative p-2 rounded-lg border transition-colors flex items-center justify-center ${
              currentView === 'cart'
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Entry */}
          <button
            onClick={() => setCurrentView('admin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              isAdminAuthenticated
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B1325] px-4 pt-3 pb-6 space-y-3">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              value={quickSearchInput}
              onChange={e => setQuickSearchInput(e.target.value)}
              placeholder={language === 'bn' ? 'ডিজাইন বা ফাইল খুঁজুন...' : 'Search designs or PLP...'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentView(link.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-sm text-left ${
                  currentView === link.id
                    ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span>{language === 'bn' ? link.labelBn : link.labelEn}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{settings.studioAddressBn}</span>
          </div>
        </div>
      )}
    </header>
  );
};
