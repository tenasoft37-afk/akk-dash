"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

type Phone = { href: string; display: string };

type Props = {
  value: string;
  onChange: (json: string) => void;
};

function parse(json: string): Phone[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function PhoneListEditor({ value, onChange }: Props) {
  const [items, setItems] = useState<Phone[]>(() => parse(value));

  useEffect(() => {
    setItems(parse(value));
  }, [value]);

  const commit = (next: Phone[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  const update = (i: number, field: keyof Phone, v: string) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: v };
    if (field === "display") {
      const digits = v.replace(/[^+\d]/g, "");
      next[i].href = digits ? `tel:${digits}` : "";
    }
    commit(next);
  };

  const remove = (i: number) => commit(items.filter((_, idx) => idx !== i));
  const add = () => commit([...items, { href: "", display: "" }]);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-md p-3">
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={item.display}
              onChange={(e) => update(i, "display", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="e.g. +961 70 234 431"
            />
            <p className="text-xs text-gray-400">
              Link: {item.href || "(auto-generated from number)"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-red-500 hover:text-red-700 p-1.5 mt-1"
            title="Remove"
          >
            <FaTrash size={12} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        <FaPlus size={11} /> Add phone number
      </button>
    </div>
  );
}
