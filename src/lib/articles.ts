import { articles, showDrafts } from "../config/site"

/** Articles visible in this build: drafts are excluded from production. */
export const visibleArticles = () =>
  articles.filter((a) => a.status === "reviewed" || showDrafts)
export const findVisibleArticle = (slug: string) =>
  visibleArticles().find((a) => a.slug === slug)
