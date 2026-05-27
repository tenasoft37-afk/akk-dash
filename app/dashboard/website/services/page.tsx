"use client";

import SiteContentSectionForm from "../../../components/SiteContentSectionForm";
import { CMS_SECTIONS } from "../../../lib/cms-sections";

const section = CMS_SECTIONS.find((s) => s.id === "services")!;

export default function ServicesContentPage() {
  return (
    <SiteContentSectionForm
      title={section.title}
      description={section.description}
      fields={section.fields}
    />
  );
}
