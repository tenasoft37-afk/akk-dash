"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaChevronDown, FaChevronRight } from "react-icons/fa";

type Pillar = {
  title: string;
  body?: string[];
  list?: string[];
};

type Props = {
  value: string;
  onChange: (json: string) => void;
};

function parse(json: string): Pillar[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function PillarListEditor({ value, onChange }: Props) {
  const [items, setItems] = useState<Pillar[]>(() => parse(value));
  const [open, setOpen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setItems(parse(value));
  }, [value]);

  const commit = (next: Pillar[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  const toggle = (i: number) =>
    setOpen((o) => ({ ...o, [i]: !o[i] }));

  const updateTitle = (i: number, title: string) => {
    const next = [...items];
    next[i] = { ...next[i], title };
    commit(next);
  };

  const updateBody = (i: number, text: string) => {
    const next = [...items];
    const paragraphs = text.split("\n").filter((l) => l.trim());
    next[i] = { ...next[i], body: paragraphs.length ? paragraphs : undefined };
    commit(next);
  };

  const updateList = (i: number, text: string) => {
    const next = [...items];
    const bullets = text.split("\n").filter((l) => l.trim());
    next[i] = { ...next[i], list: bullets.length ? bullets : undefined };
    commit(next);
  };

  const remove = (i: number) => commit(items.filter((_, idx) => idx !== i));
  const add = () => {
    const idx = items.length;
    commit([...items, { title: "", body: [""] }]);
    setOpen((o) => ({ ...o, [idx]: true }));
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-md overflow-hidden">
          <div
            className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 cursor-pointer select-none"
            onClick={() => toggle(i)}
          >
            {open[i] ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
            <span className="text-sm font-semibold text-gray-700 flex-1">
              {item.title || `Pillar ${i + 1}`}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(i);
              }}
              className="text-red-500 hover:text-red-700 p-1"
              title="Remove"
            >
              <FaTrash size={11} />
            </button>
          </div>

          {open[i] && (
            <div className="p-3 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateTitle(i, e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="e.g. Vision"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Paragraphs (one per line)
                </label>
                <textarea
                  value={(item.body || []).join("\n")}
                  onChange={(e) => updateBody(i, e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Write each paragraph on a new line"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Bullet points (one per line, optional)
                </label>
                <textarea
                  value={(item.list || []).join("\n")}
                  onChange={(e) => updateList(i, e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Optional bullet points"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        <FaPlus size={11} /> Add pillar
      </button>
    </div>
  );
}
