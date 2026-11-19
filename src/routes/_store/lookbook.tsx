import { createFileRoute } from "@tanstack/react-router";
import { ShopTheLook } from "@/components/ShopTheLook";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_store/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook — Urbanova" },
      { name: "description", content: "Shop the look: styled Urbanova outfits with shoppable hotspots." },
      { property: "og:title", content: "Lookbook — Urbanova" },
      { property: "og:description", content: "Styled outfits with shoppable hotspots." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LookbookPage,
});

function LookbookPage() {
  const s = useStore();
  return (
    <ShopTheLook
      selectedCurrency={s.currency}
      onQuickView={(p) => s.setQuickViewProduct(p)}
      onAddToCart={s.addToCart}
    />
  );
}
