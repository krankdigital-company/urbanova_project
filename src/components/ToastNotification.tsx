import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShoppingBag, Heart, Sparkles, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'bag' | 'wishlist' | 'promo' | 'info';
  title: string;
  subtitle?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto bg-[#121316] dark:bg-[#1E2025] text-white border border-[#2D3036] dark:border-[#3A3D45] rounded-xl p-4 shadow-2xl flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-white shrink-0 mt-0.5">
                {toast.type === 'bag' && <ShoppingBag className="w-4 h-4" />}
                {toast.type === 'wishlist' && <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />}
                {toast.type === 'promo' && <Sparkles className="w-4 h-4 text-amber-300" />}
                {toast.type === 'info' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-neutral-300 font-grotesk">{toast.title}</p>
                {toast.subtitle && <p className="text-xs text-neutral-400 mt-0.5 leading-snug">{toast.subtitle}</p>}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
