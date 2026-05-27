"use client";

import AkkawiCrudTable from "../../../components/AkkawiCrudTable";

export default function CareerJobPage() {
  return (
    <AkkawiCrudTable
      apiPath="/api/akkawi/careers"
      title="Job posting"
      description="The active listing shown on the Careers page. Keep one entry with Active = true."
      fields={[
        { key: "jobTitle", label: "Job title", wide: true },
        { key: "active", label: "Active", type: "toggle" },
        { key: "content", label: "Full job description", type: "textarea", wide: true },
      ]}
      emptyRow={{ jobTitle: "", active: "true", content: "" }}
    />
  );
}
