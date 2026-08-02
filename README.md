# 🎬 Reeli

**Beli, but for movies.** Rank everything you've ever seen in head-to-head matchups — no star ratings, every score is earned.

## ▶️ [Open the app → reeli.org](https://reeli.org/)

*(You're looking at the source code. The link above is the actual app.)*

- ⚔️ Head-to-head ranking: "Which did you like more?" builds your 0–10 scored list
- 🌍 Live search across a worldwide movie catalog, with real posters
- 🎟️ Reelmates: follow real people, compare taste, see their hot takes
- 🔖 Watchlist with a taste-weighted "pick tonight's movie" button
- 📱 Installs to your home screen like a native app, works offline
- 🌗 Light/dark themes, keyboard shortcuts, phone and desktop layouts

Plain HTML/CSS/JS on GitHub Pages — no framework, no build step, no bundler —
backed by [Supabase](https://supabase.com) for accounts and sync. Movie metadata
and posters from the free [Cinemeta](https://v3-cinemeta.strem.io) catalog.

## Layout

| file | what's in it |
| --- | --- |
| `index.html` | the markup, plus `<link>`/`<script>` tags. No inline CSS or JS. |
| `styles.css` | every style |
| `posters.js` | pre-resolved poster art for the built-in library. Loaded first, blocking. |
| `ranking.js` | the head-to-head insertion algorithm. Pure — no DOM, no state. |
| `matching.js` | fuzzy title matching against the catalog. Pure. |
| `app.js` | everything else: state, rendering, sync, event routing. Loaded last. |
| `sw.js` | service worker. Network-first online, app shell offline. |

The four scripts are **classic scripts, not modules**: they share one global
scope, exactly as the single inline `<script>` they were split out of did.
Order matters — `app.js` reads `posters.js`'s data the moment it runs, so it
goes last. `test/shell.mjs` enforces both of those.

`sw.js` precaches every one of those files, and its `CACHE` name must be bumped
whenever that list changes, or a returning user can end up with a half-old shell
offline. That is also checked by `test/shell.mjs`.

## Tests

No dependencies, no test runner — just Node 20+. Every suite is also runnable on
its own; see the header comment in each file.

```sh
node test/all.mjs          # all 9 suites
node test-ranking.mjs      # the ranking algorithm + the title matcher
```

| suite | what it pins |
| --- | --- |
| `test-ranking.mjs` | the head-to-head insertion algorithm and the title matcher |
| `test/shell.mjs` | file refs, the precache list, one global scope, the manifest |
| `test/helpers.mjs` | PostgREST URL building, `hueFromTitle`, the poster cache |
| `test/delegation.mjs` | every control is routed, and dispatches where it should |
| `test/smoke.mjs` | no function references a name that doesn't exist |
| `test/watchlist-sync.mjs` | the watchlist RLS failure is surfaced, not swallowed |
| `test/sync-steps.mjs` | each sync/pull step, and what happens offline |
| `test/a11y.mjs` | landmarks, accessible names, labels, contrast |
| `test/render-snapshot.mjs` | rendered HTML vs. golden hashes, and stays well-formed |

### Changing the markup on purpose

`test/render-snapshot.mjs` renders every screen across 400 deterministic app
states and hashes the result per screen, storing the hashes in
`test/render-snapshot.json`. When you change markup deliberately, the hashes
move and the suite fails. Re-bless them with:

```sh
node test/render-snapshot.mjs --update
```

Read the diff it reports first — that failure is the only thing standing between
a typo in a template literal and production. The structural invariants in the
same suite (escaping, tag balance, no raw `undefined`) are **not** silenced by
`--update`; they always run.

This replaced a 126 KB frozen copy of the pre-split source that the old
`render-diff.mjs` diffed against byte-for-byte. That baseline could only assert
"the markup has not changed since July 2026", so the first intentional change
failed it and the only repair was to re-freeze the whole app.

## CI

`.github/workflows/ci.yml` runs the suite on every push and PR (Node 20 and 22),
plus the deploy-surface and accessibility gates as separate jobs so a failure is
legible at a glance. The Pages deploy `needs:` all three, so a red suite stops
the deploy instead of publishing over a working site.

> **One-time repo setting:** Settings → Pages → Build and deployment → Source
> must be **GitHub Actions**. While it is still "Deploy from a branch", pushes
> publish directly and the test gate does nothing.

## Database

Run these in the Supabase SQL editor, in a fresh tab each:

| file | when |
| --- | --- |
| `supabase-schema.sql` | once, on a new project |
| `supabase-fixes.sql` | once, to clear the database linter warnings |
| `supabase-indexes.sql` | once, for the queries the app actually issues |
| `supabase-customize.sql` | to enable avatar uploads and saved UI settings |
| `supabase-rls-watchlist-fix.sql` | **required** — without it the watchlist stops syncing after the first save |
| `supabase-media-type.sql` | **required on existing projects** — adds the `media_type` column that splits rankings into movies / shows / anime |
