"use client";

import AkkawiCrudTable from "../../../components/AkkawiCrudTable";

export default function GalleryDesignsPage() {
  return (
    <AkkawiCrudTable
      apiPath="/api/akkawi/gallery-categories?list=designs"
      title="Full gallery page cards"
      description="Shown on /designs. Use order 10 or higher."
      fields={[
        { key: "order", label: "Order (10+)", type: "number" },
        { key: "type", label: "Type" },
        { key: "label", label: "Title" },
        { key: "cta", label: "Button text" },
        { key: "image", label: "Image", type: "image", wide: true },
      ]}
      emptyRow={{
        order: 10,
        type: "residential",
        label: "",
        slug: "",
        href: "",
        cta: "SEE MORE",
        image: "",
        desc: "",
      }}
    />
  );
}
