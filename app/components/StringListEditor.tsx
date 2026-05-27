"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

type Props = {
  value: string;
  onChange: (json: string) => void;
};

function parse(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

export default function StringListEditor({ value, onChange }: Props) {
  const [items, setItems] = useState<string[]>(() => parse(value));

  useEffect(() => {
    setItems(parse(value));
  }, [value]);

  const commit = (next: string[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    commit(next);
  };

  const remove = (i: number) => commit(items.filter((_, idx) => idx !== i));
  const add = () => commit([...items, ""]);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder={`Item ${i + 1}`}
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
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        <FaPlus size={11} /> Add item
      </button>
    </div>
  );
}
