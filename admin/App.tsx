import { useState, type FormEvent } from "react"
import { BlogManager, ServiceManager, TeamManager } from "./ContentManager"

type Tab = "overview" | "enquiries" | "videos" | "blogs" | "services" | "team"
type Status = "new" | "in_progress" | "closed"
type Enquiry = {
  id: string
  kind: "appointment" | "international"
  name: string
  email: string
  phone: string
  details: Array<[string, string]>
  status: Status
  created: string
}
type Draft = { id: string; title: string; summary: string; category: string; created: string }

const categories = ["Clinic & team", "Procedures", "Oral health", "Patient stories"]
const examples: Enquiry[] = [
  { id: "example-1", kind: "appointment", name: "Example enquiry A", email: "example-a@example.com", phone: "000 000 000", details: [["Treatment", "Consultation"], ["Preferred time", "Afternoon"]], status: "new", created: "2026-10-15T10:00:00Z" },
  { id: "example-2", kind: "international", name: "Example enquiry B", email: "example-b@example.com", phone: "000 000 000", details: [["Country", "Example country"], ["Visit type", "Online consultation"]], status: "in_progress", created: "2026-10-14T10:00:00Z" },
  { id: "example-3", kind: "appointment", name: "Example enquiry C", email: "example-c@example.com", phone: "000 000 000", details: [["Treatment", "Not sure yet"]], status: "closed", created: "2026-10-13T10:00:00Z" },
]
const tabLabels: Record<Tab, string> = {
  overview: "Overview",
  enquiries: "Enquiries",
  videos: "Video drafts",
  blogs: "Blogs",
  services: "Services",
  team: "Team",
}

function date(value: string) {
  return new Date(value).toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" })
}

export default function App() {
  const [tab, setTab] = useState<Tab>("overview")
  const [enquiries, setEnquiries] = useState<Enquiry[]>(examples)
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [filter, setFilter] = useState("all")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(categories[0])
  const newCount = enquiries.filter((item) => item.status === "new").length
  const shown = filter === "all" ? enquiries : enquiries.filter((item) => item.status === filter)

  function changeStatus(id: string, status: Status) {
    setEnquiries((items) => items.map((item) => item.id === id ? { ...item, status } : item))
  }

  function createDraft(event: FormEvent) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    setDrafts((items) => [{ id: crypto.randomUUID(), title: cleanTitle, summary: description.trim(), category, created: new Date().toISOString() }, ...items])
    setTitle("")
    setDescription("")
  }

  function deleteDraft(id: string) {
    setDrafts((items) => items.filter((item) => item.id !== id))
  }

  return <div className="workspace">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">DA</span><span>Dr Ali Dental Centre<small>Clinic workspace</small></span></div>
      <nav aria-label="Workspace sections" className="navigation">
        <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}><span aria-hidden="true">▦</span> Overview</button>
        <button className={tab === "enquiries" ? "active" : ""} onClick={() => setTab("enquiries")}><span aria-hidden="true">✉</span> Enquiries <em>{newCount}</em></button>
        <button className={tab === "videos" ? "active" : ""} onClick={() => setTab("videos")}><span aria-hidden="true">▷</span> Video drafts</button>
        <button className={tab === "blogs" ? "active" : ""} onClick={() => setTab("blogs")}><span aria-hidden="true">≡</span> Blogs</button>
        <button className={tab === "services" ? "active" : ""} onClick={() => setTab("services")}><span aria-hidden="true">✦</span> Services</button>
        <button className={tab === "team" ? "active" : ""} onClick={() => setTab("team")}><span aria-hidden="true">♙</span> Team</button>
      </nav>
      <div className="sidebar-foot"><span className="secure-dot" /> Design preview<small>No sign-in or real records yet</small></div>
    </aside>
    <main className="content">
      <header className="topbar"><div><span className="eyebrow">CLINIC OPERATIONS</span><span className="topbar-separator">/</span><span>{tabLabels[tab]}</span></div><div className="account">Preview mode<span className="avatar">DA</span></div></header>
      <div className="page">
        <div className="setup-note preview-banner" role="status"><span className="note-icon">i</span><div><strong>Admin design preview</strong><p>Enquiries are examples. Content editors start with current website text, but every change stays in this browser session. Nothing is published or stored.</p></div></div>
        {tab === "overview" && <>
          <div className="intro"><span className="eyebrow">YOUR DAILY VIEW</span><h1>Good to have you here.</h1><p>A first look at how clinic enquiries and videos could be managed.</p></div>
          <div className="stats"><article><span>Example enquiries</span><strong>{enquiries.length}</strong><small>Preview records only</small></article><article><span>Needs attention</span><strong>{newCount}</strong><small>Example requests marked new</small></article><article><span>Session drafts</span><strong>{drafts.length}</strong><small>Cleared when you reload</small></article></div>
          <section className="panel"><div className="panel-head"><div><span className="eyebrow">SAMPLE ACTIVITY</span><h2>Latest enquiries</h2></div><button className="text-button" onClick={() => setTab("enquiries")}>View all <span aria-hidden="true">→</span></button></div><div className="recent-list">{enquiries.map((item) => <div key={item.id}><span className="mini-icon">E</span><span><strong>{item.name}</strong><small>{item.kind === "international" ? "International request" : "Appointment request"} · {date(item.created)}</small></span><span className={`badge ${item.status}`}>{item.status.replace("_", " ")}</span></div>)}</div></section>
          <div className="setup-note"><span className="note-icon">i</span><div><strong>Before this becomes a live admin panel</strong><p>We will need to choose authentication and connect approved storage for enquiries and videos. This preview has no backend.</p></div></div>
        </>}
        {tab === "enquiries" && <>
          <div className="intro"><span className="eyebrow">PATIENT CONTACT</span><h1>Enquiries</h1><p>Preview the inbox and follow-up workflow with example records.</p></div>
          <section className="panel"><div className="panel-head stacked-mobile"><div><h2>Inbox</h2><p className="subtle">Example entries only</p></div><label className="filter">Show <select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="in_progress">In progress</option><option value="closed">Closed</option></select></label></div>{shown.length ? <div className="enquiry-list">{shown.map((item) => <article className="enquiry" key={item.id}><div className="enquiry-main"><span className="mini-icon">E</span><div><div className="enquiry-title"><h3>{item.name}</h3><span className={`badge ${item.status}`}>{item.status.replace("_", " ")}</span></div><p>{item.kind === "international" ? "International consultation" : "Appointment request"} · {date(item.created)}</p></div></div><div className="enquiry-body"><div><span className="label">EXAMPLE CONTACT</span><span>{item.phone}</span><span>{item.email}</span></div><div><span className="label">EXAMPLE REQUEST DETAILS</span><dl>{item.details.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></div></div><div className="enquiry-actions"><label>Follow-up status <select value={item.status} onChange={(e) => changeStatus(item.id, e.target.value as Status)}><option value="new">New</option><option value="in_progress">In progress</option><option value="closed">Closed</option></select></label></div></article>)}</div> : <Empty title="Nothing in this view" body="Try another status filter." />}</section>
        </>}
        {tab === "videos" && <>
          <div className="intro"><span className="eyebrow">CONTENT LIBRARY</span><h1>Video drafts</h1><p>Preview how the clinic could prepare video titles and descriptions.</p></div>
          <div className="video-layout"><section className="panel"><div className="panel-head"><div><span className="eyebrow">SESSION PREVIEW</span><h2>Drafts</h2></div><span className="count">{drafts.length} drafts</span></div>{drafts.length ? <div className="draft-list">{drafts.map((item) => <article key={item.id}><div className="draft-icon">▷</div><div><span className="label">{item.category}</span><h3>{item.title}</h3><p>{item.summary || "No summary added."}</p><small>Created {date(item.created)}</small></div><button className="delete" onClick={() => deleteDraft(item.id)} aria-label={`Delete ${item.title}`}>Delete</button></article>)}</div> : <Empty title="No drafts in this session" body="Create one to preview the design. It will disappear when you reload." />}</section><section className="panel form-panel"><span className="eyebrow">NEW DRAFT</span><h2>Prepare a video</h2><p>This form is a design preview. Nothing is uploaded or saved.</p><form onSubmit={createDraft}><label>Video title<input required maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Meet our dental team" /></label><label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((option) => <option key={option}>{option}</option>)}</select></label><label>Short summary<textarea maxLength={1000} rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will patients learn from this video?" /></label><button className="primary" type="submit">Preview draft</button></form><p className="form-hint">Drafts stay in memory only and do not appear on the website.</p></section></div>
        </>}
        <section hidden={tab !== "blogs"}><BlogManager /></section>
        <section hidden={tab !== "services"}><ServiceManager /></section>
        <section hidden={tab !== "team"}><TeamManager /></section>
      </div>
    </main>
  </div>
}

function Empty({ title, body }: { title: string; body: string }) {
  return <div className="empty"><div aria-hidden="true">○</div><h3>{title}</h3><p>{body}</p></div>
}
