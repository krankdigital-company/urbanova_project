import React, { useState, useMemo, useEffect } from "react";
import { useSiteContent } from "../lib/content";
import { Product, ColorOption } from "../types";
import { ProductCard } from "./ProductCard";
import { SlidersHorizontal, ChevronRight, ArrowRight } from "lucide-react";

interface ProductCatalogProps {
  selectedCurrency: string;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ColorOption) => void;
  onBuyNow: (product: Product, size: string, color: ColorOption) => void;
  onSelectProduct?: (product: Product) => void;
  initialCategory?: string;
  onCategoryChange?: (category: string) => void;
  homeOnlyCategories?: boolean;
}

type SortKey =
  | "featured"
  | "newest"
  | "best-sellers"
  | "price-low"
  | "price-high"
  | "rating"
  | "reviews"
  | "discount"
  | "name-az"
  | "name-za";

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured Order" },
  { id: "newest", label: "Newest Arrivals" },
  { id: "best-sellers", label: "Best Sellers" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Top Customer Rated" },
  { id: "reviews", label: "Most Reviewed" },
  { id: "discount", label: "Biggest Discount" },
  { id: "name-az", label: "Name: A to Z" },
  { id: "name-za", label: "Name: Z to A" },
];

const sortList = (list: Product[], sortBy: SortKey): Product[] => {
  const out = [...list];
  const discount = (p: Product) =>
    p.originalPrice && p.originalPrice > p.price
      ? (p.originalPrice - p.price) / p.originalPrice
      : 0;
  switch (sortBy) {
    case "price-low":
      return out.sort((a, b) => a.price - b.price);
    case "price-high":
      return out.sort((a, b) => b.price - a.price);
    case "rating":
      return out.sort((a, b) => b.rating - a.rating);
    case "reviews":
      return out.sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0));
    case "newest":
      return out.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    case "best-sellers":
      return out.sort((a, b) => Number(!!b.isBestSeller) - Number(!!a.isBestSeller));
    case "discount":
      return out.sort((a, b) => discount(b) - discount(a));
    case "name-az":
      return out.sort((a, b) => a.name.localeCompare(b.name));
    case "name-za":
      return out.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return out;
  }
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedCurrency,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  initialCategory,
  onCategoryChange,
  homeOnlyCategories = false,
}) => {
  const [activeTab, setActiveTabState] = useState(initialCategory || "all");
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  useEffect(() => {
    setActiveTabState(initialCategory || "all");
  }, [initialCategory]);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    onCategoryChange?.(tab);
  };

  const wishlistMap = useMemo(() => {
    const map = new Set<string>();
    wishlist.forEach((p) => map.add(p.id));
    return map;
  }, [wishlist]);

  const { products: MOCK_PRODUCTS, categories } = useSiteContent();
  const displayedCategories = homeOnlyCategories
    ? categories.filter((category) => category.showOnHome !== false)
    : categories;
  const tabs = [
    { id: "all", label: "All Categories" },
    ...displayedCategories.map((category) => ({ id: category.slug, label: category.name })),
    { id: "new-arrivals", label: "New Drops" },
  ];

  // Handle single filtered view if activeTab is not 'all'
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return [];

    let list = [...MOCK_PRODUCTS];

    if (activeTab === "new-arrivals") {
      list = list.filter((p) => p.isNew);
    } else if (activeTab === "best-sellers") {
      list = list.filter((p) => p.isBestSeller);
    } else if (activeTab === "sustainable-lab") {
      list = list.filter((p) => p.isSustainable);
    } else {
      list = list.filter((p) => p.category === activeTab);
    }

    return sortList(list, sortBy);
  }, [activeTab, sortBy, MOCK_PRODUCTS]);

  return (
    <section
      id="catalog"
      className={`${homeOnlyCategories ? "py-8" : "py-16"} max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8`}
    >
      {/* Top Controls & Category Navigation Bar */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between ${homeOnlyCategories ? "mb-4 pb-4" : "mb-8 pb-6"} border-b border-neutral-200/80 dark:border-white/10 gap-4`}
      >
        <div>
          <span className="text-xs font-grotesk font-extrabold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
            URBANOVA ARCHITECTURAL DROPS
          </span>
          <h2 className="font-syne text-2xl sm:text-4xl font-extrabold tracking-tight uppercase text-black dark:text-white mt-1">
            EXPLORE COLLECTIONS
          </h2>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-grotesk font-bold text-neutral-500 dark:text-neutral-400 uppercase flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="bg-neutral-100 dark:bg-[#181A1F] text-black dark:text-white border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-grotesk font-bold uppercase focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div
        className={`flex items-center gap-2 overflow-x-auto no-scrollbar ${homeOnlyCategories ? "pb-4 mb-6" : "pb-6 mb-12"} border-b border-neutral-200/80 dark:border-white/10`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-grotesk font-extrabold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                : "bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER CATEGORY PATTERN WHEN 'ALL' IS SELECTED */}
      {activeTab === "all" ? (
        <div className={homeOnlyCategories ? "space-y-8" : "space-y-16"}>
          {displayedCategories.map((category) => {
            const secProducts = sortList(
              MOCK_PRODUCTS.filter((p) => p.category === category.slug),
              sortBy,
            );

            return (
              <div key={category.id} className="scroll-mt-24">
                {/* Section Header Pattern */}
                <div
                  className={`flex flex-col items-center text-center ${homeOnlyCategories ? "mb-4" : "mb-8"}`}
                >
                  <span className="text-[11px] font-grotesk font-extrabold tracking-[0.3em] text-neutral-400 uppercase mb-1">
                    {category.name}
                  </span>
                  <h3 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase text-black dark:text-white tracking-tight leading-none mb-3">
                    {category.description || category.name}
                  </h3>
                  <button
                    onClick={() => setActiveTab(category.slug)}
                    className="group inline-flex items-center gap-1.5 text-xs font-grotesk font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <span>VIEW ALL</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* 5-Column Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
                  {secProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selectedCurrency={selectedCurrency}
                      isWishlisted={wishlistMap.has(product.id)}
                      onToggleWishlist={onToggleWishlist}
                      onQuickView={onQuickView}
                      onAddToCart={onAddToCart}
                      onBuyNow={onBuyNow}
                      onSelectProduct={onSelectProduct}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {(() => {
            const knownCategories = new Set(displayedCategories.map((category) => category.slug));
            const uncategorizedProducts = MOCK_PRODUCTS.filter(
              (product) => !knownCategories.has(product.category),
            );
            if (!uncategorizedProducts.length) return null;
            return (
              <div className="scroll-mt-24">
                <div className="mb-5">
                  <span className="text-xs font-grotesk font-extrabold tracking-[0.2em] text-neutral-500 uppercase">
                    NEW STORE ITEMS
                  </span>
                  <h3 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mt-1">
                    MORE FROM URBANOVA
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {sortList(uncategorizedProducts, sortBy).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selectedCurrency={selectedCurrency}
                      isWishlisted={wishlistMap.has(product.id)}
                      onToggleWishlist={onToggleWishlist}
                      onQuickView={onQuickView}
                      onAddToCart={onAddToCart}
                      onBuyNow={onBuyNow}
                      onSelectProduct={onSelectProduct}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        /* SINGLE FILTERED CATEGORY GRID VIEW */
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-syne text-xl sm:text-2xl font-black text-black dark:text-white uppercase tracking-tight">
              Showing {filteredProducts.length} Items
            </h3>
            <button
              onClick={() => setActiveTab("all")}
              className="text-xs font-grotesk font-extrabold uppercase text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selectedCurrency={selectedCurrency}
                isWishlisted={wishlistMap.has(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-neutral-100 dark:bg-white/5 rounded-2xl p-8">
              <p className="text-sm font-grotesk font-extrabold uppercase text-neutral-700 dark:text-neutral-300">
                No items found matching the selected category.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
