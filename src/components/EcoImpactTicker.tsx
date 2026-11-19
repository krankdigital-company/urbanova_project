import React from 'react';
import { useSiteContent } from '../lib/content';
import { RefreshCw, Droplets, Truck, ShieldCheck, Award } from 'lucide-react';

const ICONS: Record<string, any> = { RefreshCw, Droplets, Truck, ShieldCheck, Award };

const FALLBACK_METRICS = [
  {
    icon: Award,
    title: '100% GOTS Cotton',
    desc: 'Zero plastic fibers'
  },
  {
    icon: Droplets,
    title: '-82% Water Saved',
    desc: 'Ozone closed-loop dyeing'
  },
  {
    icon: RefreshCw,
    title: 'Circular Lifetime Repair',
    desc: 'Free repairs forever'
  },
  {
    icon: Truck,
    title: 'Carbon-Neutral Direct',
    desc: '100% plastic-free packaging'
  }
];

export const EcoImpactTicker: React.FC = () => {
  const { ecoMetrics } = useSiteContent();
  const METRICS = ecoMetrics.length
    ? ecoMetrics.map((m) => ({ icon: ICONS[m.icon] ?? Award, title: m.title, desc: m.description }))
    : FALLBACK_METRICS;

  return (
    <section className="bg-black text-white py-6 border-y border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {METRICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-3.5 ${
                  idx !== 0 ? 'pt-4 md:pt-0 md:pl-6' : ''
                }`}
              >
                <div className="p-2.5 rounded-lg bg-white/10 text-emerald-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-grotesk font-bold tracking-wider uppercase text-white">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
