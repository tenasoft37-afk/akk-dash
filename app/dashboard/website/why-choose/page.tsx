"use client";

import AkkawiCrudTable from "../../../components/AkkawiCrudTable";

export default function WhyChoosePage() {
  return (
    <AkkawiCrudTable
      apiPath="/api/akkawi/why-choose"
      title="Why Choose AKKAWI"
      fields={[
        { key: "order", label: "Order", type: "number" },
        { key: "title", label: "Title" },
        { key: "desc", label: "Description", type: "textarea", wide: true },
      ]}
      emptyRow={{ order: 0, title: "", desc: "" }}
    />
  );
}
