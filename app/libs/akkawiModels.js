/** Maps URL segment → Prisma delegate name and field metadata */
export const AKKAWI_MODELS = {
  testimonials: {
    delegate: "testimonial",
    orderBy: { order: "asc" },
    required: ["quote", "author"],
    fields: ["quote", "author", "order"],
  },
  "why-choose": {
    delegate: "whyChooseFeature",
    orderBy: { order: "asc" },
    required: ["title", "desc"],
    fields: ["title", "desc", "order"],
  },
  "gallery-categories": {
    delegate: "galleryCategory",
    orderBy: { order: "asc" },
    required: ["label", "slug", "href", "image"],
    fields: ["label", "slug", "href", "image", "desc", "cta", "type", "order"],
  },
  "gallery-images": {
    delegate: "galleryImage",
    orderBy: [{ slug: "asc" }, { order: "asc" }],
    required: ["slug", "url"],
    fields: ["slug", "url", "label", "order"],
  },
  "design-services": {
    delegate: "designService",
    orderBy: { order: "asc" },
    required: ["title", "description", "image"],
    fields: ["title", "description", "image", "order"],
  },
  "process-steps": {
    delegate: "processStep",
    orderBy: { order: "asc" },
    required: ["step", "text"],
    fields: ["step", "text", "order"],
  },
  "contracting-services": {
    delegate: "contractingService",
    orderBy: { order: "asc" },
    required: ["title", "description"],
    fields: ["title", "description", "order"],
  },
  careers: {
    delegate: "career",
    orderBy: { id: "desc" },
    required: ["jobTitle", "content"],
    fields: ["jobTitle", "content", "active"],
  },
  "site-content": {
    delegate: "siteContent",
    orderBy: { key: "asc" },
    required: ["key", "value"],
    fields: ["key", "value"],
    upsertKey: "key",
  },
};

export function getAkkawiModel(segment) {
  return AKKAWI_MODELS[segment] ?? null;
}

export function pickData(body, fields) {
  const data = {};
  for (const field of fields) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}
