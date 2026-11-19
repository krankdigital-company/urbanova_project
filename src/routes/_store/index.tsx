import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HeroBanner } from "@/components/HeroBanner";
import { EcoImpactTicker } from "@/components/EcoImpactTicker";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { HomeBannerBlock } from "@/components/HomeBannerBlock";
import { HomeProductBlock } from "@/components/HomeProductBlock";
import { NewArrivals } from "@/components/NewArrivals";
import { PromoBanners } from "@/components/PromoBanners";
import { ShopTheLook } from "@/components/ShopTheLook";
import { SustainableLab } from "@/components/SustainableLab";
import { InstagramGallery } from "@/components/InstagramGallery";
import { Newsletter } from "@/components/Newsletter";
import { useSiteContent } from "@/lib/content";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_store/")({
  head: () => ({
    meta: [
      { title: "Urbanova — Sustainable Streetwear & Sneakers" },
      {
        name: "description",
        content:
          "Shop Urbanova's sustainable streetwear, imported sneakers and architectural outerwear with nationwide delivery in Bangladesh.",
      },
      { property: "og:title", content: "Urbanova — Sustainable Streetwear & Sneakers" },
      {
        property: "og:description",
        content: "Sustainable streetwear, imported sneakers and architectural outerwear.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { homeBlocks } = useSiteContent();
  const s = useStore();
  const navigate = useNavigate();

  const goShop = () => navigate({ to: "/shop" });

  return (
    <>
      {homeBlocks.map((block) => {
        switch (block.blockType) {
          case "hero":
            return (
              <HeroBanner
                key={block.id}
                onShopNow={goShop}
                onExploreLookbook={() => navigate({ to: "/lookbook" })}
              />
            );
          case "eco":
            return <EcoImpactTicker key={block.id} />;
          case "collections":
            return (
              <FeaturedCollections
                key={block.id}
                onSelectCollection={(slug) =>
                  navigate({ to: "/shop", search: { category: slug } })
                }
              />
            );
          case "new_arrivals":
            return (
              <NewArrivals
                key={block.id}
                selectedCurrency={s.currency}
                wishlist={s.wishlist}
                onToggleWishlist={s.toggleWishlist}
                onQuickView={s.setQuickViewProduct}
                onAddToCart={s.addToCart}
                onBuyNow={(product, size, color) => {
                  s.startBuyNow(product, size, color);
                  navigate({ to: "/checkout" });
                }}
                onSelectProduct={(product) =>
                  navigate({ to: "/product/$id", params: { id: product.id } })
                }
              />
            );
          case "promos":
            return (
              <PromoBanners
                key={block.id}
                onShopOuterwear={goShop}
                onShopDenim={goShop}
              />
            );
          case "lookbook":
            return (
              <ShopTheLook
                key={block.id}
                selectedCurrency={s.currency}
                onQuickView={s.setQuickViewProduct}
                onAddToCart={s.addToCart}
              />
            );
          case "sustainability":
            return <SustainableLab key={block.id} />;
          case "instagram":
            return (
              <InstagramGallery key={block.id} onQuickView={s.setQuickViewProduct} />
            );
          case "newsletter":
            return <Newsletter key={block.id} onShowToast={s.showToast} />;
          case "category":
          case "product_grid":
            return (
              <HomeProductBlock
                key={block.id}
                block={block}
                onSelectCategory={(slug) =>
                  navigate({ to: "/shop", search: { category: slug } })
                }
                onSelectProduct={(product) =>
                  navigate({ to: "/product/$id", params: { id: product.id } })
                }
                onBuyNow={(product, size, color) => {
                  s.startBuyNow(product, size, color);
                  navigate({ to: "/checkout" });
                }}
              />
            );
          case "banner":
            return <HomeBannerBlock key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
