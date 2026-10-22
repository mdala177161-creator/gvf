import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, SiteSettings, OrderStatus } from '../types';

// Retrieve credentials from Vite environment or safe admin localStorage configuration
const getEnvOrStoredConfig = () => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

  const storedUrl = localStorage.getItem('haque_supabase_url')?.trim();
  const storedKey = localStorage.getItem('haque_supabase_anon_key')?.trim();

  const url = envUrl || storedUrl || '';
  const anonKey = envKey || storedKey || '';

  const isValidUrl = url.startsWith('https://') && url.includes('.supabase.co');
  const isValidKey = anonKey.length > 20;

  return {
    url,
    anonKey,
    isConfigured: Boolean(isValidUrl && isValidKey),
    source: envUrl ? 'env' : storedUrl ? 'storage' : 'none',
  };
};

let clientInstance: SupabaseClient | null = null;
let currentConfig = getEnvOrStoredConfig();

export const initSupabaseClient = (): SupabaseClient | null => {
  currentConfig = getEnvOrStoredConfig();
  if (currentConfig.isConfigured) {
    try {
      clientInstance = createClient(currentConfig.url, currentConfig.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return clientInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      clientInstance = null;
    }
  }
  return null;
};

// Initialize on module load
initSupabaseClient();

export const supabaseService = {
  getClient(): SupabaseClient | null {
    if (!clientInstance && currentConfig.isConfigured) {
      return initSupabaseClient();
    }
    return clientInstance;
  },

  getConfig() {
    return getEnvOrStoredConfig();
  },

  saveCustomConfig(url: string, anonKey: string): { success: boolean; message: string } {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();

    if (!trimmedUrl.startsWith('https://') || !trimmedUrl.includes('.supabase.co')) {
      return { success: false, message: 'Invalid Supabase URL. Must start with https:// and end with .supabase.co' };
    }
    if (trimmedKey.length < 20) {
      return { success: false, message: 'Invalid Publishable Anon Key. Key is too short.' };
    }

    localStorage.setItem('haque_supabase_url', trimmedUrl);
    localStorage.setItem('haque_supabase_anon_key', trimmedKey);

    initSupabaseClient();

    return { success: true, message: 'Supabase configuration saved successfully!' };
  },

  clearCustomConfig() {
    localStorage.removeItem('haque_supabase_url');
    localStorage.removeItem('haque_supabase_anon_key');
    clientInstance = null;
  },

  isReady(): boolean {
    return Boolean(clientInstance && currentConfig.isConfigured);
  },

  // Database Operations for Products
  async fetchProducts(): Promise<Product[] | null> {
    const client = this.getClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchProducts error:', error);
        return null;
      }

      if (data && data.length > 0) {
        return data.map(row => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          titleBn: row.title_bn,
          description: row.description || '',
          descriptionBn: row.description_bn || '',
          category: row.category,
          categoryNameEn: row.category_name_en || row.category,
          categoryNameBn: row.category_name_bn || row.category,
          price: Number(row.price),
          salePrice: row.sale_price ? Number(row.sale_price) : undefined,
          isFree: Boolean(row.is_free),
          isFeatured: Boolean(row.is_featured),
          isPublished: Boolean(row.is_published),
          fileType: row.file_type,
          fileSize: row.file_size || '50 MB',
          softwareVersion: row.software_version || 'Photoshop / Illustrator',
          colorMode: row.color_mode || 'CMYK',
          dimensions: row.dimensions || '3000 x 3000 px',
          dpi: row.dpi || 300,
          previewImage: row.preview_image,
          fileDownloadUrl: row.file_download_url,
          downloadCount: row.download_count || 0,
          salesCount: row.sales_count || 0,
          createdAt: row.created_at,
          tags: row.tags || [],
          features: row.features || [],
          featuresBn: row.features_bn || [],
        }));
      }
      return null;
    } catch (e) {
      console.warn('Supabase query error:', e);
      return null;
    }
  },

  async upsertProduct(product: Partial<Product>): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;

    try {
      const payload = {
        title: product.title,
        title_bn: product.titleBn,
        slug: product.slug,
        description: product.description,
        description_bn: product.descriptionBn,
        category: product.category,
        category_name_en: product.categoryNameEn,
        category_name_bn: product.categoryNameBn,
        price: product.price,
        sale_price: product.salePrice ?? null,
        is_free: product.isFree,
        is_featured: product.isFeatured ?? false,
        is_published: product.isPublished ?? true,
        file_type: product.fileType,
        file_size: product.fileSize,
        software_version: product.softwareVersion,
        color_mode: product.colorMode,
        dimensions: product.dimensions,
        dpi: product.dpi,
        preview_image: product.previewImage,
        file_download_url: product.fileDownloadUrl,
        tags: product.tags,
        features: product.features,
        features_bn: product.featuresBn,
      };

      if (product.id && !product.id.startsWith('prod-')) {
        // Update existing UUID record
        const { error } = await client.from('products').update(payload).eq('id', product.id);
        return !error;
      } else {
        // Insert new record
        const { error } = await client.from('products').insert([payload]);
        return !error;
      }
    } catch (e) {
      console.warn('Supabase upsert error:', e);
      return false;
    }
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;

    try {
      const { error } = await client.from('products').delete().eq('id', productId);
      return !error;
    } catch {
      return false;
    }
  },

  // Orders
  async createOrder(order: Omit<Order, 'id'>): Promise<string | null> {
    const client = this.getClient();
    if (!client) return null;

    try {
      const { data, error } = await client.from('orders').insert([
        {
          order_number: order.orderNumber,
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_phone: order.customerPhone,
          whatsapp_number: order.whatsappNumber,
          items: order.items,
          total_amount: order.totalAmount,
          discount_amount: order.discountAmount,
          payment_method: order.paymentMethod,
          sender_phone: order.senderPhone,
          transaction_id: order.transactionId,
          customer_note: order.customerNote,
          status: 'pending_verification',
        },
      ]).select('id').single();

      if (error) {
        console.warn('Supabase order creation error:', error);
        return null;
      }
      return data?.id || null;
    } catch {
      return null;
    }
  },

  async updateOrderStatus(orderIdOrNumber: string, status: OrderStatus, token?: string): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;

    try {
      const updates: any = {
        status,
        verified_at: status === 'verified_paid' ? new Date().toISOString() : null,
      };
      if (token) updates.download_token = token;

      const { error } = await client
        .from('orders')
        .update(updates)
        .or(`id.eq.${orderIdOrNumber},order_number.eq.${orderIdOrNumber}`);

      return !error;
    } catch {
      return false;
    }
  },
};
