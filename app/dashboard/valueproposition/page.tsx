"use client";

import { useEffect, useState } from 'react';

export default function ValuePropositionManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [sectionLabel, setSectionLabel] = useState('');
  const [heading, setHeading] = useState('');
  const [painPoints, setPainPoints] = useState<{ title: string; desc: string }[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/valueproposition');
      const json = await res.json();
      if (json.success) {
        const first = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setSectionLabel(first.sectionLabel || '');
          setHeading(first.heading || '');
          setPainPoints(first.painPoints || []);
        }
      }
    } catch (e) {
      console.error('Error fetching value proposition:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updatePainPoint = (index: number, field: string, val: string) => {
    const copy = [...painPoints];
    copy[index] = { ...copy[index], [field]: val };
    setPainPoints(copy);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { sectionLabel, heading, painPoints };

      const res = await fetch(recordId ? `/api/valueproposition/${recordId}` : '/api/valueproposition', {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
      if (!recordId && json?.data?.id) setRecordId(json.data.id);

      alert('Value Proposition saved successfully!');
    } catch (e) {
      console.error('Error saving value proposition:', e);
      alert('Error saving value proposition');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm('Are you sure you want to delete the value proposition content?')) return;
    try {
      const res = await fetch(`/api/valueproposition/${recordId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setRecordId(null);
      setSectionLabel('');
      setHeading('');
      setPainPoints([]);

      alert('Value Proposition deleted successfully!');
    } catch (e) {
      console.error('Error deleting value proposition:', e);
      alert('Error deleting value proposition');
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Value Proposition</h1>
          <p className="text-gray-600">Manage content for the value proposition section</p>
        </div>
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
              placeholder="Enter heading"
            />
          </div>
        </div>
      </div>

      {/* Pain Points */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Pain Points</h2>
        {painPoints.map((pp, i) => (
          <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Pain Point {i + 1}</span>
              <button
                onClick={() => setPainPoints(painPoints.filter((_, idx) => idx !== i))}
                className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                value={pp.title}
                onChange={(e) => updatePainPoint(i, 'title', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Pain point title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={pp.desc}
                onChange={(e) => updatePainPoint(i, 'desc', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Pain point description"
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => setPainPoints([...painPoints, { title: '', desc: '' }])}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-4 py-2 border border-blue-200 rounded-md hover:bg-blue-50 transition"
        >
          + Add Pain Point
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? 'Saving...' : recordId ? 'Save Data' : 'Create Value Proposition'}
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
          <p className="text-gray-500 text-sm">No Value Proposition record yet — fill the form and click &quot;Create Value Proposition&quot;.</p>
        </div>
      )}
    </div>
  );
}
