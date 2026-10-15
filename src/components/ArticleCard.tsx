import type { Article } from "../config/site"
import { Link } from "../lib/router"
import { ArrowRight } from "./Icons"

export default function ArticleCard({
  article,
  compact = false,
}: {
  article: Article
  compact?: boolean
}) {
  const label = article.status === "draft" ? "Draft topic" : article.category
  const imgWidth = compact ? 96 : article.imageWidth || 600
  const imgHeight = compact ? 80 : article.imageHeight || 450

  return (
    <article
      className={`group relative flex ${
        compact ? "flex-row items-center gap-4" : "flex-col"
      } h-full`}
    >
      <div
        className={`overflow-hidden rounded-[10px] bg-pale ${
          compact ? "h-20 w-24 shrink-0" : "aspect-[4/3]"
        }`}
      >
        <img
          src={article.image}
          alt={article.imageAlt || `${article.title} — oral health guide`}
          width={imgWidth}
          height={imgHeight}
          loading="lazy"
          className="zoom-img h-full w-full object-cover"
        />
      </div>
      <div className={compact ? "" : "pt-5"}>
        <div className="flex items-center gap-2">
          <p className="eyebrow !text-[0.68rem]">{label}</p>
          {article.readingTimeMinutes && (
            <span className="text-[0.72rem] text-muted">
              · {article.readingTimeMinutes} min read
            </span>
          )}
        </div>
        <h3
          className={`${compact ? "text-xl" : "h3"} mt-2 font-serif text-ink`}
        >
          <Link
            to={`/blog/${article.slug}/`}
            className="after:absolute after:inset-0 group-hover:text-action"
          >
            {article.title}
          </Link>
        </h3>
        {!compact && (
          <p className="mt-2 text-[0.95rem] text-muted">{article.excerpt}</p>
        )}
        {!compact && (
          <span className="text-link mt-2" aria-hidden>
            Read article <ArrowRight size={16} className="arrow-move" />
          </span>
        )}
      </div>
    </article>
  )
}
