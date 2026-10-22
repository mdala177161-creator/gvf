import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, SiteSettings, Language, Category, FileFormat } from '../types';
import { storageService } from '../services/storageService';

export type AppView = 
  | 'home' 
  | 'products' 
  | 'free' 
  | 'premium' 
  | 'categories' 
  | 'product_details' 
  | 'cart' 
  | 'checkout' 
  | 'order_status' 
  | 'contact' 
  | 'privacy' 
  | 'terms' 
  | 'admin';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, licenseType?: 'standard' | 'commercial') => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  discountAmount: number;
  appliedCoupon: string | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  finalTotal: number;

  // Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (cat: Category | 'all') => void;
  selectedFormat: FileFormat | 'all';
  setSelectedFormat: (fmt: FileFormat | 'all') => void;

  // Site Settings
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Navigation helpers
  navigateToProduct: (productId: string) => void;
  navigateToCategory: (cat: Category) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('haque_lang') as Language) || 'bn';
  });

  const [currentView, setCurrentViewState] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('haque_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedFormat, setSelectedFormat] = useState<FileFormat | 'all'>('all');

  const [settings, setSettings] = useState<SiteSettings>(() => storageService.getSettings());

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('haque_admin_auth') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem('haque_admin_email') || null;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    storageService.recordVisit();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('haque_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('haque_lang', lang);
  };

  const setCurrentView = (view: AppView) => {
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, licenseType: 'standard' | 'commercial' = 'standard') => {
    if (product.isFree) {
      // Free designs don't need cart - instant download
      storageService.incrementDownload(product.id);
      showToast(
        language === 'bn' 
          ? `ফ্রি ডাউনলোড প্রস্তুত: ${product.titleBn}` 
          : `Free download initiated: ${product.title}`, 
        'success'
      );
      return;
    }

    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      showToast(
        language === 'bn' ? 'আইটেমটি ইতিমধ্যে আপনার কার্টে রয়েছে' : 'Item is already in your cart', 
        'info'
      );
    } else {
      setCart(prev => [...prev, { product, quantity: 1, licenseType }]);
      showToast(
        language === 'bn' ? `কার্টে যোগ করা হয়েছে: ${product.titleBn}` : `Added to cart: ${product.title}`, 
        'success'
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast(
      language === 'bn' ? 'কার্ট থেকে আইটেম সরানো হয়েছে' : 'Item removed from cart',
      'info'
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountPercent(0);
  };

  const cartCount = cart.length;

  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return sum + price;
  }, 0);

  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const applyCouponCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'HAQUE20') {
      setAppliedCoupon('HAQUE20');
      setDiscountPercent(20);
      return { 
        success: true, 
        message: language === 'bn' ? '২০% ডিসকাউন্ট সফলভাবে প্রয়োগ হয়েছে!' : '20% discount applied successfully!' 
      };
    } else if (clean === 'EIDMUBARAK') {
      setAppliedCoupon('EIDMUBARAK');
      setDiscountPercent(15);
      return { 
        success: true, 
        message: language === 'bn' ? '১৫% ঈদ বিশেষ ছাড় প্রয়োগ হয়েছে!' : '15% Eid special discount applied!' 
      };
    } else {
      return { 
        success: false, 
        message: language === 'bn' ? 'অবৈধ কুপন কোড! চেষ্টা করুন HAQUE20' : 'Invalid coupon code! Try HAQUE20' 
      };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    showToast(language === 'bn' ? 'সেটিংস সংরক্ষিত হয়েছে' : 'Settings updated', 'success');
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    // Valid admin credentials (or quick test credentials)
    if (email === 'admin@haquegraphy.com' && pass === 'haque2026!') {
      setIsAdminAuthenticated(true);
      setAdminEmail(email);
      localStorage.setItem('haque_admin_auth', 'true');
      localStorage.setItem('haque_admin_email', email);
      showToast(language === 'bn' ? 'অ্যাডমিন লগইন সফল হয়েছে' : 'Admin logged in successfully', 'success');
      return true;
    }
    showToast(language === 'bn' ? 'ভুল ইমেইল বা পাসওয়ার্ড' : 'Invalid credentials', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminEmail(null);
    localStorage.removeItem('haque_admin_auth');
    localStorage.removeItem('haque_admin_email');
    showToast(language === 'bn' ? 'লগআউট সফল হয়েছে' : 'Logged out', 'info');
    setCurrentView('home');
  };

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product_details');
  };

  const navigateToCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setCurrentView('products');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        discountAmount,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        finalTotal,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedFormat,
        setSelectedFormat,
        settings,
        updateSettings,
        isAdminAuthenticated,
        adminEmail,
        loginAdmin,
        logoutAdmin,
        toasts,
        showToast,
        removeToast,
        navigateToProduct,
        navigateToCategory,
        lastCreatedOrder,
        setLastCreatedOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
