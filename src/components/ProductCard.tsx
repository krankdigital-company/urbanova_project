import React, { useState } from "react";
import type { Product, ColorOption } from "../types";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "../utils/currency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductCardProps {
  product: Product;
  selectedCurrency: string;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ColorOption) => void;
  onBuyNow: (product: Product, size: string, color: ColorOption) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedCurrency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
}) => {
  const productColors = product.colors?.filter(Boolean) ?? [];
  const productSizes = product.sizes?.filter(Boolean) ?? [];
  const availableColors = productColors.length
    ? productColors
    : [{ name: "Default", hex: "#B8B0A4" }];
  const availableSizes = productSizes.length ? productSizes : ["OS"];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(
    availableColors.length === 1 ? availableColors[0]! : null,
  );
  const [selectedSize, setSelectedSize] = useState(
    availableSizes.length === 1 ? availableSizes[0]! : "",
  );
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const formattedPrice = formatPrice(product.price, selectedCurrency);
  const formattedOriginalPrice = product.originalPrice
    ? formatPrice(product.originalPrice, selectedCurrency)
    : null;

  const requiresOptionSelection = availableColors.length > 1 || availableSizes.length > 1;

  const beginAction = (action: "buy-now" | "add-to-cart") => {
    if (requiresOptionSelection) {
      setIsOptionsOpen(true);
      return;
    }

    const color = availableColors[0]!;
    const size = availableSizes[0]!;
    if (action === "buy-now") onBuyNow(product, size, color);
    else onAddToCart(product, size, color);
  };

  const confirmAction = (action: "buy-now" | "add-to-cart") => {
    if (!selectedColor || !selectedSize) return;
    if (action === "buy-now") onBuyNow(product, selectedSize, selectedColor);
    else onAddToCart(product, selectedSize, selectedColor);
    setIsOptionsOpen(false);
  };

  return (
    <>
      <div
        onMouseEnter={() => {
          setIsHovered(true);
          if (product.images.length > 1) setCurrentImageIdx(1);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIdx(0);
        }}
        className="group relative flex flex-col h-full bg-neutral-50/60 dark:bg-[#111215] border border-neutral-200/80 dark:border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-neutral-300 dark:hover:border-white/15"
      >
        {/* Image Container */}
        <div
          onClick={() => (onSelectProduct ? onSelectProduct(product) : onQuickView(product))}
          className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-[#16171B] cursor-pointer"
        >
          <img
            src={product.images[currentImageIdx]}
            alt={product.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Top Badges - Only key tags like NEW or SALE */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            {product.isNew && (
              <span className="px-2.5 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-[9px] font-grotesk font-extrabold tracking-widest uppercase">
                NEW
              </span>
            )}
            {product.originalPrice && (
              <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[9px] font-grotesk font-extrabold tracking-widest uppercase">
                SALE
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/70 backdrop-blur-md text-black dark:text-white hover:scale-110 active:scale-95 transition-all shadow-sm border border-black/5 dark:border-white/10"
            aria-label="Save to wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isWishlisted
                  ? "fill-rose-500 text-rose-500"
                  : "text-neutral-700 dark:text-neutral-300"
              }`}
            />
          </button>

          {/* Product actions stay visible on touch devices; desktop reveals them on hover. */}
          <div
            className={`absolute inset-x-3 bottom-3 z-10 transition-all duration-300 flex flex-col gap-1.5 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-3 lg:pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  beginAction("buy-now");
                }}
                className="min-w-0 flex-1 py-2.5 bg-black text-white dark:bg-white dark:text-black font-grotesk font-bold text-[10px] tracking-widest uppercase rounded-xl shadow-md hover:opacity-90 transition-opacity"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  beginAction("add-to-cart");
                }}
                aria-label={`Add ${product.name} to cart`}
                title="Add to Cart"
                className="shrink-0 p-2.5 bg-white/95 dark:bg-neutral-900/95 text-black dark:text-white rounded-xl shadow-md border border-black/5 dark:border-white/10 hover:opacity-80 transition-opacity"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Card Info Below Image */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
          <div>
            {/* Category Eyebrow */}
            <div className="flex items-center justify-between text-[10px] font-grotesk font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-1">
              <span>{product.category}</span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
            </div>

            {/* Product Title */}
            <h3
              onClick={() => (onSelectProduct ? onSelectProduct(product) : onQuickView(product))}
              className="font-syne text-xs sm:text-sm font-bold text-black dark:text-white tracking-tight uppercase cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors line-clamp-1"
              title={product.name}
            >
              {product.name}
            </h3>
          </div>

          {/* Bottom Price & Swatches */}
          <div className="pt-3 mt-3 border-t border-neutral-200/60 dark:border-white/5 flex items-center justify-between gap-2">
            {/* Clean Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-grotesk font-black text-sm text-black dark:text-white">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-[11px] text-neutral-400 line-through font-grotesk">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-1 shrink-0">
              {availableColors.slice(0, 3).map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  className={`w-2.5 h-2.5 rounded-full border border-black/20 dark:border-white/20 transition-transform ${
                    selectedColor?.name === c.name
                      ? "scale-125 ring-1 ring-black dark:ring-white"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md max-h-[85dvh] overflow-y-auto rounded-2xl bg-[#FAF9F6] dark:bg-[#121316] text-black dark:text-white border border-black/10 dark:border-white/10 p-5 sm:p-6">
          <DialogHeader className="pr-8">
            <DialogTitle className="font-syne text-xl font-extrabold uppercase tracking-tight">
              Choose Your Options
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Select the size and color for {product.name}.
            </DialogDescription>
          </DialogHeader>

          {productSizes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-grotesk font-extrabold uppercase tracking-widest text-neutral-500">
                Size
              </h4>
              <div className="flex flex-wrap gap-2">
                {productSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-11 rounded-lg border px-3 py-2 text-xs font-grotesk font-bold transition-colors ${
                      selectedSize === size
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-black/15 dark:border-white/15 hover:border-black dark:hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {productColors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-grotesk font-extrabold uppercase tracking-widest text-neutral-500">
                Color
              </h4>
              <div className="flex flex-wrap gap-2">
                {productColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    aria-pressed={selectedColor?.name === color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-grotesk font-bold transition-colors ${
                      selectedColor?.name === color.name
                        ? "border-black dark:border-white"
                        : "border-black/15 dark:border-white/15 hover:border-black dark:hover:border-white"
                    }`}
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-black/20 dark:border-white/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => confirmAction("add-to-cart")}
              disabled={!selectedColor || !selectedSize}
              className="rounded-xl border border-black/15 dark:border-white/15 px-4 py-3 text-xs font-grotesk font-extrabold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => confirmAction("buy-now")}
              disabled={!selectedColor || !selectedSize}
              className="rounded-xl bg-black px-4 py-3 text-xs font-grotesk font-extrabold uppercase tracking-widest text-white hover:opacity-90 dark:bg-white dark:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
