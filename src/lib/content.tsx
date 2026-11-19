import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { Product, CollectionItem, LookbookOutfit, InstagramPost } from "@/types";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  media_type?: "image" | "video";
  video_url?: string;
  badge: string;
  impact: string;
  cta_label?: string;
  cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  ctaLabel: string;
  ctaUrl?: string;
  image: string;
  mediaType?: "image" | "video";
  videoUrl?: string;
}

export type HomeBlockType =
  | "hero"
  | "eco"
  | "collections"
  | "new_arrivals"
  | "promos"
  | "lookbook"
  | "sustainability"
  | "instagram"
  | "newsletter"
  | "category"
  | "product_grid"
  | "banner";

export interface HomeBlock {
  id: string;
  blockType: HomeBlockType;
  title: string;
  settings: Record<string, Json | undefined>;
  isVisible: boolean;
  sortOrder: number;
}

export interface EcoMetric {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  image: string;
  stats: { label: string; value: string }[];
  features: string[];
}

export interface SectionItem {
  key: string;
  label: string;
  isVisible: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  brand?: string;
  tagline?: string;
  logo_url?: string;
  logo_dark_url?: string;
  favicon_url?: string;
  about_text?: string;
  whatsapp?: string;
  support_phone?: string;
  support_email?: string;
  copyright?: string;
  announcements?: string[];
  default_currency?: string;
  shipping_flat?: number;
  free_shipping_note?: string;
  [key: string]: unknown;
}

export interface PageItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  blocks: { type?: string; text?: string; image?: string; heading?: string }[];
  seoTitle: string;
  seoDescription: string;
  showInHeader: boolean;
  showInFooter: boolean;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  location: string;
  groupLabel: string;
  label: string;
  href: string;
  parentId: string | null;
  sortOrder: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  showOnHome: boolean;
  homeTag: string;
  homeDescription: string;
  showInHeader: boolean;
  showInFooter: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ShopLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  mapUrl: string;
}

export interface PaymentMethod {
  id: string;
  key: string;
  label: string;
  description: string;
  instructions: string;
  accountNumber: string;
  requiresTxnId: boolean;
}

export interface DeliveryZone {
  id: string;
  district: string;
  area: string;
  charge: number;
  freeThreshold: number | null;
  eta: string;
}

export interface VariantStock {
  id: string;
  productId: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
}

export interface SiteContent {
  products: Product[];
  collections: CollectionItem[];
  heroSlides: HeroSlide[];
  promos: PromoBanner[];
  homeBlocks: HomeBlock[];
  ecoMetrics: EcoMetric[];
  materials: MaterialItem[];
  lookbook: LookbookOutfit | null;
  instagram: InstagramPost[];
  sections: SectionItem[];
  settings: SiteSettings;
  pages: PageItem[];
  menus: MenuItem[];
  socials: SocialLink[];
  locations: ShopLocation[];
  paymentMethods: PaymentMethod[];
  deliveryZones: DeliveryZone[];
  variants: VariantStock[];
  categories: ProductCategory[];
  isLoading: boolean;
}

const EMPTY: SiteContent = {
  products: [],
  collections: [],
  heroSlides: [],
  promos: [],
  homeBlocks: [],
  ecoMetrics: [],
  materials: [],
  lookbook: null,
  instagram: [],
  sections: [],
  settings: {},
  pages: [],
  menus: [],
  socials: [],
  locations: [],
  paymentMethods: [],
  deliveryZones: [],
  variants: [],
  categories: [],
  isLoading: true,
};

const normalizeImageUrl = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.startsWith("/uploads/") ? `/api/public${value}` : value;
};

export const mapProduct = (r: any): Product => {
  const images = Array.isArray(r.images) ? r.images.filter(Boolean) : [];
  const colors = Array.isArray(r.colors) ? r.colors.filter(Boolean) : [];
  const sizes = Array.isArray(r.sizes) ? r.sizes.filter(Boolean) : [];

  return {
    id: r.id,
    name: r.name,
    category: r.category,
    price: Number(r.price),
    originalPrice: r.original_price == null ? undefined : Number(r.original_price),
    currency: r.currency,
    rating: Number(r.rating),
    reviewsCount: r.reviews_count,
    ecoBadge: r.eco_badge,
    ecoImpactText: r.eco_impact_text,
    co2SavedKg: Number(r.co2_saved_kg),
    images,
    colors: colors.length ? colors : [{ name: "Default", hex: "#B8B0A4" }],
    sizes: sizes.length ? sizes : ["OS"],
    composition: r.composition,
    fitDescription: r.fit_description,
    isNew: r.is_new,
    isBestSeller: r.is_best_seller,
    isSustainable: r.is_sustainable,
    description: r.description,
    detailBlocks: r.detail_blocks ?? [],
  };
};

export async function fetchSiteContent(
  client: any = supabase,
): Promise<Omit<SiteContent, "isLoading">> {
  const supabase = client;
  const [
    products,
    collections,
    hero,
    promos,
    eco,
    materials,
    lookbook,
    insta,
    sections,
    settings,
    pages,
    menus,
    socials,
    locations,
    payments,
    zones,
    variants,
    categories,
    homeBlocks,
  ] = await Promise.all([
    supabase.from("products").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("collections").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("hero_slides").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("promo_banners").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("eco_metrics").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("materials").select("*").eq("is_published", true).order("sort_order"),
    supabase
      .from("lookbook_outfits")
      .select("*")
      .eq("is_published", true)
      .order("sort_order")
      .limit(1),
    supabase.from("instagram_posts").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("sections").select("*").order("sort_order"),
    supabase.from("site_settings").select("*").eq("key", "general").maybeSingle(),
    supabase.from("pages").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("menu_items").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("social_links").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("shop_locations").select("*").eq("is_visible", true).order("sort_order"),
    // account_number / instructions are intentionally NOT public — they are
    // fetched per selected method through a server function at checkout.
    supabase
      .from("payment_methods")
      .select("id, key, label, description, requires_txn_id, sort_order")
      .eq("is_enabled", true)
      .order("sort_order"),
    supabase.from("delivery_zones").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("product_variants").select("id, product_id, size, color, sku, stock"),
    supabase.from("product_categories").select("*").eq("is_visible", true).order("sort_order"),
    supabase
      .from("home_blocks")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order")
      .order("id"),
  ]);

  const queryResults = [
    ["products", products],
    ["collections", collections],
    ["hero_slides", hero],
    ["promo_banners", promos],
    ["eco_metrics", eco],
    ["materials", materials],
    ["lookbook_outfits", lookbook],
    ["instagram_posts", insta],
    ["sections", sections],
    ["site_settings", settings],
    ["pages", pages],
    ["menu_items", menus],
    ["social_links", socials],
    ["shop_locations", locations],
    ["payment_methods", payments],
    ["delivery_zones", zones],
    ["product_variants", variants],
    ["product_categories", categories],
    ["home_blocks", homeBlocks],
  ] as const;
  // Payment credentials are deliberately restricted and are loaded separately
  // during checkout, so a missing public grant must not blank the storefront.
  const failedQuery = queryResults.find(
    ([table, result]) => table !== "payment_methods" && result.error,
  );
  if (failedQuery) {
    const [table, result] = failedQuery;
    throw new Error(`Could not load ${table}: ${result.error.message}`);
  }

  const lb = (lookbook.data ?? [])[0] as any;

  return {
    products: (products.data ?? []).map(mapProduct),
    collections: (collections.data ?? []).map((r: any) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      image: normalizeImageUrl(r.image),
      tag: r.tag,
      itemCount: r.item_count,
      slug: r.slug,
    })),
    heroSlides: (hero.data ?? []).map((r: any) => ({
      ...r,
      image: normalizeImageUrl(r.image),
      video_url: normalizeImageUrl(r.video_url),
    })) as HeroSlide[],
    promos: (promos.data ?? []).map((r: any) => ({
      id: r.id,
      eyebrow: r.eyebrow,
      title: r.title,
      description: r.description,
      badge: r.badge,
      ctaLabel: r.cta_label,
      ctaUrl: r.cta_url,
      image: normalizeImageUrl(r.image),
      mediaType: r.media_type,
      videoUrl: normalizeImageUrl(r.video_url),
    })),
    homeBlocks: (homeBlocks.data ?? []).map((r: any) => {
      const settings =
        typeof r.settings === "object" && r.settings !== null && !Array.isArray(r.settings)
          ? { ...r.settings }
          : {};
      if (typeof settings["image"] === "string")
        settings["image"] = normalizeImageUrl(settings["image"]);
      if (typeof settings["videoUrl"] === "string")
        settings["videoUrl"] = normalizeImageUrl(settings["videoUrl"]);

      return {
        id: r.id,
        blockType: r.block_type,
        title: r.title,
        settings: settings as Record<string, Json | undefined>,
        isVisible: r.is_visible,
        sortOrder: r.sort_order,
      };
    }) as HomeBlock[],
    ecoMetrics: (eco.data ?? []) as unknown as EcoMetric[],
    materials: (materials.data ?? []) as unknown as MaterialItem[],
    lookbook: lb
      ? {
          id: lb.id,
          title: lb.title,
          subtitle: lb.subtitle,
          image: lb.image,
          hotspots: lb.hotspots ?? [],
        }
      : null,
    instagram: (insta.data ?? []).map((r: any) => ({
      id: r.id,
      handle: r.handle,
      image: r.image,
      likes: r.likes,
      caption: r.caption,
      productId: r.product_id ?? "",
    })),
    sections: (sections.data ?? []).map((r: any) => ({
      key: r.key,
      label: r.label,
      isVisible: r.is_visible,
      sortOrder: r.sort_order,
    })),
    settings: ((settings.data as any)?.value ?? {}) as SiteSettings,
    pages: (pages.data ?? []).map((r: any) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      subtitle: r.subtitle,
      heroImage: r.hero_image,
      blocks: r.blocks ?? [],
      seoTitle: r.seo_title,
      seoDescription: r.seo_description,
      showInHeader: r.show_in_header,
      showInFooter: r.show_in_footer,
      sortOrder: r.sort_order,
    })),
    menus: (menus.data ?? []).map((r: any) => ({
      id: r.id,
      location: r.location,
      groupLabel: r.group_label,
      label: r.label,
      href: r.href,
      parentId: r.parent_id,
      sortOrder: r.sort_order,
    })),
    socials: (socials.data ?? []).map((r: any) => ({ id: r.id, platform: r.platform, url: r.url })),
    locations: (locations.data ?? []).map((r: any) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      city: r.city,
      phone: r.phone,
      hours: r.hours,
      mapUrl: r.map_url,
    })),
    paymentMethods: (payments.data ?? []).map((r: any) => ({
      id: r.id,
      key: r.key,
      label: r.label,
      description: r.description,
      instructions: "",
      accountNumber: "",
      requiresTxnId: r.requires_txn_id,
    })),
    deliveryZones: (zones.data ?? []).map((r: any) => ({
      id: r.id,
      district: r.district,
      area: r.area,
      charge: Number(r.charge),
      freeThreshold: r.free_threshold == null ? null : Number(r.free_threshold),
      eta: r.eta,
    })),
    variants: (variants.data ?? []).map((r: any) => ({
      id: r.id,
      productId: r.product_id,
      size: r.size,
      color: r.color,
      sku: r.sku,
      stock: r.stock,
    })),
    categories: (categories.data ?? []).map((r: any) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      image: r.image,
      showOnHome: r.show_on_home !== false,
      homeTag: r.home_tag ?? "",
      homeDescription: r.home_description ?? "",
      showInHeader: r.show_in_header,
      showInFooter: r.show_in_footer,
    })),
  };
}

const ContentContext = createContext<SiteContent>(EMPTY);

export const useSiteContent = () => useContext(ContentContext);

export const SiteContentProvider: React.FC<{
  children: React.ReactNode;
  initialContent?: Omit<SiteContent, "isLoading"> | null;
}> = ({ children, initialContent }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: () => fetchSiteContent(),
    staleTime: 0,
    gcTime: 30 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    ...(initialContent ? { initialData: initialContent, initialDataUpdatedAt: Date.now() } : {}),
  });

  return (
    <ContentContext.Provider value={{ ...(data ?? EMPTY), isLoading }}>
      {children}
    </ContentContext.Provider>
  );
};
