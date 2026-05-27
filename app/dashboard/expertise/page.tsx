"use client";

import { useState, useEffect } from "react";

interface Tool {
  label: string;
  desc: string;
}

export default function ExpertiseManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  const [sectionLabel, setSectionLabel] = useState("");
  const [heading, setHeading] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [odooHeading, setOdooHeading] = useState("");
  const [odooDescription, setOdooDescription] = useState("");
  const [odooServices, setOdooServices] = useState<string[]>([]);

  const updateTool = (index: number, field: string, val: string) => {
    const copy = [...tools];
    copy[index] = { ...copy[index], [field]: val };
    setTools(copy);
  };
  const addTool = () => setTools([...tools, { label: "", desc: "" }]);
  const removeTool = (i: number) => setTools(tools.filter((_, idx) => idx !== i));

  const updateService = (index: number, val: string) => {
    const copy = [...odooServices];
    copy[index] = val;
    setOdooServices(copy);
  };
  const addService = () => setOdooServices([...odooServices, ""]);
  const removeService = (i: number) => setOdooServices(odooServices.filter((_, idx) => idx !== i));

  const fetchData = async () => {
    try {
      const res = await fetch("/api/expertise");
      const json = await res.json();
      if (json.success) {
        const first = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setSectionLabel(first.sectionLabel || "");
          setHeading(first.heading || "");
          setTools(first.tools || []);
          setOdooHeading(first.odooHeading || "");
          setOdooDescription(first.odooDescription || "");
          setOdooServices(first.odooServices || []);
        }
      }
    } catch (e) {
      console.error("Error fetching expertise:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { sectionLabel, heading, tools, odooHeading, odooDescription, odooServices };

      const res = await fetch(recordId ? `/api/expertise/${recordId}` : "/api/expertise", {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");
      if (!recordId && json?.data?.id) setRecordId(json.data.id);
      alert("Expertise saved successfully!");
    } catch (e) {
      console.error("Error saving expertise:", e);
      alert("Error saving expertise");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      const res = await fetch(`/api/expertise/${recordId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete");
      setRecordId(null);
      setSectionLabel("");
      setHeading("");
      setTools([]);
      setOdooHeading("");
      setOdooDescription("");
      setOdooServices([]);
      alert("Expertise deleted successfully!");
    } catch (e) {
      console.error("Error deleting expertise:", e);
      alert("Error deleting expertise");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expertise & Tools</h1>
        <p className="text-gray-600">Manage the Expertise & Tools section</p>
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
              placeholder="e.g. Our Expertise"
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
          <h2 className="text-xl font-semibold text-gray-800">Tools</h2>
          <button
            onClick={addTool}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 text-sm transition"
          >
            + Add Tool
          </button>
        </div>
        {tools.map((tool, i) => (
          <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={tool.label}
                onChange={(e) => updateTool(i, "label", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Tool label"
              />
              <input
                value={tool.desc}
                onChange={(e) => updateTool(i, "desc", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Tool description"
              />
            </div>
            <button
              onClick={() => removeTool(i)}
              className="bg-red-50 text-red-600 border border-red-200 px-3 py-2.5 rounded-md hover:bg-red-100 transition text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        {tools.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No tools added yet.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Odoo Section</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Odoo Heading</label>
          <input
            value={odooHeading}
            onChange={(e) => setOdooHeading(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Odoo heading"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Odoo Description</label>
          <textarea
            value={odooDescription}
            onChange={(e) => setOdooDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Odoo description text"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Odoo Services</h2>
          <button
            onClick={addService}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 text-sm transition"
          >
            + Add Service
          </button>
        </div>
        {odooServices.map((svc, i) => (
          <div key={i} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              value={svc}
              onChange={(e) => updateService(i, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Service bullet point"
            />
            <button
              onClick={() => removeService(i)}
              className="bg-red-50 text-red-600 border border-red-200 px-3 py-2.5 rounded-md hover:bg-red-100 transition text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        {odooServices.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No services added yet.</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? "Saving..." : recordId ? "Save Data" : "Create Expertise"}
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
          <p className="text-gray-500 text-sm">No Expertise record yet — fill the form and click &quot;Create Expertise&quot;.</p>
        </div>
      )}
    </div>
  );
}
