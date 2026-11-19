import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FeaturedCollections } from "@/components/FeaturedCollections";

export const Route = createFileRoute("/_store/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Urbanova" },
      {
        name: "description",
        content: "Explore Urbanova's seasonal capsules and curated collections.",
      },
      { property: "og:title", content: "Collections — Urbanova" },
      { property: "og:description", content: "Seasonal capsules and curated collections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const navigate = useNavigate();
  return <FeaturedCollections onSelectCollection={() => navigate({ to: "/shop" })} />;
}
