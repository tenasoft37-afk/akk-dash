"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const json = await res.json();
      if (json.success) {
        setLeads(json.data || []);
      }
    } catch (e) {
      console.error("Error fetching leads:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete");
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      console.error(e);
      alert("Error deleting submission");
    }
  };

  const exportToExcel = () => {
    if (leads.length === 0) {
      alert("No submissions to export");
      return;
    }

    const rows = leads.map((lead) => ({
      Date: new Date(lead.createdAt).toLocaleString(),
      Name: lead.fullName,
      Email: lead.email,
      Phone: lead.phone,
      Company: lead.company || "—",
      Message: lead.message || "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `nbs-lead-submissions-${date}.xlsx`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-64 rounded bg-gray-300" />
          <div className="h-64 rounded-lg bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started Submissions</h1>
          <p className="text-gray-600">
            Client inquiries from the website form ({leads.length} total)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchLeads}
            className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={exportToExcel}
            disabled={leads.length === 0}
            className="rounded-md bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No submissions yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Submissions appear here when visitors click &quot;Get Started Now&quot; on the website.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Message
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                        {lead.email}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{lead.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.company || "—"}</td>
                    <td className="max-w-xs px-4 py-3 text-sm text-gray-600">
                      <p className="line-clamp-2">{lead.message || "—"}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
