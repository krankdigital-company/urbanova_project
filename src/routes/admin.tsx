import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listPaymentMethodsAdmin,
  savePaymentMethodAdmin,
  deletePaymentMethodAdmin,
} from "@/lib/payment-admin";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Layers,
  Image as ImageIcon,
  FileText,
  Link2,
  Share2,
  MapPin,
  Leaf,
  FlaskConical,
  Camera,
  ShoppingBag,
  TicketPercent,
  CreditCard,
  Truck,
  Users,
  LogOut,
  ExternalLink,
  Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { RecordEditor, type FieldDef } from "@/components/admin/RecordEditor";
import { HomePageBuilder } from "@/components/admin/HomePageBuilder";
import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Panel — Urbanova" },
      {
        name: "description",
        content: "Manage Urbanova content, product placements, section order and orders.",
      },
      { property: "og:title", content: "Admin Panel — Urbanova" },
      { property: "og:description", content: "Manage Urbanova content, products and orders." },
    ],
  }),
  component: AdminPage,
});

const commonTail: FieldDef[] = [
  { key: "sort_order", label: "Sort order", type: "number" },
  { key: "is_published", label: "Published", type: "boolean" },
];

interface TableCfg {
  table: string;
  title: string;
  pk?: string;
  fields: FieldDef[];
  order?: string;
  uuid?: boolean;
  hint?: string;
  bulkActions?: boolean;
}

const TABLES: Record<string, TableCfg> = {
  products: {
    table: "products",
    title: "Products",
    bulkActions: true,
    fields: [
      { key: "name", label: "Name" },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "outerwear", label: "Outerwear" },
          { value: "knitwear", label: "Knitwear & Tees" },
          { value: "denim", label: "Japanese Denim" },
          { value: "footwear", label: "Footwear" },
          { value: "accessories", label: "Accessories" },
        ],
      },
      { key: "price", label: "Price", type: "number" },
      { key: "original_price", label: "Original price", type: "number" },
      { key: "currency", label: "Currency" },
      { key: "rating", label: "Rating", type: "number" },
      { key: "reviews_count", label: "Reviews count", type: "number" },
      { key: "eco_badge", label: "Eco badge" },
      { key: "eco_impact_text", label: "Eco impact text" },
      { key: "co2_saved_kg", label: "CO2 saved (kg)", type: "number" },
      { key: "images", label: "Gallery images", type: "images" },
      { key: "colors", label: "Colors (JSON)", type: "json" },
      { key: "sizes", label: "Sizes (JSON)", type: "json" },
      { key: "composition", label: "Composition" },
      { key: "fit_description", label: "Fit description", type: "textarea" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "is_new", label: "New arrival", type: "boolean" },
      { key: "is_best_seller", label: "Best seller", type: "boolean" },
      { key: "is_sustainable", label: "Sustainable lab", type: "boolean" },
      {
        key: "detail_blocks",
        label: "Description blocks (optional images + text)",
        type: "blocks",
      },
      ...commonTail,
    ],
  },
  product_categories: {
    table: "product_categories",
    title: "Product Categories",
    uuid: true,
    hint: "Manage the categories available to products. Use the slug as the product category value.",
    fields: [
      { key: "name", label: "Category name" },
      { key: "slug", label: "Slug (used by products)" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image", label: "Category image", type: "image" },
      { key: "home_tag", label: "Home tag" },
      { key: "home_description", label: "Home description", type: "textarea" },
      { key: "show_in_header", label: "Show in header", type: "boolean" },
      { key: "show_in_footer", label: "Show in footer", type: "boolean" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "is_visible", label: "Visible", type: "boolean" },
    ],
  },
  product_variants: {
    table: "product_variants",
    title: "Stock & Variants",
    order: "sku",
    uuid: true,
    hint: "Size/colour level inventory. Stock is deducted automatically on every order.",
    fields: [
      { key: "product_id", label: "Product id" },
      { key: "size", label: "Size" },
      { key: "color", label: "Colour" },
      { key: "sku", label: "SKU" },
      { key: "stock", label: "Stock", type: "number" },
      { key: "low_stock_threshold", label: "Low stock threshold", type: "number" },
    ],
  },
  collections: {
    table: "collections",
    title: "Collections",
    fields: [
      { key: "title", label: "Title" },
      { key: "subtitle", label: "Subtitle" },
      { key: "image", label: "Image", type: "image" },
      { key: "tag", label: "Tag" },
      { key: "item_count", label: "Item count", type: "number" },
      { key: "slug", label: "Slug" },
      ...commonTail,
    ],
  },
  hero_slides: {
    table: "hero_slides",
    title: "Hero Slides",
    bulkActions: true,
    fields: [
      { key: "title", label: "Title" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "tagline", label: "Tagline" },
      {
        key: "media_type",
        label: "Background media",
        type: "select",
        options: [
          { value: "image", label: "Image" },
          { value: "video", label: "Video" },
        ],
      },
      { key: "image", label: "Image / video poster", type: "image" },
      { key: "video_url", label: "Video upload or direct URL", type: "video" },
      { key: "badge", label: "Badge" },
      { key: "impact", label: "Impact" },
      { key: "cta_label", label: "Primary button label" },
      { key: "cta_url", label: "Primary button link" },
      { key: "secondary_cta_label", label: "Secondary button label" },
      { key: "secondary_cta_url", label: "Secondary button link" },
      ...commonTail,
    ],
  },
  promo_banners: {
    table: "promo_banners",
    title: "Promo Banners",
    bulkActions: true,
    fields: [
      { key: "title", label: "Title" },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "badge", label: "Badge" },
      { key: "cta_label", label: "CTA label" },
      { key: "cta_url", label: "CTA link" },
      {
        key: "media_type",
        label: "Media type",
        type: "select",
        options: [
          { value: "image", label: "Image" },
          { value: "video", label: "Video" },
        ],
      },
      { key: "image", label: "Image", type: "image" },
      { key: "video_url", label: "Video upload or direct URL", type: "video" },
      ...commonTail,
    ],
  },
  pages: {
    table: "pages",
    title: "Custom Pages",
    uuid: true,
    hint: "Custom pages are served at /p/{slug} and can be linked from the header or footer.",
    fields: [
      { key: "slug", label: "Slug (e.g. about)" },
      { key: "title", label: "Title" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "hero_image", label: "Hero image", type: "image" },
      { key: "blocks", label: "Content blocks", type: "blocks" },
      { key: "seo_title", label: "SEO title" },
      { key: "seo_description", label: "SEO description", type: "textarea" },
      { key: "show_in_header", label: "Show in header", type: "boolean" },
      { key: "show_in_footer", label: "Show in footer", type: "boolean" },
      ...commonTail,
    ],
  },
  menu_items: {
    table: "menu_items",
    title: "Navigation Menus",
    uuid: true,
    hint: "Set a parent id to build a dropdown (e.g. categories under Shop). Use /shop?category=denim style links.",
    fields: [
      { key: "location", label: "Location (header / footer)" },
      { key: "group_label", label: "Group label (footer column)" },
      { key: "label", label: "Label" },
      { key: "href", label: "Href" },
      { key: "parent_id", label: "Parent id (for dropdown)" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "is_visible", label: "Visible", type: "boolean" },
    ],
  },
  social_links: {
    table: "social_links",
    title: "Social Links",
    uuid: true,
    fields: [
      { key: "platform", label: "Platform (instagram, facebook, youtube, tiktok, x, linkedin)" },
      { key: "url", label: "URL" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "is_visible", label: "Visible", type: "boolean" },
    ],
  },
  site_settings: {
    table: "site_settings",
    title: "Site Settings",
    pk: "key",
    fields: [
      { key: "key", label: "Key" },
      { key: "value", label: "Value", type: "json" },
    ],
  },
  shop_locations: {
    table: "shop_locations",
    title: "Shop Locations",
    uuid: true,
    fields: [
      { key: "name", label: "Name" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "city", label: "City" },
      { key: "phone", label: "Phone" },
      { key: "hours", label: "Opening hours" },
      { key: "map_url", label: "Map URL" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "is_visible", label: "Visible", type: "boolean" },
    ],
  },
  eco_metrics: {
    table: "eco_metrics",
    title: "Eco Metrics",
    fields: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description" },
      { key: "icon", label: "Icon (RefreshCw, Droplets, Truck, ShieldCheck, Award)" },
      ...commonTail,
    ],
  },
  materials: {
    table: "materials",
    title: "Sustainable Lab",
    fields: [
      { key: "name", label: "Name" },
      { key: "badge", label: "Badge" },
      { key: "tagline", label: "Tagline", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
      { key: "stats", label: "Stats (JSON)", type: "json" },
      { key: "features", label: "Features (JSON array)", type: "json" },
      ...commonTail,
    ],
  },
  lookbook_outfits: {
    table: "lookbook_outfits",
    title: "Lookbook",
    fields: [
      { key: "title", label: "Title" },
      { key: "subtitle", label: "Subtitle" },
      { key: "image", label: "Image", type: "image" },
      { key: "hotspots", label: "Hotspots (JSON)", type: "json" },
      ...commonTail,
    ],
  },
  instagram_posts: {
    table: "instagram_posts",
    title: "Instagram Gallery",
    fields: [
      { key: "handle", label: "Handle" },
      { key: "image", label: "Image", type: "image" },
      { key: "likes", label: "Likes", type: "number" },
      { key: "caption", label: "Caption", type: "textarea" },
      { key: "product_id", label: "Tagged product id" },
      ...commonTail,
    ],
  },
  discounts: {
    table: "discounts",
    title: "Discounts & Promo Codes",
    uuid: true,
    order: "code",
    fields: [
      { key: "code", label: "Code" },
      { key: "description", label: "Description" },
      { key: "discount_type", label: "Type (percent / fixed)" },
      { key: "value", label: "Value", type: "number" },
      { key: "min_order", label: "Minimum order", type: "number" },
      { key: "max_discount", label: "Max discount", type: "number" },
      { key: "usage_limit", label: "Total usage limit", type: "number" },
      { key: "per_customer_limit", label: "Per customer limit", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  payment_methods: {
    table: "payment_methods",
    title: "Payment Gateways",
    uuid: true,
    hint: "bKash, Nagad and SSLCommerz. Enter your merchant number or gateway credentials, then enable the method to show it at checkout.",
    fields: [
      { key: "key", label: "Key (cod, bkash, nagad, sslcommerz)" },
      { key: "label", label: "Label shown at checkout" },
      { key: "description", label: "Short description" },
      {
        key: "integration_mode",
        label: "Integration mode",
        type: "select",
        options: [
          { value: "manual", label: "Manual / transaction ID" },
          { value: "api", label: "API / hosted checkout" },
        ],
      },
      { key: "instructions", label: "Customer instructions", type: "textarea" },
      { key: "account_number", label: "Merchant number / Store ID" },
      { key: "merchant_id", label: "Merchant ID" },
      { key: "store_id", label: "Store ID" },
      { key: "store_password", label: "Store password", type: "password" },
      { key: "app_key", label: "API app key", type: "password" },
      { key: "app_secret", label: "API app secret", type: "password" },
      { key: "api_username", label: "API username" },
      { key: "api_password", label: "API password", type: "password" },
      { key: "api_base_url", label: "API base URL" },
      { key: "success_url", label: "Success callback URL" },
      { key: "fail_url", label: "Failure callback URL" },
      { key: "cancel_url", label: "Cancel callback URL" },
      { key: "ipn_url", label: "IPN / webhook URL" },
      { key: "requires_txn_id", label: "Ask for transaction ID", type: "boolean" },
      { key: "is_enabled", label: "Enabled", type: "boolean" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  delivery_zones: {
    table: "delivery_zones",
    title: "Delivery Charges",
    uuid: true,
    hint: "District based COD delivery charges used by checkout, with auto-detected customer location.",
    fields: [
      { key: "district", label: "District" },
      { key: "area", label: "Area" },
      { key: "charge", label: "Charge", type: "number" },
      { key: "free_threshold", label: "Free above", type: "number" },
      { key: "eta", label: "ETA" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  staff: {
    table: "staff",
    title: "Team Management",
    uuid: true,
    order: "full_name",
    hint: "Roles: admin, manager, staff. Link a user id to grant back-office access.",
    fields: [
      { key: "full_name", label: "Full name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "role", label: "Role (admin / manager / staff)" },
      { key: "user_id", label: "Auth user id" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
};

const NAV: { group: string; items: { key: string; label: string; icon: any }[] }[] = [
  { group: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    group: "Catalog",
    items: [
      { key: "products", label: "Products", icon: Package },
      { key: "product_categories", label: "Product Categories", icon: Layers },
      { key: "product_variants", label: "Stock & Variants", icon: Boxes },
      { key: "collections", label: "Collections", icon: Layers },
    ],
  },
  {
    group: "Storefront",
    items: [
      { key: "hero_slides", label: "Hero Slides", icon: ImageIcon },
      { key: "promo_banners", label: "Banners", icon: ImageIcon },
      { key: "home_builder", label: "Homepage Builder", icon: Layers },
      { key: "pages", label: "Custom Pages", icon: FileText },
      { key: "menu_items", label: "Navigation", icon: Link2 },
      { key: "social_links", label: "Social Links", icon: Share2 },
      { key: "shop_locations", label: "Shop Locations", icon: MapPin },
      { key: "eco_metrics", label: "Eco Metrics", icon: Leaf },
      { key: "materials", label: "Sustainable Lab", icon: FlaskConical },
      { key: "lookbook_outfits", label: "Lookbook", icon: Camera },
      { key: "instagram_posts", label: "Instagram", icon: Camera },
      { key: "site_settings", label: "Site Settings", icon: LayoutDashboard },
    ],
  },
  {
    group: "Sales",
    items: [
      { key: "orders", label: "Orders & Invoices", icon: ShoppingBag },
      { key: "discounts", label: "Discounts", icon: TicketPercent },
    ],
  },
  {
    group: "System",
    items: [
      { key: "payment_methods", label: "Payments", icon: CreditCard },
      { key: "delivery_zones", label: "Delivery Charges", icon: Truck },
      { key: "staff", label: "Users & Roles", icon: Users },
    ],
  },
];

const STATUSES = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

const escapeInvoiceText = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const downloadInvoice = (order: any) => {
  const currency = order.currency || "৳";
  const items = Array.isArray(order.order_items) ? order.order_items : [];
  const itemRows = items
    .map((item: any) => {
      const unitPrice = Number(item.unit_price || 0);
      const quantity = Number(item.quantity || 0);
      return `<tr><td>${escapeInvoiceText(item.product_name)}</td><td>${escapeInvoiceText(item.size)} / ${escapeInvoiceText(item.color)}</td><td>${quantity}</td><td>${currency}${unitPrice.toLocaleString()}</td><td>${currency}${(unitPrice * quantity).toLocaleString()}</td></tr>`;
    })
    .join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${escapeInvoiceText(order.invoice_number || order.order_number)}</title><style>body{font:14px Arial,sans-serif;color:#171717;max-width:800px;margin:40px auto;padding:0 24px}header{display:flex;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:20px}h1{margin:0;font-size:28px}h2{margin:28px 0 8px;font-size:16px}p{margin:5px 0;color:#555}table{width:100%;border-collapse:collapse;margin-top:22px}th,td{text-align:left;padding:10px 8px;border-bottom:1px solid #ddd}th{font-size:11px;text-transform:uppercase;color:#666}.total{text-align:right;font-size:20px;font-weight:bold;margin-top:20px}@media print{body{margin:0}}</style></head><body><header><div><h1>URBANOVA</h1><p>Sustainable menswear</p></div><div><strong>INVOICE</strong><p>${escapeInvoiceText(order.invoice_number || order.order_number)}</p><p>${new Date(order.created_at).toLocaleDateString()}</p></div></header><h2>Bill to</h2><p><strong>${escapeInvoiceText(order.customer_name)}</strong></p><p>${escapeInvoiceText(order.customer_phone)}</p><p>${escapeInvoiceText(order.shipping_address)}${order.city ? `, ${escapeInvoiceText(order.city)}` : ""}</p><table><thead><tr><th>Item</th><th>Variant</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead><tbody>${itemRows}</tbody></table><p class="total">Total: ${currency}${Number(order.total || 0).toLocaleString()}</p><p>Payment: ${escapeInvoiceText(order.payment_method || "cod")} · ${escapeInvoiceText(order.payment_status || "unpaid")}</p></body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${order.invoice_number || order.order_number || order.id}.html`;
  link.click();
  URL.revokeObjectURL(url);
};

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<string>("dashboard");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const cfg = TABLES[tab];

  const { data: productCategories = [] } = useQuery({
    queryKey: ["admin-product-category-options"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("name, slug")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-rows", tab],
    enabled: !!cfg && isAdmin,
    queryFn: async () => {
      // Merchant account numbers are not exposed through the Data API — staff
      // read them through a role-checked server function instead.
      if (cfg!.table === "payment_methods") return await listPaymentMethodsAdmin();

      const query = supabase.from(cfg!.table as any).select("*");
      const { data, error } =
        cfg!.table === "site_settings"
          ? await query.eq("key", "general")
          : await query.order(cfg!.order ?? "sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    enabled: (tab === "orders" || tab === "dashboard") && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    enabled: tab === "dashboard" && isAdmin,
    queryFn: async () => {
      const [products, lowStock, codes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("product_variants").select("id, stock").lte("stock", 3),
        supabase
          .from("discounts")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
      ]);
      return {
        products: products.count ?? 0,
        lowStock: (lowStock.data ?? []).length,
        codes: codes.count ?? 0,
      };
    },
  });

  const revenue = useMemo(
    () =>
      orders
        .filter((o: any) => o.status !== "cancelled")
        .reduce((s: number, o: any) => s + Number(o.total), 0),
    [orders],
  );

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) return alert(error.message);
    await supabase
      .from("order_events")
      .insert({ order_id: orderId, status, note: `Status updated to ${status}.` });
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  if (loading) return <main className="min-h-screen bg-[#FAF9F6]" />;

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-syne text-3xl font-extrabold uppercase tracking-tight">
            Admin access required
          </h1>
          <p className="text-sm text-neutral-500 mt-3">This account doesn't have the admin role.</p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-xl text-xs font-grotesk font-extrabold uppercase tracking-widest"
          >
            Back to store
          </Link>
        </div>
      </main>
    );
  }

  const activeLabel = NAV.flatMap((g) => g.items).find((i) => i.key === tab)?.label ?? "Dashboard";

  return (
    <main className="min-h-screen bg-[#F6F5F1] text-[#121316] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-black/10 bg-white sticky top-0 h-screen overflow-y-auto">
        <div className="px-6 py-7 border-b border-black/5">
          <p className="font-syne text-lg font-extrabold uppercase tracking-[0.18em]">Urbanova</p>
          <p className="text-[10px] font-grotesk font-bold uppercase tracking-[0.3em] text-neutral-400 mt-1">
            Admin
          </p>
        </div>
        <nav className="py-4 px-3 flex-1">
          {NAV.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="px-3 mb-2 text-[10px] font-grotesk font-extrabold uppercase tracking-[0.2em] text-neutral-400">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setTab(item.key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-sans transition-colors text-left ${
                        tab === item.key
                          ? "bg-neutral-100 text-black font-semibold"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-neutral-500" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-black/10 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="lg:hidden">
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value)}
              className="px-3 py-2 rounded-lg border border-black/15 text-xs font-grotesk font-bold uppercase tracking-widest bg-white"
            >
              {NAV.flatMap((g) => g.items).map((i) => (
                <option key={i.key} value={i.key}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
          <p className="hidden lg:block font-grotesk text-[11px] font-extrabold uppercase tracking-[0.25em] text-neutral-500">
            {activeLabel}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500 hover:text-black"
            >
              View storefront <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-sans text-neutral-700 truncate max-w-[180px]">
                {user?.email}
              </p>
              <p className="text-[10px] font-grotesk uppercase tracking-widest text-neutral-400">
                admin
              </p>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
              className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="px-4 sm:px-8 py-8 max-w-6xl">
          {tab === "dashboard" ? (
            <section>
              <h1 className="font-syne text-4xl font-extrabold uppercase tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-neutral-500 mt-2">
                Everything on the storefront is managed from this panel.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Orders", value: orders.length },
                  { label: "Revenue", value: `৳${revenue.toLocaleString()}` },
                  { label: "Products", value: stats?.products ?? 0 },
                  { label: "Low stock variants", value: stats?.lowStock ?? 0 },
                ].map((c) => (
                  <div key={c.label} className="rounded-2xl border border-black/10 bg-white p-5">
                    <p className="text-[10px] font-grotesk font-extrabold uppercase tracking-[0.2em] text-neutral-400">
                      {c.label}
                    </p>
                    <p className="font-syne text-3xl font-extrabold mt-2">{c.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6">
                <h2 className="font-grotesk text-[11px] font-extrabold uppercase tracking-[0.25em] text-neutral-500">
                  Recent orders
                </h2>
                <div className="mt-4 space-y-2">
                  {orders.slice(0, 6).map((o: any) => (
                    <div
                      key={o.id}
                      className="flex justify-between items-center text-sm border-b border-black/5 pb-2"
                    >
                      <span className="font-grotesk font-bold">{o.order_number}</span>
                      <span className="text-neutral-500 text-xs">{o.customer_name}</span>
                      <span className="text-xs uppercase tracking-widest text-neutral-400">
                        {o.status}
                      </span>
                      <span className="font-semibold">৳{Number(o.total).toLocaleString()}</span>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-sm text-neutral-500">No orders yet.</p>
                  )}
                </div>
              </div>
            </section>
          ) : tab === "orders" ? (
            <section className="space-y-3">
              <h1 className="font-syne text-4xl font-extrabold uppercase tracking-tight mb-6">
                Orders & Invoices
              </h1>
              {orders.map((o: any) => (
                <div key={o.id} className="rounded-2xl border border-black/10 bg-white p-5">
                  <div className="flex flex-wrap justify-between gap-4 items-center">
                    <div>
                      <p className="font-grotesk font-extrabold text-sm uppercase tracking-widest">
                        {o.order_number}
                        {o.invoice_number ? (
                          <span className="ml-2 text-neutral-400">· {o.invoice_number}</span>
                        ) : null}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        {o.customer_name} · {o.customer_phone} ·{" "}
                        {new Date(o.created_at).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {o.shipping_address}
                        {o.city ? `, ${o.city}` : ""}
                      </p>
                      <p className="text-[11px] text-neutral-500 uppercase tracking-widest mt-1">
                        {o.payment_method || "cod"} · {o.payment_status || "unpaid"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-grotesk font-extrabold">
                        {o.currency}
                        {Number(o.total).toLocaleString()}
                      </span>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-black/15 text-[11px] font-grotesk font-bold uppercase tracking-widest bg-white"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => downloadInvoice(o)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-black/15 text-[11px] font-grotesk font-bold uppercase tracking-widest hover:bg-neutral-100"
                        title="Download invoice"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Invoice
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {o.order_items?.map((it: any) => (
                      <p key={it.id} className="text-xs text-neutral-600">
                        {it.product_name} · {it.size} / {it.color} × {it.quantity}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-sm text-neutral-500">No orders yet.</p>}
            </section>
          ) : tab === "home_builder" ? (
            <HomePageBuilder />
          ) : tab === "site_settings" ? (
            <SiteSettingsEditor
              value={(rows[0]?.value as Record<string, unknown>) ?? {}}
              onChanged={async () => {
                await qc.invalidateQueries({ queryKey: ["admin-rows", tab] });
                await qc.refetchQueries({ queryKey: ["site-content"], type: "active" });
              }}
            />
          ) : cfg ? (
            <>
              {cfg.hint && <p className="text-sm text-neutral-500 mb-6 max-w-2xl">{cfg.hint}</p>}
              <RecordEditor
                table={cfg.table}
                title={cfg.title}
                {...(cfg.pk ? { pk: cfg.pk } : {})}
                fields={
                  tab === "products"
                    ? cfg.fields.map((field) =>
                        field.key === "category"
                          ? {
                              ...field,
                              options: productCategories.map((category) => ({
                                value: category.slug,
                                label: category.name,
                              })),
                            }
                          : field,
                      )
                    : cfg.fields
                }
                rows={rows}
                newIdPrefix={cfg.table}
                generateId={!cfg.uuid}
                bulkActions={cfg.bulkActions}
                {...(tab === "payment_methods"
                  ? {
                      onSaveRecord: savePaymentMethodAdmin,
                      onDeleteRecord: deletePaymentMethodAdmin,
                    }
                  : {})}
                onChanged={async () => {
                  await qc.invalidateQueries({ queryKey: ["admin-rows", tab] });
                  if (tab === "product_categories") {
                    await qc.invalidateQueries({ queryKey: ["admin-product-category-options"] });
                  }
                  await qc.refetchQueries({ queryKey: ["site-content"], type: "active" });
                }}
              />
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
