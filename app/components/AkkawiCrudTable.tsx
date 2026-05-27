"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaTrash } from "react-icons/fa";
import CloudinaryImageField from "./CloudinaryImageField";

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "image";
  wide?: boolean;
};

type AkkawiCrudTableProps = {
  apiPath: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  emptyRow: Record<string, string | number | boolean>;
};

export default function AkkawiCrudTable({
  apiPath,
  title,
  description,
  fields,
  emptyRow,
}: AkkawiCrudTableProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  const fetchRows = useCallback(async () => {
    try {
      const res = await fetch(apiPath);
      const json = await res.json();
      if (json.success) setRows(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [apiPath]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const updateRow = (index: number, key: string, value: string | number) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], [key]: value };
    setRows(copy);
  };

  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
  };

  const removeRow = async (index: number) => {
    const row = rows[index];
    if (row.id) {
      if (!confirm("Delete this item?")) return;
      await fetch(`${apiPath.split("?")[0]}/${row.id}`, { method: "DELETE" });
    }
    setRows(rows.filter((_, i) => i !== index));
  };

  const saveRow = async (index: number) => {
    const row = rows[index];
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      payload[f.key] = row[f.key];
    }

    setSaving(true);
    try {
      const base = apiPath.split("?")[0];
      const res = await fetch(row.id ? `${base}/${row.id}` : apiPath, {
        method: row.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");
      await fetchRows();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-gray-500">Loading…</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <Link
        href="/dashboard"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to dashboard
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 text-sm mt-1 max-w-xl">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 shrink-0"
        >
          <FaPlus /> Add item
        </button>
      </div>

      <div className="space-y-4">
        {rows.map((row, index) => (
          <div
            key={String(row.id ?? `new-${index}`)}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
          >
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">
              Item {index + 1}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map((f) => (
                <div
                  key={f.key}
                  className={f.wide ? "md:col-span-2" : undefined}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {f.label}
                  </label>
                  {f.type === "image" ? (
                    <CloudinaryImageField
                      value={String(row[f.key] ?? "")}
                      onChange={(url) => updateRow(index, f.key, url)}
                      label={f.label}
                    />
                  ) : f.type === "textarea" ? (
                    <textarea
                      value={String(row[f.key] ?? "")}
                      onChange={(e) => updateRow(index, f.key, e.target.value)}
                      rows={f.wide ? 4 : 2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={String(row[f.key] ?? "")}
                      onChange={(e) =>
                        updateRow(
                          index,
                          f.key,
                          f.type === "number"
                            ? Number(e.target.value)
                            : e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                type="button"
                disabled={saving}
                onClick={() => saveRow(index)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="flex items-center gap-1 text-red-600 px-3 py-2 text-sm hover:bg-red-50 rounded-md"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-gray-500 text-sm bg-white border rounded-lg p-8 text-center">
            No items yet. Click &quot;Add item&quot; to create one.
          </p>
        )}
      </div>
    </div>
  );
}
