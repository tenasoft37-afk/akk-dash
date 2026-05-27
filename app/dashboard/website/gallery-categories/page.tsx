"use client";

import AkkawiCrudTable from "../../../components/AkkawiCrudTable";

export default function GalleryCategoriesPage() {
  return (
    <AkkawiCrudTable
      apiPath="/api/akkawi/gallery-categories"
      title="Gallery categories (home & designs)"
      fields={[
        { key: "order", label: "Order", type: "number" },
        { key: "label", label: "Label" },
        { key: "slug", label: "Slug" },
        { key: "href", label: "Link path" },
        { key: "type", label: "Type (residential | commercial)" },
        { key: "cta", label: "CTA text" },
        { key: "image", label: "Image", type: "image", wide: true },
        { key: "desc", label: "Description", type: "textarea", wide: true },
      ]}
      emptyRow={{
        order: 0,
        label: "",
        slug: "",
        href: "",
        type: "residential",
        cta: "View more",
        image: "",
        desc: "",
      }}
    />
  );
}
