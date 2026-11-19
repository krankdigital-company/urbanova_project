import React from 'react';
import { useSiteContent } from '../lib/content';
import { Product } from '../types';
import { Heart, Instagram, ShoppingBag, ExternalLink } from 'lucide-react';

interface InstagramGalleryProps {
  onQuickView: (product: Product) => void;
}

export const InstagramGallery: React.FC<InstagramGalleryProps> = ({ onQuickView }) => {
  const { products: MOCK_PRODUCTS, instagram: MOCK_INSTAGRAM_POSTS } = useSiteContent();
  return (
    <section id="instagram" className="py-20 bg-neutral-100 dark:bg-[#08090A] border-y border-black/5 dark:border-white/5">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-black/10 dark:border-white/10 gap-4">
          <div>
            <span className="text-xs font-grotesk font-extrabold tracking-[0.25em] text-neutral-500 uppercase flex items-center gap-2">
              <Instagram className="w-3.5 h-3.5 text-rose-500" />
              Community Street Style
            </span>
            <h2 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-black dark:text-white mt-1">
              @URBANOVA_OFFICIAL
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-grotesk font-bold uppercase tracking-wider text-black dark:text-white hover:underline"
          >
            <span>Follow Community</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {MOCK_INSTAGRAM_POSTS.map((post) => {
            const taggedProduct = MOCK_PRODUCTS.find((p) => p.id === post.productId);

            return (
              <div
                key={post.id}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 shadow-md border border-black/5 dark:border-white/5"
              >
                {/* Photo */}
                <img
                  src={post.image}
                  alt={post.handle}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-between" />

                {/* Floating Top Handle */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-grotesk font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {post.handle}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-grotesk font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{post.likes}</span>
                  </div>
                </div>

                {/* Bottom Content on Hover */}
                <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs text-neutral-200 font-sans line-clamp-2 mb-3 leading-snug">
                    "{post.caption}"
                  </p>

                  {taggedProduct && (
                    <button
                      onClick={() => onQuickView(taggedProduct)}
                      className="w-full py-2.5 bg-white text-black font-grotesk font-extrabold text-[11px] tracking-widest uppercase rounded-lg shadow-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Shop Worn Garment</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
