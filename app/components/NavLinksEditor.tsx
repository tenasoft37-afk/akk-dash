"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

type NavChild = { label: string; href: string };
type NavLink = { label: string; href: string; children?: NavChild[] };

type Props = {
  value: string;
  onChange: (json: string) => void;
};

function parse(json: string): NavLink[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function NavLinksEditor({ value, onChange }: Props) {
  const [items, setItems] = useState<NavLink[]>(() => parse(value));

  useEffect(() => {
    setItems(parse(value));
  }, [value]);

  const commit = (next: NavLink[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  const updateLink = (i: number, field: "label" | "href", v: string) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: v };
    commit(next);
  };

  const removeLink = (i: number) =>
    commit(items.filter((_, idx) => idx !== i));

  const addLink = () =>
    commit([...items, { label: "", href: "/" }]);

  const addChild = (i: number) => {
    const next = [...items];
    const children = [...(next[i].children || []), { label: "", href: "/" }];
    next[i] = { ...next[i], children };
    commit(next);
  };

  const updateChild = (
    i: number,
    ci: number,
    field: "label" | "href",
    v: string
  ) => {
    const next = [...items];
    const children = [...(next[i].children || [])];
    children[ci] = { ...children[ci], [field]: v };
    next[i] = { ...next[i], children };
    commit(next);
  };

  const removeChild = (i: number, ci: number) => {
    const next = [...items];
    const children = (next[i].children || []).filter((_, idx) => idx !== ci);
    next[i] = { ...next[i], children: children.length ? children : undefined };
    commit(next);
  };

  return (
    <div className="space-y-3">
      {items.map((link, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-md p-3 space-y-2"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={link.label}
              onChange={(e) => updateLink(i, "label", e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Label (e.g. SERVICES)"
            />
            <input
              type="text"
              value={link.href}
              onChange={(e) => updateLink(i, "href", e.target.value)}
              className="w-36 border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Path (e.g. /services)"
            />
            <button
              type="button"
              onClick={() => removeLink(i)}
              className="text-red-500 hover:text-red-700 p-1.5"
              title="Remove link"
            >
              <FaTrash size={12} />
            </button>
          </div>

          {link.children && link.children.length > 0 && (
            <div className="ml-6 space-y-2 border-l-2 border-indigo-100 pl-3">
              <p className="text-xs font-medium text-gray-500">Sub-links</p>
              {link.children.map((child, ci) => (
                <div key={ci} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={child.label}
                    onChange={(e) =>
                      updateChild(i, ci, "label", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    placeholder="Sub-label"
                  />
                  <input
                    type="text"
                    value={child.href}
                    onChange={(e) =>
                      updateChild(i, ci, "href", e.target.value)
                    }
                    className="w-32 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    placeholder="/path"
                  />
                  <button
                    type="button"
                    onClick={() => removeChild(i, ci)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => addChild(i)}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium ml-6"
          >
            + Add sub-link
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addLink}
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        <FaPlus size={11} /> Add menu link
      </button>
    </div>
  );
}
