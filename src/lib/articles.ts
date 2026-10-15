import { articles } from "../config/site"

/** Show draft content for review; individual draft pages remain noindex. */
export const visibleArticles = () => articles
export const findVisibleArticle = (slug: string) =>
  visibleArticles().find((a) => a.slug === slug)
