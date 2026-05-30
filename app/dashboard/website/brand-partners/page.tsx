"use client";

import AkkawiCrudTable from "../../../components/AkkawiCrudTable";

export default function BrandPartnersPage() {
  return (
    <AkkawiCrudTable
      apiPath="/api/akkawi/brand-partners"
      title="Brand partners"
      description="Logos shown in the scrolling carousel on the home page. Use order to control display sequence."
      fields={[
        { key: "order", label: "Order", type: "number" },
        { key: "name", label: "Brand name (optional)" },
        { key: "image", label: "Logo image", type: "image", wide: true },
      ]}
      emptyRow={{ order: 0, name: "", image: "" }}
    />
  );
}
