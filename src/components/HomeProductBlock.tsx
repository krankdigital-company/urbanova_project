import React from "react";
import { ChevronRight } from "lucide-react";
import { useSiteContent, type HomeBlock } from "@/lib/content";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import type { ColorOption, Product } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface HomeProductBlockProps {
  block: HomeBlock;
  onSelectCategory: (slug: string) => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product, size: string, color: ColorOption) => void;
}

const safeLink = (value: unknown) =>
  typeof value === "string" &&
  (/^https?:\/\//i.test(value) || (value.startsWith("/") && !value.startsWith("//")))
    ? value
    : "";

const clamp = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.round(parsed))) : fallback;
};

const GRID_COLUMNS: Record<number, string> = {
  2: "grid-cols-2 lg:grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

const CAROUSEL_COLUMNS: Record<number, string> = {
  2: "basis-1/2",
  3: "basis-1/2 md:basis-1/3",
  4: "basis-1/2 md:basis-1/3 lg:basis-1/4",
  5: "basis-1/2 md:basis-1/3 lg:basis-1/5",
  6: "basis-1/2 md:basis-1/3 lg:basis-1/6",
};

export const HomeProductBlock: React.FC<HomeProductBlockProps> = ({
  block,
  onSelectCategory,
  onSelectProduct,
  onBuyNow,
}) => {
  const { categories, products } = useSiteContent();
  const store = useStore();
  const { settings } = block;
  const categorySlug =
    block.blockType === "category" && typeof settings["categorySlug"] === "string"
      ? settings["categorySlug"]
      : "";
  const source = typeof settings["source"] === "string" ? settings["source"] : "all";
  const filterCategorySlug =
    typeof settings["categorySlug"] === "string" ? settings["categorySlug"] : "";
  const selectedCategory =
    categories.find((category) => category.slug === categorySlug) ??
    (source === "category"
      ? categories.find((category) => category.slug === filterCategorySlug)
      : undefined);

  const matchingProducts = products.filter((product) => {
    if (block.blockType === "category") return product.category === categorySlug;
    if (source === "new") return product.isNew;
    if (source === "best_seller") return product.isBestSeller;
    if (source === "sustainable") return product.isSustainable;
    if (source === "category") return product.category === filterCategorySlug;
    return true;
  });
  const configuredLimit = Number(settings["productLimit"]);
  const limit =
    configuredLimit === 0
      ? matchingProducts.length
      : clamp(settings["productLimit"], matchingProducts.length, 1, Math.max(100, matchingProducts.length));
  const visibleProducts = matchingProducts.slice(0, limit);
  const columns = clamp(settings["desktopColumns"], 5, 2, 6);
  const layout = settings["layout"] === "grid" ? "grid" : "carousel";
  const heading =
    (typeof settings["heading"] === "string" && settings["heading"]) ||
    selectedCategory?.homeTag ||
    selectedCategory?.name ||
    block.title;
  const description =
    (typeof settings["description"] === "string" && settings["description"]) ||
    selectedCategory?.homeDescription ||
    selectedCategory?.description ||
    "";
  const eyebrow =
    (typeof settings["eyebrow"] === "string" && settings["eyebrow"]) ||
    (selectedCategory ? "Shop by category" : "");
  const ctaLabel =
    (typeof settings["ctaLabel"] === "string" && settings["ctaLabel"]) ||
    (categorySlug ? "View category" : "");
  const ctaUrl = safeLink(settings["ctaUrl"]);
  const gridClass = GRID_COLUMNS[columns] ?? GRID_COLUMNS[5]!;
  const carouselClass = CAROUSEL_COLUMNS[columns] ?? CAROUSEL_COLUMNS[5]!;

  if (!visibleProducts.length) return null;

  return (
    <section className="py-12 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
      {(heading || description || ctaLabel) && (
        <div className="mb-6 flex flex-col gap-3 border-b border-black/10 pb-5 text-center dark:border-white/10">
          {eyebrow && (
            <span className="text-xs font-grotesk font-extrabold tracking-[0.3em] text-neutral-500 uppercase">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h2 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mx-auto max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          )}
          {ctaLabel &&
            (ctaUrl ? (
              <a
                href={ctaUrl}
                className="mx-auto inline-flex items-center gap-1 text-[11px] font-grotesk font-extrabold uppercase tracking-[0.18em] text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
              >
                {ctaLabel} <ChevronRight className="h-4 w-4" />
              </a>
            ) : categorySlug ? (
              <button
                type="button"
                onClick={() => onSelectCategory(categorySlug)}
                className="mx-auto inline-flex items-center gap-1 text-[11px] font-grotesk font-extrabold uppercase tracking-[0.18em] text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
              >
                {ctaLabel} <ChevronRight className="h-4 w-4" />
              </button>
            ) : null)}
        </div>
      )}

      {layout === "grid" ? (
        <div className={`grid ${gridClass} gap-4`}>
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selectedCurrency={store.currency}
              isWishlisted={store.wishlist.some((item) => item.id === product.id)}
              onToggleWishlist={store.toggleWishlist}
              onQuickView={store.setQuickViewProduct}
              onAddToCart={store.addToCart}
              onBuyNow={onBuyNow}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <Carousel opts={{ align: "start" }} className="px-8">
          <CarouselContent>
            {visibleProducts.map((product) => (
              <CarouselItem key={product.id} className={carouselClass}>
                <ProductCard
                  product={product}
                  selectedCurrency={store.currency}
                  isWishlisted={store.wishlist.some((item) => item.id === product.id)}
                  onToggleWishlist={store.toggleWishlist}
                  onQuickView={store.setQuickViewProduct}
                  onAddToCart={store.addToCart}
                  onBuyNow={onBuyNow}
                  onSelectProduct={onSelectProduct}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      )}
    </section>
  );
};
