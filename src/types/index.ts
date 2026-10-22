export type FileFormat = 'PLP' | 'PSD' | 'AI' | 'EPS' | 'ZIP' | 'PDF';

export type Category = 
  | 'typography'
  | 'social_media'
  | 'branding'
  | 'wedding'
  | 'print_packaging'
  | 'islamic_eid';

export interface Product {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  category: Category;
  categoryNameEn: string;
  categoryNameBn: string;
  price: number; // in BDT (৳)
  salePrice?: number;
  isFree: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  fileType: FileFormat;
  fileSize: string;
  softwareVersion: string;
  colorMode: 'CMYK' | 'RGB' | 'Vector CMYK';
  dimensions: string;
  dpi: number;
  previewImage: string;
  fileDownloadUrl: string;
  downloadCount: number;
  salesCount: number;
  createdAt: string;
  tags: string[];
  features: string[];
  featuresBn: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  licenseType: 'standard' | 'commercial';
}

export type OrderStatus = 'pending_verification' | 'verified_paid' | 'rejected';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'whatsapp';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  whatsappNumber: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  appliedCoupon?: string;
  paymentMethod: PaymentMethod;
  senderPhone?: string;
  transactionId?: string;
  customerNote?: string;
  status: OrderStatus;
  createdAt: string;
  verifiedAt?: string;
  downloadToken?: string;
}

export interface SiteSettings {
  brandName: string;
  brandNameBn: string;
  tagline: string;
  taglineBn: string;
  bkashNumber: string;
  nagadNumber: string;
  whatsappNumber: string;
  contactEmail: string;
  studioAddress: string;
  studioAddressBn: string;
  bannerNotice: string;
  bannerNoticeBn: string;
  isBannerActive: boolean;
  cloudinaryCloudName?: string;
  logoUrl?: string;
}

export type Language = 'bn' | 'en';
