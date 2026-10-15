import { clinicians, showDrafts, type Clinician } from "../config/site"

/** Published profiles, plus labelled placeholders while developing. Sorted by displayOrder. */
export const visibleClinicians = (): Clinician[] =>
  clinicians
    .filter(
      (c) => (c.published && !c.placeholder) || (showDrafts && c.placeholder),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder)

export const publishedClinicians = () =>
  clinicians.filter((c) => c.published && !c.placeholder && c.name)

export const cliniciansForService = (slug: string) =>
  publishedClinicians().filter((c) => c.relatedServiceSlugs.includes(slug))
