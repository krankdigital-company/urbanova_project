import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeMode, CartItem, Product, ColorOption } from '@/types';
import type { ToastMessage } from '@/components/ToastNotification';

interface StoreState {
  theme: ThemeMode;
  toggleTheme: () => void;
  currency: string;
  setCurrency: (c: string) => void;
  cartItems: CartItem[];
  wishlist: Product[];
  toasts: ToastMessage[];
  isBagOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: Product | null;
  buyNowItem: CartItem | null;
  setIsBagOpen: (v: boolean) => void;
  setIsWishlistOpen: (v: boolean) => void;
  setIsSearchOpen: (v: boolean) => void;
  setQuickViewProduct: (p: Product | null) => void;
  clearBuyNowItem: () => void;
  showToast: (title: string, subtitle?: string, type?: 'bag' | 'wishlist' | 'promo' | 'info') => void;
  dismissToast: (id: string) => void;
  addToCart: (product: Product, size: string, color: ColorOption) => void;
  startBuyNow: (product: Product, size: string, color: ColorOption) => void;
  updateCartQuantity: (cartItemId: string, qty: number) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
}

const noop = () => {};

const StoreContext = createContext<StoreState>({
  theme: 'light',
  toggleTheme: noop,
  currency: '৳',
  setCurrency: noop,
  cartItems: [],
  wishlist: [],
  toasts: [],
  isBagOpen: false,
  isWishlistOpen: false,
  isSearchOpen: false,
  quickViewProduct: null,
  buyNowItem: null,
  setIsBagOpen: noop,
  setIsWishlistOpen: noop,
  setIsSearchOpen: noop,
  setQuickViewProduct: noop,
  clearBuyNowItem: noop,
  showToast: noop,
  dismissToast: noop,
  addToCart: noop,
  startBuyNow: noop,
  updateCartQuantity: noop,
  removeCartItem: noop,
  clearCart: noop,
  toggleWishlist: noop,
});

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [currency, setCurrency] = useState<string>('৳');
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem('urbanova-cart');
    if (raw) {
      try {
        setCartItems(JSON.parse(raw));
      } catch {
        /* ignore malformed cart */
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('urbanova-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const showToast: StoreState['showToast'] = (title, subtitle, type = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      subtitle,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== newToast.id)), 3500);
  };

  const addToCart: StoreState['addToCart'] = (product, size, color) => {
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name,
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx]!, quantity: updated[idx]!.quantity + 1 };
        return updated;
      }
      return [
        ...prev,
        {
          id: `cart-${product.id}-${size}-${color.name}-${Date.now()}`,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: 1,
        },
      ];
    });
    showToast('ADDED TO BAG', `${product.name} (${size} / ${color.name}) added to your shopping bag.`, 'bag');
  };

  const startBuyNow: StoreState['startBuyNow'] = (product, size, color) => {
    setBuyNowItem({
      id: `buy-now-${product.id}-${size}-${color.name}-${Date.now()}`,
      product,
      selectedSize: size,
      selectedColor: color,
      quantity: 1,
    });
  };

  const toggleWishlist: StoreState['toggleWishlist'] = (product) => {
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        showToast('REMOVED FROM WISHLIST', `${product.name} removed from saved items.`, 'info');
        return prev.filter((p) => p.id !== product.id);
      }
      showToast('SAVED TO WISHLIST', `${product.name} added to your saved list.`, 'wishlist');
      return [...prev, product];
    });
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        toggleTheme: () => setTheme((p) => (p === 'light' ? 'dark' : 'light')),
        currency,
        setCurrency,
        cartItems,
        wishlist,
        toasts,
        isBagOpen,
        isWishlistOpen,
        isSearchOpen,
        quickViewProduct,
        buyNowItem,
        setIsBagOpen,
        setIsWishlistOpen,
        setIsSearchOpen,
        setQuickViewProduct,
        clearBuyNowItem: () => setBuyNowItem(null),
        showToast,
        dismissToast: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
        addToCart,
        startBuyNow,
        updateCartQuantity: (id, qty) =>
          qty <= 0
            ? setCartItems((prev) => prev.filter((i) => i.id !== id))
            : setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))),
        removeCartItem: (id) => setCartItems((prev) => prev.filter((i) => i.id !== id)),
        clearCart: () => setCartItems([]),
        toggleWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
