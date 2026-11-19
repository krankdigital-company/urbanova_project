import React, { useState } from "react";
import { Product, ColorOption } from "../types";
import { X, Heart, ShoppingBag, ShieldCheck, Check, Star, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "../utils/currency";

interface QuickViewModalProps {
  product: Product | null;
  selectedCurrency: string;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ColorOption) => void;
  onViewFullPage?: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  selectedCurrency,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onViewFullPage,
}) => {
  const availableColors = product?.colors?.length
    ? product.colors
    : [{ name: "Default", hex: "#B8B0A4" }];
  const availableSizes = product?.sizes?.length ? product.sizes : ["OS"];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(availableColors[0]!);
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0]!);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#121316] text-black dark:text-white rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors text-black dark:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2 p-6 bg-neutral-100 dark:bg-[#0A0B0C] flex flex-col items-center justify-center relative">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-inner mb-4">
              <img
                src={product.images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx
                        ? "border-black dark:border-white scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Purchase Actions */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-none">
            <div>
              {/* Eco Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-grotesk font-extrabold tracking-wider uppercase mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{product.ecoBadge}</span>
              </div>

              {/* Title */}
              <h2 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white mb-2">
                {product.name}
              </h2>

              {/* Price & Rating */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/10 dark:border-white/10">
                <div className="flex items-baseline gap-3">
                  <span className="font-grotesk font-extrabold text-2xl text-black dark:text-white">
                    {formatPrice(product.price, selectedCurrency)}
                  </span>
                  {product.originalPrice && (
                    <span className="font-grotesk text-sm text-neutral-400 line-through">
                      {formatPrice(product.originalPrice, selectedCurrency)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs font-grotesk font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>
                    {product.rating} ({product.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Material Composition */}
              <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-xl mb-6">
                <span className="text-[11px] font-grotesk font-extrabold tracking-widest text-neutral-500 uppercase block mb-1">
                  SUSTAINABLE FABRIC COMPOSITION
                </span>
                <p className="text-xs font-medium text-black dark:text-white">
                  {product.composition}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-grotesk font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> {product.ecoImpactText}
                </p>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-grotesk font-extrabold uppercase tracking-wider text-neutral-500">
                    Color: <span className="text-black dark:text-white">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {availableColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-grotesk font-bold transition-all ${
                        selectedColor.name === c.name
                          ? "border-black dark:border-white bg-black/5 dark:bg-white/10"
                          : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-grotesk font-extrabold uppercase tracking-wider text-neutral-500">
                    Select Size
                  </span>
                  <span className="text-[11px] font-grotesk text-neutral-400 underline cursor-pointer">
                    Fit Guide
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 rounded-xl text-xs font-grotesk font-extrabold uppercase transition-all ${
                        selectedSize === sz
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                          : "bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-4 font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Add to Bag — {selectedCurrency}
                        {product.price}
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className="p-4 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
                  />
                </button>
              </div>

              {onViewFullPage && (
                <button
                  onClick={() => {
                    onViewFullPage(product);
                    onClose();
                  }}
                  className="w-full py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 font-grotesk font-bold text-xs uppercase tracking-wider text-black dark:text-white rounded-lg transition-colors text-center"
                >
                  View Full Product Page & Reviews →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
