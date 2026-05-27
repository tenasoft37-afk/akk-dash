"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Upload from "../../components/Upload";

interface IndustryItem {
  label: string;
  tag: string;
  image: string;
}

export default function IndustriesManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  const [sectionLabel, setSectionLabel] = useState("");
  const [heading, setHeading] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [spotlightTitle, setSpotlightTitle] = useState("");
  const [spotlightDesc, setSpotlightDesc] = useState("");
  const [spotlightImage, setSpotlightImage] = useState("");
  const [fmcgServices, setFmcgServices] = useState<string[]>([]);
  const [items, setItems] = useState<IndustryItem[]>([]);

  const updateFmcg = (index: number, val: string) => {
    const copy = [...fmcgServices];
    copy[index] = val;
    setFmcgServices(copy);
  };
  const addFmcg = () => setFmcgServices([...fmcgServices, ""]);
  const removeFmcg = (i: number) => setFmcgServices(fmcgServices.filter((_, idx) => idx !== i));

  const updateItem = (index: number, field: string, val: string) => {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: val };
    setItems(copy);
  };
  const addItem = () => setItems([...items, { label: "", tag: "", image: "" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const fetchData = async () => {
    try {
      const res = await fetch("/api/industries");
      const json = await res.json();
      if (json.success) {
        const first = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setSectionLabel(first.sectionLabel || "");
          setHeading(first.heading || "");
          setSubtitle(first.subtitle || "");
          setSpotlightTitle(first.spotlightTitle || "");
          setSpotlightDesc(first.spotlightDesc || "");
          setSpotlightImage(first.spotlightImage || "");
          setFmcgServices(first.fmcgServices || []);
          setItems(first.items || []);
        }
      }
    } catch (e) {
      console.error("Error fetching industries:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSpotlightUpload = async (imageUrls: string[]) => {
    const first = imageUrls?.[0];
    if (first) setSpotlightImage(first);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { sectionLabel, heading, subtitle, spotlightTitle, spotlightDesc, spotlightImage, fmcgServices, items };

      const res = await fetch(recordId ? `/api/industries/${recordId}` : "/api/industries", {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");
      if (!recordId && json?.data?.id) setRecordId(json.data.id);
      alert("Industries saved successfully!");
    } catch (e) {
      console.error("Error saving industries:", e);
      alert("Error saving industries");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      const res = await fetch(`/api/industries/${recordId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete");
      setRecordId(null);
      setSectionLabel("");
      setHeading("");
      setSubtitle("");
      setSpotlightTitle("");
      setSpotlightDesc("");
      setSpotlightImage("");
      setFmcgServices([]);
      setItems([]);
      alert("Industries deleted successfully!");
    } catch (e) {
      console.error("Error deleting industries:", e);
      alert("Error deleting industries");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Industries</h1>
        <p className="text-gray-600">Manage the Industries section</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Section Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Label</label>
            <input
              value={sectionLabel}
              onChange={(e) => setSectionLabel(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. Industries"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Main heading"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Section subtitle"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Spotlight</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spotlight Title</label>
            <input
              value={spotlightTitle}
              onChange={(e) => setSpotlightTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Spotlight title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spotlight Description</label>
            <textarea
              value={spotlightDesc}
              onChange={(e) => setSpotlightDesc(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Spotlight description"
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Spotlight Image</h3>
          <Upload onFilesUpload={handleSpotlightUpload} />
          {spotlightImage && (
            <div className="relative w-full h-48 rounded-md overflow-hidden border">
              <Image src={spotlightImage} alt="Spotlight" fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">FMCG Services</h2>
          <button
            onClick={addFmcg}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 text-sm transition"
          >
            + Add Service
          </button>
        </div>
        {fmcgServices.map((svc, i) => (
          <div key={i} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              value={svc}
              onChange={(e) => updateFmcg(i, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="FMCG service"
            />
            <button
              onClick={() => removeFmcg(i)}
              className="bg-red-50 text-red-600 border border-red-200 px-3 py-2.5 rounded-md hover:bg-red-100 transition text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        {fmcgServices.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No FMCG services added yet.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Industry Items</h2>
          <button
            onClick={addItem}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 text-sm transition"
          >
            + Add Item
          </button>
        </div>
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-600">Industry {i + 1}</span>
              <button onClick={() => removeItem(i)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-md hover:bg-red-100 transition text-sm">Remove</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Label" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                <input value={item.tag} onChange={(e) => updateItem(i, "tag", e.target.value)} className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Tag" />
              </div>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <Upload onFilesUpload={(urls: string[]) => { if (urls?.[0]) updateItem(i, 'image', urls[0]); }} />
              {item.image && (
                <div className="relative w-full h-40 rounded-md overflow-hidden border">
                  <Image src={item.image} alt={item.label || 'Industry'} fill className="object-cover" />
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No industry items added yet.</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? "Saving..." : recordId ? "Save Data" : "Create Industries"}
        </button>
        {recordId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Entire Section
          </button>
        )}
      </div>

      {!recordId && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No Industries record yet — fill the form and click &quot;Create Industries&quot;.</p>
        </div>
      )}
    </div>
  );
}
