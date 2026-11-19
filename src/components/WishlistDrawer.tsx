import React from 'react';
import { Product, ColorOption } from '../types';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../utils/currency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  selectedCurrency: string;
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ColorOption) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  selectedCurrency,
  onRemoveFromWishlist,
  onAddToCart,
  onQuickView
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FAF9F6] dark:bg-[#0D0E10] text-black dark:text-white z-50 shadow-2xl flex flex-col justify-between border-l border-black/10 dark:border-white/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-black dark:fill-white text-black dark:text-white" />
                <h3 className="font-syne text-lg font-bold uppercase tracking-tight">
                  Saved Wishlist ({wishlist.length})
                </h3>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <Heart className="w-12 h-12 text-neutral-400 mb-3 opacity-50" />
                  <p className="font-syne text-lg font-bold uppercase mb-1">Your wishlist is empty</p>
                  <p className="text-xs text-neutral-500 font-grotesk max-w-xs">
                    Tap the heart icon on any product to save items for later session inspection.
                  </p>
                </div>
              ) : (
                wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3 rounded-xl bg-white dark:bg-[#121316] border border-black/5 dark:border-white/5 shadow-sm"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-24 object-cover rounded-lg bg-neutral-100 cursor-pointer"
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 
                            onClick={() => {
                              onQuickView(product);
                              onClose();
                            }}
                            className="font-syne text-xs font-bold uppercase tracking-tight line-clamp-1 cursor-pointer hover:underline"
                          >
                            {product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveFromWishlist(product)}
                            className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] font-grotesk text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          {product.ecoBadge}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-grotesk font-bold text-xs">
                          {formatPrice(product.price, selectedCurrency)}
                        </span>

                        <button
                          onClick={() => onAddToCart(product, product.sizes[0], product.colors[0])}
                          className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black font-grotesk font-bold text-[10px] tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
