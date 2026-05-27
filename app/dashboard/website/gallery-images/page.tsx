"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaTrash } from "react-icons/fa";
import CloudinaryImageField from "../../../components/CloudinaryImageField";

const GALLERY_SLUGS = [
  "living-rooms",
  "bedrooms",
  "bathrooms",
  "kitchens",
  "restaurants",
  "offices",
  "retail",
  "projects",
];

type ImageRow = {
  id?: string;
  slug: string;
  url: string;
  label: string;
  order: number;
};

export default function GalleryImagesPage() {
  const [slug, setSlug] = useState(GALLERY_SLUGS[0]);
  const [rows, setRows] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/akkawi/gallery-images");
      const json = await res.json();
      if (json.success) {
        const all = (json.data || []) as ImageRow[];
        setRows(all.filter((r) => r.slug === slug));
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const updateRow = (index: number, key: keyof ImageRow, value: string | number) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], [key]: value };
    setRows(copy);
  };

  const addRow = () => {
    setRows([
      ...rows,
      { slug, url: "", label: "", order: rows.length },
    ]);
  };

  const saveRow = async (index: number) => {
    const row = rows[index];
    setSaving(true);
    try {
      const res = await fetch(
        row.id ? `/api/akkawi/gallery-images/${row.id}` : "/api/akkawi/gallery-images",
        {
          method: row.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row),
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");
      await fetchRows();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeRow = async (index: number) => {
    const row = rows[index];
    if (row.id) {
      if (!confirm("Delete this image?")) return;
      await fetch(`/api/akkawi/gallery-images/${row.id}`, { method: "DELETE" });
    }
    setRows(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <Link href="/dashboard" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Gallery photos</h1>
      <p className="text-gray-600 text-sm mb-6">
        Images for each gallery page and the projects portfolio.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {GALLERY_SLUGS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSlug(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${
              slug === s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {s.replace(/-/g, " ")}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mb-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
      >
        <FaPlus /> Add image
      </button>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row, index) => (
            <div key={row.id ?? index} className="bg-white border rounded-lg p-4 space-y-3">
              <CloudinaryImageField
                value={row.url}
                onChange={(url) => updateRow(index, "url", url)}
                label="Gallery image"
              />
              <input
                type="text"
                placeholder="Caption (projects page)"
                value={row.label}
                onChange={(e) => updateRow(index, "label", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Order"
                value={row.order}
                onChange={(e) => updateRow(index, "order", Number(e.target.value))}
                className="w-24 border rounded px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => saveRow(index)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-gray-500 text-sm">No images for this category yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
