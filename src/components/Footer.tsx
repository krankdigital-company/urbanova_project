import React, { useState } from 'react';
import {
  ChevronDown,
  ShieldCheck,
  Award,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Facebook,
  Linkedin,
  Link2
} from 'lucide-react';
import { useSiteContent } from '../lib/content';
import { DynamicLink } from './DynamicLink';

interface FooterProps {
  selectedCurrency: string;
  onChangeCurrency: (curr: string) => void;
}

const SOCIAL_ICONS: Record<string, { Icon: React.ElementType; color: string }> = {
  facebook: { Icon: Facebook, color: 'text-blue-400' },
  instagram: { Icon: Instagram, color: 'text-pink-400' },
  youtube: { Icon: Youtube, color: 'text-red-500' },
  twitter: { Icon: Twitter, color: 'text-sky-400' },
  linkedin: { Icon: Linkedin, color: 'text-blue-300' },
};

export const Footer: React.FC<FooterProps> = () => {
  const { settings, locations, menus, socials } = useSiteContent();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const brand = (settings.brand as string) || 'URBANOVA';
  const tagline = (settings.tagline as string) || 'BEST IMPORTED SNEAKERS & STREETWEAR BRAND IN BANGLADESH.';
  const about =
    (settings.about_text as string) ||
    'Curating premium drops, high-quality sneaker imports, and streetwear cultural artifacts for the fashion-forward in Bangladesh.';
  const whatsapp = (settings.whatsapp as string) || '';
  const copyright =
    (settings.copyright as string) || `© ${new Date().getFullYear()} ${brand}. All rights reserved.`;

  const footerMenu = menus.filter((m) => m.location === 'footer');
  const groups = Array.from(new Set(footerMenu.map((m) => m.groupLabel || 'MENU')));

  return (
    <footer className="bg-black text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Retail Outlets & WhatsApp Banner Section */}
        {(locations.length > 0 || whatsapp) && (
          <div className="mb-14 pb-12 border-b border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <span className="text-[10px] font-grotesk font-extrabold tracking-[0.25em] text-emerald-400 uppercase">
                  FLAGSHIP OUTLETS
                </span>
                <h3 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase text-white mt-0.5 tracking-tight">
                  OUR RETAIL LOCATIONS
                </h3>
              </div>

              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-[#07190F] border border-emerald-800/80 hover:border-emerald-500 text-emerald-400 transition-all group w-fit shadow-lg"
                >
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5 fill-emerald-500/20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-grotesk font-extrabold text-sm sm:text-base text-emerald-400 tracking-tight">
                      WhatsApp: {whatsapp}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-grotesk font-extrabold tracking-wider uppercase">
                      INTERNATIONAL ORDER
                    </span>
                  </div>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {locations.map((outlet) => (
                <div
                  key={outlet.id}
                  className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 mb-2.5">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-grotesk font-extrabold tracking-wider uppercase">
                        {outlet.name}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed mb-1 font-medium">
                      {outlet.address}{outlet.city ? `, ${outlet.city}` : ''}
                    </p>
                    {outlet.hours && (
                      <p className="text-[11px] text-neutral-500 font-sans mb-4">{outlet.hours}</p>
                    )}
                  </div>

                  <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-grotesk">
                    {outlet.phone && (
                      <a
                        href={`tel:${outlet.phone}`}
                        className="flex items-center gap-2 text-white font-extrabold tracking-tight hover:text-emerald-400 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{outlet.phone}</span>
                      </a>
                    )}

                    {outlet.mapUrl && (
                      <a
                        href={outlet.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white uppercase font-extrabold text-[10px] tracking-wider transition-colors"
                      >
                        <span>OPEN IN GOOGLE MAPS</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brand Grid & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              {settings.logo_url ? (
                <img src={settings.logo_url as string} alt={brand} className="h-10 w-auto object-contain self-start" />
              ) : (
                <span className="font-syne text-2xl font-extrabold uppercase tracking-tight text-white">
                  {brand}
                </span>
              )}
              <span className="text-[10px] font-grotesk tracking-[0.15em] text-emerald-400 font-extrabold uppercase mt-1">
                {tagline}
              </span>
            </div>

            <div className="pt-1">
              <span className="text-[10px] font-grotesk font-extrabold tracking-widest text-neutral-400 uppercase block mb-1">
                ABOUT {brand}
              </span>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed max-w-sm">{about}</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="p-2 rounded-lg bg-white/10 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-grotesk font-bold text-neutral-300">
                100% Carbon-Neutral Shipping &amp; Plastic-Free Packaging
              </span>
            </div>
          </div>

          {groups.slice(0, 3).map((group) => (
            <div key={group}>
              <div
                onClick={() => toggleAccordion(group)}
                className="flex justify-between items-center md:block cursor-pointer md:cursor-default py-2 md:py-0 border-b md:border-b-0 border-white/10"
              >
                <h4 className="text-xs font-grotesk font-extrabold tracking-widest uppercase text-white">
                  {group}
                </h4>
                <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${openAccordion === group ? 'rotate-180' : ''}`} />
              </div>

              <ul className={`space-y-2.5 text-xs text-neutral-400 pt-3 md:pt-4 ${openAccordion === group ? 'block' : 'hidden md:block'}`}>
                {footerMenu
                  .filter((m) => (m.groupLabel || 'MENU') === group)
                  .map((m) => (
                    <li key={m.id}>
                      <DynamicLink href={m.href} className="hover:text-white transition-colors">
                        {m.label}
                      </DynamicLink>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications & Social Networks Bar */}
        <div className="py-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-grotesk font-bold text-neutral-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-white">
              <Award className="w-4 h-4 text-amber-400" />
              GOTS Organic Certified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Fair Trade Verified
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {socials.map((s) => {
              const conf = SOCIAL_ICONS[s.platform.toLowerCase()] ?? { Icon: Link2, color: 'text-neutral-300' };
              const Icon = conf.Icon;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white text-xs font-grotesk font-medium flex items-center gap-1.5 transition-colors capitalize"
                >
                  <Icon className={`w-3.5 h-3.5 ${conf.color}`} />
                  <span>{s.platform}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-grotesk text-neutral-500">
          <p>{copyright}</p>
          <p>
            Developed by{" "}
            <a
              href="https://krankdigital.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Krank Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
