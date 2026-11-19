import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckoutView } from "@/components/CheckoutView";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_store/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Urbanova" },
      { name: "description", content: "Secure checkout with cash on delivery and mobile payment options." },
      { property: "og:title", content: "Checkout — Urbanova" },
      { property: "og:description", content: "Secure checkout with cash on delivery and mobile payments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const s = useStore();
  const navigate = useNavigate();
  return (
    <CheckoutView
      cartItems={s.buyNowItem ? [s.buyNowItem] : s.cartItems}
      selectedCurrency={s.currency}
      onBack={() => {
        s.clearBuyNowItem();
        navigate({ to: "/shop" });
      }}
      onPlaced={() => {
        if (s.buyNowItem) s.clearBuyNowItem();
        else s.clearCart();
      }}
    />
  );
}
