import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Download, ShoppingBag, Eye, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, navigateToProduct, addToCart } = useApp();

  const title = language === 'bn' ? product.titleBn : product.title;
  const categoryName = language === 'bn' ? product.categoryNameBn : product.categoryNameEn;

  return (
    <div className="group bg-[#0B1325] border border-slate-800/90 hover:border-amber-500/40 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/20">
      {/* Product Image Slot */}
      <div 
        onClick={() => navigateToProduct(product.id)}
        className="relative aspect-[4/3] bg-slate-900 overflow-hidden cursor-pointer"
      >
        <img
          src={product.previewImage}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quiet format indicator */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-amber-400 text-[11px] font-mono px-2 py-0.5 rounded tracking-wider uppercase font-semibold">
          {product.fileType}
        </div>

        {/* Free or Sale notice */}
        {product.isFree ? (
          <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
            {language === 'bn' ? 'ফ্রি' : 'Free'}
          </div>
        ) : product.salePrice ? (
          <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
            {language === 'bn' ? 'অফার' : 'Sale'}
          </div>
        ) : null}

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToProduct(product.id);
            }}
            className="p-2.5 rounded-lg bg-slate-900/90 text-white hover:text-amber-400 hover:bg-slate-900 border border-slate-700 transition-colors shadow-lg"
            title={language === 'bn' ? 'বিস্তারিত দেখুন' : 'Quick View'}
          >
            <Eye className="w-4 h-4" />
          </button>
          {product.isFree ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ফ্রি ডাউনলোড' : 'Download'}</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-lg transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'কার্টে নিন' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Metadata & Title */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
            <span className="text-amber-400/90">{categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>{product.colorMode}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{product.fileSize}</span>
          </div>

          <h3
            onClick={() => navigateToProduct(product.id)}
            className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
          >
            {title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-bengali">
            {language === 'bn' ? product.descriptionBn : product.description}
          </p>
        </div>

        {/* Bottom Bar: Price and Direct Action */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {product.isFree ? (
              <span className="text-base font-bold text-emerald-400 font-mono">
                {language === 'bn' ? '৳০ (ফ্রি)' : '৳0 Free'}
              </span>
            ) : (
              <>
                <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                  ৳{product.salePrice ?? product.price}
                </span>
                {product.salePrice && (
                  <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                    ৳{product.price}
                  </span>
                )}
              </>
            )}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {product.isFree ? (
              <span>{product.downloadCount} dl</span>
            ) : (
              <span>{product.salesCount} sold</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
