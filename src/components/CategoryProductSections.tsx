import React from "react";
import { ChevronRight } from "lucide-react";
import { useSiteContent } from "@/lib/content";
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

interface CategoryProductSectionsProps {
  onSelectCategory: (slug: string) => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product, size: string, color: ColorOption) => void;
}

export const CategoryProductSections: React.FC<CategoryProductSectionsProps> = ({
  onSelectCategory,
  onSelectProduct,
  onBuyNow,
}) => {
  const { categories, products } = useSiteContent();
  const store = useStore();
  const homeCategories = categories.filter((category) => category.showOnHome !== false);

  const sections = homeCategories
    .map((category) => ({
      category,
      products: products.filter((product) => product.category === category.slug),
    }))
    .filter((section) => section.products.length > 0);

  if (!sections.length) return null;

  return (
    <section className="py-12 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 pb-5 text-center border-b border-black/10 dark:border-white/10">
        <span className="text-xs font-grotesk font-extrabold tracking-[0.3em] text-neutral-500 uppercase">
          Shop by category
        </span>
        <h2 className="mt-1 font-syne text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black dark:text-white">
          Category Highlights
        </h2>
      </div>

      <div className="space-y-12">
        {sections.map(({ category, products: categoryProducts }) => (
          <div key={category.id}>
            <Carousel opts={{ align: "start" }} className="px-8">
              <div className="flex flex-col items-center text-center gap-3 mb-6">
                <div className="max-w-2xl">
                  <p className="font-syne text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white uppercase">
                    {category.homeTag || category.name}
                  </p>
                  {category.homeDescription || category.description ? (
                    <p className="mt-2 mx-auto max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {category.homeDescription || category.description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => onSelectCategory(category.slug)}
                  className="inline-flex items-center gap-1 text-[11px] font-grotesk font-extrabold uppercase tracking-[0.18em] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                >
                  View category <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <CarouselContent>
                {categoryProducts.map((product) => (
                  <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
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
          </div>
        ))}
      </div>
    </section>
  );
};
