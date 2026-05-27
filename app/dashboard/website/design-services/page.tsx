"use client";

import AkkawiCrudTable from "../../../components/AkkawiCrudTable";

export default function DesignServicesPage() {
  return (
    <AkkawiCrudTable
      apiPath="/api/akkawi/design-services"
      title="Design services"
      fields={[
        { key: "order", label: "Order", type: "number" },
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea", wide: true },
        { key: "image", label: "Image", type: "image", wide: true },
      ]}
      emptyRow={{ order: 0, title: "", description: "", image: "" }}
    />
  );
}
