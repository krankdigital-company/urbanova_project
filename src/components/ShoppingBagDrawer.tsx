import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Tag, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../utils/currency';

interface ShoppingBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  selectedCurrency: string;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onCheckout?: () => void;
  onShowToast: (title: string, subtitle?: string, type?: 'bag' | 'wishlist' | 'promo' | 'info') => void;
}

export const ShoppingBagDrawer: React.FC<ShoppingBagDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  selectedCurrency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onShowToast
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // e.g., 0.15 for 15%
  const [discountMsg, setDiscountMsg] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const discountAmount = subtotal * appliedDiscount;
  const freeShippingThreshold = 150;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 20;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'URBANOVA15') {
      setAppliedDiscount(0.15);
      setDiscountMsg('15% VIP Discount Applied!');
      onShowToast('DISCOUNT APPLIED', '15% discount deducted from your bag.', 'promo');
    } else {
      setDiscountMsg('Invalid code. Try URBANOVA15');
    }
  };

  const handleSimulateCheckout = () => {
    if (cartItems.length === 0) return;
    if (onCheckout) {
      onCheckout();
      return;
    }
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onShowToast('ORDER CONFIRMED', 'Thank you! Your sustainable order #URB-8921 has been placed.', 'info');
      onClearCart();
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FAF9F6] dark:bg-[#0D0E10] text-black dark:text-white z-50 shadow-2xl flex flex-col justify-between border-l border-black/10 dark:border-white/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h3 className="font-syne text-lg font-bold uppercase tracking-tight">
                  Shopping Bag ({cartItems.reduce((a, b) => a + b.quantity, 0)})
                </h3>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="bg-black/5 dark:bg-white/5 p-4 border-b border-black/5 dark:border-white/5 text-xs font-grotesk font-semibold">
              {amountToFreeShipping > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Add <span className="text-black dark:text-white font-bold">{formatPrice(amountToFreeShipping, selectedCurrency)}</span> more for Free Express Shipping
                  </p>
                  <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  You qualify for Free Express Shipping!
                </p>
              )}
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <ShoppingBag className="w-12 h-12 text-neutral-400 mb-3 opacity-50" />
                  <p className="font-syne text-lg font-bold uppercase mb-1">Your bag is empty</p>
                  <p className="text-xs text-neutral-500 font-grotesk max-w-xs">
                    Explore our curated men's sustainable essentials to add items.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-xl bg-white dark:bg-[#121316] border border-black/5 dark:border-white/5 shadow-sm"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-lg bg-neutral-100"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-syne text-xs font-bold uppercase tracking-tight line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] font-grotesk text-neutral-500 mt-0.5">
                          Size: {item.selectedSize} • Color: {item.selectedColor.name}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity Adjuster */}
                        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-lg p-1 text-xs font-grotesk font-bold">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <span className="font-grotesk font-bold text-xs">
                          {formatPrice(item.product.price * item.quantity, selectedCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-black/10 dark:border-white/10 bg-white dark:bg-[#121316] space-y-4">
                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Promo Code (URBANOVA15)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-black/5 dark:bg-white/5 text-xs font-grotesk font-bold rounded-lg border border-black/5 dark:border-white/5 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black/10 dark:bg-white/10 text-xs font-grotesk font-bold uppercase rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {discountMsg && (
                  <p className={`text-[11px] font-grotesk font-bold ${appliedDiscount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {discountMsg}
                  </p>
                )}

                {/* Subtotal Calculation */}
                <div className="space-y-1.5 text-xs font-grotesk">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span className="text-black dark:text-white font-bold">{formatPrice(subtotal, selectedCurrency)}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-bold">
                      <span>VIP Discount (15%)</span>
                      <span>-{formatPrice(discountAmount, selectedCurrency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-500">
                    <span>Shipping Fee</span>
                    <span className="text-black dark:text-white font-bold">
                      {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost, selectedCurrency)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-black/10 dark:border-white/10 text-sm font-extrabold font-grotesk">
                    <span>Grand Total</span>
                    <span>{formatPrice(grandTotal, selectedCurrency)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleSimulateCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                >
                  {isCheckingOut ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Proceed To Sustainable Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
