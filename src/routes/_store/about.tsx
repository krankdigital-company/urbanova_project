import { createFileRoute } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/content";
import { PageBody } from "./p.$slug";

export const Route = createFileRoute("/_store/about")({
  head: () => ({
    meta: [
      { title: "About Us — Urbanova" },
      { name: "description", content: "The story, craft and people behind Urbanova sustainable streetwear." },
      { property: "og:title", content: "About Us — Urbanova" },
      { property: "og:description", content: "The story, craft and people behind Urbanova." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { pages, settings } = useSiteContent();
  const page = pages.find((p) => p.slug === "about");
  if (page) return <PageBody page={page} />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <h1 className="font-syne text-4xl font-extrabold uppercase tracking-tight">About {(settings.brand as string) || "Urbanova"}</h1>
      <p className="mt-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 font-sans">
        {(settings.about_text as string) ||
          "Add your about content from the admin panel under Pages to replace this placeholder."}
      </p>
    </div>
  );
}
