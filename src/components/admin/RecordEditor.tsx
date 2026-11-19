import React, { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload, MultiImageUpload, BlocksEditor, VideoUpload } from "./ImageUpload";

export interface FieldDef {
  key: string;
  label: string;
  type?:
    | "text"
    | "password"
    | "textarea"
    | "number"
    | "boolean"
    | "json"
    | "image"
    | "video"
    | "images"
    | "blocks"
    | "select";
  options?: { value: string; label: string }[];
}

interface RecordEditorProps {
  table: string;
  title: string;
  pk?: string;
  fields: FieldDef[];
  rows: any[];
  onChanged: () => void;
  newIdPrefix?: string;
  /** false for tables whose primary key is a uuid with a database default */
  generateId?: boolean;
  bulkActions?: boolean;
  onSaveRecord?: (payload: any) => Promise<void>;
  onDeleteRecord?: (id: string) => Promise<void>;
}

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-neutral-100 border border-black/10 text-sm outline-none focus:border-black";

export const RecordEditor: React.FC<RecordEditorProps> = ({
  table,
  title,
  pk = "id",
  fields,
  rows,
  onChanged,
  newIdPrefix,
  generateId = true,
  bulkActions = false,
  onSaveRecord,
  onDeleteRecord,
}) => {
  const [editing, setEditing] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blank = useMemo(() => {
    const o: any = {};
    fields.forEach((f) => {
      o[f.key] =
        f.type === "boolean"
          ? true
          : f.type === "number"
            ? 0
            : f.type === "select" && f.key === "media_type"
              ? "image"
              : f.type === "json"
                ? "[]"
                : f.type === "images" || f.type === "blocks"
                  ? []
                  : "";
    });
    return o;
  }, [fields]);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload: any = {};
      fields.forEach((f) => {
        const v = editing[f.key];
        if (f.type === "images" || f.type === "blocks") {
          payload[f.key] = Array.isArray(v) ? v : [];
        } else if (f.type === "json") {
          payload[f.key] = typeof v === "string" ? JSON.parse(v || "[]") : v;
        } else if (f.type === "number") {
          payload[f.key] = v === "" || v === null ? null : Number(v);
        } else {
          payload[f.key] = v;
        }
      });
      if (editing[pk]) payload[pk] = editing[pk];
      else if (generateId) payload[pk] = `${newIdPrefix ?? table}-${Date.now().toString(36)}`;

      if (onSaveRecord) await onSaveRecord(payload);
      else {
        const { error: err } = await supabase.from(table as any).upsert(payload);
        if (err) throw err;
      }
      setEditing(null);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    try {
      if (onDeleteRecord) await onDeleteRecord(id);
      else {
        const { error: err } = await supabase
          .from(table as any)
          .delete()
          .eq(pk, id);
        if (err) throw err;
      }
      onChanged();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const removeSelected = async () => {
    if (!selectedIds.length || !confirm(`Delete ${selectedIds.length} selected records?`)) return;
    setBusy(true);
    try {
      const { error: err } = await supabase
        .from(table as any)
        .delete()
        .in(pk, selectedIds);
      if (err) throw err;
      setSelectedIds([]);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk delete failed");
    } finally {
      setBusy(false);
    }
  };

  const startDuplicate = (row: any) => {
    const draft: any = { ...row };
    delete draft[pk];
    fields.forEach((f) => {
      if (f.type === "json") draft[f.key] = JSON.stringify(row[f.key] ?? [], null, 2);
      if (f.type === "images" || f.type === "blocks") {
        draft[f.key] = Array.isArray(row[f.key]) ? [...row[f.key]] : [];
      }
    });
    setEditing(draft);
  };

  const startEdit = (row: any) => {
    const draft: any = { ...row };
    fields.forEach((f) => {
      if (f.type === "json") draft[f.key] = JSON.stringify(row[f.key] ?? [], null, 2);
      if (f.type === "images" || f.type === "blocks")
        draft[f.key] = Array.isArray(row[f.key]) ? row[f.key] : [];
    });
    setEditing(draft);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne text-2xl font-extrabold uppercase tracking-tight">{title}</h2>
        <div className="flex items-center gap-2">
          {bulkActions && selectedIds.length > 0 && (
            <button
              onClick={removeSelected}
              disabled={busy}
              className="px-4 py-2.5 border border-rose-300 text-rose-600 rounded-xl text-xs font-grotesk font-extrabold uppercase tracking-widest disabled:opacity-50"
            >
              Delete selected ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setEditing({ ...blank })}
            className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-grotesk font-extrabold uppercase tracking-widest"
          >
            Add new
          </button>
        </div>
      </div>

      {bulkActions && rows.length > 0 && (
        <label className="mb-3 flex items-center gap-2 text-xs font-grotesk font-bold uppercase tracking-widest text-neutral-500">
          <input
            type="checkbox"
            checked={selectedIds.length === rows.length}
            onChange={(event) =>
              setSelectedIds(event.target.checked ? rows.map((row) => String(row[pk])) : [])
            }
          />
          Select all
        </label>
      )}

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row[pk]}
            className="flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-white px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              {bulkActions && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(String(row[pk]))}
                  onChange={(event) =>
                    setSelectedIds((current) =>
                      event.target.checked
                        ? [...current, String(row[pk])]
                        : current.filter((id) => id !== String(row[pk])),
                    )
                  }
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-sans font-semibold truncate">
                  {row[fields[0]!.key] || row[pk]}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">{row[pk]}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => startEdit(row)}
                className="px-3 py-2 border border-black/15 rounded-lg text-[11px] font-grotesk font-bold uppercase tracking-widest"
              >
                Edit
              </button>
              {bulkActions && (
                <button
                  onClick={() => startDuplicate(row)}
                  className="px-3 py-2 border border-black/15 rounded-lg text-[11px] font-grotesk font-bold uppercase tracking-widest"
                >
                  Duplicate
                </button>
              )}
              <button
                onClick={() => remove(row[pk])}
                className="px-3 py-2 border border-rose-300 text-rose-600 rounded-lg text-[11px] font-grotesk font-bold uppercase tracking-widest"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-neutral-500">Nothing here yet.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 my-8">
            <h3 className="font-grotesk font-extrabold uppercase tracking-widest text-sm mb-5">
              {editing[pk] ? "Edit" : "New"} {title}
            </h3>
            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              {fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="text-[11px] font-grotesk font-bold uppercase tracking-widest text-neutral-500">
                    {f.label}
                  </span>
                  {f.type === "image" ? (
                    <ImageUpload
                      value={editing[f.key] ?? ""}
                      onChange={(url) => setEditing({ ...editing, [f.key]: url })}
                    />
                  ) : f.type === "video" ? (
                    <VideoUpload
                      value={editing[f.key] ?? ""}
                      onChange={(url) => setEditing({ ...editing, [f.key]: url })}
                    />
                  ) : f.type === "images" ? (
                    <MultiImageUpload
                      value={editing[f.key] ?? []}
                      onChange={(urls) => setEditing({ ...editing, [f.key]: urls })}
                    />
                  ) : f.type === "blocks" ? (
                    <BlocksEditor
                      value={editing[f.key] ?? []}
                      onChange={(v) => setEditing({ ...editing, [f.key]: v })}
                    />
                  ) : f.type === "boolean" ? (
                    <div className="mt-1">
                      <input
                        type="checkbox"
                        checked={!!editing[f.key]}
                        onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })}
                      />
                    </div>
                  ) : f.type === "select" ? (
                    <select
                      className={`${inputCls} mt-1`}
                      value={editing[f.key] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    >
                      <option value="">Select {f.label.toLowerCase()}</option>
                      {(f.options ?? []).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "textarea" || f.type === "json" ? (
                    <textarea
                      className={`${inputCls} mt-1 font-mono text-xs`}
                      rows={f.type === "json" ? 6 : 3}
                      value={editing[f.key] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      className={`${inputCls} mt-1`}
                      type={
                        f.type === "number" ? "number" : f.type === "password" ? "password" : "text"
                      }
                      value={editing[f.key] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    />
                  )}
                </label>
              ))}
            </div>

            {error && <p className="text-xs text-rose-500 mt-3">{error}</p>}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2.5 border border-black/15 rounded-xl text-xs font-grotesk font-extrabold uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={busy}
                className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-grotesk font-extrabold uppercase tracking-widest disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
