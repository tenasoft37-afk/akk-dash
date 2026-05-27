"use client";

import { useEffect, useState } from 'react';
import Upload from '../../components/Upload';
import Image from 'next/image';

export default function ServicesManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [sectionLabel, setSectionLabel] = useState('');
  const [heading, setHeading] = useState('');
  const [items, setItems] = useState<{ step: string; title: string; shortDesc: string; desc: string; image: string; learnMoreLink: string }[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/services');
      const json = await res.json();
      if (json.success) {
        const first = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setSectionLabel(first.sectionLabel || '');
          setHeading(first.heading || '');
          setItems(first.items || []);
        }
      }
    } catch (e) {
      console.error('Error fetching services:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateItem = (index: number, field: string, val: string) => {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: val };
    setItems(copy);
  };

  const addItem = () => {
    const nextStep = String(items.length + 1).padStart(2, '0');
    setItems([...items, { step: nextStep, title: '', shortDesc: '', desc: '', image: '', learnMoreLink: '' }]);
  };

  const removeItem = (index: number) => {
    const filtered = items.filter((_, i) => i !== index);
    const renumbered = filtered.map((item, i) => ({
      ...item,
      step: String(i + 1).padStart(2, '0'),
    }));
    setItems(renumbered);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { sectionLabel, heading, items };

      const res = await fetch(recordId ? `/api/services/${recordId}` : '/api/services', {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
      if (!recordId && json?.data?.id) setRecordId(json.data.id);

      alert('Services saved successfully!');
    } catch (e) {
      console.error('Error saving services:', e);
      alert('Error saving services');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm('Are you sure you want to delete the services content?')) return;
    try {
      const res = await fetch(`/api/services/${recordId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setRecordId(null);
      setSectionLabel('');
      setHeading('');
      setItems([]);

      alert('Services deleted successfully!');
    } catch (e) {
      console.error('Error deleting services:', e);
      alert('Error deleting services');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Services</h1>
          <p className="text-gray-600">Manage content for the services section</p>
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
              placeholder="e.g. Our Services"
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

      {/* Service Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Service Items</h2>
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-600">Step {item.step}</span>
              <button
                onClick={() => removeItem(i)}
                className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                value={item.title}
                onChange={(e) => updateItem(i, 'title', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Service title"
              />
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <Upload onFilesUpload={(urls: string[]) => { if (urls?.[0]) updateItem(i, 'image', urls[0]); }} />
              {item.image && (
                <div className="relative w-full h-40 rounded-md overflow-hidden border">
                  <Image src={item.image} alt={item.title || 'Service'} fill className="object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea
                value={item.shortDesc}
                onChange={(e) => updateItem(i, 'shortDesc', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 min-h-[60px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Brief description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
              <textarea
                value={item.desc}
                onChange={(e) => updateItem(i, 'desc', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Detailed description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Learn More Link (PDF/Document URL)</label>
              <input
                value={item.learnMoreLink || ''}
                onChange={(e) => updateItem(i, 'learnMoreLink', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g. https://example.com/document.pdf"
              />
              <p className="text-xs text-gray-500 mt-1">URL to a downloadable PDF or document for &quot;Learn More&quot;</p>
            </div>
          </div>
        ))}
        <button
          onClick={addItem}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-4 py-2 border border-blue-200 rounded-md hover:bg-blue-50 transition"
        >
          + Add Service Item
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? 'Saving...' : recordId ? 'Save Data' : 'Create Services'}
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
          <p className="text-gray-500 text-sm">No Services record yet — fill the form and click &quot;Create Services&quot;.</p>
        </div>
      )}
    </div>
  );
}
