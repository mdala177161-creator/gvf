import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { Product, Order, OrderStatus, Category, FileFormat, SiteSettings } from '../types';
import { 
  Shield, 
  Lock, 
  BarChart3, 
  Package, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Edit3, 
  Trash2, 
  Plus, 
  LogOut, 
  ExternalLink, 
  Download, 
  Sliders, 
  Database, 
  Cloud, 
  Server, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Users, 
  MessageCircle,
  Sparkles,
  KeyRound,
  CreditCard
} from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { authService } from '../services/authService';
import { supabaseService } from '../services/supabaseService';
import { FULL_SUPABASE_SCHEMA } from '../data/supabaseSchemaContent';

type AdminTab = 'overview' | 'products' | 'orders' | 'branding' | 'deployment';

export const Admin: React.FC = () => {
  const {
    language,
    isAdminAuthenticated,
    adminUser,
    adminEmail,
    adminUsername,
    authStatus,
    loginAdmin,
    logoutAdmin,
    settings,
    updateSettings,
    showToast,
    setCurrentView,
  } = useApp();

  // Login form state (Supports Username + Password)
  const [usernameInput, setUsernameInput] = useState(() => authService.getConfiguredUsername());
  const [passInput, setPassInput] = useState('haque2026!');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Change credentials state
  const [customUsername, setCustomUsername] = useState(() => authService.getConfiguredUsername());
  const [customPassword, setCustomPassword] = useState('');

  // Product CRUD states
  const [productsList, setProductsList] = useState<Product[]>(() => storageService.getProducts());
  const [ordersList, setOrdersList] = useState<Order[]>(() => storageService.getOrders());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // New product form
  const [formTitle, setFormTitle] = useState('');
  const [formTitleBn, setFormTitleBn] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDescriptionBn, setFormDescriptionBn] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('islamic_eid');
  const [formPrice, setFormPrice] = useState<number>(350);
  const [formSalePrice, setFormSalePrice] = useState<number | ''>(220);
  const [formIsFree, setFormIsFree] = useState(false);
  const [formFileType, setFormFileType] = useState<FileFormat>('PSD');
  const [formFileSize, setFormFileSize] = useState('85 MB');
  const [formSoftware, setFormSoftware] = useState('Adobe Photoshop CC');
  const [formColorMode, setFormColorMode] = useState<'CMYK' | 'RGB' | 'Vector CMYK'>('CMYK');
  const [formDimensions, setFormDimensions] = useState('3000 x 3000 px');
  const [formDpi, setFormDpi] = useState<number>(300);
  const [formPreview, setFormPreview] = useState('https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80');
  const [formDownloadUrl, setFormDownloadUrl] = useState('https://storage.haquegraphy.com/secure/asset.zip');

  // Order filtering
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Branding settings form
  const [brandingSettings, setBrandingSettings] = useState<SiteSettings>(settings);

  // Supabase live configuration state
  const [sbUrlInput, setSbUrlInput] = useState(() => supabaseService.getConfig().url);
  const [sbKeyInput, setSbKeyInput] = useState(() => supabaseService.getConfig().anonKey);
  const [isTestingSb, setIsTestingSb] = useState(false);
  const [sbTestResult, setSbTestResult] = useState<{ success: boolean; message: string; mode?: string } | null>(null);

  // SQL & Config copy states
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedNetlify, setCopiedNetlify] = useState(false);

  // Refresh data
  const refreshData = () => {
    setProductsList(storageService.getProducts());
    setOrdersList(storageService.getOrders());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginAdmin(usernameInput.trim(), passInput.trim());
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateLocalCredentials(customUsername, customPassword || undefined);
    showToast(language === 'bn' ? 'অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড সংরক্ষিত হয়েছে' : 'Admin credentials updated', 'success');
    setCustomPassword('');
  };

  const handleSaveAndTestSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingSb(true);
    setSbTestResult(null);

    const saveRes = supabaseService.saveCustomConfig(sbUrlInput, sbKeyInput);
    if (!saveRes.success) {
      setIsTestingSb(false);
      setSbTestResult({ success: false, message: saveRes.message });
      showToast(saveRes.message, 'error');
      return;
    }

    try {
      const client = supabaseService.getClient();
      if (!client) {
        throw new Error('Supabase client could not be created.');
      }
      const { error } = await client.from('settings').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        if (error.message.includes('relation') || error.code === '42P01') {
          setSbTestResult({
            success: true,
            message: 'Supabase credentials verified successfully! Connection reached PostgreSQL. Please run the SQL schema below to create tables.',
            mode: 'needs_schema'
          });
          showToast('Supabase connected! Tables need to be created.', 'info');
        } else {
          setSbTestResult({
            success: false,
            message: `Supabase returned: ${error.message}`
          });
          showToast(`Supabase error: ${error.message}`, 'error');
        }
      } else {
        setSbTestResult({
          success: true,
          message: 'Supabase connection verified! Authentication and Database are 100% active.',
          mode: 'ready'
        });
        showToast('Supabase connection verified and active!', 'success');
        const sbProducts = await supabaseService.fetchProducts();
        if (sbProducts && sbProducts.length > 0) {
          storageService.saveProducts(sbProducts);
          refreshData();
        }
      }
    } catch (err: any) {
      setSbTestResult({
        success: false,
        message: err?.message || 'Failed to connect to Supabase endpoint.'
      });
      showToast('Supabase connection test failed', 'error');
    } finally {
      setIsTestingSb(false);
    }
  };

  const handleDisconnectSupabase = () => {
    supabaseService.clearCustomConfig();
    setSbUrlInput('');
    setSbKeyInput('');
    setSbTestResult(null);
    showToast('Supabase disconnected. Running in secure local sandbox mode.', 'info');
  };

  // Toggle publish
  const handleTogglePublish = async (p: Product) => {
    const updated = storageService.updateProduct(p.id, { isPublished: !p.isPublished });
    if (updated) {
      if (supabaseService.isReady()) {
        await supabaseService.upsertProduct(updated);
      }
      refreshData();
      showToast(
        updated.isPublished ? 'Product published' : 'Product unpublished', 
        'info'
      );
    }
  };

  // Toggle free
  const handleToggleFree = async (p: Product) => {
    const updated = storageService.updateProduct(p.id, { isFree: !p.isFree });
    if (updated) {
      if (supabaseService.isReady()) {
        await supabaseService.upsertProduct(updated);
      }
      refreshData();
      showToast(updated.isFree ? 'Marked as Free' : 'Marked as Premium', 'info');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      if (supabaseService.isReady()) {
        await supabaseService.deleteProduct(id);
      }
      storageService.deleteProduct(id);
      refreshData();
      showToast('Product deleted', 'info');
    }
  };

  // Save new or edited product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryNames: Record<Category, { en: string; bn: string }> = {
      islamic_eid: { en: 'Islamic & Eid', bn: 'ইসলামিক ও ঈদ' },
      typography: { en: 'Bangla Typography', bn: 'বাংলা টাইপোগ্রাফি' },
      social_media: { en: 'Social Media', bn: 'সোশ্যাল মিডিয়া' },
      branding: { en: 'Brand Identity', bn: 'ব্র্যান্ড আইডেন্টিটি' },
      wedding: { en: 'Wedding & Invitation', bn: 'বিয়ে ও ইনভিটেশন' },
      print_packaging: { en: 'Print & Packaging', bn: 'প্রিন্ট ও প্যাকেজিং' },
    };

    if (editingProduct) {
      const updateData = {
        title: formTitle,
        titleBn: formTitleBn || formTitle,
        description: formDescription,
        descriptionBn: formDescriptionBn || formDescription,
        category: formCategory,
        categoryNameEn: categoryNames[formCategory].en,
        categoryNameBn: categoryNames[formCategory].bn,
        price: Number(formPrice),
        salePrice: formSalePrice !== '' ? Number(formSalePrice) : undefined,
        isFree: formIsFree,
        fileType: formFileType,
        fileSize: formFileSize,
        softwareVersion: formSoftware,
        colorMode: formColorMode,
        dimensions: formDimensions,
        dpi: Number(formDpi),
        previewImage: formPreview,
        fileDownloadUrl: formDownloadUrl,
      };
      storageService.updateProduct(editingProduct.id, updateData);
      if (supabaseService.isReady()) {
        await supabaseService.upsertProduct({ id: editingProduct.id, ...updateData });
      }
      showToast('Product updated successfully', 'success');
      setEditingProduct(null);
    } else {
      const newProdData = {
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: formTitle,
        titleBn: formTitleBn || formTitle,
        description: formDescription,
        descriptionBn: formDescriptionBn || formDescription,
        category: formCategory,
        categoryNameEn: categoryNames[formCategory].en,
        categoryNameBn: categoryNames[formCategory].bn,
        price: formIsFree ? 0 : Number(formPrice),
        salePrice: formIsFree ? undefined : (formSalePrice !== '' ? Number(formSalePrice) : undefined),
        isFree: formIsFree,
        isFeatured: false,
        isPublished: true,
        fileType: formFileType,
        fileSize: formFileSize,
        softwareVersion: formSoftware,
        colorMode: formColorMode,
        dimensions: formDimensions,
        dpi: Number(formDpi),
        previewImage: formPreview,
        fileDownloadUrl: formDownloadUrl,
        tags: [formFileType, categoryNames[formCategory].en],
        features: ['Full layered vector/PSD files', 'Print ready resolution'],
        featuresBn: ['সম্পূর্ণ লেয়ার্ড ফাইল', 'প্রিন্ট উপযোগী রেজোলিউশন'],
      };
      const created = storageService.addProduct(newProdData);
      if (supabaseService.isReady()) {
        await supabaseService.upsertProduct({ ...newProdData, id: created.id });
      }
      showToast('New design product added', 'success');
      setIsAddingProduct(false);
    }
    refreshData();
  };

  // Open Edit Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormTitleBn(p.titleBn);
    setFormDescription(p.description);
    setFormDescriptionBn(p.descriptionBn);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormSalePrice(p.salePrice ?? '');
    setFormIsFree(p.isFree);
    setFormFileType(p.fileType);
    setFormFileSize(p.fileSize);
    setFormSoftware(p.softwareVersion);
    setFormColorMode(p.colorMode);
    setFormDimensions(p.dimensions);
    setFormDpi(p.dpi);
    setFormPreview(p.previewImage);
    setFormDownloadUrl(p.fileDownloadUrl);
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormTitleBn('');
    setFormDescription('');
    setFormDescriptionBn('');
    setFormCategory('islamic_eid');
    setFormPrice(350);
    setFormSalePrice(220);
    setFormIsFree(false);
    setFormFileType('PSD');
    setFormFileSize('95 MB');
    setFormSoftware('Adobe Photoshop CC 2022+');
    setFormColorMode('CMYK');
    setFormDimensions('3000 x 3000 px');
    setFormDpi(300);
    setFormPreview('https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80');
    setFormDownloadUrl('https://storage.haquegraphy.com/secure/asset.zip');
    setIsAddingProduct(true);
  };

  // Order status update
  const handleOrderStatusUpdate = async (orderId: string, status: OrderStatus) => {
    if (supabaseService.isReady()) {
      await supabaseService.updateOrderStatus(orderId, status);
    }
    storageService.updateOrderStatus(orderId, status);
    refreshData();
    showToast(`Order status updated to ${status.toUpperCase()}`, 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    const csv = storageService.exportOrdersCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haque-graphy-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Orders exported as CSV', 'info');
  };

  const analytics = storageService.getAnalytics();

  // If NOT authenticated, render Secure Administrator Auth Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="p-8 rounded-2xl bg-[#0B1325] border border-amber-500/30 space-y-6 shadow-2xl">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 border border-amber-500/30 flex items-center justify-center mx-auto shadow-xl overflow-hidden">
              <img 
                src={settings.logoUrl || '/haque-graphy-logo.jpeg'} 
                alt="Haque Graphy Studio" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-display">Haque Graphy Studio Admin</h1>
              <p className="text-xs text-slate-400 font-bengali mt-0.5">
                {language === 'bn' ? 'শুধুমাত্র অনুমোদিত অ্যাডমিনের জন্য সুরক্ষিত পোর্টাল' : 'Protected Administrator Gateway'}
              </p>
            </div>
          </div>

          {/* Auth Engine Status Badge */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Security Engine:</span>
              <span className={`font-mono font-semibold px-2 py-0.5 rounded text-[10px] ${
                authStatus.isConfigured 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {authStatus.isConfigured ? 'Supabase Auth & Database RLS' : 'Setup Required (Dev Fallback)'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-bengali leading-relaxed">
              {authStatus.isConfigured 
                ? 'সার্ভার-সাইড নিরাপত্তা সক্রিয় রয়েছে: শুধুমাত্র ভেরিফাইড admin@haquegraphy.com ডাটাবেজ পরিবর্তন করতে পারে।'
                : 'বাস্তব সার্ভার-সাইড সুরক্ষার জন্য Supabase Auth ও Row Level Security (RLS) সক্রিয় থাকা আবশ্যক।'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Admin Username or Email</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="e.g. admin or admin@haquegraphy.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Password</label>
              <input
                type="password"
                required
                value={passInput}
                onChange={e => setPassInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In with Administrator Credentials</span>
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="text-xs text-slate-400 hover:text-white transition-colors font-bengali"
            >
              ← স্টোরফ্রন্টে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders list
  const filteredOrders = ordersList.filter(o => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchTrx = o.transactionId?.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchTrx) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header with Top Bar Contract Compliance */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white p-1 border border-amber-500/30 flex items-center justify-center shadow-md overflow-hidden shrink-0">
            <img 
              src={settings.logoUrl || '/haque-graphy-logo.jpeg'} 
              alt="Haque Graphy Studio" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-display">Haque Graphy Studio Admin</h1>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold uppercase">
                Authorized Admin
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">Logged in as: {adminEmail}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            {language === 'bn' ? 'স্টোরফ্রন্টে যান' : 'View Storefront'}
          </button>
          <button
            onClick={logoutAdmin}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Module Tabs (Button Segmented Controls) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Product Catalog ({productsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Orders & Verification ({ordersList.filter(o => o.status === 'pending_verification').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'branding'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Branding & Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('deployment')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'deployment'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/20'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Netlify & Supabase Cloud Hub</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & REAL ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Real Metrics KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Total Confirmed Revenue</span>
              <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                ৳{analytics.confirmedRevenue}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                +৳{analytics.pendingRevenue} pending verification
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Total Orders</span>
              <div className="text-2xl font-black text-white font-mono tabular-nums">
                {analytics.totalOrders}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                {analytics.confirmedOrdersCount} verified · {analytics.pendingOrdersCount} pending
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Digital Downloads Released</span>
              <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                {analytics.totalDownloads}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Includes free and verified assets
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Website Visits Tracked</span>
              <div className="text-2xl font-black text-sky-400 font-mono tabular-nums">
                {analytics.visitsCount}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Session telemetry counter
              </div>
            </div>
          </div>

          {/* Best Sellers and Order Status Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Performing Designs</h3>
                <span className="text-xs text-slate-400 font-mono">Real Sales & Downloads</span>
              </div>

              <div className="space-y-3">
                {analytics.bestSellers.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 font-mono text-amber-400 font-bold">{idx + 1}.</span>
                      <div>
                        <div className="text-white font-medium line-clamp-1">{item.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{item.fileType} · {item.categoryNameEn}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-amber-400 font-bold">{item.salesCount} sold</span>
                      <span className="text-slate-500 block text-[10px]">{item.downloadCount} dl</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Verification Pipeline</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Manage
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-emerald-400">Verified & Paid</span>
                    <span className="text-white">{analytics.confirmedOrdersCount}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(analytics.confirmedOrdersCount / Math.max(1, analytics.totalOrders)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-amber-400">Pending Verification</span>
                    <span className="text-white">{analytics.pendingOrdersCount}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(analytics.pendingOrdersCount / Math.max(1, analytics.totalOrders)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-rose-400">Rejected / Failed</span>
                    <span className="text-white">{analytics.rejectedOrdersCount}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${(analytics.rejectedOrdersCount / Math.max(1, analytics.totalOrders)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-bengali">
                  বিকাশ বা নগদ ট্রানজেকশন আসার পর ট্রানজেকশন ট্যাবে গিয়ে "Verify" বাটনে ক্লিক করলে গ্রাহকের ডাউনলোড লিংক সাথে সাথে সক্রিয় হয়ে যায়।
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Product Catalog Management</h2>
              <p className="text-xs text-slate-400 font-bengali">ডিজাইন যুক্ত, সম্পাদনা, মূল্য নির্ধারণ ও পাবলিশ নিয়ন্ত্রণ করুন।</p>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Design</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-[#0B1325] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Design Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Sales / DL</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {productsList.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.previewImage}
                            alt=""
                            className="w-10 h-8 rounded object-cover bg-slate-900 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white line-clamp-1">{prod.title}</div>
                            <div className="text-[11px] text-slate-400 font-bengali">{prod.titleBn}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{prod.categoryNameEn}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">{prod.fileType}</td>
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        {prod.isFree ? (
                          <span className="text-emerald-400 font-bold">Free</span>
                        ) : (
                          <span>৳{prod.salePrice ?? prod.price}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        {prod.salesCount} sold · {prod.downloadCount} dl
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(prod)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            prod.isPublished
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {prod.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleToggleFree(prod)}
                          title="Toggle Free/Premium"
                          className="p-1.5 rounded bg-slate-900 text-slate-300 hover:text-amber-400 border border-slate-800"
                        >
                          {prod.isFree ? 'Make Paid' : 'Make Free'}
                        </button>
                        <button
                          onClick={() => openEditModal(prod)}
                          title="Edit Product"
                          className="p-1.5 rounded bg-slate-900 text-slate-300 hover:text-amber-400 border border-slate-800"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          title="Delete Product"
                          className="p-1.5 rounded bg-slate-900 text-slate-500 hover:text-rose-400 border border-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS & VERIFICATION */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Order Management & Manual Verification</h2>
              <p className="text-xs text-slate-400 font-bengali">বিকাশ/নগদ TrxID যাচাই করে ডাউনলোড রিলিজ করুন।</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Orders CSV</span>
            </button>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  orderFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Orders ({ordersList.length})
              </button>
              <button
                onClick={() => setOrderFilter('pending_verification')}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  orderFilter === 'pending_verification' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({ordersList.filter(o => o.status === 'pending_verification').length})
              </button>
              <button
                onClick={() => setOrderFilter('verified_paid')}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  orderFilter === 'verified_paid' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Verified Paid
              </button>
              <button
                onClick={() => setOrderFilter('rejected')}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  orderFilter === 'rejected' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rejected
              </button>
            </div>

            <input
              type="text"
              value={orderSearch}
              onChange={e => setOrderSearch(e.target.value)}
              placeholder="Search by Order # or Phone..."
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 w-full sm:w-64 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* Orders Table */}
          <div className="bg-[#0B1325] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer Contact</th>
                    <th className="py-3 px-4">Method & TrxID</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredOrders.map(order => {
                    const waChatLink = `https://wa.me/${order.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${order.customerName}, this is Haque Graphy regarding your Order #${order.orderNumber}.`
                    )}`;

                    return (
                      <tr key={order.id} className="hover:bg-slate-900/40">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-white">{order.orderNumber}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">{order.customerName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</div>
                          <div className="text-[10px] text-slate-500">{order.customerEmail}</div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <div className="uppercase font-semibold text-white">{order.paymentMethod}</div>
                          <div className="text-amber-400 font-bold">{order.transactionId || 'None'}</div>
                          {order.senderPhone && (
                            <div className="text-[10px] text-slate-400">From: {order.senderPhone}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                          ৳{order.totalAmount}
                        </td>
                        <td className="py-3 px-4">
                          {order.status === 'verified_paid' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              Verified Paid
                            </span>
                          ) : order.status === 'pending_verification' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              Pending
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          {order.status === 'pending_verification' && (
                            <>
                              <button
                                onClick={() => handleOrderStatusUpdate(order.id, 'verified_paid')}
                                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm"
                              >
                                Verify & Release
                              </button>
                              <button
                                onClick={() => handleOrderStatusUpdate(order.id, 'rejected')}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 text-[11px]"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          <a
                            href={waChatLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-400 text-[11px] hover:bg-slate-800"
                            title="Message customer on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BRANDING & SITE SETTINGS */}
      {activeTab === 'branding' && (
        <div className="max-w-3xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Website Branding & Contact Customization</h2>
            <p className="text-xs text-slate-400 font-bengali">হোমপেজ ট্যাগলাইন, বিকাশ নম্বর ও নোটিশ পরিবর্তন করুন।</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateSettings(brandingSettings);
            }}
            className="p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-4"
          >
            {/* Official Brand Logo Management Card */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Official Brand Logo</h4>
                  <p className="text-[11px] text-slate-400 font-bengali">হেডার, ফুটার এবং সব পেজে প্রদর্শিত আসল ব্র্যান্ড লোগো</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBrandingSettings({ ...brandingSettings, logoUrl: '/haque-graphy-logo.jpeg' });
                    showToast('Logo reset to original Haque Graphy design', 'info');
                  }}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] text-amber-400 hover:text-white font-semibold transition-colors"
                >
                  Reset to Original Logo
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                <div className="w-20 h-20 rounded-xl bg-white p-2 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg">
                  <img
                    src={brandingSettings.logoUrl || '/haque-graphy-logo.jpeg'}
                    alt="Brand Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <FileUploader
                    label="Upload / Change Brand Logo (PNG, JPG, WebP, SVG)"
                    accept=".png,.jpg,.jpeg,.webp,.svg"
                    type="image"
                    currentValue={brandingSettings.logoUrl}
                    onFileLoaded={({ url, fileName }) => {
                      setBrandingSettings({ ...brandingSettings, logoUrl: url });
                      showToast(language === 'bn' ? `লোগো আপলোড সম্পন্ন: ${fileName}` : `Logo loaded: ${fileName}`, 'success');
                    }}
                    cloudinaryCloudName={brandingSettings.cloudinaryCloudName || 'c48ghki2'}
                  />
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Direct Logo Image URL</label>
                    <input
                      type="text"
                      value={brandingSettings.logoUrl || ''}
                      onChange={e => setBrandingSettings({ ...brandingSettings, logoUrl: e.target.value })}
                      placeholder="/haque-graphy-logo.jpeg or https://..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Brand Name</label>
                <input
                  type="text"
                  value={brandingSettings.brandName}
                  onChange={e => setBrandingSettings({ ...brandingSettings, brandName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Brand Name (Bangla)</label>
                <input
                  type="text"
                  value={brandingSettings.brandNameBn}
                  onChange={e => setBrandingSettings({ ...brandingSettings, brandNameBn: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Tagline (English)</label>
                <input
                  type="text"
                  value={brandingSettings.tagline}
                  onChange={e => setBrandingSettings({ ...brandingSettings, tagline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Tagline (Bangla)</label>
                <input
                  type="text"
                  value={brandingSettings.taglineBn}
                  onChange={e => setBrandingSettings({ ...brandingSettings, taglineBn: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">bKash Send Money Number</label>
                <input
                  type="text"
                  value={brandingSettings.bkashNumber}
                  onChange={e => setBrandingSettings({ ...brandingSettings, bkashNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Nagad Send Money Number</label>
                <input
                  type="text"
                  value={brandingSettings.nagadNumber}
                  onChange={e => setBrandingSettings({ ...brandingSettings, nagadNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">WhatsApp Support Number</label>
                <input
                  type="text"
                  value={brandingSettings.whatsappNumber}
                  onChange={e => setBrandingSettings({ ...brandingSettings, whatsappNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Contact Email</label>
                <input
                  type="email"
                  value={brandingSettings.contactEmail}
                  onChange={e => setBrandingSettings({ ...brandingSettings, contactEmail: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Cloudinary Cloud Name</label>
                <input
                  type="text"
                  value={brandingSettings.cloudinaryCloudName || 'c48ghki2'}
                  onChange={e => setBrandingSettings({ ...brandingSettings, cloudinaryCloudName: e.target.value })}
                  placeholder="e.g. c48ghki2"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Top Banner Notice (Bangla)</label>
                <input
                  type="text"
                  value={brandingSettings.bannerNoticeBn}
                  onChange={e => setBrandingSettings({ ...brandingSettings, bannerNoticeBn: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                Save Store Settings
              </button>
            </div>
          </form>

          {/* Dedicated Admin Credentials & Account Security */}
          <div className="p-6 rounded-2xl bg-[#0B1325] border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Admin Credentials & Account Security
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                authStatus.isConfigured 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {authStatus.isConfigured ? 'Supabase Auth' : 'Local Protected Sandbox'}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-bengali">
              এখানে আপনি আপনার অ্যাডমিন ড্যাশবোর্ডের Username ও Password পরিবর্তন করতে পারেন। কোনো পাসওয়ার্ড বা সিক্রেট কোডে রাখা হয় না।
            </p>

            <form onSubmit={handleUpdateCredentials} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Designated Admin Username</label>
                  <input
                    type="text"
                    required
                    value={customUsername}
                    onChange={e => setCustomUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">New Password (leave empty to keep current)</label>
                  <input
                    type="password"
                    value={customPassword}
                    onChange={e => setCustomPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-500">
                  Current logged in user: <strong className="text-white font-mono">{adminUsername || 'admin'}</strong>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  Update Admin Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: NETLIFY, SUPABASE & CLOUDINARY DEPLOYMENT HUB */}
      {activeTab === 'deployment' && (
        <div className="space-y-8 max-w-4xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>Production Backend & Cloud Storage Blueprint</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-bengali">
              প্রোটোটাইপ থেকে পূর্ণাঙ্গ ক্লাউড প্রোডাকশন ডিপ্লয়মেন্টের সম্পূর্ণ গাইড ও এসকিউএল স্কিমা।
            </p>
          </div>

          {/* Status Matrix */}
          <div className="p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Architecture Status Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Frontend & UI Engine</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">100% Functional</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  React 19 + Tailwind v4 + Motion. Mobile-first responsive, bilingual (Bangla/EN), Cart, Checkout, Order Tracking.
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Netlify Deployment</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono">Ready to Deploy</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Build command <code className="text-white">npm run build</code>, publish directory <code className="text-white">dist</code>. Connect to free Netlify subdomain.
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Supabase Auth & Database</span>
                  <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded font-mono">Schema Provided</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  PostgreSQL schema with Row-Level Security (RLS) policies for products, orders, and admin role enforcement.
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Cloudinary & Signed Downloads</span>
                  <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-mono">Serverless Spec</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Private bucket for raw files (PSD/PLP/AI) with signed time-limited Netlify Functions URLs.
                </p>
              </div>
            </div>
          </div>

          {/* Supabase Live Connection & Credentials Manager */}
          <div className="p-6 rounded-2xl bg-[#0B1325] border border-sky-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Supabase Live Connection & API Configuration
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bengali">
                    এখানে আপনার Supabase প্রজেক্টের URL ও Publishable Anon Key দিয়ে সরাসরি ডাটাবেজের সাথে সংযোগ পরীক্ষা করুন।
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded font-semibold ${
                authStatus.isConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {authStatus.isConfigured ? 'Connected to Supabase' : 'Local Sandbox Mode'}
              </span>
            </div>

            <form onSubmit={handleSaveAndTestSupabase} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Supabase Project URL (VITE_SUPABASE_URL)</label>
                  <input
                    type="url"
                    placeholder="https://your-project-id.supabase.co"
                    value={sbUrlInput}
                    onChange={e => setSbUrlInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-sky-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Publishable Anon Key (VITE_SUPABASE_ANON_KEY)</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={sbKeyInput}
                    onChange={e => setSbKeyInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-sky-400 outline-none"
                  />
                </div>
              </div>

              {sbTestResult && (
                <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  sbTestResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {sbTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="font-mono">{sbTestResult.message}</div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isTestingSb || !sbUrlInput.trim() || !sbKeyInput.trim()}
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-sky-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isTestingSb ? 'Testing Supabase Connection...' : 'Save & Test Connection'}</span>
                </button>

                {authStatus.isConfigured && (
                  <button
                    type="button"
                    onClick={handleDisconnectSupabase}
                    className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-rose-950/40 border border-slate-700 text-rose-300 hover:border-rose-500/40 text-xs transition-colors"
                  >
                    Disconnect Supabase
                  </button>
                )}
              </div>
            </form>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1 font-bengali">
              <div>💡 <strong>নিরাপত্তা নীতি:</strong> কোনো <code className="text-rose-400 font-mono">service_role</code> সিক্রেট কী ফ্রন্টএন্ডে ব্যবহার করবেন না। শুধু <code className="text-sky-300 font-mono">anon public key</code> এবং <code className="text-sky-300 font-mono">project url</code> প্রদান করবেন। সমস্ত টেবিল Row Level Security (RLS) দ্বারা সংরক্ষিত।</div>
              <div>অফিসিয়াল অ্যাডমিন ইমেইল: <strong className="text-amber-300 font-mono">admin@haquegraphy.com</strong></div>
            </div>
          </div>

          {/* Copyable Full SQL Schema */}
          <div className="p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">Full PostgreSQL Schema & Row Level Security (RLS)</h3>
                <p className="text-xs text-slate-400 font-bengali">Supabase SQL Editor-এ এই কোড রান করলেই profiles, products, orders, settings টেবিল ও RLS তৈরি হবে।</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(FULL_SUPABASE_SCHEMA);
                  setCopiedSql(true);
                  showToast('Complete SQL schema copied to clipboard', 'info');
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy Full SQL Script'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72">
{FULL_SUPABASE_SCHEMA}
            </pre>
          </div>

          {/* Netlify Config */}
          <div className="p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Netlify Deployment Instructions</h3>
                <p className="text-xs text-slate-400">Step-by-step to host with free Netlify subdomain</p>
              </div>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed font-bengali">
              <li>গিটহাবে কোড পুশ করুন অথবা সরাসরি Netlify CLI দিয়ে ডিপ্লয় করুন: <code className="text-amber-400 font-mono">netlify deploy --prod</code></li>
              <li>Netlify Dashboard &gt; Site Settings এ গিয়ে আপনার পছন্দমতো ফ্রি সাবডোমেন সেট করুন (যেমন: <code className="text-white font-mono">haquegraphy.netlify.app</code>)</li>
              <li>Environment Variables সেকশনে আপনার Supabase URL ও Anon Key যোগ করুন:
                <div className="mt-1 font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded">
                  VITE_SUPABASE_URL=https://xyz.supabase.co<br />
                  VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1325] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Design Product' : 'Add New Design Product'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Title (Bangla) *</label>
                  <input
                    type="text"
                    required
                    value={formTitleBn}
                    onChange={e => setFormTitleBn(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Category *</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="islamic_eid">Islamic & Eid</option>
                    <option value="typography">Bangla Typography</option>
                    <option value="social_media">Social Media</option>
                    <option value="branding">Brand Identity</option>
                    <option value="wedding">Wedding & Invitation</option>
                    <option value="print_packaging">Print & Packaging</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">File Type *</label>
                  <select
                    value={formFileType}
                    onChange={e => setFormFileType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    <option value="PLP">PLP (Pixellab Mobile)</option>
                    <option value="PSD">PSD (Photoshop)</option>
                    <option value="AI">AI (Illustrator)</option>
                    <option value="EPS">EPS (Vector)</option>
                    <option value="ZIP">ZIP (Bundle)</option>
                    <option value="PDF">PDF (Print Ready)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Price (BDT ৳)</label>
                  <input
                    type="number"
                    disabled={formIsFree}
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white disabled:opacity-40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Sale Price (Optional)</label>
                  <input
                    type="number"
                    disabled={formIsFree}
                    value={formSalePrice}
                    onChange={e => setFormSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white disabled:opacity-40"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFreeCheckbox"
                    checked={formIsFree}
                    onChange={e => setFormIsFree(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="isFreeCheckbox" className="text-slate-200 font-semibold cursor-pointer">
                    100% Free Design
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Software Compatibility</label>
                  <input
                    type="text"
                    value={formSoftware}
                    onChange={e => setFormSoftware(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Color Mode</label>
                  <select
                    value={formColorMode}
                    onChange={e => setFormColorMode(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="CMYK">CMYK (Print)</option>
                    <option value="RGB">RGB (Screen)</option>
                    <option value="Vector CMYK">Vector CMYK</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">File Size</label>
                  <input
                    type="text"
                    value={formFileSize}
                    onChange={e => setFormFileSize(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* File Upload Section for Images & Design Assets (PLP, PSD, AI, EPS, ZIP, PNG, JPG) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <FileUploader
                  label="1. Preview Image Upload (PNG, JPG, WebP) *"
                  accept=".png,.jpg,.jpeg,.webp"
                  type="image"
                  currentValue={formPreview}
                  onFileLoaded={({ url, fileName }) => {
                    setFormPreview(url);
                    showToast(language === 'bn' ? `প্রিভিউ ইমেজ লোড হয়েছে: ${fileName}` : `Preview image loaded: ${fileName}`, 'success');
                  }}
                  cloudinaryCloudName={brandingSettings.cloudinaryCloudName || 'c48ghki2'}
                />

                <FileUploader
                  label="2. Digital Asset Upload (PLP, PSD, AI, EPS, ZIP, PDF) *"
                  accept=".plp,.psd,.ai,.eps,.zip,.pdf,.png,.jpg"
                  type="asset"
                  currentValue={formDownloadUrl}
                  onFileLoaded={({ url, fileSize, detectedFormat, fileName }) => {
                    setFormDownloadUrl(url);
                    if (fileSize) setFormFileSize(fileSize);
                    if (detectedFormat) setFormFileType(detectedFormat);
                    showToast(language === 'bn' ? `ডিজাইন ফাইল যুক্ত হয়েছে: ${fileName}` : `Design file attached: ${fileName}`, 'success');
                  }}
                  cloudinaryCloudName={brandingSettings.cloudinaryCloudName || 'c48ghki2'}
                />
              </div>

              {/* Direct URL input fallback */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium text-[11px]">Direct Preview Image URL (Optional)</label>
                  <input
                    type="text"
                    value={formPreview}
                    onChange={e => setFormPreview(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium text-[11px]">Direct Download Asset URL (Optional)</label>
                  <input
                    type="text"
                    value={formDownloadUrl}
                    onChange={e => setFormDownloadUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Description (Bangla)</label>
                <textarea
                  rows={2}
                  value={formDescriptionBn}
                  onChange={e => setFormDescriptionBn(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
