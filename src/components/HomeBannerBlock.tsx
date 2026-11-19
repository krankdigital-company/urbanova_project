import React from "react";
import { ArrowRight } from "lucide-react";
import type { HomeBlock } from "@/lib/content";

const safeLink = (value: unknown) =>
  typeof value === "string" &&
  (/^https?:\/\//i.test(value) || (value.startsWith("/") && !value.startsWith("//")))
    ? value
    : "";

export const HomeBannerBlock: React.FC<{ block: HomeBlock }> = ({ block }) => {
  const { settings } = block;
  const image = typeof settings["image"] === "string" ? settings["image"] : "";
  const videoUrl = typeof settings["videoUrl"] === "string" ? settings["videoUrl"] : "";
  const mediaType = settings["mediaType"] === "video" ? "video" : "image";
  const layout = settings["layout"] === "split" ? "split" : "overlay";
  const eyebrow = typeof settings["eyebrow"] === "string" ? settings["eyebrow"] : "";
  const heading = typeof settings["heading"] === "string" ? settings["heading"] : block.title;
  const description = typeof settings["description"] === "string" ? settings["description"] : "";
  const ctaLabel = typeof settings["ctaLabel"] === "string" ? settings["ctaLabel"] : "";
  const href = safeLink(settings["ctaUrl"]);
  const media =
    mediaType === "video" && videoUrl ? (
      <video
        src={videoUrl}
        poster={image || undefined}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    ) : image ? (
      <img src={image} alt={heading} className="h-full w-full object-cover" />
    ) : null;

  if (!media && !heading && !description) return null;

  return (
    <section className="mx-auto max-w-[1700px] px-4 py-8 sm:px-6 lg:px-8">
      {layout === "split" ? (
        <div className="grid min-h-[300px] overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-lg md:grid-cols-2">
          <div className="min-h-[240px] bg-neutral-800">{media}</div>
          <div className="flex flex-col items-start justify-center p-8 sm:p-12">
            {eyebrow && (
              <span className="mb-3 text-xs font-grotesk font-bold uppercase tracking-[0.2em] text-neutral-300">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="font-syne text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
                {heading}
              </h2>
            )}
            {description && <p className="mt-4 max-w-lg text-sm leading-6 text-neutral-300">{description}</p>}
            {ctaLabel && href && (
              <a
                href={href}
                className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-grotesk font-extrabold uppercase tracking-widest text-black hover:bg-neutral-200"
              >
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="group relative min-h-[320px] overflow-hidden rounded-2xl bg-neutral-900 text-white shadow-lg sm:min-h-[420px]">
          {media}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-start justify-center p-8 sm:p-12 lg:p-16">
            {eyebrow && (
              <span className="mb-3 text-xs font-grotesk font-bold uppercase tracking-[0.2em] text-neutral-300">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="max-w-2xl font-syne text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-200">{description}</p>
            )}
            {ctaLabel && href && (
              <a
                href={href}
                className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-grotesk font-extrabold uppercase tracking-widest text-black hover:bg-neutral-200"
              >
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
