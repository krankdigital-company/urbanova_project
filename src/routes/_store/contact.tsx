import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { useSiteContent } from "@/lib/content";

export const Route = createFileRoute("/_store/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Stores — Urbanova" },
      { name: "description", content: "Reach Urbanova support, WhatsApp ordering and visit our retail outlets." },
      { property: "og:title", content: "Contact & Stores — Urbanova" },
      { property: "og:description", content: "Support, WhatsApp ordering and retail outlets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { settings, locations } = useSiteContent();
  const whatsapp = (settings.whatsapp as string) || "";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-syne text-4xl font-extrabold uppercase tracking-tight">Contact</h1>
      <p className="text-sm text-neutral-500 mt-3 font-sans">
        We reply within one business day. For instant help, message us on WhatsApp.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 flex items-center gap-3"
          >
            <MessageCircle className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-[10px] font-grotesk font-extrabold uppercase tracking-widest text-neutral-400">WhatsApp</p>
              <p className="text-sm font-grotesk font-bold">{whatsapp}</p>
            </div>
          </a>
        )}
        {settings.support_phone && (
          <a
            href={`tel:${settings.support_phone as string}`}
            className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 flex items-center gap-3"
          >
            <Phone className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-[10px] font-grotesk font-extrabold uppercase tracking-widest text-neutral-400">Hotline</p>
              <p className="text-sm font-grotesk font-bold">{settings.support_phone as string}</p>
            </div>
          </a>
        )}
        {settings.support_email && (
          <a
            href={`mailto:${settings.support_email as string}`}
            className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 flex items-center gap-3"
          >
            <Mail className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-[10px] font-grotesk font-extrabold uppercase tracking-widest text-neutral-400">Email</p>
              <p className="text-sm font-grotesk font-bold break-all">{settings.support_email as string}</p>
            </div>
          </a>
        )}
      </div>

      <h2 className="font-syne text-2xl font-extrabold uppercase tracking-tight mt-14 mb-5">Store locations</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {locations.map((l) => (
          <div key={l.id} className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-grotesk font-extrabold uppercase tracking-wider">{l.name}</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans">
              {l.address}{l.city ? `, ${l.city}` : ""}
            </p>
            {l.hours && <p className="text-[11px] text-neutral-500 mt-1">{l.hours}</p>}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/10 dark:border-white/10">
              {l.phone && (
                <a href={`tel:${l.phone}`} className="text-xs font-grotesk font-bold hover:text-emerald-500">
                  {l.phone}
                </a>
              )}
              {l.mapUrl && (
                <a
                  href={l.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-grotesk font-extrabold uppercase tracking-wider text-neutral-500 hover:text-black dark:hover:text-white"
                >
                  Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
        {locations.length === 0 && <p className="text-sm text-neutral-500">No stores added yet.</p>}
      </div>
    </div>
  );
}
