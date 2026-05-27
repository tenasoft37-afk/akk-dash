/** Keep in sync with `src/lib/sectionVisibility.ts` on the main site */

export const DEFAULT_SECTION_VISIBILITY = {
  hero: true,
  companyProfile: true,
  about: true,
  valueProposition: true,
  services: true,
  expertise: true,
  industries: true,
  whyNbs: true,
  contact: true,
};

export const SECTION_META = [
  { key: 'hero', label: 'Hero', description: 'Top banner with headline and main CTAs' },
  { key: 'companyProfile', label: 'Company Profile', labelNav: 'Profile', description: 'Vision, mission, and promise' },
  { key: 'about', label: 'About Us', description: 'About section with video and team' },
  { key: 'valueProposition', label: 'Value Proposition', description: 'Pain points grid' },
  { key: 'services', label: 'Our Core Services', description: 'Service cards and learn more links' },
  { key: 'expertise', label: 'Expertise & Tools', description: 'Tools grid and Odoo spotlight' },
  { key: 'industries', label: 'Industries', description: 'Industry showcase' },
  { key: 'whyNbs', label: 'Why NBS', description: 'Differentiators and counters' },
  { key: 'contact', label: 'Contact & Footer', description: 'Get Started CTA, contact cards, and footer' },
];

export function mergeVisibility(raw) {
  const merged = { ...DEFAULT_SECTION_VISIBILITY };
  if (!raw || typeof raw !== 'object') return merged;

  for (const key of Object.keys(DEFAULT_SECTION_VISIBILITY)) {
    if (typeof raw[key] === 'boolean') merged[key] = raw[key];
  }
  return merged;
}
