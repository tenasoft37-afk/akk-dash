"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Upload from '../../components/Upload';

export default function HeroManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroId, setHeroId] = useState<string | null>(null);
  const [heading, setHeading] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [stats, setStats] = useState<{ value: string; label: string }[]>([]);
  const [image, setImage] = useState('');
  const [ctaText1, setCtaText1] = useState('');
  const [ctaLink1, setCtaLink1] = useState('');
  const [ctaText2, setCtaText2] = useState('');
  const [ctaLink2, setCtaLink2] = useState('');

  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero');
      const json = await res.json();
      if (json.success) {
        const first = (json.data || [])[0];
        if (first?.id) {
          setHeroId(first.id);
          setHeading(first.heading || '');
          setSubtitle(first.subtitle || '');
          setHighlights(first.highlights || []);
          setStats(first.stats || []);
          setImage(first.image || '');
          setCtaText1(first.ctaText1 || '');
          setCtaLink1(first.ctaLink1 || '');
          setCtaText2(first.ctaText2 || '');
          setCtaLink2(first.ctaLink2 || '');
        }
      }
    } catch (e) {
      console.error('Error fetching hero:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHero(); }, []);

  const handleUploadImage = async (imageUrls: string[]) => {
    const first = imageUrls?.[0];
    if (first) setImage(first);
  };

  const updateHighlight = (index: number, val: string) => {
    const copy = [...highlights];
    copy[index] = val;
    setHighlights(copy);
  };

  const updateStat = (index: number, field: string, val: string) => {
    const copy = [...stats];
    copy[index] = { ...copy[index], [field]: val };
    setStats(copy);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { heading, subtitle, highlights, stats, image, ctaText1, ctaLink1, ctaText2, ctaLink2 };

      const res = await fetch(heroId ? `/api/hero/${heroId}` : '/api/hero', {
        method: heroId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
      if (!heroId && json?.data?.id) setHeroId(json.data.id);

      alert('Hero saved successfully!');
    } catch (e) {
      console.error('Error saving hero:', e);
      alert('Error saving hero');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!heroId) return;
    if (!confirm('Are you sure you want to delete the hero content?')) return;
    try {
      const res = await fetch(`/api/hero/${heroId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete');

      setHeroId(null);
      setHeading('');
      setSubtitle('');
      setHighlights([]);
      setStats([]);
      setImage('');
      setCtaText1('');
      setCtaLink1('');
      setCtaText2('');
      setCtaLink2('');

      alert('Hero deleted successfully!');
    } catch (e) {
      console.error('Error deleting hero:', e);
      alert('Error deleting hero');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Section</h1>
          <p className="text-gray-600">Manage content for the hero section</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Content Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
          <textarea
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter heading"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter subtitle"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text 1</label>
            <input
              value={ctaText1}
              onChange={(e) => setCtaText1(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. Get Started"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link 1</label>
            <input
              value={ctaLink1}
              onChange={(e) => setCtaLink1(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. /contact"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text 2</label>
            <input
              value={ctaText2}
              onChange={(e) => setCtaText2(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. Learn More"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link 2</label>
            <input
              value={ctaLink2}
              onChange={(e) => setCtaLink2(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. /about"
            />
          </div>
        </div>

      </div>

      {/* Highlights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Highlights</h2>
        {highlights.map((h, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input
              value={h}
              onChange={(e) => updateHighlight(i, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder={`Highlight ${i + 1}`}
            />
            <button
              onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}
              className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 border border-red-200 rounded-md hover:bg-red-50 transition"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => setHighlights([...highlights, ''])}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-4 py-2 border border-blue-200 rounded-md hover:bg-blue-50 transition"
        >
          + Add Highlight
        </button>
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
              <Image src={image} alt="Hero image" fill className="object-cover" />
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
          {saving ? 'Saving...' : heroId ? 'Save Data' : 'Create Hero'}
        </button>

        {heroId && (
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
          >
            Delete Entire Section
          </button>
        )}
      </div>

      {!heroId && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No Hero record yet — fill the form and click &quot;Create Hero&quot;.</p>
        </div>
      )}
    </div>
  );
}
