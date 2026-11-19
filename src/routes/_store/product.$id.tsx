import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductDetailView } from "@/components/ProductDetailView";
import { useSiteContent } from "@/lib/content";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_store/product/$id")({
  head: () => ({
    meta: [
      { title: "Product — Urbanova" },
      { name: "description", content: "Product details, sizing, materials and sustainability impact." },
      { property: "og:title", content: "Product — Urbanova" },
      { property: "og:description", content: "Product details, sizing, materials and sustainability impact." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { products, isLoading } = useSiteContent();
  const s = useStore();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  if (isLoading) return <div className="min-h-[60vh]" />;

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-syne text-4xl font-extrabold uppercase tracking-tight">Product unavailable</h1>
        <p className="text-sm text-neutral-500 mt-3">This item is no longer published.</p>
      </div>
    );
  }

  return (
    <ProductDetailView
      product={product}
      allProducts={products}
      selectedCurrency={s.currency}
      isWishlisted={s.wishlist.some((p) => p.id === product.id)}
      onBack={() => navigate({ to: "/shop" })}
      onToggleWishlist={s.toggleWishlist}
      onAddToCart={s.addToCart}
      onBuyNow={(product, size, color) => {
        s.startBuyNow(product, size, color);
        navigate({ to: "/checkout" });
      }}
      onSelectProduct={(p) => navigate({ to: "/product/$id", params: { id: p.id } })}
      onQuickView={(p) => s.setQuickViewProduct(p)}
    />
  );
}
