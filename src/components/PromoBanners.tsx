import React from 'react';
import { ArrowRight, Award } from 'lucide-react';
import { useSiteContent, type PromoBanner } from '../lib/content';

interface PromoBannersProps {
  onShopOuterwear: () => void;
  onShopDenim: () => void;
}

const safeLink = (value?: string) =>
  value && (/^https?:\/\//i.test(value) || (value.startsWith("/") && !value.startsWith("//")))
    ? value
    : "";

const FALLBACK_PROMOS: PromoBanner[] = [
  {
    id: 'promo-1',
    badge: '100% Traceable Wool',
    eyebrow: 'EDITORIAL CAPSULE',
    title: 'The Architectural Double Trench',
    description:
      'Clean magnetic closures and structured shoulder draping tailored for damp urban winter transitions.',
    ctaLabel: 'Shop Outerwear',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'promo-2',
    badge: 'Shuttle Loom Woven',
    eyebrow: 'REGENERATIVE DENIM',
    title: 'Kojima Ozone Zero-Water Selvedge',
    description:
      'Woven on vintage 1950s looms in Okayama using organic raw indigo with 98% reduced water consumption.',
    ctaLabel: 'Shop Selvedge Denim',
    image:
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85'
  }
];

export const PromoBanners: React.FC<PromoBannersProps> = ({ onShopOuterwear, onShopDenim }) => {
  const { promos } = useSiteContent();
  const BANNERS = promos.length ? promos : FALLBACK_PROMOS;

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {BANNERS.map((banner, idx) => (
          <div
            key={banner.id}
            className="relative h-[480px] rounded-3xl overflow-hidden group bg-neutral-900 shadow-xl"
          >
            {banner.mediaType === "video" && banner.videoUrl ? (
              <video
                src={banner.videoUrl}
                poster={banner.image || undefined}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover object-center filter brightness-[0.70]"
              />
            ) : (
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.70]"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 ${
                  idx % 2 === 0 ? 'text-emerald-300' : 'text-amber-300'
                } text-xs font-grotesk font-extrabold tracking-widest uppercase w-fit`}
              >
                {idx % 2 === 0 && <Award className="w-3.5 h-3.5" />}
                <span>{banner.badge}</span>
              </div>

              <div>
                <span className="text-xs font-grotesk font-bold tracking-[0.2em] text-neutral-300 uppercase block mb-1">
                  {banner.eyebrow}
                </span>
                <h3 className="font-syne text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight leading-tight mb-3">
                  {banner.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-md mb-6 leading-relaxed">
                  {banner.description}
                </p>

                {safeLink(banner.ctaUrl) ? (
                  <a
                    href={safeLink(banner.ctaUrl)}
                    className="px-6 py-3.5 bg-white text-black font-grotesk font-extrabold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2 group/btn"
                  >
                    <span>{banner.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <button
                    onClick={idx % 2 === 0 ? onShopOuterwear : onShopDenim}
                    className="px-6 py-3.5 bg-white text-black font-grotesk font-extrabold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2 group/btn"
                  >
                    <span>{banner.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
