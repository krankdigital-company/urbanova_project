import React, { useState } from 'react';
import { useSiteContent } from '../lib/content';
import { Product, ColorOption } from '../types';
import { ShoppingBag, Plus, X, ArrowRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../utils/currency';

interface ShopTheLookProps {
  selectedCurrency: string;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ColorOption) => void;
}

export const ShopTheLook: React.FC<ShopTheLookProps> = ({
  selectedCurrency,
  onQuickView,
  onAddToCart
}) => {
  const { products: MOCK_PRODUCTS, lookbook } = useSiteContent();
  const MOCK_LOOKBOOK_OUTFIT = lookbook ?? { id: '', title: '', subtitle: '', image: '', hotspots: [] };
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const currentHotspotId = activeHotspotId ?? MOCK_LOOKBOOK_OUTFIT.hotspots[0]?.id ?? null;

  const activeHotspot = MOCK_LOOKBOOK_OUTFIT.hotspots.find((h) => h.id === currentHotspotId);
  const activeProduct = activeHotspot
    ? MOCK_PRODUCTS.find((p) => p.id === activeHotspot.productId)
    : null;

  return (
    <section id="lookbook" className="py-20 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10 gap-4">
          <div>
            <span className="text-xs font-grotesk font-extrabold tracking-[0.25em] text-emerald-400 uppercase flex items-center gap-2">
              Interactive Lookbook
            </span>
            <h2 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-white mt-1">
              Shop The Look
            </h2>
          </div>
          <p className="text-xs font-grotesk text-neutral-400 max-w-md">
            Tap any hotspot on the editorial look below to discover specific garments, inspect sustainable material composition, and add to your bag.
          </p>
        </div>

        {/* Content Layout: Model Image with Hotspots + Interactive Product Popover */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Model Photograph Stage */}
          <div className="lg:col-span-7 relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
            <img
              src={MOCK_LOOKBOOK_OUTFIT.image}
              alt={MOCK_LOOKBOOK_OUTFIT.title}
              className="w-full h-full object-cover object-center filter brightness-90"
              referrerPolicy="no-referrer"
            />

            {/* Hotspot Pulsing Nodes */}
            {MOCK_LOOKBOOK_OUTFIT.hotspots.map((hs) => {
              const targetProd = MOCK_PRODUCTS.find((p) => p.id === hs.productId);
              const isActive = currentHotspotId === hs.id;

              return (
                <div
                  key={hs.id}
                  style={{ top: `${hs.yPercent}%`, left: `${hs.xPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => setActiveHotspotId(hs.id)}
                    className={`relative p-3 rounded-full transition-transform ${
                      isActive ? 'scale-125' : 'hover:scale-110'
                    }`}
                    aria-label={`Inspect ${targetProd?.name || 'Garment'}`}
                  >
                    {/* Ripple ring */}
                    <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                    {/* Inner Core */}
                    <span
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-grotesk font-extrabold text-xs shadow-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-400 text-black'
                          : 'bg-white text-black hover:bg-neutral-200'
                      }`}
                    >
                      <Plus className={`w-4 h-4 transition-transform ${isActive ? 'rotate-45' : ''}`} />
                    </span>
                  </button>
                </div>
              );
            })}

            {/* Bottom Look Caption */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
              <h4 className="font-syne font-bold uppercase text-sm text-white">
                {MOCK_LOOKBOOK_OUTFIT.title}
              </h4>
              <p className="text-xs text-neutral-300 font-sans mt-0.5">
                {MOCK_LOOKBOOK_OUTFIT.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Selected Product Spotlight Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {activeProduct ? (
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#121316] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-grotesk font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                    SELECTED ITEM SPOTLIGHT
                  </span>
                  <span className="text-xs font-grotesk font-bold text-neutral-400">
                    {activeProduct.ecoBadge}
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-24 h-32 rounded-xl overflow-hidden shrink-0 bg-neutral-800">
                    <img
                      src={activeProduct.images[0]}
                      alt={activeProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <h3 className="font-syne text-xl font-bold uppercase text-white tracking-tight leading-snug">
                      {activeProduct.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      {activeProduct.fitDescription}
                    </p>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="font-grotesk font-extrabold text-xl text-white">
                        {formatPrice(activeProduct.price, selectedCurrency)}
                      </span>
                      {activeProduct.originalPrice && (
                        <span className="font-grotesk text-xs text-neutral-500 line-through">
                          {formatPrice(activeProduct.originalPrice, selectedCurrency)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Composition */}
                <div className="p-3 bg-white/5 rounded-xl text-xs text-neutral-300 mb-6">
                  <span className="font-grotesk font-bold text-white uppercase block mb-1">
                    Material:
                  </span>
                  {activeProduct.composition}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onAddToCart(activeProduct, activeProduct.sizes[0], activeProduct.colors[0])}
                    className="flex-1 py-3.5 bg-white text-black font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Quick Add To Bag</span>
                  </button>

                  <button
                    onClick={() => onQuickView(activeProduct)}
                    className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-grotesk font-bold text-xs tracking-widest uppercase rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Details</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="p-8 text-center text-neutral-400 bg-[#121316] rounded-2xl border border-white/10">
                Tap any hotspot on the outfit model to view garment breakdown.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
