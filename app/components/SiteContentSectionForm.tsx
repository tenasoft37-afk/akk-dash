"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CloudinaryImageField from "./CloudinaryImageField";

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image";
  wide?: boolean;
  hint?: string;
};

type SiteContentSectionFormProps = {
  title: string;
  description?: string;
  fields: FieldDef[];
  backHref?: string;
};

export default function SiteContentSectionForm({
  title,
  description,
  fields,
  backHref = "/dashboard",
}: SiteContentSectionFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/akkawi/site-content/batch");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Load failed");
      const map = json.data as Record<string, string>;
      const initial: Record<string, string> = {};
      for (const f of fields) {
        initial[f.key] = map[f.key] ?? "";
      }
      setValues(initial);
    } catch (e) {
      console.error(e);
      alert("Could not load content. Check database connection.");
    } finally {
      setLoading(false);
    }
  }, [fields]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const items = fields.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
      const res = await fetch("/api/akkawi/site-content/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-gray-500">Loading page content…</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <Link
        href={backHref}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      {description && (
        <p className="text-gray-600 text-sm mb-8">{description}</p>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-5"
      >
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {f.label}
            </label>
            {f.hint && (
              <p className="text-xs text-gray-400 mb-1.5">{f.hint}</p>
            )}
            {f.type === "image" ? (
              <CloudinaryImageField
                value={values[f.key] ?? ""}
                onChange={(url) =>
                  setValues((v) => ({ ...v, [f.key]: url }))
                }
                label={f.label}
              />
            ) : f.type === "textarea" ? (
              <textarea
                value={values[f.key] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value }))
                }
                rows={f.wide ? 6 : 3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
              />
            ) : (
              <input
                type="text"
                value={values[f.key] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && (
            <span className="text-green-600 text-sm font-medium">
              Saved! Website updates within ~1 minute.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
