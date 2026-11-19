import React, { useState } from "react";
import { Product, ColorOption } from "../types";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  CheckCircle2,
  Ruler,
  Share2,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  ZoomIn,
  Filter,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard } from "./ProductCard";
import { formatPrice } from "../utils/currency";

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  selectedCurrency: string;
  isWishlisted: boolean;
  onBack: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ColorOption) => void;
  onBuyNow: (product: Product, size: string, color: ColorOption) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpfulCount: number;
  sizePurchased: string;
  fitFeedback: "True to Size" | "Runs Small" | "Runs Large";
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  selectedCurrency,
  isWishlisted,
  onBack,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onQuickView,
}) => {
  const availableColors = product.colors?.filter(Boolean).length
    ? product.colors.filter(Boolean)
    : [{ name: "Default", hex: "#B8B0A4" }];
  const availableSizes = product.sizes?.filter(Boolean).length
    ? product.sizes.filter(Boolean)
    : ["OS"];
  // Gallery state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState<ColorOption>(availableColors[0]!);
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0]!);
  const [quantity, setQuantity] = useState(1);

  // Modals & Accordions
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"provenance" | "details" | "care" | "shipping">(
    "provenance",
  );
  const [copiedLink, setCopiedLink] = useState(false);

  // Reviews state
  const [reviewFilter, setReviewFilter] = useState<"all" | "verified" | "5star">("all");
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newReviewAuthor, setNewReviewAuthor] = useState("");

  // Sample initial reviews generator based on product
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "rev-1",
      author: "Marcus Vance",
      rating: 5,
      date: "2 weeks ago",
      title: "Unbelievable drape and architectural silhouette",
      content: `The craftsmanship on this ${product.name} is unmatched. The weight feels substantial yet comfortable, and the zero-waste fabric gives it an elevated structure. Wore it to an architectural symposium in Tokyo and received endless compliments.`,
      verified: true,
      helpfulCount: 24,
      sizePurchased: product.sizes[Math.min(1, product.sizes.length - 1)],
      fitFeedback: "True to Size",
    },
    {
      id: "rev-2",
      author: "Elias Thorne",
      rating: 5,
      date: "1 month ago",
      title: "True sustainable luxury",
      content: `I’m extremely particular about fabric composition and eco-certifications. Knowing this garment is 100% GOTS certified organic material with zero microplastics makes wearing it feel genuinely rewarding.`,
      verified: true,
      helpfulCount: 18,
      sizePurchased: product.sizes[0],
      fitFeedback: "True to Size",
    },
    {
      id: "rev-3",
      author: "David K.",
      rating: 4,
      date: "1 month ago",
      title: "Heavyweight quality, precise tailoring",
      content:
        "Fits impeccably across shoulders. Slightly longer than expected in the length, but the tailoring is masterclass. Definitely worth the investment.",
      verified: true,
      helpfulCount: 9,
      sizePurchased: product.sizes[product.sizes.length - 1],
      fitFeedback: "Runs Large",
    },
  ]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle || !newReviewContent || !newReviewAuthor) return;

    const created: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      date: "Just now",
      title: newReviewTitle,
      content: newReviewContent,
      verified: true,
      helpfulCount: 1,
      sizePurchased: selectedSize,
      fitFeedback: "True to Size",
    };

    setReviews([created, ...reviews]);
    setIsWriteReviewOpen(false);
    setNewReviewTitle("");
    setNewReviewContent("");
    setNewReviewAuthor("");
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Recommended products in same category or complementary
  const recommendedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 5);

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "verified") return r.verified;
    if (reviewFilter === "5star") return r.rating === 5;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0D0E10] text-black dark:text-white pt-20 pb-20 transition-colors">
      {/* Top Sticky Breadcrumb / Action Bar */}
      <div className="sticky top-20 z-20 bg-[#FAF9F6]/90 dark:bg-[#0D0E10]/90 backdrop-blur-md border-b border-black/10 dark:border-white/10 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-grotesk text-neutral-500 overflow-x-auto whitespace-nowrap">
            <button
              onClick={onBack}
              className="hover:text-black dark:hover:text-white flex items-center gap-1.5 font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </button>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <span className="uppercase tracking-wider font-semibold">{product.category}</span>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <span className="text-black dark:text-white font-bold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-grotesk font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: Gallery & Thumbnails (7 Cols on LG) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Vertical Thumbnail List */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all bg-neutral-100 ${
                    activeImageIdx === idx
                      ? "border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/5 group aspect-[3/4]">
              <img
                src={product.images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
                referrerPolicy="no-referrer"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
                <span className="px-3 py-1.5 rounded-full bg-emerald-950/90 text-emerald-200 border border-emerald-500/30 text-xs font-grotesk font-bold tracking-wider uppercase backdrop-blur-md">
                  {product.ecoBadge}
                </span>

                {product.isNew && (
                  <span className="px-3 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-[11px] font-grotesk font-extrabold uppercase tracking-widest">
                    2026 ARCHITECTURAL RELEASE
                  </span>
                )}
              </div>

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-3 rounded-full bg-black/70 text-white hover:bg-black backdrop-blur-md transition-all shadow-lg"
                title="Expand fullscreen view"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Specs & Direct Checkout Actions (5 Cols on LG) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-grotesk font-extrabold tracking-widest uppercase text-neutral-400">
                  URBANOVA / {product.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-grotesk font-bold">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                  </div>
                  <span>{product.rating}</span>
                  <a href="#reviews-section" className="text-neutral-400 hover:underline">
                    ({product.reviewsCount} verified reviews)
                  </a>
                </div>
              </div>

              {/* Main Product Title */}
              <h1 className="font-syne text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black dark:text-white leading-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-grotesk text-2xl font-extrabold text-black dark:text-white">
                  {formatPrice(product.price * quantity, selectedCurrency)}
                </span>
                {product.originalPrice && (
                  <span className="font-grotesk text-base text-neutral-400 line-through">
                    {formatPrice(product.originalPrice * quantity, selectedCurrency)}
                  </span>
                )}
                <span className="text-xs text-neutral-500 font-grotesk">
                  Taxes & Carbon-Neutral Duty Included
                </span>
              </div>

              {/* Installation payment preview */}
              <p className="text-xs text-neutral-500 font-grotesk mt-1">
                Or 4 interest-free payments of{" "}
                <span className="font-bold text-black dark:text-white">
                  {formatPrice(product.price / 4, selectedCurrency)}
                </span>{" "}
                with Klarna or ShopPay.
              </p>
            </div>

            {/* Eco Impact Banner */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs font-grotesk space-y-0.5">
                <p className="font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  SUSTAINABLE FOOTPRINT IMPACT
                </p>
                <p className="leading-relaxed">
                  {product.ecoImpactText} • Saves {product.co2SavedKg}kg CO₂ footprint compared to
                  conventional industry fast-fashion garments.
                </p>
              </div>
            </div>

            {/* Color Swatch Selection */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-grotesk">
                <span className="font-bold uppercase tracking-wider">
                  Color: <span className="text-neutral-500 font-normal">{selectedColor.name}</span>
                </span>
                <span className="text-neutral-400">Ozone Dye Wash</span>
              </div>

              <div className="flex items-center gap-3">
                {availableColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`relative p-1 rounded-full border-2 transition-all ${
                      selectedColor.name === c.name
                        ? "border-black dark:border-white scale-110"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span
                      className="block w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-grotesk">
                <span className="font-bold uppercase tracking-wider">
                  Select Size: <span className="text-neutral-500">{selectedSize}</span>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-black dark:text-white font-bold underline flex items-center gap-1 hover:text-neutral-600 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Interactive Size Chart</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl font-grotesk text-xs font-extrabold uppercase border transition-all ${
                      selectedSize === size
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md"
                        : "bg-white dark:bg-[#121316] text-black dark:text-white border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <p className="text-[11px] font-grotesk text-neutral-500">
                Fit Note: {product.fitDescription}. Tailored for structured layering.
              </p>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity Box */}
                <div className="flex items-center border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-[#121316] px-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-neutral-500 hover:text-black dark:hover:text-white font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 font-grotesk font-extrabold text-sm w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-neutral-500 hover:text-black dark:hover:text-white font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add To Bag Primary CTA */}
                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product, selectedSize, selectedColor);
                    }
                  }}
                  className="flex-1 py-4 px-6 bg-black text-white dark:bg-white dark:text-black font-syne font-bold text-sm tracking-wider uppercase rounded-xl hover:opacity-90 active:scale-[0.99] transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Add To Bag • {formatPrice(product.price * quantity, selectedCurrency)}
                  </span>
                </button>

                {/* Wishlist Toggle */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-4 rounded-xl border transition-all ${
                    isWishlisted
                      ? "bg-rose-50 dark:bg-rose-950/30 border-rose-500/30 text-rose-500"
                      : "bg-white dark:bg-[#121316] border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500" : ""}`} />
                </button>
              </div>
            </div>

            {/* Delivery Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-black/10 dark:border-white/10 text-xs font-grotesk text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                <span>Express Carbon-Neutral Delivery (2-4 Days)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                <span>Complimentary 30-Day Global Returns</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                <span>Lifetime Repair Guarantee Included</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                <span>In Stock at Soho Flagship Lab</span>
              </div>
            </div>

            {/* Accordion Panels for Technical Garment Specs */}
            <div className="pt-6 border-t border-black/10 dark:border-white/10 space-y-4">
              <div className="flex border-b border-black/10 dark:border-white/10 pb-3 gap-6 text-xs font-grotesk font-extrabold uppercase tracking-wider overflow-x-auto">
                <button
                  onClick={() => setActiveTab("provenance")}
                  className={`pb-1 transition-colors whitespace-nowrap ${
                    activeTab === "provenance"
                      ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  Provenance & Fiber
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-1 transition-colors whitespace-nowrap ${
                    activeTab === "details"
                      ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  Composition
                </button>
                <button
                  onClick={() => setActiveTab("care")}
                  className={`pb-1 transition-colors whitespace-nowrap ${
                    activeTab === "care"
                      ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  Garment Care
                </button>
              </div>

              <div className="text-xs font-sans text-neutral-600 dark:text-neutral-300 leading-relaxed min-h-[100px]">
                {activeTab === "provenance" && (
                  <div className="space-y-2 font-grotesk">
                    <p className="font-bold text-black dark:text-white">Traceable Supply Chain:</p>
                    <p>• Raw Mill: Biella, Piedmont Region, Italy (Oeko-Tex Standard 100)</p>
                    <p>• Weaving & Finishing: Kyoto Zero-Discharge Ozone Atelier</p>
                    <p>• Assembly: Fair Trade Certified Facility #8920 (Fair living wages paid)</p>
                    <p>• Microplastics: 0% synthetic microfibers present.</p>
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-2">
                    <p>
                      <strong className="text-black dark:text-white font-grotesk">
                        Composition:
                      </strong>{" "}
                      {product.composition}
                    </p>
                    <p>
                      <strong className="text-black dark:text-white font-grotesk">
                        Description:
                      </strong>{" "}
                      {product.description}
                    </p>
                    <p>
                      <strong className="text-black dark:text-white font-grotesk">Hardware:</strong>{" "}
                      Recycled matte titanium fasteners & horn-alternative buttons.
                    </p>

                    {(product.detailBlocks ?? []).length > 0 && (
                      <div className="pt-6 space-y-8">
                        {(product.detailBlocks ?? []).map((b, i) => (
                          <div key={i} className="space-y-3">
                            {b.heading && (
                              <h4 className="font-syne text-lg font-extrabold uppercase tracking-tight text-black dark:text-white">
                                {b.heading}
                              </h4>
                            )}
                            {b.image && (
                              <img
                                src={b.image}
                                alt={b.heading || product.name}
                                loading="lazy"
                                className="w-full rounded-2xl object-cover"
                              />
                            )}
                            {b.text && <p className="leading-relaxed">{b.text}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="space-y-2 font-grotesk">
                    <p>• Cold machine wash on delicate cycle with eco-friendly liquid detergent.</p>
                    <p>• Do not tumble dry. Lay flat on towel away from direct sunlight.</p>
                    <p>• Cool iron if needed with damp cloth guard.</p>
                    <p>• Free lifetime repair service at any Urbanova flagship store.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS & RATINGS SECTION */}
        <section
          id="reviews-section"
          className="mt-20 pt-16 border-t border-black/10 dark:border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <span className="text-xs font-grotesk font-extrabold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                VERIFIED COMMUNITY FEEDBACK
              </span>
              <h2 className="font-syne text-2xl sm:text-3xl font-bold uppercase tracking-tight mt-1">
                Client Reviews ({reviews.length})
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-xl text-xs font-grotesk">
                <button
                  onClick={() => setReviewFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    reviewFilter === "all"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-neutral-500"
                  }`}
                >
                  All ({reviews.length})
                </button>
                <button
                  onClick={() => setReviewFilter("verified")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    reviewFilter === "verified"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-neutral-500"
                  }`}
                >
                  Verified Buyers
                </button>
                <button
                  onClick={() => setReviewFilter("5star")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    reviewFilter === "5star"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-neutral-500"
                  }`}
                >
                  5 Stars
                </button>
              </div>

              <button
                onClick={() => setIsWriteReviewOpen(true)}
                className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-grotesk font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Write Review</span>
              </button>
            </div>
          </div>

          {/* Rating Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 rounded-2xl bg-white dark:bg-[#121316] border border-black/5 dark:border-white/5 shadow-sm mb-10">
            <div className="md:col-span-4 flex flex-col justify-center items-center text-center p-4 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10">
              <span className="font-syne text-5xl font-extrabold">{product.rating}</span>
              <div className="flex text-amber-500 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-xs text-neutral-500 font-grotesk">
                Based on {product.reviewsCount} verified purchases
              </p>
            </div>

            <div className="md:col-span-8 flex flex-col justify-center space-y-2 text-xs font-grotesk">
              <div className="flex items-center gap-3">
                <span className="w-12 text-neutral-400 font-bold">5 Stars</span>
                <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[88%]" />
                </div>
                <span className="w-8 text-right font-bold">88%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-neutral-400 font-bold">4 Stars</span>
                <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[12%]" />
                </div>
                <span className="w-8 text-right font-bold">12%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-neutral-400 font-bold">3 Stars</span>
                <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[0%]" />
                </div>
                <span className="w-8 text-right font-bold">0%</span>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#121316] border border-black/5 dark:border-white/5 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-syne font-bold text-sm uppercase">{rev.author}</span>
                      {rev.verified && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-grotesk font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-grotesk mt-1">
                      <span>
                        Purchased size:{" "}
                        <strong className="text-black dark:text-white">{rev.sizePurchased}</strong>
                      </span>
                      <span>•</span>
                      <span>Fit: {rev.fitFeedback}</span>
                    </div>
                  </div>

                  <span className="text-xs text-neutral-400 font-grotesk">{rev.date}</span>
                </div>

                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <h4 className="font-grotesk font-bold text-sm">{rev.title}</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                  {rev.content}
                </p>

                <div className="pt-2 flex items-center gap-4 text-xs font-grotesk text-neutral-400">
                  <button className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPLETE THE LOOK / RECOMMENDED SECTION */}
        <section className="mt-20 pt-16 border-t border-black/10 dark:border-white/10">
          <div className="mb-8">
            <span className="text-xs font-grotesk font-extrabold tracking-widest uppercase text-neutral-400">
              EDITORIAL CURATION
            </span>
            <h2 className="font-syne text-2xl sm:text-3xl font-bold uppercase tracking-tight mt-1">
              Complete The Look
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {recommendedProducts.map((recProd) => (
              <ProductCard
                key={recProd.id}
                product={recProd}
                selectedCurrency={selectedCurrency}
                isWishlisted={false}
                onToggleWishlist={() => {}}
                onQuickView={() => onSelectProduct(recProd)}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      </div>

      {/* SIZE GUIDE MODAL */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF9F6] dark:bg-[#121316] text-black dark:text-white rounded-2xl p-6 sm:p-8 max-w-xl w-full border border-black/10 dark:border-white/10 shadow-2xl relative"
            >
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Ruler className="w-5 h-5 text-emerald-500" />
                <h3 className="font-syne text-xl font-bold uppercase tracking-tight">
                  Architectural Size Guide
                </h3>
              </div>
              <p className="text-xs text-neutral-500 font-grotesk mb-6">
                All measurements are taken flat in inches. Urbanova garments are cut with precision
                structure.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-grotesk text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 font-extrabold uppercase">
                      <th className="py-2.5">Size</th>
                      <th className="py-2.5">Chest</th>
                      <th className="py-2.5">Shoulder</th>
                      <th className="py-2.5">Sleeve</th>
                      <th className="py-2.5">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    <tr>
                      <td className="py-3 font-bold">XS</td>
                      <td>36" - 38"</td>
                      <td>17.5"</td>
                      <td>32.5"</td>
                      <td>28"</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold">S</td>
                      <td>38" - 40"</td>
                      <td>18.0"</td>
                      <td>33.0"</td>
                      <td>28.5"</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold">M</td>
                      <td>40" - 42"</td>
                      <td>18.5"</td>
                      <td>33.5"</td>
                      <td>29.0"</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold">L</td>
                      <td>42" - 44"</td>
                      <td>19.2"</td>
                      <td>34.0"</td>
                      <td>29.5"</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold">XL</td>
                      <td>44" - 46"</td>
                      <td>20.0"</td>
                      <td>34.5"</td>
                      <td>30.0"</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-grotesk space-y-1">
                <p className="font-bold uppercase">Need Personal Sizing Advice?</p>
                <p className="text-neutral-500">
                  Contact our Soho Studio fitting team at concierge@urbanovafashion.com or schedule
                  a virtual 1-on-1 video appointment.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WRITE REVIEW MODAL */}
      <AnimatePresence>
        {isWriteReviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF9F6] dark:bg-[#121316] text-black dark:text-white rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-black/10 dark:border-white/10 shadow-2xl relative"
            >
              <button
                onClick={() => setIsWriteReviewOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-syne text-xl font-bold uppercase tracking-tight mb-1">
                Review {product.name}
              </h3>
              <p className="text-xs text-neutral-500 font-grotesk mb-6">
                Share your feedback on garment drape, material tactile feel, and tailoring
                precision.
              </p>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-grotesk font-bold uppercase mb-1">
                    Overall Score
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${star <= newReviewRating ? "fill-amber-500" : "text-neutral-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-grotesk font-bold uppercase mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Julian Sterling"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 text-xs font-grotesk outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-grotesk font-bold uppercase mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    placeholder="e.g. Sublime drape & weight"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 text-xs font-grotesk outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-grotesk font-bold uppercase mb-1">
                    Detailed Feedback
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newReviewContent}
                    onChange={(e) => setNewReviewContent(e.target.value)}
                    placeholder="How does the fabric feel? How is the fit across shoulders and sleeves?"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 text-xs font-sans outline-none focus:border-black dark:focus:border-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white dark:bg-white dark:text-black font-syne font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
                >
                  Submit Verified Review
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX FULLSCREEN IMAGE MODAL */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={product.images[activeImageIdx]}
              alt={product.name}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
