import { createRemoteJWKSet, jwtVerify } from "jose"

type EnquiryStatus = "new" | "in_progress" | "closed"
const statuses: EnquiryStatus[] = ["new", "in_progress", "closed"]
const categories = ["Clinic & team", "Procedures", "Oral health", "Patient stories"]

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  })
}

function reject(status: number, message: string): Response {
  return json({ error: message }, status)
}

async function identity(request: Request, env: Env): Promise<string | null> {
  if (
    !/^[a-z0-9-]+\.cloudflareaccess\.com$/i.test(env.ACCESS_TEAM_DOMAIN || "") ||
    !env.ACCESS_AUD ||
    !env.ADMIN_EMAILS
  ) return null
  const token = request.headers.get("Cf-Access-Jwt-Assertion")
  if (!token) return null
  try {
    const issuer = `https://${env.ACCESS_TEAM_DOMAIN}`
    const keys = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`))
    const { payload } = await jwtVerify(token, keys, {
      issuer,
      audience: env.ACCESS_AUD,
      algorithms: ["RS256"],
    })
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : ""
    const allowed = env.ADMIN_EMAILS.split(",").map((item) => item.trim().toLowerCase())
    return allowed.includes(email) ? email : null
  } catch {
    return null
  }
}

function sameOriginMutation(request: Request): boolean {
  const origin = request.headers.get("Origin")
  const fetchSite = request.headers.get("Sec-Fetch-Site")
  return !!origin && origin === new URL(request.url).origin &&
    (!fetchSite || fetchSite === "same-origin") &&
    request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json") === true
}

async function smallJson(request: Request): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get("Content-Length"))
  if (length > 8192) return null
  const reader = request.body?.getReader()
  if (!reader) return null
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 8192) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) {
      bytes.set(chunk, offset)
      offset += chunk.byteLength
    }
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes))
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown> : null
  } catch {
    return null
  }
}

function noStore(response: Response): Response {
  const result = new Response(response.body, response)
  result.headers.set("Cache-Control", "no-store")
  result.headers.set("X-Content-Type-Options", "nosniff")
  result.headers.set("Referrer-Policy", "no-referrer")
  result.headers.set("X-Frame-Options", "DENY")
  result.headers.set("Content-Security-Policy", "default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'")
  return result
}

async function api(request: Request, env: Env, email: string, url: URL): Promise<Response> {
  const path = url.pathname
  if (request.method === "GET" && path === "/api/me") return json({ email })
  if (request.method === "GET" && path === "/api/summary") {
    const [enquiries, newEnquiries, drafts] = await Promise.all([
      env.DB.prepare("SELECT COUNT(*) AS count FROM enquiries").first<{ count: number }>(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'new'").first<{ count: number }>(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM video_drafts").first<{ count: number }>(),
    ])
    return json({ enquiries: enquiries?.count ?? 0, newEnquiries: newEnquiries?.count ?? 0, drafts: drafts?.count ?? 0 })
  }
  if (request.method === "GET" && path === "/api/enquiries") {
    const status = url.searchParams.get("status")
    if (status && !statuses.includes(status as EnquiryStatus)) return reject(400, "Invalid filter")
    const statement = status
      ? env.DB.prepare("SELECT id, kind, name, email, phone, details_json, status, created_at FROM enquiries WHERE status = ? ORDER BY created_at DESC LIMIT 100").bind(status)
      : env.DB.prepare("SELECT id, kind, name, email, phone, details_json, status, created_at FROM enquiries ORDER BY created_at DESC LIMIT 100")
    const { results } = await statement.all()
    return json({ enquiries: results })
  }
  const enquiry = /^\/api\/enquiries\/([0-9a-f-]{36})$/.exec(path)
  if (request.method === "PATCH" && enquiry) {
    const body = await smallJson(request)
    if (!body || !statuses.includes(body.status as EnquiryStatus)) return reject(400, "Invalid status")
    const result = await env.DB.prepare("UPDATE enquiries SET status = ? WHERE id = ?")
      .bind(body.status, enquiry[1]).run()
    return result.meta.changes ? json({ ok: true }) : reject(404, "Enquiry not found")
  }
  if (request.method === "GET" && path === "/api/video-drafts") {
    const { results } = await env.DB.prepare("SELECT id, title, summary, category, created_at FROM video_drafts ORDER BY created_at DESC LIMIT 100").all()
    return json({ drafts: results })
  }
  if (request.method === "POST" && path === "/api/video-drafts") {
    const body = await smallJson(request)
    const title = typeof body?.title === "string" ? body.title.trim() : ""
    const summary = typeof body?.summary === "string" ? body.summary.trim() : ""
    const category = body?.category
    if (!title || title.length > 160 || summary.length > 1000 || !categories.includes(category as string))
      return reject(400, "Check the video details")
    const id = crypto.randomUUID()
    await env.DB.prepare("INSERT INTO video_drafts (id, title, summary, category) VALUES (?, ?, ?, ?)")
      .bind(id, title, summary, category).run()
    return json({ id }, 201)
  }
  const draft = /^\/api\/video-drafts\/([0-9a-f-]{36})$/.exec(path)
  if (request.method === "DELETE" && draft) {
    const result = await env.DB.prepare("DELETE FROM video_drafts WHERE id = ?").bind(draft[1]).run()
    return result.meta.changes ? json({ ok: true }) : reject(404, "Draft not found")
  }
  return reject(404, "Not found")
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const email = await identity(request, env)
    if (!email) return noStore(reject(403, "Admin access is unavailable or not authorized"))
    const url = new URL(request.url)
    if (url.pathname.startsWith("/api/")) {
      if (!["GET", "POST", "PATCH", "DELETE"].includes(request.method))
        return noStore(reject(405, "Method not allowed"))
      if (request.method !== "GET" && !sameOriginMutation(request))
        return noStore(reject(403, "Invalid request origin"))
      try {
        return noStore(await api(request, env, email, url))
      } catch {
        return noStore(reject(503, "Admin data is temporarily unavailable"))
      }
    }
    if (request.method !== "GET" && request.method !== "HEAD")
      return noStore(reject(405, "Method not allowed"))
    return noStore(await env.ASSETS.fetch(request))
  },
} satisfies ExportedHandler<Env>
