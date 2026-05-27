"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Upload from "../../components/Upload";

interface Differentiator {
  title: string;
  desc: string;
}

interface Counter {
  value: string;
  suffix: string;
  label: string;
}

export default function WhyNbsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  const [sectionLabel, setSectionLabel] = useState("");
  const [heading, setHeading] = useState("");
  const [differentiators, setDifferentiators] = useState<Differentiator[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [bgImage, setBgImage] = useState("");

  const updateDiff = (index: number, field: string, val: string) => {
    const copy = [...differentiators];
    copy[index] = { ...copy[index], [field]: val };
    setDifferentiators(copy);
  };
  const addDiff = () => setDifferentiators([...differentiators, { title: "", desc: "" }]);
  const removeDiff = (i: number) => setDifferentiators(differentiators.filter((_, idx) => idx !== i));

  const updateCounter = (index: number, field: string, val: string) => {
    const copy = [...counters];
    copy[index] = { ...copy[index], [field]: val };
    setCounters(copy);
  };
  const addCounter = () => setCounters([...counters, { value: "", suffix: "", label: "" }]);
  const removeCounter = (i: number) => setCounters(counters.filter((_, idx) => idx !== i));

  const fetchData = async () => {
    try {
      const res = await fetch("/api/whynbs");
      const json = await res.json();
      if (json.success) {
        const first = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setSectionLabel(first.sectionLabel || "");
          setHeading(first.heading || "");
          setDifferentiators(first.differentiators || []);
          setCounters(first.counters || []);
          setBgImage(first.bgImage || "");
        }
      }
    } catch (e) {
      console.error("Error fetching whynbs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBgUpload = async (imageUrls: string[]) => {
    const first = imageUrls?.[0];
    if (first) setBgImage(first);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { sectionLabel, heading, differentiators, counters, bgImage };

      const res = await fetch(recordId ? `/api/whynbs/${recordId}` : "/api/whynbs", {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");
      if (!recordId && json?.data?.id) setRecordId(json.data.id);
      alert("Why NBS saved successfully!");
    } catch (e) {
      console.error("Error saving whynbs:", e);
      alert("Error saving Why NBS");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      const res = await fetch(`/api/whynbs/${recordId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete");
      setRecordId(null);
      setSectionLabel("");
      setHeading("");
      setDifferentiators([]);
      setCounters([]);
      setBgImage("");
      alert("Why NBS deleted successfully!");
    } catch (e) {
      console.error("Error deleting whynbs:", e);
      alert("Error deleting Why NBS");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Why NBS</h1>
        <p className="text-gray-600">Manage the Why NBS section</p>
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
              placeholder="e.g. Why Choose Us"
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
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Differentiators</h2>
          <button
            onClick={addDiff}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 text-sm transition"
          >
            + Add Differentiator
          </button>
        </div>
        {differentiators.map((diff, i) => (
          <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={diff.title}
                onChange={(e) => updateDiff(i, "title", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Title"
              />
              <input
                value={diff.desc}
                onChange={(e) => updateDiff(i, "desc", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Description"
              />
            </div>
            <button
              onClick={() => removeDiff(i)}
              className="bg-red-50 text-red-600 border border-red-200 px-3 py-2.5 rounded-md hover:bg-red-100 transition text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        {differentiators.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No differentiators added yet.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Counters</h2>
          <button
            onClick={addCounter}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 text-sm transition"
          >
            + Add Counter
          </button>
        </div>
        {counters.map((counter, i) => (
          <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={counter.value}
                onChange={(e) => updateCounter(i, "value", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Value (e.g. 50)"
              />
              <input
                value={counter.suffix}
                onChange={(e) => updateCounter(i, "suffix", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Suffix (e.g. +)"
              />
              <input
                value={counter.label}
                onChange={(e) => updateCounter(i, "label", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Label (e.g. Projects)"
              />
            </div>
            <button
              onClick={() => removeCounter(i)}
              className="bg-red-50 text-red-600 border border-red-200 px-3 py-2.5 rounded-md hover:bg-red-100 transition text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        {counters.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No counters added yet.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Background Image</h2>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <Upload onFilesUpload={handleBgUpload} />
          {bgImage && (
            <div className="relative w-full h-48 rounded-md overflow-hidden border">
              <Image src={bgImage} alt="Background" fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? "Saving..." : recordId ? "Save Data" : "Create Why NBS"}
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
          <p className="text-gray-500 text-sm">No Why NBS record yet — fill the form and click &quot;Create Why NBS&quot;.</p>
        </div>
      )}
    </div>
  );
}
