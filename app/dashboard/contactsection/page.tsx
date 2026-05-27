"use client";

import { useState, useEffect } from "react";

interface Contact {
  label: string;
  value: string;
  href: string;
}

interface Location {
  name: string;
  detail: string;
  phone: string;
}

export default function ContactSectionManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  const [ctaHeading, setCtaHeading] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaButton, setCtaButton] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [footerText, setFooterText] = useState("");

  const updateContact = (index: number, field: string, val: string) => {
    const copy = [...contacts];
    copy[index] = { ...copy[index], [field]: val };
    setContacts(copy);
  };
  const addContact = () => setContacts([...contacts, { label: "", value: "", href: "" }]);
  const removeContact = (i: number) => setContacts(contacts.filter((_, idx) => idx !== i));

  const updateLocation = (index: number, field: string, val: string) => {
    const copy = [...locations];
    copy[index] = { ...copy[index], [field]: val };
    setLocations(copy);
  };
  const addLocation = () => setLocations([...locations, { name: "", detail: "", phone: "" }]);
  const removeLocation = (i: number) => setLocations(locations.filter((_, idx) => idx !== i));

  const fetchData = async () => {
    try {
      const res = await fetch("/api/contactsection");
      const json = await res.json();
      if (json.success) {
        const first = (json.data || [])[0];
        if (first?.id) {
          setRecordId(first.id);
          setCtaHeading(first.ctaHeading || "");
          setCtaText(first.ctaText || "");
          setCtaButton(first.ctaButton || "");
          setContacts(first.contacts || []);
          setLocations(first.locations || []);
          setFooterText(first.footerText || "");
        }
      }
    } catch (e) {
      console.error("Error fetching contactsection:", e);
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
      const payload = { ctaHeading, ctaText, ctaButton, contacts, locations, footerText };

      const res = await fetch(recordId ? `/api/contactsection/${recordId}` : "/api/contactsection", {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");
      if (!recordId && json?.data?.id) setRecordId(json.data.id);
      alert("Contact & Footer saved successfully!");
    } catch (e) {
      console.error("Error saving contactsection:", e);
      alert("Error saving Contact & Footer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      const res = await fetch(`/api/contactsection/${recordId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete");
      setRecordId(null);
      setCtaHeading("");
      setCtaText("");
      setCtaButton("");
      setContacts([]);
      setLocations([]);
      setFooterText("");
      alert("Contact & Footer deleted successfully!");
    } catch (e) {
      console.error("Error deleting contactsection:", e);
      alert("Error deleting Contact & Footer");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact & Footer</h1>
        <p className="text-gray-600">Manage the Contact CTA and Footer section</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">CTA Section</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Heading</label>
          <input
            value={ctaHeading}
            onChange={(e) => setCtaHeading(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Call to action heading"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
          <textarea
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Call to action description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
          <input
            value={ctaButton}
            onChange={(e) => setCtaButton(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g. Contact Us"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Contact Details</h2>
          <button
            onClick={addContact}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 text-sm transition"
          >
            + Add Contact
          </button>
        </div>
        {contacts.map((contact, i) => (
          <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={contact.label}
                onChange={(e) => updateContact(i, "label", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Label (e.g. Email)"
              />
              <input
                value={contact.value}
                onChange={(e) => updateContact(i, "value", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Value (e.g. info@nbs.com)"
              />
              <input
                value={contact.href}
                onChange={(e) => updateContact(i, "href", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Link (e.g. mailto:info@nbs.com)"
              />
            </div>
            <button
              onClick={() => removeContact(i)}
              className="bg-red-50 text-red-600 border border-red-200 px-3 py-2.5 rounded-md hover:bg-red-100 transition text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No contacts added yet.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Office Locations</h2>
          <button
            onClick={addLocation}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 text-sm transition"
          >
            + Add Location
          </button>
        </div>
        {locations.map((loc, i) => (
          <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={loc.name}
                onChange={(e) => updateLocation(i, "name", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Office name"
              />
              <input
                value={loc.detail}
                onChange={(e) => updateLocation(i, "detail", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Address / detail"
              />
              <input
                value={loc.phone}
                onChange={(e) => updateLocation(i, "phone", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Phone number"
              />
            </div>
            <button
              onClick={() => removeLocation(i)}
              className="bg-red-50 text-red-600 border border-red-200 px-3 py-2.5 rounded-md hover:bg-red-100 transition text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        {locations.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No locations added yet.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Footer</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
          <textarea
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Footer copyright / description text"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
        >
          {saving ? "Saving..." : recordId ? "Save Data" : "Create Contact & Footer"}
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
          <p className="text-gray-500 text-sm">No Contact & Footer record yet — fill the form and click &quot;Create Contact & Footer&quot;.</p>
        </div>
      )}
    </div>
  );
}
