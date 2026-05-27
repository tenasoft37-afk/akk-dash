"use client";

import AkkawiCrudTable from "../../../components/AkkawiCrudTable";

export default function TestimonialsPage() {
  return (
    <AkkawiCrudTable
      apiPath="/api/akkawi/testimonials"
      title="Client testimonials"
      fields={[
        { key: "order", label: "Order", type: "number" },
        { key: "author", label: "Author" },
        { key: "quote", label: "Quote", type: "textarea", wide: true },
      ]}
      emptyRow={{ order: 0, author: "", quote: "" }}
    />
  );
}
