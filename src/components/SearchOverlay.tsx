import React, { useState, useMemo } from 'react';
import { useSiteContent } from '../lib/content';
import { Product } from '../types';
import { Search, X, ArrowRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../utils/currency';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: string;
  onQuickView: (product: Product) => void;
}

const TRENDING_KEYWORDS = [
  'Oversized Trench',
  'Organic Hoodie',
  'Raw Selvedge Denim',
  'Lugged Boots',
  'Fine Merino Turtleneck',
  'Recycled Nylon'
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  selectedCurrency,
  onQuickView
}) => {
  const [query, setQuery] = useState('');
  const { products: MOCK_PRODUCTS } = useSiteContent();

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-white/95 dark:bg-[#0D0E10]/95 backdrop-blur-xl text-black dark:text-white p-4 sm:p-8 overflow-y-auto">
        {/* Top Header */}
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-grotesk font-extrabold uppercase tracking-widest text-neutral-500">
              Urbanova Catalog Search
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Search Input */}
        <div className="max-w-4xl mx-auto w-full pt-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search by garment, fabric, or fit..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-lg sm:text-2xl font-syne font-bold placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Trending Keywords */}
          {!query && (
            <div className="py-4">
              <span className="text-xs font-grotesk font-extrabold text-neutral-500 uppercase tracking-wider block mb-3">
                Trending Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {TRENDING_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setQuery(kw)}
                    className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 text-xs font-grotesk font-bold uppercase hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Grid */}
          {query && (
            <div className="py-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-grotesk font-extrabold uppercase text-neutral-500">
                  {searchResults.length} Results for "{query}"
                </span>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                      className="group flex gap-4 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-black/10 dark:hover:border-white/10"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-20 object-cover rounded-lg bg-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col justify-center">
                        <h4 className="font-syne text-xs font-bold uppercase tracking-tight line-clamp-1 group-hover:underline">
                          {product.name}
                        </h4>
                        <p className="text-[11px] font-grotesk text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          {product.ecoBadge}
                        </p>
                        <span className="font-grotesk font-bold text-xs mt-1">
                          {formatPrice(product.price, selectedCurrency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-black/5 dark:bg-white/5 rounded-2xl">
                  <p className="font-syne text-lg font-bold uppercase mb-1">No products found</p>
                  <p className="text-xs font-grotesk text-neutral-500">
                    Try searching for "trench", "denim", or "merino".
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
