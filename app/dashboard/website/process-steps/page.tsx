"use client";

import AkkawiCrudTable from "../../../components/AkkawiCrudTable";

export default function ProcessStepsPage() {
  return (
    <AkkawiCrudTable
      apiPath="/api/akkawi/process-steps"
      title="Online design process"
      fields={[
        { key: "order", label: "Order", type: "number" },
        { key: "step", label: "Step label" },
        { key: "text", label: "Text", type: "textarea", wide: true },
      ]}
      emptyRow={{ order: 0, step: "", text: "" }}
    />
  );
}
