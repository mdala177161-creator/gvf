import { Product, Order, SiteSettings, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/mockData';

const PRODUCTS_KEY = 'haque_graphy_products_v3';
const ORDERS_KEY = 'haque_graphy_orders_v3';
const SETTINGS_KEY = 'haque_graphy_settings_v3';
const VISITS_KEY = 'haque_graphy_visits_count';

export const storageService = {
  // Products
  getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        // Ensure all Cloudinary products are included at the top
        const cldIds = ['prod-cld-1', 'prod-cld-2', 'prod-cld-3', 'prod-cld-4', 'prod-hd-62'];
        let updated = false;
        for (const id of cldIds.reverse()) {
          if (!parsed.some(p => p.id === id)) {
            const item = INITIAL_PRODUCTS.find(p => p.id === id);
            if (item) {
              parsed.unshift(item);
              updated = true;
            }
          }
        }
        if (updated) {
          localStorage.setItem(PRODUCTS_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id || p.slug === id);
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  },

  addProduct(newProduct: Omit<Product, 'id' | 'createdAt' | 'downloadCount' | 'salesCount'>): Product {
    const products = this.getProducts();
    const product: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      downloadCount: 0,
      salesCount: 0,
    };
    products.unshift(product);
    this.saveProducts(products);
    return product;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    this.saveProducts(products);
    return products[index];
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length !== products.length) {
      this.saveProducts(filtered);
      return true;
    }
    return false;
  },

  incrementDownload(id: string): void {
    const products = this.getProducts();
    const item = products.find(p => p.id === id);
    if (item) {
      item.downloadCount = (item.downloadCount || 0) + 1;
      this.saveProducts(products);
    }
  },

  incrementSales(id: string): void {
    const products = this.getProducts();
    const item = products.find(p => p.id === id);
    if (item) {
      item.salesCount = (item.salesCount || 0) + 1;
      this.saveProducts(products);
    }
  },

  // Orders
  getOrders(): Order[] {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order {
    const orders = this.getOrders();
    const orderNumber = `HQG-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      status: 'pending_verification',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return null;

    const current = orders[index];
    const updates: Partial<Order> = { status };

    if (status === 'verified_paid') {
      updates.verifiedAt = new Date().toISOString();
      updates.downloadToken = `dl_token_${current.orderNumber.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`;
      // increment sales count for items
      current.items.forEach(item => {
        this.incrementSales(item.product.id);
      });
    }

    orders[index] = { ...current, ...updates };
    this.saveOrders(orders);
    return orders[index];
  },

  findOrder(query: string): Order | undefined {
    const trimmed = query.trim().toLowerCase();
    const orders = this.getOrders();
    return orders.find(
      o =>
        o.orderNumber.toLowerCase() === trimmed ||
        o.customerPhone.toLowerCase() === trimmed ||
        (o.transactionId && o.transactionId.toLowerCase() === trimmed)
    );
  },

  // Site Settings
  getSettings(): SiteSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed: SiteSettings = JSON.parse(stored);
        if (parsed.contactEmail === 'contact@haquegraphy.com' || parsed.whatsappNumber === '+8801712345678') {
          parsed.contactEmail = 'haquegraphydesign@gmail.com';
          parsed.whatsappNumber = '+8801792124279';
          parsed.studioAddress = 'Machum Bazar, Birshree, Zakiganj, Sylhet, Bangladesh';
          parsed.studioAddressBn = 'মাছুম বাজার, বীরশ্রী, জকিগঞ্জ, সিলেট, বাংলাদেশ';
          parsed.bkashNumber = '01792-124279 (Personal / Send Money)';
          parsed.nagadNumber = '01792-124279 (Personal / Send Money)';
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
        }
        if (!parsed.logoUrl) {
          parsed.logoUrl = '/haque-graphy-logo.jpeg';
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  },

  saveSettings(settings: SiteSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  },

  // Real Analytics Calculator
  getAnalytics() {
    const orders = this.getOrders();
    const products = this.getProducts();

    const totalOrders = orders.length;
    const verifiedOrders = orders.filter(o => o.status === 'verified_paid');
    const pendingOrders = orders.filter(o => o.status === 'pending_verification');
    const rejectedOrders = orders.filter(o => o.status === 'rejected');

    // Real verified revenue in BDT
    const confirmedRevenue = verifiedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingRevenue = pendingOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Real downloads
    const totalDownloads = products.reduce((sum, p) => sum + (p.downloadCount || 0), 0);

    // Best sellers
    const bestSellers = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 5);

    // Total visits tracker (increments on session)
    let visits = 1420;
    try {
      const storedVisits = localStorage.getItem(VISITS_KEY);
      if (storedVisits) {
        visits = parseInt(storedVisits, 10);
      } else {
        localStorage.setItem(VISITS_KEY, visits.toString());
      }
    } catch {
      // ignore
    }

    return {
      totalOrders,
      confirmedOrdersCount: verifiedOrders.length,
      pendingOrdersCount: pendingOrders.length,
      rejectedOrdersCount: rejectedOrders.length,
      confirmedRevenue,
      pendingRevenue,
      totalDownloads,
      activeProductsCount: products.filter(p => p.isPublished).length,
      totalProductsCount: products.length,
      bestSellers,
      visitsCount: visits,
    };
  },

  recordVisit(): void {
    try {
      const current = parseInt(localStorage.getItem(VISITS_KEY) || '1420', 10);
      localStorage.setItem(VISITS_KEY, (current + 1).toString());
    } catch {
      // ignore
    }
  },

  exportOrdersCSV(): string {
    const orders = this.getOrders();
    const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Phone', 'Payment Method', 'Transaction ID', 'Amount (BDT)', 'Status'];
    const rows = orders.map(o => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.customerEmail,
      o.customerPhone,
      o.paymentMethod.toUpperCase(),
      o.transactionId || 'N/A',
      o.totalAmount,
      o.status.toUpperCase(),
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  resetAllData(): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
  },
};
