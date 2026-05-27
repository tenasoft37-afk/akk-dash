"use client";

import AkkawiCrudTable from "../../../components/AkkawiCrudTable";

export default function GalleryHomePage() {
  return (
    <AkkawiCrudTable
      apiPath="/api/akkawi/gallery-categories?list=home"
      title="Home page gallery cards"
      description="Residential (order 0–3) and commercial (order 0–2). Use order under 10."
      fields={[
        { key: "order", label: "Order", type: "number" },
        { key: "type", label: "Type (residential | commercial)" },
        { key: "label", label: "Label" },
        { key: "cta", label: "Button text" },
        { key: "image", label: "Image", type: "image", wide: true },
        { key: "desc", label: "Description", type: "textarea", wide: true },
      ]}
      emptyRow={{
        order: 0,
        type: "residential",
        label: "",
        slug: "",
        href: "",
        cta: "View more",
        image: "",
        desc: "",
      }}
    />
  );
}
