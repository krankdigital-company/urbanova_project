import { createFileRoute } from "@tanstack/react-router";
import { SustainableLab } from "@/components/SustainableLab";
import { EcoImpactTicker } from "@/components/EcoImpactTicker";

export const Route = createFileRoute("/_store/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — Urbanova" },
      { name: "description", content: "Traceable fibers, circular production and our eco-impact commitments at Urbanova." },
      { property: "og:title", content: "Sustainability — Urbanova" },
      { property: "og:description", content: "Traceable fibers, circular production and eco-impact commitments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SustainabilityPage,
});

function SustainabilityPage() {
  return (
    <>
      <EcoImpactTicker />
      <SustainableLab />
    </>
  );
}
