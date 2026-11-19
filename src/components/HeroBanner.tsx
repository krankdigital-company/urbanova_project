import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent, type HeroSlide } from '../lib/content';
import { ArrowRight, Play, Pause, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
  onExploreLookbook: () => void;
}

const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'ARCHITECTURAL SILHOUETTES',
    subtitle: 'FALL / WINTER 2026 COLLECTION',
    tagline: 'Precision tailored outerwear crafted from zero-waste traceable merino wool and recycled Japanese technical shells.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=2000&q=90',
    badge: 'GOTS Certified • 100% Traceable',
    impact: '-6.8kg CO2 saved per jacket'
  },
  {
    id: 'slide-2',
    title: 'HEAVYWEIGHT ORGANIC KNITS',
    subtitle: 'THE ESSENTIAL 500 GSM SERIES',
    tagline: 'Brushed French terry hoodies and fine gauge merino turtlenecks engineered for lifetime durability.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=2000&q=90',
    badge: '100% Plant-Dyed Cotton',
    impact: '820L Water saved vs standard dyeing'
  },
  {
    id: 'slide-3',
    title: 'KOJIMA ZERO-WATER DENIM',
    subtitle: 'REGENERATIVE JAPANESE SELVEDGE',
    tagline: 'Woven on vintage shuttle looms using natural indigo and ozone waterless wash technology.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=2000&q=90',
    badge: 'Shuttle Loom Woven in Japan',
    impact: '98% Less Water Consumption'
  }
];

const safeLink = (value?: string) =>
  value && (/^https?:\/\//i.test(value) || (value.startsWith("/") && !value.startsWith("//")))
    ? value
    : "";

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow, onExploreLookbook }) => {
  const { heroSlides } = useSiteContent();
  const HERO_SLIDES = heroSlides.length ? heroSlides : FALLBACK_HERO_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, HERO_SLIDES.length]);

  const slide = HERO_SLIDES[currentSlide % HERO_SLIDES.length] ?? FALLBACK_HERO_SLIDES[0];

  return (
    <section className="relative w-full h-[85vh] min-h-[580px] max-h-[850px] overflow-hidden bg-black text-white">
      {/* Background Image Carousel with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {slide.media_type === "video" && slide.video_url ? (
            <video
              src={slide.video_url}
              poster={slide.image || undefined}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05]"
            />
          ) : (
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
          )}
          {/* Subtle gradient vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-2xl">
          {/* Top Badge */}
          <motion.div
            key={`badge-${slide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-grotesk tracking-widest uppercase text-emerald-300 font-semibold mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{slide.badge}</span>
            <span className="text-white/40">•</span>
            <span className="text-neutral-200">{slide.impact}</span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            key={`sub-${slide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xs sm:text-sm font-grotesk font-bold tracking-[0.2em] text-neutral-300 uppercase mb-2"
          >
            {slide.subtitle}
          </motion.p>

          {/* Main Title */}
          <motion.h1
            key={`title-${slide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-syne text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[0.95] mb-4"
          >
            {slide.title}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            key={`tag-${slide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm sm:text-base text-neutral-300 font-sans font-normal leading-relaxed max-w-xl mb-8"
          >
            {slide.tagline}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            key={`btn-${slide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            {safeLink(slide.cta_url) ? (
              <a
                href={safeLink(slide.cta_url)}
                className="group px-7 py-4 bg-white text-black font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-none hover:bg-neutral-200 transition-all flex items-center gap-3 shadow-xl"
              >
                <span>{slide.cta_label || "Explore Collection"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <button
                onClick={onShopNow}
                className="group px-7 py-4 bg-white text-black font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-none hover:bg-neutral-200 transition-all flex items-center gap-3 shadow-xl"
              >
                <span>{slide.cta_label || "Explore Collection"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {safeLink(slide.secondary_cta_url) ? (
              <a
                href={safeLink(slide.secondary_cta_url)}
                className="px-6 py-4 bg-transparent border border-white/40 hover:border-white text-white font-grotesk font-semibold text-xs tracking-widest uppercase backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <span>{slide.secondary_cta_label || "Shop The Look"}</span>
              </a>
            ) : (
              <button
                onClick={onExploreLookbook}
                className="px-6 py-4 bg-transparent border border-white/40 hover:border-white text-white font-grotesk font-semibold text-xs tracking-widest uppercase backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <span>{slide.secondary_cta_label || "Shop The Look"}</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center gap-4 bg-black/60 backdrop-blur-md px-4 py-2.5 border border-white/10 rounded-full">
        {/* Play / Pause toggle */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white/70 hover:text-white transition-colors p-1"
          aria-label={isPlaying ? "Pause slider" : "Play slider"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Slide Counter */}
        <span className="text-xs font-grotesk font-bold text-white tracking-widest">
          0{currentSlide + 1} / 0{HERO_SLIDES.length}
        </span>

        {/* Progress Bar */}
        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            key={`progress-${currentSlide}-${isPlaying}`}
            initial={{ width: '0%' }}
            animate={{ width: isPlaying ? '100%' : '0%' }}
            transition={{ duration: isPlaying ? 6 : 0, ease: 'linear' }}
            className="h-full bg-white"
          />
        </div>

        {/* Nav Arrows */}
        <div className="flex items-center gap-1 border-l border-white/20 pl-2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="p-1 text-white/70 hover:text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="p-1 text-white/70 hover:text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
