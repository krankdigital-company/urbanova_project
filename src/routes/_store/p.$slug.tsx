import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/content";

export const Route = createFileRoute("/_store/p/$slug")({
  head: () => ({
    meta: [
      { title: "Page — Urbanova" },
      { name: "description", content: "Urbanova information page." },
      { property: "og:title", content: "Page — Urbanova" },
      { property: "og:description", content: "Urbanova information page." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomPage,
});

function CustomPage() {
  const { slug } = Route.useParams();
  const { pages, isLoading } = useSiteContent();
  const page = pages.find((p) => p.slug === slug);

  if (isLoading) return <div className="min-h-[50vh]" />;

  if (!page) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-syne text-4xl font-extrabold uppercase tracking-tight">Page not found</h1>
        <p className="text-sm text-neutral-500 mt-3">This page hasn't been published yet.</p>
      </div>
    );
  }

  return <PageBody page={page} />;
}

export function PageBody({ page }: { page: import("@/lib/content").PageItem }) {
  return (
    <article className="pb-20">
      {page.heroImage && (
        <div className="relative h-[38vh] min-h-[260px] w-full overflow-hidden">
          <img src={page.heroImage} alt={page.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-syne text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="mt-3 text-sm text-neutral-200 max-w-2xl font-sans">{page.subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-14">
        {!page.heroImage && (
          <header className="mb-10">
            <h1 className="font-syne text-4xl font-extrabold uppercase tracking-tight">{page.title}</h1>
            {page.subtitle && <p className="mt-3 text-sm text-neutral-500 font-sans">{page.subtitle}</p>}
          </header>
        )}

        <div className="space-y-8">
          {page.blocks.map((block, i) => {
            if (block.type === "image" && block.image) {
              return <img key={i} src={block.image} alt={block.heading ?? page.title} className="w-full rounded-2xl" />;
            }
            return (
              <section key={i}>
                {block.heading && (
                  <h2 className="font-syne text-2xl font-extrabold uppercase tracking-tight mb-3">{block.heading}</h2>
                )}
                {block.text && (
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 whitespace-pre-line font-sans">
                    {block.text}
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
}
