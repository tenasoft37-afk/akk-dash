/**
 * Sidebar navigation — mirrors the website menu structure.
 * Each top-level item groups all dashboard editors for that page.
 */
export const SIDEBAR_NAV = [
  {
    label: "HOME",
    href: "/dashboard/website/home",
    children: [
      { label: "Page content", href: "/dashboard/website/home" },
      { label: "Why Choose cards", href: "/dashboard/website/why-choose" },
      { label: "Brand partners", href: "/dashboard/website/brand-partners" },
      { label: "Gallery cards", href: "/dashboard/website/gallery-home" },
    ],
  },
  {
    label: "SERVICES",
    href: "/dashboard/website/services",
    children: [
      { label: "Page content", href: "/dashboard/website/services" },
      { label: "Design services", href: "/dashboard/website/design-services" },
      { label: "Process steps", href: "/dashboard/website/process-steps" },
      { label: "Contracting", href: "/dashboard/website/contracting" },
    ],
  },
  {
    label: "PROJECTS",
    href: "/dashboard/website/projects",
  },
  {
    label: "GALLERY",
    href: "/dashboard/website/designs",
    children: [
      { label: "Gallery hub", href: "/dashboard/website/designs" },
      { label: "Category cards", href: "/dashboard/website/gallery-designs" },
      { label: "Photos", href: "/dashboard/website/gallery-images" },
    ],
  },
  {
    label: "ABOUT",
    href: "/dashboard/website/about",
    children: [
      { label: "Page content", href: "/dashboard/website/about" },
      { label: "Testimonials", href: "/dashboard/website/testimonials" },
    ],
  },
  {
    label: "CONTACT",
    href: "/dashboard/website/contact",
  },
  {
    label: "CAREERS",
    href: "/dashboard/website/careers",
    children: [
      { label: "Page content", href: "/dashboard/website/careers" },
      { label: "Job posting", href: "/dashboard/website/career-job" },
    ],
  },
  {
    label: "SETTINGS",
    href: "/dashboard/website/navigation",
    icon: "settings",
    children: [
      { label: "Logo, menu & footer", href: "/dashboard/website/navigation" },
    ],
  },
];
