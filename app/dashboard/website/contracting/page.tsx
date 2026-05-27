"use client";

import AkkawiCrudTable from "../../../components/AkkawiCrudTable";

export default function ContractingPage() {
  return (
    <AkkawiCrudTable
      apiPath="/api/akkawi/contracting-services"
      title="Contracting services"
      fields={[
        { key: "order", label: "Order", type: "number" },
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea", wide: true },
      ]}
      emptyRow={{ order: 0, title: "", description: "" }}
    />
  );
}
