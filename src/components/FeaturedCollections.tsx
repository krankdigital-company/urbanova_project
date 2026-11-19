import React from "react";
import { useSiteContent } from "../lib/content";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface FeaturedCollectionsProps {
  onSelectCollection: (slug: string) => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ onSelectCollection }) => {
  const { collections } = useSiteContent();

  return (
    <section id="collections" className="py-20 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-black/10 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs font-grotesk font-extrabold tracking-[0.25em] text-neutral-500 uppercase flex items-center gap-2">
            Curated Form & Material
          </span>
          <h2 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-black dark:text-white mt-1">
            Featured Collections
          </h2>
        </div>
        <p className="text-xs font-grotesk text-neutral-600 dark:text-neutral-400 max-w-md">
          Distinct minimalist silhouettes rendered in sustainable heavyweight textiles, certified
          zero-water Japanese denim, and circular merino wool.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {collections.map((col, idx) => {
          const colSpanClass =
            idx === 0
              ? "md:col-span-7 h-[460px]"
              : idx === 1
                ? "md:col-span-5 h-[460px]"
                : idx === 2
                  ? "md:col-span-5 h-[420px]"
                  : "md:col-span-7 h-[420px]";

          return (
            <motion.div
              key={col.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              onClick={() => onSelectCollection(col.slug)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-neutral-900 ${colSpanClass} shadow-lg`}
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 filter brightness-[0.75] group-hover:brightness-[0.85]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-grotesk font-extrabold tracking-widest text-white uppercase">
                  {col.tag}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-grotesk font-medium text-neutral-300">
                  {col.itemCount} Items
                </span>
              </div>
              <div className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <h3 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight mb-2">
                  {col.title}
                </h3>
                <p className="text-xs text-neutral-300 font-sans line-clamp-2 max-w-lg mb-4">
                  {col.subtitle}
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-grotesk font-bold text-white tracking-widest uppercase group-hover:underline">
                  <span>Explore Series</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
