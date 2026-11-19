import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload, LOGO_IMAGE_ACCEPT } from "./ImageUpload";

interface SiteSettingsEditorProps {
  value: Record<string, unknown>;
  onChanged: () => void;
}

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-neutral-100 border border-black/10 text-sm outline-none focus:border-black";

export const SiteSettingsEditor: React.FC<SiteSettingsEditorProps> = ({ value, onChanged }) => {
  const [editing, setEditing] = useState({ ...value });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEditing({ ...value });
  }, [value]);

  const update = (key: string, nextValue: unknown) =>
    setEditing((current) => ({ ...current, [key]: nextValue }));

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const { error: saveError } = await supabase
        .from("site_settings")
        .upsert({ key: "general", value: editing });
      if (saveError) throw saveError;
      onChanged();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : typeof e === "object" && e !== null && "message" in e
            ? String((e as { message: unknown }).message)
            : "Save failed",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h2 className="font-syne text-2xl font-extrabold uppercase tracking-tight">Site Settings</h2>
      <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
        Manage the storefront identity and the logo shown in the header and footer.
      </p>
      <div className="mt-6 max-w-2xl rounded-2xl border border-black/10 bg-white p-6 space-y-4">
        <label className="block">
          <span className="text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
            Brand
          </span>
          <input
            className={`${inputCls} mt-1`}
            value={(editing.brand as string) ?? ""}
            onChange={(e) => update("brand", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
            Tagline
          </span>
          <input
            className={`${inputCls} mt-1`}
            value={(editing.tagline as string) ?? ""}
            onChange={(e) => update("tagline", e.target.value)}
          />
        </label>
        <ImageUpload
          value={(editing.logo_url as string) ?? ""}
          onChange={(url) => update("logo_url", url)}
          accept={LOGO_IMAGE_ACCEPT}
          label="Header and footer logo"
        />
        <ImageUpload
          value={(editing.favicon_url as string) ?? ""}
          onChange={(url) => update("favicon_url", url)}
          accept={LOGO_IMAGE_ACCEPT}
          label="Browser favicon"
        />
        <label className="block">
          <span className="text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
            About text
          </span>
          <textarea
            className={`${inputCls} mt-1`}
            rows={4}
            value={(editing.about_text as string) ?? ""}
            onChange={(e) => update("about_text", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
            Copyright
          </span>
          <input
            className={`${inputCls} mt-1`}
            value={(editing.copyright as string) ?? ""}
            onChange={(e) => update("copyright", e.target.value)}
          />
        </label>
        {error && <p className="text-xs text-rose-500">{error}</p>}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-grotesk font-extrabold uppercase tracking-widest disabled:opacity-50"
          >
            {busy ? "Saving..." : "Save settings"}
          </button>
        </div>
      </div>
    </section>
  );
};
