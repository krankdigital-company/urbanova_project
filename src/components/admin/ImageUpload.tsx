import React, { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const LOGO_IMAGE_ACCEPT = ".png,.jpg,.jpeg,.ico,image/png,image/jpeg,image/x-icon";
export const HERO_VIDEO_ACCEPT = ".mp4,.webm,.ogv,video/mp4,video/webm,video/ogg";

const uploadSiteFile = async (file: File): Promise<string> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your admin session has expired. Please sign in again.");

  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const result = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!response.ok) throw new Error(result.error || "Upload failed");
  if (!result.url) throw new Error("Upload did not return a file URL");
  return result.url;
};

export const uploadSiteImage = uploadSiteFile;

const btn =
  "px-3 py-2 rounded-lg border border-black/15 text-[11px] font-grotesk font-bold uppercase tracking-widest hover:bg-neutral-50 disabled:opacity-50";

interface SingleProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}

export const ImageUpload: React.FC<SingleProps> = ({
  value,
  onChange,
  accept = "image/*",
  label,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const pick = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      if (accept === LOGO_IMAGE_ACCEPT) {
        const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
        const validExtension = [".png", ".jpg", ".jpeg", ".ico"].includes(extension);
        const validMime = [
          "image/png",
          "image/jpeg",
          "image/x-icon",
          "image/vnd.microsoft.icon",
        ].includes(file.type);
        if (!validExtension || (file.type && !validMime)) {
          throw new Error("Please choose a PNG, JPG, or ICO icon file.");
        }
      }
      onChange(await uploadSiteImage(file));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-1">
      {label && (
        <span className="text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt=""
            className="w-16 h-16 rounded-lg object-cover border border-black/10 bg-neutral-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg border border-dashed border-black/20 bg-neutral-50" />
        )}
        <div className="flex-1 min-w-0 space-y-2">
          <input
            className="w-full px-3 py-2 rounded-lg bg-neutral-100 border border-black/10 text-xs outline-none focus:border-black"
            placeholder="Paste an image URL or upload"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className={btn}
              disabled={busy}
              onClick={() => ref.current?.click()}
            >
              {busy ? "Uploading..." : "Upload"}
            </button>
            {value && (
              <button type="button" className={btn} onClick={() => onChange("")}>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {err && <p className="text-xs text-rose-500 mt-1">{err}</p>}
    </div>
  );
};

export const VideoUpload: React.FC<SingleProps> = ({ value, onChange, label }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const pick = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const validExtension = [".mp4", ".webm", ".ogv"].includes(extension);
      const validMime = ["video/mp4", "video/webm", "video/ogg"].includes(file.type);
      if (!validExtension || (file.type && !validMime)) {
        throw new Error("Please choose an MP4, WebM, or OGV video.");
      }
      onChange(await uploadSiteFile(file));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div className="mt-1">
      {label && (
        <span className="text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
          {label}
        </span>
      )}
      {value && (
        <video
          src={value}
          className="mt-2 w-full max-h-40 rounded-lg border border-black/10 bg-black object-contain"
          controls
          preload="metadata"
        />
      )}
      <div className="mt-2 space-y-2">
        <input
          className="w-full px-3 py-2 rounded-lg bg-neutral-100 border border-black/10 text-xs outline-none focus:border-black"
          placeholder="Paste a direct MP4, WebM, or OGV video URL"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className={btn}
            disabled={busy}
            onClick={() => ref.current?.click()}
          >
            {busy ? "Uploading..." : "Upload video"}
          </button>
          {value && (
            <button type="button" className={btn} onClick={() => onChange("")}>
              Remove
            </button>
          )}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept={HERO_VIDEO_ACCEPT}
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {err && <p className="text-xs text-rose-500 mt-1">{err}</p>}
      <p className="mt-1 text-[11px] text-neutral-500">Maximum upload size: 100 MB.</p>
    </div>
  );
};

interface MultiProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export const MultiImageUpload: React.FC<MultiProps> = ({ value, onChange }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const list = Array.isArray(value) ? value : [];

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setErr(null);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await uploadSiteImage(f));
      onChange([...list, ...urls]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...list];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <div className="mt-1">
      <div className="flex flex-wrap gap-3">
        {list.map((url, i) => (
          <div key={`${url}-${i}`} className="w-24">
            <img
              src={url}
              alt=""
              className="w-24 h-24 rounded-lg object-cover border border-black/10 bg-neutral-100"
            />
            <div className="flex justify-between mt-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="text-[11px] px-1.5 py-0.5 border border-black/10 rounded"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => onChange(list.filter((_, k) => k !== i))}
                className="text-[11px] px-1.5 py-0.5 border border-rose-300 text-rose-600 rounded"
              >
                ×
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="text-[11px] px-1.5 py-0.5 border border-black/10 rounded"
              >
                →
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="w-24 h-24 rounded-lg border border-dashed border-black/25 text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
        >
          {busy ? "..." : "+ Add"}
        </button>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => add(e.target.files)}
      />
      {err && <p className="text-xs text-rose-500 mt-1">{err}</p>}
    </div>
  );
};

export interface DetailBlock {
  heading?: string;
  text?: string;
  image?: string;
}

export const BlocksEditor: React.FC<{
  value: DetailBlock[];
  onChange: (v: DetailBlock[]) => void;
}> = ({ value, onChange }) => {
  const list = Array.isArray(value) ? value : [];
  const patch = (i: number, p: Partial<DetailBlock>) =>
    onChange(list.map((b, k) => (k === i ? { ...b, ...p } : b)));

  return (
    <div className="mt-1 space-y-3">
      {list.map((b, i) => (
        <div key={i} className="rounded-xl border border-black/10 p-3 bg-neutral-50/60">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-grotesk font-extrabold uppercase tracking-widest text-neutral-400">
              Block {i + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(list.filter((_, k) => k !== i))}
              className="text-[11px] px-2 py-1 border border-rose-300 text-rose-600 rounded"
            >
              Remove
            </button>
          </div>
          <input
            className="w-full px-3 py-2 mb-2 rounded-lg bg-white border border-black/10 text-sm"
            placeholder="Heading (optional)"
            value={b.heading ?? ""}
            onChange={(e) => patch(i, { heading: e.target.value })}
          />
          <textarea
            className="w-full px-3 py-2 mb-2 rounded-lg bg-white border border-black/10 text-sm"
            rows={3}
            placeholder="Text (optional)"
            value={b.text ?? ""}
            onChange={(e) => patch(i, { text: e.target.value })}
          />
          <ImageUpload value={b.image ?? ""} onChange={(url) => patch(i, { image: url })} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, {}])} className={btn}>
        + Add block
      </button>
    </div>
  );
};
