"use client";

import { useEffect, useState } from 'react';

export default function CompanyProfileManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [sectionLabel, setSectionLabel] = useState('');
  const [heading, setHeading] = useState('');
  const [pillar1Title, setPillar1Title] = useState('');
  const [pillar1Text, setPillar1Text] = useState('');
  const [pillar2Title, setPillar2Title] = useState('');
  const [pillar2Text, setPillar2Text] = useState('');
  const [pillar3Title, setPillar3Title] = useState('');
  const [pillar3Text, setPillar3Text] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/companyprofile');
      const json = await res.json();
      if (json.success) {
        const first = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setSectionLabel(first.sectionLabel || '');
          setHeading(first.heading || '');
          setPillar1Title(first.pillar1Title || '');
          setPillar1Text(first.pillar1Text || '');
          setPillar2Title(first.pillar2Title || '');
          setPillar2Text(first.pillar2Text || '');
          setPillar3Title(first.pillar3Title || '');
          setPillar3Text(first.pillar3Text || '');
        }
      }
    } catch (e) {
      console.error('Error fetching company profile:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        sectionLabel, heading,
        pillar1Title, pillar1Text,
        pillar2Title, pillar2Text,
        pillar3Title, pillar3Text,
      };

      const res = await fetch(recordId ? `/api/companyprofile/${recordId}` : '/api/companyprofile', {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
      if (!recordId && json?.data?.id) setRecordId(json.data.id);

      alert('Company Profile saved successfully!');
    } catch (e) {
      console.error('Error saving company profile:', e);
      alert('Error saving company profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm('Are you sure you want to delete the company profile content?')) return;
    try {
      const res = await fetch(`/api/companyprofile/${recordId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setRecordId(null);
      setSectionLabel('');
      setHeading('');
      setPillar1Title('');
      setPillar1Text('');
      setPillar2Title('');
      setPillar2Text('');
      setPillar3Title('');
      setPillar3Text('');

      alert('Company Profile deleted successfully!');
    } catch (e) {
      console.error('Error deleting company profile:', e);
      alert('Error deleting company profile');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Profile</h1>
          <p className="text-gray-600">Manage content for the company profile section</p>
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
              placeholder="e.g. About Us"
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Pillar 1</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            value={pillar1Title}
            onChange={(e) => setPillar1Title(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Pillar 1 title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
          <textarea
            value={pillar1Text}
            onChange={(e) => setPillar1Text(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Pillar 1 text"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Pillar 2</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            value={pillar2Title}
            onChange={(e) => setPillar2Title(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Pillar 2 title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
          <textarea
            value={pillar2Text}
            onChange={(e) => setPillar2Text(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Pillar 2 text"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Pillar 3</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            value={pillar3Title}
            onChange={(e) => setPillar3Title(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Pillar 3 title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
          <textarea
            value={pillar3Text}
            onChange={(e) => setPillar3Text(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Pillar 3 text"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? 'Saving...' : recordId ? 'Save Data' : 'Create Company Profile'}
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
          <p className="text-gray-500 text-sm">No Company Profile record yet — fill the form and click &quot;Create Company Profile&quot;.</p>
        </div>
      )}
    </div>
  );
}
