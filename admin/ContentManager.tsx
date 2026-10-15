import { useState, type FormEvent } from "react"
import { articles, clinicians, pricing, services } from "../src/config/site"

type BlogDraft = {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  body: string
  author: string
}

type ServiceDraft = {
  slug: string
  name: string
  amount: number | null
  from: boolean
  basis: string
  overview: string
}

type TeamDraft = {
  id: string
  name: string
  role: string
  qualifications: string
  clinicalFocus: string
  bio: string
  portrait: string
  published: boolean
}

const initialServices: ServiceDraft[] = services.map((service) => ({
  slug: service.slug,
  name: service.name,
  amount: service.fee.amount,
  from: service.fee.from,
  basis: service.fee.basis ?? "",
  overview: service.overview.join("\n\n"),
}))

const initialTeam: TeamDraft[] = clinicians.map((person) => ({
  id: person.id,
  name: person.name ?? "",
  role: person.role ?? "",
  qualifications: person.qualifications.join("\n"),
  clinicalFocus: person.clinicalFocus.join("\n"),
  bio: person.bio ?? "",
  portrait: person.portrait?.src ?? "",
  published: person.published,
}))

const emptyBlog = (): BlogDraft => ({
  id: "",
  title: "",
  slug: "",
  category: "Oral care",
  excerpt: "",
  body: "",
  author: "DADC Clinical Team",
})

const emptyTeam = (): TeamDraft => ({
  id: "",
  name: "",
  role: "",
  qualifications: "",
  clinicalFocus: "",
  bio: "",
  portrait: "",
  published: false,
})

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function Intro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="setup-note manager-note"><span className="note-icon">i</span><div><p>{children}</p></div></div>
}

export function BlogManager() {
  const [drafts, setDrafts] = useState<BlogDraft[]>([])
  const [form, setForm] = useState<BlogDraft>(emptyBlog)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  function save(event: FormEvent) {
    event.preventDefault()
    const slug = slugify(form.slug || form.title)
    if (!slug) { setMessage("Enter a title and a valid URL slug."); return }
    if ([...articles.map((article) => article.slug), ...drafts.filter((draft) => draft.id !== editingId).map((draft) => draft.slug)].includes(slug)) {
      setMessage("This URL slug is already used. Choose another one.")
      return
    }
    const entry = { ...form, id: editingId ?? crypto.randomUUID(), slug }
    setDrafts((items) => editingId ? items.map((item) => item.id === editingId ? entry : item) : [entry, ...items])
    setForm(emptyBlog())
    setEditingId(null)
    setMessage("Blog draft saved for this session only.")
  }

  function edit(draft: BlogDraft) {
    setForm({ ...draft })
    setEditingId(draft.id)
    setMessage("")
  }

  return <>
    <Intro eyebrow="ORAL-CARE JOURNAL" title="Blogs" description="Add a new article draft and review the titles already on the website." />
    <div className="manager-layout">
      <section className="panel"><div className="panel-head"><div><span className="eyebrow">CONTENT LIST</span><h2>Articles</h2></div><span className="count">{articles.length + drafts.length} total</span></div>
        <div className="content-list">
          {drafts.map((draft) => <article key={draft.id} className="content-row"><div className="row-icon">✎</div><div className="row-copy"><span className="label">SESSION DRAFT · {draft.category}</span><h3>{draft.title}</h3><p>{draft.excerpt || "No excerpt yet."}</p><small>/{draft.slug}/</small></div><button className="row-action" onClick={() => edit(draft)}>Edit</button></article>)}
          {articles.map((article) => <article key={article.slug} className="content-row"><div className="row-icon">≡</div><div className="row-copy"><span className="label">{article.status.toUpperCase()} · {article.category}</span><h3>{article.title}</h3><p>{article.excerpt}</p><small>/blog/{article.slug}/</small></div><span className="source-tag">Site content</span></article>)}
        </div>
      </section>
      <section className="panel form-panel"><span className="eyebrow">{editingId ? "EDIT SESSION DRAFT" : "NEW ARTICLE"}</span><h2>{editingId ? "Edit blog draft" : "Add new blog"}</h2><p>Write the complete draft here. Clinical review is needed before any real publication.</p>
        <form onSubmit={save}>
          <label>Title<input required maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Article title" /></label>
          <label>URL slug <small>Optional; generated from the title when blank</small><input maxLength={120} value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder={slugify(form.title) || "article-url"} /></label>
          <label>Category<input required maxLength={60} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
          <label>Author<input required maxLength={100} value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} /></label>
          <label>Short excerpt<textarea required maxLength={400} rows={3} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} placeholder="A concise introduction shown on the blog listing" /></label>
          <label>Article body<textarea required rows={10} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} placeholder="Write the article draft here..." /></label>
          {message && <p className="form-message" role="status">{message}</p>}
          <div className="form-actions"><button className="primary" type="submit">{editingId ? "Save preview changes" : "Add draft"}</button>{editingId && <button type="button" className="secondary" onClick={() => { setForm(emptyBlog()); setEditingId(null); setMessage("") }}>Cancel</button>}</div>
        </form><p className="form-hint">Session drafts disappear when this preview reloads.</p>
      </section>
    </div>
    <Notice>Existing articles are shown for context. New drafts in this preview do not change the public blog or its article pages.</Notice>
  </>
}

export function ServiceManager() {
  const [items, setItems] = useState<ServiceDraft[]>(initialServices)
  const [selected, setSelected] = useState(initialServices[0]?.slug ?? "")
  const [form, setForm] = useState<ServiceDraft>({ ...initialServices[0] })
  const [saved, setSaved] = useState("")

  function choose(slug: string) {
    const item = items.find((service) => service.slug === slug)
    if (!item) return
    setSelected(slug)
    setForm({ ...item })
    setSaved("")
  }

  function save(event: FormEvent) {
    event.preventDefault()
    setItems((current) => current.map((service) => service.slug === selected ? { ...form, name: form.name.trim(), overview: form.overview.trim() } : service))
    setSaved("Service changes saved in this preview session only.")
  }

  return <>
    <Intro eyebrow="TREATMENT CONTENT" title="Services" description="Review treatment names, fee details, and overview copy." />
    <div className="manager-layout">
      <section className="panel"><div className="panel-head"><div><span className="eyebrow">CURRENT SERVICES</span><h2>Treatments</h2></div><span className="count">{items.length} services</span></div><div className="selector-list">{items.map((service) => <button key={service.slug} className={selected === service.slug ? "selected" : ""} onClick={() => choose(service.slug)}><span><strong>{service.name}</strong><small>{service.amount === null ? "Price not confirmed" : `${service.from ? "From " : ""}${service.amount} · ${service.basis || "Fee"}`}</small></span><span aria-hidden="true">→</span></button>)}</div></section>
      <section className="panel form-panel"><span className="eyebrow">SERVICE DETAILS</span><h2>Edit treatment</h2><p>Review clinical descriptions and prices before using them publicly.</p><form onSubmit={save}>
        <label>Service name<input required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <div className="form-grid"><label>Price amount<input type="number" min="1" step="1" placeholder="Not confirmed" value={form.amount ?? ""} onChange={(event) => setForm({ ...form, amount: event.target.value ? Number(event.target.value) : null })} /></label><label>Fee basis<input maxLength={80} placeholder="e.g. Per session" value={form.basis} onChange={(event) => setForm({ ...form, basis: event.target.value })} /></label></div>
        <label className="toggle-line"><input type="checkbox" checked={form.from} onChange={(event) => setForm({ ...form, from: event.target.checked })} /> Show “From” before the price</label>
        <label>Treatment overview<textarea required rows={11} value={form.overview} onChange={(event) => setForm({ ...form, overview: event.target.value })} placeholder="Separate paragraphs with a blank line" /></label>
        {saved && <p className="form-message" role="status">{saved}</p>}
        <div className="form-actions"><button className="primary" type="submit">Save preview changes</button><button type="button" className="secondary" onClick={() => choose(selected)}>Discard edits</button></div>
      </form><p className="form-hint">{pricing.currency ? `Current currency: ${pricing.currency}.` : "The website has no confirmed currency configured yet."} A blank amount means price not confirmed.</p></section>
    </div>
    <Notice>Prices and treatment wording are clinical and commercial details. Preview changes remain here until verified and connected to an approved publishing process.</Notice>
  </>
}

export function TeamManager() {
  const [items, setItems] = useState<TeamDraft[]>(initialTeam)
  const [selected, setSelected] = useState<string | null>(initialTeam[0]?.id ?? null)
  const [form, setForm] = useState<TeamDraft>({ ...initialTeam[0] })
  const [saved, setSaved] = useState("")

  function choose(id: string) {
    const person = items.find((entry) => entry.id === id)
    if (!person) return
    setSelected(id)
    setForm({ ...person })
    setSaved("")
  }

  function newMember() {
    setSelected(null)
    setForm(emptyTeam())
    setSaved("")
  }

  function save(event: FormEvent) {
    event.preventDefault()
    const entry = { ...form, id: selected ?? crypto.randomUUID(), name: form.name.trim(), role: form.role.trim(), published: form.published }
    setItems((current) => selected ? current.map((person) => person.id === selected ? entry : person) : [...current, entry])
    setSelected(entry.id)
    setForm(entry)
    setSaved("Team profile saved in this preview session only.")
  }

  return <>
    <Intro eyebrow="YOUR PEOPLE" title="Team" description="Update current profiles or prepare a new team member." />
    <div className="manager-layout">
      <section className="panel"><div className="panel-head"><div><span className="eyebrow">TEAM DIRECTORY</span><h2>Members</h2></div><button className="text-button" onClick={newMember}>+ Add member</button></div><div className="selector-list">{items.map((person) => <button key={person.id} className={selected === person.id ? "selected" : ""} onClick={() => choose(person.id)}><span><strong>{person.name}</strong><small>{person.role} · {person.published ? "Marked visible" : "Draft"}</small></span><span aria-hidden="true">→</span></button>)}</div></section>
      <section className="panel form-panel"><span className="eyebrow">PROFILE DETAILS</span><h2>{selected ? "Edit team member" : "Add team member"}</h2><p>Use only verified qualifications and an approved portrait.</p><form onSubmit={save}>
        <label>Full name<input required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>Role<input required maxLength={120} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} /></label>
        <label>Qualifications <small>One per line</small><textarea rows={4} value={form.qualifications} onChange={(event) => setForm({ ...form, qualifications: event.target.value })} /></label>
        <label>Areas of clinical focus <small>One per line</small><textarea rows={4} value={form.clinicalFocus} onChange={(event) => setForm({ ...form, clinicalFocus: event.target.value })} /></label>
        <label>Biography<textarea rows={6} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} /></label>
        <label>Portrait path or URL<input maxLength={300} value={form.portrait} onChange={(event) => setForm({ ...form, portrait: event.target.value })} placeholder="/team/name.jpg" /></label>
        <label className="toggle-line"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Mark visible in preview</label>
        {saved && <p className="form-message" role="status">{saved}</p>}
        <div className="form-actions"><button className="primary" type="submit">Save preview changes</button>{selected && <button type="button" className="secondary" onClick={() => choose(selected)}>Discard edits</button>}</div>
      </form><p className="form-hint">This preview does not upload portraits or publish team details.</p></section>
    </div>
    <Notice>Team names, qualifications, and photos should be approved before publication. Nothing entered here changes the public site.</Notice>
  </>
}
