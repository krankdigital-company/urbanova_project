import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useSiteContent } from "@/lib/content";
import type { ColorOption, Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface NewArrivalsProps {
  selectedCurrency: string;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ColorOption) => void;
  onBuyNow: (product: Product, size: string, color: ColorOption) => void;
  onSelectProduct: (product: Product) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  selectedCurrency,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
}) => {
  const { products } = useSiteContent();
  const arrivals = products.filter((product) => product.isNew);
  const wishlistIds = new Set(wishlist.map((product) => product.id));

  if (!arrivals.length) return null;

  return (
    <section className="py-12 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 mb-6 pb-4 border-b border-black/10 dark:border-white/10">
        <div>
          <span className="text-xs font-grotesk font-extrabold tracking-[0.25em] text-neutral-500 uppercase">
            Just In
          </span>
          <h2 className="font-syne text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black dark:text-white">
            New Arrivals
          </h2>
        </div>
        <ArrowUpRight className="w-5 h-5 text-neutral-500" aria-hidden="true" />
      </div>
      <Carousel opts={{ align: "start" }} className="px-8">
        <CarouselContent>
          {arrivals.map((product) => (
            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
              <ProductCard
                product={product}
                selectedCurrency={selectedCurrency}
                isWishlisted={wishlistIds.has(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onSelectProduct={onSelectProduct}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </section>
  );
};
