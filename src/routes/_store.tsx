import React from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToastNotification } from "@/components/ToastNotification";
import { ShoppingBagDrawer } from "@/components/ShoppingBagDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { QuickViewModal } from "@/components/QuickViewModal";
import { StoreProvider, useStore } from "@/lib/store";

export const Route = createFileRoute("/_store")({
  component: StoreLayout,
});

function StoreLayout() {
  return (
    <StoreProvider>
      <StoreShell />
    </StoreProvider>
  );
}

function StoreShell() {
  const s = useStore();
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        s.theme === "dark" ? "bg-[#0D0E10] text-[#F1F2F4]" : "bg-[#FAF9F6] text-[#121316]"
      }`}
    >
      <ToastNotification toasts={s.toasts} onDismiss={s.dismissToast} />

      <Header
        theme={s.theme}
        onToggleTheme={s.toggleTheme}
        cartItems={s.cartItems}
        wishlist={s.wishlist}
        onOpenBag={() => s.setIsBagOpen(true)}
        onOpenWishlist={() => s.setIsWishlistOpen(true)}
        onOpenSearch={() => s.setIsSearchOpen(true)}
        selectedCurrency={s.currency}
        onChangeCurrency={s.setCurrency}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer selectedCurrency={s.currency} onChangeCurrency={s.setCurrency} />

      <ShoppingBagDrawer
        isOpen={s.isBagOpen}
        onClose={() => s.setIsBagOpen(false)}
        cartItems={s.cartItems}
        selectedCurrency={s.currency}
        onUpdateQuantity={s.updateCartQuantity}
        onRemoveItem={s.removeCartItem}
        onClearCart={s.clearCart}
        onShowToast={s.showToast}
        onCheckout={() => {
          s.setIsBagOpen(false);
          s.clearBuyNowItem();
          navigate({ to: "/checkout" });
        }}
      />

      <WishlistDrawer
        isOpen={s.isWishlistOpen}
        onClose={() => s.setIsWishlistOpen(false)}
        wishlist={s.wishlist}
        selectedCurrency={s.currency}
        onRemoveFromWishlist={s.toggleWishlist}
        onAddToCart={s.addToCart}
        onQuickView={(p) => s.setQuickViewProduct(p)}
      />

      <SearchOverlay
        isOpen={s.isSearchOpen}
        onClose={() => s.setIsSearchOpen(false)}
        selectedCurrency={s.currency}
        onQuickView={(p) => s.setQuickViewProduct(p)}
      />

      <QuickViewModal
        product={s.quickViewProduct}
        selectedCurrency={s.currency}
        isWishlisted={s.quickViewProduct ? s.wishlist.some((p) => p.id === s.quickViewProduct!.id) : false}
        onClose={() => s.setQuickViewProduct(null)}
        onToggleWishlist={s.toggleWishlist}
        onAddToCart={s.addToCart}
        onViewFullPage={(p) => {
          s.setQuickViewProduct(null);
          navigate({ to: "/product/$id", params: { id: p.id } });
        }}
      />
    </div>
  );
}
