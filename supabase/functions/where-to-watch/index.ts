// Where to watch: which services carry a title, from the Streaming Availability
// API (Movie of the Night), cached in public.watch_providers.
//
// POST { id: "tt0068646", country?: "us" }
//   -> { options: [{ service, name, logo, type, link, price }], cached, attribution }
//
// The free API plan is 1,000 requests a month, so every answer (including "not
// found") is cached for CACHE_DAYS and only refetched after that.
//
// Deploy:   supabase functions deploy where-to-watch
// Secret:   supabase secrets set SA_API_KEY=<your key>
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
// Table:    run supabase-watch-providers.sql once in the SQL editor.

const SA_KEY = Deno.env.get("SA_API_KEY") ?? "";
const SUPA_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const CACHE_DAYS = 7;
const ATTRIBUTION = {
  text: "Streaming data by Movie of the Night",
  url: "https://www.movieofthenight.com/about/api",
};
const TYPES = new Set(["subscription", "free", "addon", "rent", "buy"]);

function corsHeaders(origin: string | null): Record<string, string> {
  const ok = !!origin && (
    origin === "https://reeli.org" ||
    origin === "https://www.reeli.org" ||
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  );
  return {
    "Access-Control-Allow-Origin": ok ? origin! : "https://reeli.org",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Vary": "Origin",
  };
}

function reply(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

type Option = {
  service: string; name: string; logo: string | null;
  type: string; link: string; price: string | null;
};

// Keep only what the client draws, one entry per service + type.
// deno-lint-ignore no-explicit-any
function trim(list: any[]): Option[] {
  const seen = new Set<string>();
  const out: Option[] = [];
  for (const o of Array.isArray(list) ? list : []) {
    const s = o?.service;
    if (!s?.id || !TYPES.has(o.type) || typeof o.link !== "string") continue;
    if (!/^https:\/\//.test(o.link)) continue;
    const key = s.id + "|" + o.type;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      service: String(s.id),
      name: String(s.name ?? s.id),
      logo: s.imageSet?.darkThemeImage ?? s.imageSet?.whiteImage ?? null,
      type: o.type,
      link: o.link,
      price: o.price?.formatted ?? null,
    });
  }
  return out;
}

async function db(path: string, init: RequestInit = {}) {
  return fetch(SUPA_URL + "/rest/v1/" + path, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: "Bearer " + SERVICE_KEY,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

Deno.serve(async (req) => {
  const cors = corsHeaders(req.headers.get("Origin"));
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "POST only" }, 405, cors);

  // deno-lint-ignore no-explicit-any
  let body: any;
  try { body = await req.json(); } catch { return reply({ error: "bad JSON" }, 400, cors); }
  const id = String(body?.id ?? "");
  const country = String(body?.country ?? "us").toLowerCase();
  if (!/^tt\d{1,10}$/.test(id)) return reply({ error: "id must be an IMDb id like tt0068646" }, 400, cors);
  if (!/^[a-z]{2}$/.test(country)) return reply({ error: "country must be a 2-letter code" }, 400, cors);

  // 1. cache
  const q = `watch_providers?imdb_id=eq.${id}&country=eq.${country}&select=options,fetched_at&limit=1`;
  try {
    const r = await db(q);
    if (r.ok) {
      const rows = await r.json();
      const row = rows[0];
      if (row && Date.now() - Date.parse(row.fetched_at) < CACHE_DAYS * 864e5) {
        return reply({ options: row.options ?? [], cached: true, attribution: ATTRIBUTION }, 200, cors);
      }
    }
  } catch (_) { /* cache unreachable: fall through to the API */ }

  if (!SA_KEY) return reply({ error: "SA_API_KEY is not set" }, 503, cors);

  // 2. Streaming Availability
  let options: Option[];
  try {
    const r = await fetch(
      `https://api.movieofthenight.com/v4/shows/${id}?country=${country}`,
      { headers: { "X-API-Key": SA_KEY } },
    );
    if (r.status === 404) {
      options = []; // not in their catalog: cache that too, so it isn't re-asked daily
    } else if (!r.ok) {
      // quota hit (429) or an outage: don't cache, let the client fall back
      return reply({ error: "upstream " + r.status }, 502, cors);
    } else {
      const show = await r.json();
      options = trim(show?.streamingOptions?.[country] ?? []);
    }
  } catch (_) {
    return reply({ error: "upstream unreachable" }, 502, cors);
  }

  // 3. store (best effort)
  try {
    await db("watch_providers?on_conflict=imdb_id,country", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ imdb_id: id, country, options, fetched_at: new Date().toISOString() }),
    });
  } catch (_) { /* answer anyway */ }

  return reply({ options, cached: false, attribution: ATTRIBUTION }, 200, cors);
});
