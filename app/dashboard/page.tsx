"use client";

import Link from "next/link";
import { CMS_SECTIONS, LIST_SECTIONS } from "../lib/cms-sections";

export default function DashboardHome() {
  return (
    <div className="max-w-4xl mx-auto pb-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Website content</h1>
      <p className="text-gray-600 mb-10">
        Edit text and images for the AKKAWI marketing site. Changes appear on the
        live site within about a minute.
      </p>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pages</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {CMS_SECTIONS.map((section) => (
            <Link
              key={section.id}
              href={section.path}
              className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Lists &amp; galleries
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {LIST_SECTIONS.map((section) => (
            <Link
              key={section.id}
              href={section.path}
              className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
