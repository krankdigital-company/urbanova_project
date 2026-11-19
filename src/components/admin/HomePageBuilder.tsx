import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { HomeBlock, HomeBlockType } from "@/lib/content";
import { ImageUpload, VideoUpload } from "./ImageUpload";

type Settings = Record<string, Json | undefined>;

interface BlockDraft {
  id?: string;
  blockType: HomeBlockType;
  title: string;
  settings: Settings;
  isVisible: boolean;
  sortOrder: number;
}

const BLOCK_OPTIONS: { value: HomeBlockType; label: string }[] = [
  { value: "hero", label: "Hero slider" },
  { value: "eco", label: "Eco impact ticker" },
  { value: "collections", label: "Featured collections" },
  { value: "new_arrivals", label: "New arrivals" },
  { value: "promos", label: "Promo banners" },
  { value: "lookbook", label: "Shop the look" },
  { value: "sustainability", label: "Sustainable lab" },
  { value: "instagram", label: "Instagram gallery" },
  { value: "newsletter", label: "Newsletter" },
  { value: "category", label: "Category products" },
  { value: "product_grid", label: "Product grid" },
  { value: "banner", label: "Custom banner" },
];

const fieldClass =
  "mt-1 w-full rounded-lg border border-black/10 bg-neutral-100 px-3 py-2 text-sm outline-none focus:border-black";

const defaultSettings = (blockType: HomeBlockType, firstCategorySlug = ""): Settings => {
  if (blockType === "category") {
    return {
      categorySlug: firstCategorySlug,
      layout: "carousel",
      desktopColumns: 5,
      productLimit: 0,
    };
  }
  if (blockType === "product_grid") {
    return { source: "all", layout: "grid", desktopColumns: 4, productLimit: 8 };
  }
  if (blockType === "banner") return { layout: "overlay", mediaType: "image" };
  return {};
};

const displaySettings = (block: HomeBlock) => {
  const category = typeof block.settings["categorySlug"] === "string"
    ? ` · ${block.settings["categorySlug"]}`
    : "";
  const layout = typeof block.settings["layout"] === "string"
    ? ` · ${block.settings["layout"]}`
    : "";
  return `${BLOCK_OPTIONS.find((option) => option.value === block.blockType)?.label ?? block.blockType}${category}${layout}`;
};

export const HomePageBuilder: React.FC = () => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<BlockDraft | null>(null);
  const [newType, setNewType] = useState<HomeBlockType>("category");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const {
    data: blocks = [],
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["admin-home-blocks"],
    queryFn: async () => {
      const { data, error: queryError } = await supabase
        .from("home_blocks")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });
      if (queryError) throw queryError;
      return (data ?? []).map(
        (row): HomeBlock => ({
          id: row.id,
          blockType: row.block_type as HomeBlockType,
          title: row.title,
          settings:
            row.settings && typeof row.settings === "object" && !Array.isArray(row.settings)
              ? (row.settings as Settings)
              : {},
          isVisible: row.is_visible,
          sortOrder: row.sort_order,
        }),
      );
    },
  });

  const { data: categories = [], error: categoriesError } = useQuery({
    queryKey: ["admin-home-block-categories"],
    queryFn: async () => {
      const { data, error: queryError } = await supabase
        .from("product_categories")
        .select("name, slug")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (queryError) throw queryError;
      return data ?? [];
    },
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-home-blocks"] }),
      queryClient.invalidateQueries({ queryKey: ["site-content"] }),
    ]);
  };

  const patchSettings = (key: string, value: Json | undefined) => {
    setDraft((current) =>
      current ? { ...current, settings: { ...current.settings, [key]: value } } : current,
    );
  };

  const addBlock = () => {
    const option = BLOCK_OPTIONS.find((item) => item.value === newType);
    setError(null);
    setDraft({
      blockType: newType,
      title: option?.label ?? "Homepage section",
      settings: defaultSettings(newType, categories[0]?.slug ?? ""),
      isVisible: true,
      sortOrder: blocks.reduce((max, block) => Math.max(max, block.sortOrder), 0) + 100,
    });
  };

  const editBlock = (block: HomeBlock) => {
    setError(null);
    setDraft({ ...block, settings: { ...block.settings } });
  };

  const duplicateBlock = (block: HomeBlock) => {
    setError(null);
    setDraft({
      blockType: block.blockType,
      title: `${block.title} copy`,
      settings: { ...block.settings },
      isVisible: block.isVisible,
      sortOrder: blocks.reduce((max, item) => Math.max(max, item.sortOrder), 0) + 100,
    });
  };

  const saveBlock = async () => {
    if (!draft) return;
    if (draft.blockType === "category" && !draft.settings["categorySlug"]) {
      setError("Choose a category for this section.");
      return;
    }
    if (
      draft.blockType === "product_grid" &&
      draft.settings["source"] === "category" &&
      !draft.settings["categorySlug"]
    ) {
      setError("Choose a category for this product grid.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const payload = {
        ...(draft.id ? { id: draft.id } : {}),
        block_type: draft.blockType,
        title: draft.title.trim() || "Homepage section",
        settings: draft.settings,
        is_visible: draft.isVisible,
        sort_order: draft.sortOrder,
      };
      const { error: saveError } = await supabase.from("home_blocks").upsert(payload);
      if (saveError) throw saveError;
      setDraft(null);
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save this homepage section.");
    } finally {
      setBusy(false);
    }
  };

  const updateBlock = async (block: HomeBlock, changes: Partial<HomeBlock>) => {
    setError(null);
    try {
      const { error: updateError } = await supabase.from("home_blocks").upsert({
        id: block.id,
        block_type: changes.blockType ?? block.blockType,
        title: changes.title ?? block.title,
        settings: changes.settings ?? block.settings,
        is_visible: changes.isVisible ?? block.isVisible,
        sort_order: changes.sortOrder ?? block.sortOrder,
      });
      if (updateError) throw updateError;
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update this homepage section.");
    }
  };

  const moveBlock = async (index: number, direction: -1 | 1) => {
    const current = blocks[index];
    const neighbor = blocks[index + direction];
    if (!current || !neighbor) return;
    setError(null);
    try {
      const reordered = [...blocks];
      [reordered[index], reordered[index + direction]] = [
        reordered[index + direction]!,
        reordered[index]!,
      ];
      const updates = await Promise.all(
        reordered.map((block, order) =>
          supabase
            .from("home_blocks")
            .update({ sort_order: (order + 1) * 100 })
            .eq("id", block.id),
        ),
      );
      const failedUpdate = updates.find((result) => result.error);
      if (failedUpdate?.error) throw failedUpdate.error;
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reorder homepage sections.");
    }
  };

  const deleteBlock = async (block: HomeBlock) => {
    if (!confirm(`Remove "${block.title}" from the homepage?`)) return;
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("home_blocks")
        .delete()
        .eq("id", block.id);
      if (deleteError) throw deleteError;
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove this homepage section.");
    }
  };

  return (
    <section>
      <h1 className="font-syne text-3xl font-extrabold uppercase tracking-tight">Homepage Builder</h1>
      <p className="mt-2 max-w-3xl text-sm text-neutral-500">
        Add, edit, hide, duplicate, and reorder homepage sections. Existing modules keep using their
        content in the corresponding admin sections.
      </p>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 sm:flex-row">
        <select
          value={newType}
          onChange={(event) => setNewType(event.target.value as HomeBlockType)}
          className={`${fieldClass} mt-0 sm:max-w-sm`}
          aria-label="Section type to add"
        >
          {BLOCK_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addBlock}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-grotesk font-extrabold uppercase tracking-widest text-white"
        >
          <Plus className="h-4 w-4" /> Add section
        </button>
      </div>

      {loadError && <p className="mt-4 text-sm text-rose-600">{loadError.message}</p>}
      {categoriesError && (
        <p className="mt-4 text-sm text-rose-600">
          Could not load categories: {categoriesError.message}
        </p>
      )}
      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      {isLoading ? (
        <p className="mt-6 text-sm text-neutral-500">Loading homepage sections...</p>
      ) : (
        <div className="mt-4 space-y-2">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{block.title}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-neutral-500">
                  {displaySettings(block)}
                </p>
                {!block.isVisible && (
                  <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    Hidden from storefront
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void moveBlock(index, -1)}
                  disabled={index === 0}
                  className="rounded-lg border border-black/15 p-2 disabled:opacity-40"
                  aria-label={`Move ${block.title} up`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void moveBlock(index, 1)}
                  disabled={index === blocks.length - 1}
                  className="rounded-lg border border-black/15 p-2 disabled:opacity-40"
                  aria-label={`Move ${block.title} down`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void updateBlock(block, { isVisible: !block.isVisible })}
                  className="rounded-lg border border-black/15 p-2"
                  aria-label={block.isVisible ? `Hide ${block.title}` : `Show ${block.title}`}
                >
                  {block.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => duplicateBlock(block)}
                  className="rounded-lg border border-black/15 p-2"
                  aria-label={`Duplicate ${block.title}`}
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editBlock(block)}
                  className="rounded-lg border border-black/15 px-3 py-2 text-[11px] font-grotesk font-bold uppercase tracking-widest"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void deleteBlock(block)}
                  className="rounded-lg border border-rose-300 p-2 text-rose-600"
                  aria-label={`Remove ${block.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {!blocks.length && (
            <p className="rounded-xl border border-dashed border-black/20 p-6 text-center text-sm text-neutral-500">
              No homepage sections yet. Add one above to start building your page.
            </p>
          )}
        </div>
      )}

      {draft && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6">
            <h2 className="mb-1 font-syne text-xl font-extrabold uppercase tracking-tight">
              {draft.id ? "Edit section" : "Add section"}
            </h2>
            <p className="mb-5 text-xs text-neutral-500">
              {BLOCK_OPTIONS.find((option) => option.value === draft.blockType)?.label}
            </p>
            <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
              <label className="block text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
                Section name in admin
                <input
                  className={fieldClass}
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  placeholder="Name this section"
                />
              </label>

              {(draft.blockType === "category" || draft.blockType === "product_grid") && (
                <>
                  {draft.blockType === "category" ? (
                    <label className="block text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
                      Category
                      <select
                        className={fieldClass}
                        value={String(draft.settings["categorySlug"] ?? "")}
                        onChange={(event) => patchSettings("categorySlug", event.target.value)}
                      >
                        <option value="">Choose category</option>
                        {categories.map((category) => (
                          <option key={category.slug} value={category.slug}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <label className="block text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
                      Products to show
                      <select
                        className={fieldClass}
                        value={String(draft.settings["source"] ?? "all")}
                        onChange={(event) => patchSettings("source", event.target.value)}
                      >
                        <option value="all">All published products</option>
                        <option value="category">One category</option>
                        <option value="new">New arrivals</option>
                        <option value="best_seller">Best sellers</option>
                        <option value="sustainable">Sustainable products</option>
                      </select>
                    </label>
                  )}
                  {draft.blockType === "product_grid" &&
                    draft.settings["source"] === "category" && (
                      <label className="block text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
                        Category
                        <select
                          className={fieldClass}
                          value={String(draft.settings["categorySlug"] ?? "")}
                          onChange={(event) => patchSettings("categorySlug", event.target.value)}
                        >
                          <option value="">Choose category</option>
                          {categories.map((category) => (
                            <option key={category.slug} value={category.slug}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
                      Layout
                      <select
                        className={fieldClass}
                        value={String(draft.settings["layout"] ?? "carousel")}
                        onChange={(event) => patchSettings("layout", event.target.value)}
                      >
                        <option value="carousel">Horizontal carousel</option>
                        <option value="grid">Product grid</option>
                      </select>
                    </label>
                    <label className="block text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
                      Products per row
                      <select
                        className={fieldClass}
                        value={String(draft.settings["desktopColumns"] ?? 5)}
                        onChange={(event) =>
                          patchSettings("desktopColumns", Number(event.target.value))
                        }
                      >
                        {[2, 3, 4, 5, 6].map((count) => (
                          <option key={count} value={count}>
                            {count} columns
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="block text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
                    Maximum products (0 = all)
                    <input
                      className={fieldClass}
                      type="number"
                      min={0}
                      max={100}
                      value={Number(draft.settings["productLimit"] ?? 0)}
                      onChange={(event) =>
                        patchSettings("productLimit", Number(event.target.value))
                      }
                    />
                  </label>
                  <TextSetting
                    label="Eyebrow"
                    value={draft.settings["eyebrow"]}
                    onChange={(value) => patchSettings("eyebrow", value)}
                  />
                  <TextSetting
                    label="Heading"
                    value={draft.settings["heading"]}
                    onChange={(value) => patchSettings("heading", value)}
                  />
                  <TextSetting
                    label="Description"
                    value={draft.settings["description"]}
                    onChange={(value) => patchSettings("description", value)}
                    multiline
                  />
                  <TextSetting
                    label="Button label"
                    value={draft.settings["ctaLabel"]}
                    onChange={(value) => patchSettings("ctaLabel", value)}
                  />
                  <TextSetting
                    label="Button link"
                    value={draft.settings["ctaUrl"]}
                    onChange={(value) => patchSettings("ctaUrl", value)}
                  />
                </>
              )}

              {draft.blockType === "banner" && (
                <>
                  <label className="block text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
                    Banner layout
                    <select
                      className={fieldClass}
                      value={String(draft.settings["layout"] ?? "overlay")}
                      onChange={(event) => patchSettings("layout", event.target.value)}
                    >
                      <option value="overlay">Full image with text overlay</option>
                      <option value="split">Image and text side by side</option>
                    </select>
                  </label>
                  <label className="block text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
                    Background media
                    <select
                      className={fieldClass}
                      value={String(draft.settings["mediaType"] ?? "image")}
                      onChange={(event) => patchSettings("mediaType", event.target.value)}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </label>
                  <ImageUpload
                    value={String(draft.settings["image"] ?? "")}
                    onChange={(url) => patchSettings("image", url)}
                    label="Image / video poster"
                  />
                  <VideoUpload
                    value={String(draft.settings["videoUrl"] ?? "")}
                    onChange={(url) => patchSettings("videoUrl", url)}
                    label="Video upload or direct URL"
                  />
                  <TextSetting
                    label="Eyebrow"
                    value={draft.settings["eyebrow"]}
                    onChange={(value) => patchSettings("eyebrow", value)}
                  />
                  <TextSetting
                    label="Heading"
                    value={draft.settings["heading"]}
                    onChange={(value) => patchSettings("heading", value)}
                  />
                  <TextSetting
                    label="Description"
                    value={draft.settings["description"]}
                    onChange={(value) => patchSettings("description", value)}
                    multiline
                  />
                  <TextSetting
                    label="Button label"
                    value={draft.settings["ctaLabel"]}
                    onChange={(value) => patchSettings("ctaLabel", value)}
                  />
                  <TextSetting
                    label="Button link"
                    value={draft.settings["ctaUrl"]}
                    onChange={(value) => patchSettings("ctaUrl", value)}
                  />
                </>
              )}

              {!["category", "product_grid", "banner"].includes(draft.blockType) && (
                <p className="rounded-lg bg-neutral-50 p-3 text-xs leading-5 text-neutral-600">
                  This section uses the existing content managed in its corresponding admin section.
                  Here you can choose its position and visibility.
                </p>
              )}
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={draft.isVisible}
                  onChange={(event) =>
                    setDraft({ ...draft, isVisible: event.target.checked })
                  }
                />
                Show this section on the storefront
              </label>
            </div>

            {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-xl border border-black/15 px-4 py-2.5 text-xs font-grotesk font-extrabold uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveBlock()}
                disabled={busy}
                className="rounded-xl bg-black px-4 py-2.5 text-xs font-grotesk font-extrabold uppercase tracking-widest text-white disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save section"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const TextSetting: React.FC<{
  label: string;
  value: unknown;
  onChange: (value: string) => void;
  multiline?: boolean;
}> = ({ label, value, onChange, multiline = false }) => (
  <label className="block text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
    {label}
    {multiline ? (
      <textarea
        className={fieldClass}
        rows={3}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
      />
    ) : (
      <input
        className={fieldClass}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
      />
    )}
  </label>
);
