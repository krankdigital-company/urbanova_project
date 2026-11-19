import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductCatalog } from "@/components/ProductCatalog";
import { useStore } from "@/lib/store";

type ShopSearch = { category?: string };

export const Route = createFileRoute("/_store/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch =>
    typeof search['category'] === "string" ? { category: search['category'] } : {},
  head: () => ({
    meta: [
      { title: "Shop All — Urbanova" },
      { name: "description", content: "Browse the full Urbanova catalogue: outerwear, knits, denim, footwear and accessories." },
      { property: "og:title", content: "Shop All — Urbanova" },
      { property: "og:description", content: "Browse the full Urbanova catalogue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const s = useStore();
  const navigate = useNavigate();
  const { category } = Route.useSearch();

  return (
    <div className="pt-4">
      <ProductCatalog
        selectedCurrency={s.currency}
        wishlist={s.wishlist}
        onToggleWishlist={s.toggleWishlist}
        onQuickView={(p) => s.setQuickViewProduct(p)}
        onAddToCart={s.addToCart}
        onBuyNow={(product, size, color) => {
          s.startBuyNow(product, size, color);
          navigate({ to: "/checkout" });
        }}
        onSelectProduct={(p) => navigate({ to: "/product/$id", params: { id: p.id } })}
        {...(category ? { initialCategory: category } : {})}
        onCategoryChange={(c) =>
          navigate({ to: "/shop", search: c === "all" ? {} : { category: c }, replace: true })
        }
      />
    </div>
  );
}
