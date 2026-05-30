"use client";

import { useCallback, useEffect, useState } from "react";
import CloudinaryImageField from "./CloudinaryImageField";
import StringListEditor from "./StringListEditor";
import PhoneListEditor from "./PhoneListEditor";
import SocialListEditor from "./SocialListEditor";
import PillarListEditor from "./PillarListEditor";
import NavLinksEditor from "./NavLinksEditor";

type FieldDef = {
  key: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "image"
    | "video"
    | "file"
    | "string-list"
    | "phone-list"
    | "social-list"
    | "pillar-list"
    | "nav-links";
  wide?: boolean;
  hint?: string;
};

type SiteContentSectionFormProps = {
  title: string;
  description?: string;
  fields: FieldDef[];
};

export default function SiteContentSectionForm({
  title,
  description,
  fields,
}: SiteContentSectionFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
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

  const set = (key: string, val: string) =>
    setValues((v) => ({ ...v, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setSaveMessage("");
    try {
      const items = fields.map((f) => ({
        key: f.key,
        value: values[f.key] ?? "",
      }));
      const res = await fetch("/api/akkawi/site-content/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");
      setSaved(true);
      if (json.revalidated === false) {
        setSaveMessage(
          "Saved to database, but the live website could not be refreshed. Set WEBSITE_URL on the dashboard host to your public site URL."
        );
      } else {
        setSaveMessage("Saved! The website should update within a few seconds.");
      }
      setTimeout(() => {
        setSaved(false);
        setSaveMessage("");
      }, 5000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (f: FieldDef) => {
    const val = values[f.key] ?? "";

    switch (f.type) {
      case "image":
        return (
          <CloudinaryImageField
            value={val}
            onChange={(url) => set(f.key, url)}
            label={f.label}
            accept="image"
          />
        );
      case "video":
        return (
          <CloudinaryImageField
            value={val}
            onChange={(url) => set(f.key, url)}
            label={f.label}
            accept="video"
          />
        );
      case "file":
        return (
          <CloudinaryImageField
            value={val}
            onChange={(url) => set(f.key, url)}
            label={f.label}
            accept="any"
          />
        );
      case "string-list":
        return <StringListEditor value={val} onChange={(j) => set(f.key, j)} />;
      case "phone-list":
        return <PhoneListEditor value={val} onChange={(j) => set(f.key, j)} />;
      case "social-list":
        return <SocialListEditor value={val} onChange={(j) => set(f.key, j)} />;
      case "pillar-list":
        return <PillarListEditor value={val} onChange={(j) => set(f.key, j)} />;
      case "nav-links":
        return <NavLinksEditor value={val} onChange={(j) => set(f.key, j)} />;
      case "textarea":
        return (
          <textarea
            value={val}
            onChange={(e) => set(f.key, e.target.value)}
            rows={f.wide ? 6 : 3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        );
      default:
        return (
          <input
            type="text"
            value={val}
            onChange={(e) => set(f.key, e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-gray-500">
        Loading page content…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
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
            {renderField(f)}
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
          {saved && saveMessage && (
            <span
              className={`text-sm font-medium ${
                saveMessage.includes("could not")
                  ? "text-amber-700"
                  : "text-green-600"
              }`}
            >
              {saveMessage}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
