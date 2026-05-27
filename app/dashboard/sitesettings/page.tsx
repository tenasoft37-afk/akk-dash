"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SECTION_VISIBILITY, SECTION_META, mergeVisibility } from "../../constants/sectionVisibility";

type VisibilityState = Record<string, boolean>;

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<VisibilityState>({ ...DEFAULT_SECTION_VISIBILITY });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/sitesettings");
      const json = await res.json();
      if (json.success) {
        setRecordId(json.data?.id ?? null);
        setVisibility(mergeVisibility(json.data?.visibility));
      }
    } catch (e) {
      console.error("Error fetching site settings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggle = (key: string) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setAll = (value: boolean) => {
    const next: VisibilityState = {};
    for (const key of Object.keys(DEFAULT_SECTION_VISIBILITY)) {
      next[key] = value;
    }
    setVisibility(next);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(recordId ? `/api/sitesettings/${recordId}` : "/api/sitesettings", {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");
      if (!recordId && json?.data?.id) setRecordId(json.data.id);
      alert("Section visibility saved! Changes appear on the live site after refresh.");
    } catch (e) {
      console.error(e);
      alert("Error saving section visibility");
    } finally {
      setSaving(false);
    }
  };

  const visibleCount = Object.values(visibility).filter(Boolean).length;
  const totalCount = SECTION_META.length;

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-72 rounded bg-gray-300" />
          <div className="h-64 rounded-lg bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Section Visibility</h1>
        <p className="text-gray-600">
          Show or hide whole sections on the public website. Hidden sections are removed from the
          page and navigation ({visibleCount} of {totalCount} visible).
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAll(true)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Show all
        </button>
        <button
          type="button"
          onClick={() => setAll(false)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Hide all
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100 mb-8">
        {SECTION_META.map((section) => {
          const on = visibility[section.key] !== false;
          return (
            <div
              key={section.key}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">{section.label}</p>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => toggle(section.key)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  on ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition ${
                    on ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <p className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        Tip: Keep <strong>Hero</strong> visible unless you have another entry point. Hiding{" "}
        <strong>Contact & Footer</strong> also removes phone / &quot;Let&apos;s Talk&quot; from the
        navigation bar.
      </p>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
      >
        {saving ? "Saving..." : "Save visibility"}
      </button>
    </div>
  );
}

