import { useCallback, useEffect, useState, type FormEvent } from "react"

type Tab = "overview" | "enquiries" | "videos"
type Status = "new" | "in_progress" | "closed"
type Enquiry = {
  id: string
  kind: "appointment" | "international"
  name: string
  email: string | null
  phone: string
  details_json: string
  status: Status
  created_at: string
}
type Draft = {
  id: string
  title: string
  summary: string
  category: string
  created_at: string
}
type Summary = { enquiries: number; newEnquiries: number; drafts: number }
const categories = ["Clinic & team", "Procedures", "Oral health", "Patient stories"]

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: "same-origin",
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const message = body && typeof body === "object" && "error" in body &&
      typeof body.error === "string" ? body.error : `Request failed (${response.status})`
    throw new Error(message)
  }
  return response.json() as Promise<T>
}

function date(value: string) {
  return new Date(value).toLocaleString("en-PK", {
    timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short",
  })
}

function details(value: string): Array<[string, string]> {
  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return []
    return Object.entries(parsed).filter(([, item]) =>
      typeof item === "string" || typeof item === "number" || typeof item === "boolean",
    ).map(([key, item]) => [key, String(item)])
  } catch { return [] }
}

export default function App() {
  const [tab, setTab] = useState<Tab>("overview")
  const [email, setEmail] = useState("")
  const [summary, setSummary] = useState<Summary | null>(null)
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [filter, setFilter] = useState("all")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(categories[0])

  const refresh = useCallback(async () => {
    try {
      const [me, counts, items, videos] = await Promise.all([
        api<{ email: string }>("/api/me"),
        api<Summary>("/api/summary"),
        api<{ enquiries: Enquiry[] }>("/api/enquiries"),
        api<{ drafts: Draft[] }>("/api/video-drafts"),
      ])
      setEmail(me.email)
      setSummary(counts)
      setEnquiries(items.enquiries)
      setDrafts(videos.drafts)
      setError("")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load the workspace")
    } finally { setLoaded(true) }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  async function changeStatus(item: Enquiry, status: Status) {
    setBusy(true)
    setError("")
    try {
      await api(`/api/enquiries/${item.id}`, { method: "PATCH", body: JSON.stringify({ status }) })
      await refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update enquiry")
    } finally { setBusy(false) }
  }

  async function createDraft(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      await api("/api/video-drafts", {
        method: "POST", body: JSON.stringify({ title, summary: description, category }),
      })
      setTitle("")
      setDescription("")
      await refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save draft")
    } finally { setBusy(false) }
  }

  async function deleteDraft(item: Draft) {
    if (!window.confirm(`Delete the draft “${item.title}”?`)) return
    setBusy(true)
    setError("")
    try {
      await api(`/api/video-drafts/${item.id}`, {
        method: "DELETE", body: "{}",
      })
      await refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete draft")
    } finally { setBusy(false) }
  }

  const shown = filter === "all" ? enquiries : enquiries.filter((item) => item.status === filter)
  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">DA</span><span>Dr Ali Dental Centre<small>Clinic workspace</small></span></div>
        <nav aria-label="Workspace sections" className="navigation">
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}><span aria-hidden="true">▦</span> Overview</button>
          <button className={tab === "enquiries" ? "active" : ""} onClick={() => setTab("enquiries")}><span aria-hidden="true">✉</span> Enquiries <em>{summary?.newEnquiries ?? "·"}</em></button>
          <button className={tab === "videos" ? "active" : ""} onClick={() => setTab("videos")}><span aria-hidden="true">▷</span> Video drafts</button>
        </nav>
        <div className="sidebar-foot"><span className="secure-dot" /> Protected workspace<small>Sign-in managed by Cloudflare Access</small></div>
      </aside>
      <main className="content">
        <header className="topbar"><div><span className="eyebrow">CLINIC OPERATIONS</span><span className="topbar-separator">/</span><span>{tab === "overview" ? "Overview" : tab === "enquiries" ? "Enquiries" : "Video drafts"}</span></div><div className="account">{email || "Admin"}<span className="avatar">{email ? email[0].toUpperCase() : "A"}</span></div></header>
        <div className="page">
          {error && <div className="error" role="alert"><strong>{loaded && !summary ? "Workspace unavailable" : "Action failed"}</strong><span>{error}. Check Access and D1 setup, then retry.</span><button onClick={() => void refresh()}>Retry</button></div>}
          {!loaded ? <p className="loading">Loading workspace…</p> : <>
            {tab === "overview" && <>
              <div className="intro"><span className="eyebrow">YOUR DAILY VIEW</span><h1>Good to have you here.</h1><p>Keep enquiries moving and prepare trusted clinic videos for publication.</p></div>
              <div className="stats"><article><span>Total enquiries</span><strong>{summary?.enquiries ?? "—"}</strong><small>Stored in your clinic database</small></article><article><span>Needs attention</span><strong>{summary?.newEnquiries ?? "—"}</strong><small>New requests awaiting review</small></article><article><span>Video drafts</span><strong>{summary?.drafts ?? "—"}</strong><small>Ready for media and review</small></article></div>
              <section className="panel"><div className="panel-head"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Latest enquiries</h2></div><button className="text-button" onClick={() => setTab("enquiries")}>View all <span aria-hidden="true">→</span></button></div>{enquiries.length ? <div className="recent-list">{enquiries.slice(0, 5).map((item) => <div key={item.id}><span className="mini-icon">{item.name.slice(0, 1).toUpperCase()}</span><span><strong>{item.name}</strong><small>{item.kind === "international" ? "International request" : "Appointment request"} · {date(item.created_at)}</small></span><span className={`badge ${item.status}`}>{item.status.replace("_", " ")}</span></div>)}</div> : <Empty title="No enquiries yet" body="Requests will appear here when the public forms are connected to D1." />}</section>
              <div className="setup-note"><span className="note-icon">i</span><div><strong>What is connected?</strong><p>This workspace stores video drafts and reads enquiries from D1. Public form delivery and R2 uploads are the next integration steps.</p></div></div>
            </>}
            {tab === "enquiries" && <>
              <div className="intro"><span className="eyebrow">PATIENT CONTACT</span><h1>Enquiries</h1><p>Review requests and keep track of the clinic's follow-up. Avoid storing clinical records here.</p></div>
              <section className="panel"><div className="panel-head stacked-mobile"><div><h2>Inbox</h2><p className="subtle">Up to 100 most recent requests</p></div><label className="filter">Show <select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="in_progress">In progress</option><option value="closed">Closed</option></select></label></div>{shown.length ? <div className="enquiry-list">{shown.map((item) => <article className="enquiry" key={item.id}><div className="enquiry-main"><span className="mini-icon">{item.name.slice(0, 1).toUpperCase()}</span><div><div className="enquiry-title"><h3>{item.name}</h3><span className={`badge ${item.status}`}>{item.status.replace("_", " ")}</span></div><p>{item.kind === "international" ? "International consultation" : "Appointment request"} · {date(item.created_at)}</p></div></div><div className="enquiry-body"><div><span className="label">CONTACT</span><a href={`tel:${item.phone}`}>{item.phone}</a>{item.email && <a href={`mailto:${item.email}`}>{item.email}</a>}</div>{details(item.details_json).length > 0 && <div><span className="label">REQUEST DETAILS</span><dl>{details(item.details_json).map(([key, value]) => <div key={key}><dt>{key.replaceAll("_", " ")}</dt><dd>{value}</dd></div>)}</dl></div>}</div><div className="enquiry-actions"><label>Follow-up status <select disabled={busy} value={item.status} onChange={(e) => void changeStatus(item, e.target.value as Status)}><option value="new">New</option><option value="in_progress">In progress</option><option value="closed">Closed</option></select></label></div></article>)}</div> : <Empty title="Nothing in this view" body={filter === "all" ? "Enquiries will appear after the public forms are connected." : "Try another status filter."} />}</section>
            </>}
            {tab === "videos" && <>
              <div className="intro"><span className="eyebrow">CONTENT LIBRARY</span><h1>Video drafts</h1><p>Prepare descriptions now. Uploading to R2 and publishing to the public video page come next.</p></div>
              <div className="video-layout"><section className="panel"><div className="panel-head"><div><span className="eyebrow">YOUR LIBRARY</span><h2>Saved drafts</h2></div><span className="count">{drafts.length} drafts</span></div>{drafts.length ? <div className="draft-list">{drafts.map((item) => <article key={item.id}><div className="draft-icon">▷</div><div><span className="label">{item.category}</span><h3>{item.title}</h3><p>{item.summary || "No summary added."}</p><small>Created {date(item.created_at)}</small></div><button className="delete" disabled={busy} onClick={() => void deleteDraft(item)} aria-label={`Delete ${item.title}`}>Delete</button></article>)}</div> : <Empty title="No video drafts yet" body="Create a draft to prepare the title and description before upload." />}</section><section className="panel form-panel"><span className="eyebrow">NEW DRAFT</span><h2>Prepare a video</h2><p>Only add content approved by the clinic for public use.</p><form onSubmit={createDraft}><label>Video title<input required maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Meet our dental team" /></label><label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((option) => <option key={option}>{option}</option>)}</select></label><label>Short summary<textarea maxLength={1000} rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will patients learn from this video?" /></label><button className="primary" disabled={busy} type="submit">{busy ? "Saving…" : "Save draft"}</button></form><p className="form-hint">Drafts are private and do not appear on the website.</p></section></div>
            </>}
          </>}
        </div>
      </main>
    </div>
  )
}

function Empty({ title, body }: { title: string; body: string }) {
  return <div className="empty"><div aria-hidden="true">○</div><h3>{title}</h3><p>{body}</p></div>
}
