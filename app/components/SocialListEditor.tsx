"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

type Social = { label: string; href: string; icon: string };

type Props = {
  value: string;
  onChange: (json: string) => void;
};

const ICON_OPTIONS = [
  "instagram",
  "facebook",
  "linkedin",
  "whatsapp",
  "youtube",
  "tiktok",
  "pinterest",
  "behance",
  "twitter",
  "other",
];

function parse(json: string): Social[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function SocialListEditor({ value, onChange }: Props) {
  const [items, setItems] = useState<Social[]>(() => parse(value));

  useEffect(() => {
    setItems(parse(value));
  }, [value]);

  const commit = (next: Social[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  const update = (i: number, field: keyof Social, v: string) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: v };
    commit(next);
  };

  const remove = (i: number) => commit(items.filter((_, idx) => idx !== i));
  const add = () =>
    commit([...items, { label: "", href: "https://", icon: "instagram" }]);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-md p-3 space-y-2">
          <div className="flex items-center gap-2">
            <select
              value={item.icon}
              onChange={(e) => update(i, "icon", e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-2 text-sm capitalize w-32"
            >
              {ICON_OPTIONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic.charAt(0).toUpperCase() + ic.slice(1)}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={item.label}
              onChange={(e) => update(i, "label", e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Label (e.g. Instagram)"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-500 hover:text-red-700 p-1.5"
              title="Remove"
            >
              <FaTrash size={12} />
            </button>
          </div>
          <input
            type="text"
            value={item.href}
            onChange={(e) => update(i, "href", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="URL (e.g. https://www.instagram.com/)"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        <FaPlus size={11} /> Add social link
      </button>
    </div>
  );
}
