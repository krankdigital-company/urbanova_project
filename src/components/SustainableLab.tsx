import React, { useState } from 'react';
import { useSiteContent } from '../lib/content';
import { RefreshCw, Droplets, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const FALLBACK_MATERIALS = [
  {
    id: 'wool',
    name: 'Traceable Circular Wool',
    badge: '-6.8 kg CO2 / garment',
    tagline: 'Mulesing-free Australian merino wool spun in Italy with zero plastic microfibers.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
    stats: [
      { label: 'Biodegradability', value: '100% Organic' },
      { label: 'Water Recycling', value: '88% Closed-Loop' },
      { label: 'Plastic Free', value: '0% Microplastics' }
    ],
    features: [
      'Sourced directly from certified non-mulesed family farms in Victoria.',
      'Spun with zero synthetic binders or acrylic softeners.',
      'Naturally flame resistant, temperature regulating, and self-cleaning.'
    ]
  },
  {
    id: 'cotton',
    name: 'GOTS 500 GSM French Terry',
    badge: '-820L Water Saved',
    tagline: 'Extra heavyweight organic cotton grown without synthetic pesticides or GMO seeds.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    stats: [
      { label: 'GOTS Certified', value: 'Grade 1 Organic' },
      { label: 'Pesticide Free', value: '100%' },
      { label: 'Fabric Weight', value: '500 GSM Heavy' }
    ],
    features: [
      'Grown in rain-fed organic cotton cooperatives in Portugal.',
      'Dyed with non-toxic, plant-based pigments derived from walnut hulls and olive leaves.',
      'Pre-shrunk using mechanical steam process rather than harsh resin baths.'
    ]
  },
  {
    id: 'denim',
    name: 'Kojima Shuttle Loom Selvedge',
    badge: '98% Water Reduction',
    tagline: 'Authentic 14oz shuttle loom denim crafted in Okayama using ozone waterless wash technology.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
    stats: [
      { label: 'Loom Type', value: 'Toyoda Shuttle' },
      { label: 'Water Process', value: 'Ozone Zero-Water' },
      { label: 'Indigo Dye', value: '100% Natural' }
    ],
    features: [
      'Woven on vintage 1950s narrow shuttle looms that create characteristic selvedge ID edges.',
      'Finished with laser distressing and ozone fading that eliminates toxic chemical runoff.',
      'Custom copper hardware made from 100% recycled brass.'
    ]
  }
];

export const SustainableLab: React.FC = () => {
  const { materials } = useSiteContent();
  const MATERIALS = materials.length ? materials : FALLBACK_MATERIALS;
  const [selectedMatIdx, setSelectedMatIdx] = useState(0);
  const currentMat = MATERIALS[selectedMatIdx] ?? MATERIALS[0] ?? FALLBACK_MATERIALS[0];

  return (
    <section id="sustainability" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-black/10 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs font-grotesk font-extrabold tracking-[0.25em] text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Transparent Provenance
          </span>
          <h2 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-black dark:text-white mt-1">
            The Sustainable Lab
          </h2>
        </div>
        <p className="text-xs font-grotesk text-neutral-600 dark:text-neutral-400 max-w-md">
          Every thread in an Urbanova garment is engineered for longevity and circularity. Explore our material sourcing breakdown below.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 mb-8">
        {MATERIALS.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => setSelectedMatIdx(idx)}
            className={`px-6 py-3 rounded-xl text-xs font-grotesk font-extrabold uppercase tracking-wider whitespace-nowrap transition-all border ${
              selectedMatIdx === idx
                ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg'
                : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Card Content */}
      <motion.div
        key={currentMat.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-[#121316] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl items-center"
      >
        {/* Left Column: Details */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-grotesk font-bold text-xs uppercase mb-3">
              {currentMat.badge}
            </span>

            <h3 className="font-syne text-2xl sm:text-4xl font-extrabold uppercase text-black dark:text-white mb-3">
              {currentMat.name}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed mb-6">
              {currentMat.tagline}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 mb-6">
              {currentMat.stats.map((st, i) => (
                <div key={i}>
                  <p className="text-[10px] font-grotesk font-extrabold text-neutral-500 uppercase">
                    {st.label}
                  </p>
                  <p className="text-xs sm:text-sm font-grotesk font-extrabold text-black dark:text-white mt-0.5">
                    {st.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Feature Checklist */}
            <ul className="space-y-2.5 mb-8">
              {currentMat.features.map((ft, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{ft}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: High Quality Material Image */}
        <div className="lg:col-span-5 h-[340px] rounded-2xl overflow-hidden relative shadow-lg">
          <img
            src={currentMat.image}
            alt={currentMat.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-grotesk font-bold uppercase tracking-wider">
            Verified Lab Specimen No. 042-B
          </div>
        </div>
      </motion.div>
    </section>
  );
};
