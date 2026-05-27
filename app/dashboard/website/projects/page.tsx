"use client";

import SiteContentSectionForm from "../../../components/SiteContentSectionForm";
import { CMS_SECTIONS } from "../../../lib/cms-sections";

const section = CMS_SECTIONS.find((s) => s.id === "projects")!;

export default function ProjectsContentPage() {
  return (
    <SiteContentSectionForm
      title={section.title}
      description={section.description}
      fields={section.fields}
    />
  );
}
