"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Upload from '../../components/Upload';

export default function AboutManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [recordId, setRecordId] = useState<string | null>(null);
  const [sectionLabel, setSectionLabel] = useState('');
  const [heading, setHeading] = useState('');
  const [paragraph1, setParagraph1] = useState('');
  const [paragraph2, setParagraph2] = useState('');
  const [paragraph3, setParagraph3] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [stats, setStats] = useState<{ value: string; label: string }[]>([]);
  const [image, setImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/about');
      const json = await res.json();
      if (json.success) {
        const first = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setSectionLabel(first.sectionLabel || '');
          setHeading(first.heading || '');
          setParagraph1(first.paragraph1 || '');
          setParagraph2(first.paragraph2 || '');
          setParagraph3(first.paragraph3 || '');
          setCtaText(first.ctaText || '');
          setCtaLink(first.ctaLink || '');
          setStats(first.stats || []);
          setImage(first.image || '');
          setVideoUrl(first.videoUrl || '');
        }
      }
    } catch (e) {
      console.error('Error fetching about:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUploadImage = async (imageUrls: string[]) => {
    const first = imageUrls?.[0];
    if (first) setImage(first);
  };

  const updateStat = (index: number, field: string, val: string) => {
    const copy = [...stats];
    copy[index] = { ...copy[index], [field]: val };
    setStats(copy);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { sectionLabel, heading, paragraph1, paragraph2, paragraph3, ctaText, ctaLink, stats, image, videoUrl };

      const res = await fetch(recordId ? `/api/about/${recordId}` : '/api/about', {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
      if (!recordId && json?.data?.id) setRecordId(json.data.id);

      alert('About section saved successfully!');
    } catch (e) {
      console.error('Error saving about:', e);
      alert('Error saving about section');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm('Are you sure you want to delete the about content?')) return;
    try {
      const res = await fetch(`/api/about/${recordId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setRecordId(null);
      setSectionLabel('');
      setHeading('');
      setParagraph1('');
      setParagraph2('');
      setParagraph3('');
      setCtaText('');
      setCtaLink('');
      setStats([]);
      setImage('');
      setVideoUrl('');

      alert('About section deleted successfully!');
    } catch (e) {
      console.error('Error deleting about:', e);
      alert('Error deleting about section');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">About Section</h1>
          <p className="text-gray-600">Manage content for the about section</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Content Details</h2>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 1</label>
          <textarea
            value={paragraph1}
            onChange={(e) => setParagraph1(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter first paragraph"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 2</label>
          <textarea
            value={paragraph2}
            onChange={(e) => setParagraph2(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter second paragraph"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 3</label>
          <textarea
            value={paragraph3}
            onChange={(e) => setParagraph3(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter third paragraph"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
            <input
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. Learn More"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
            <input
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. /about"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Watch Intro Video URL</label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g. https://www.youtube.com/watch?v=... or https://vimeo.com/..."
          />
          <p className="text-xs text-gray-500 mt-1">YouTube or Vimeo link for the &quot;Watch Intro&quot; button in the About section</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Stats</h2>
        {stats.map((s, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input
              value={s.value}
              onChange={(e) => updateStat(i, 'value', e.target.value)}
              className="w-32 border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Value"
            />
            <input
              value={s.label}
              onChange={(e) => updateStat(i, 'label', e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Label"
            />
            <button
              onClick={() => setStats(stats.filter((_, idx) => idx !== i))}
              className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 border border-red-200 rounded-md hover:bg-red-50 transition"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => setStats([...stats, { value: '', label: '' }])}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-4 py-2 border border-blue-200 rounded-md hover:bg-blue-50 transition"
        >
          + Add Stat
        </button>
      </div>

      {/* Image */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5">Image</h2>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <Upload onFilesUpload={handleUploadImage} />
          {image && (
            <div className="relative w-full h-48 rounded-md overflow-hidden border">
              <Image src={image} alt="About image" fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? 'Saving...' : recordId ? 'Save Data' : 'Create About'}
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
          <p className="text-gray-500 text-sm">No About record yet — fill the form and click &quot;Create About&quot;.</p>
        </div>
      )}
    </div>
  );
}
