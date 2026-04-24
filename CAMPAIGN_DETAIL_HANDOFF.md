# Campaign Detail — Redesign Handoff

**Prototype:** [`prototype-campaign-detail.html`](./prototype-campaign-detail.html)
**Live URL:** `https://<your-vercel-domain>/prototype-campaign-detail`
**Replaces:** current `app.outpulse.ai/campaigns/<id>` detail view

This document tells the implementer **what's new**, **what's changed**, **what to keep**, and the order in which to ship it. Read end-to-end before starting.

---

## TL;DR — what changes and why

The current campaign detail is an **informational dashboard**: it shows what's happening but doesn't tell the user what to do. We're turning it into an **operational cockpit**: health → goal → funnel → insights → action.

Six changes in priority order:

1. **Tab restructure** (6 → 5): `Overview / Sequence / Prospects / Inbox / Settings`. Drop `Board` and `Sent emails` tabs — fold into Overview / Prospects.
2. **Health strip** on top: one-line status, TL;DR, next action.
3. **Goal card**: target, pace, "on track? off track?".
4. **KPI cards with sparklines + deltas + benchmarks** (not just big numbers).
5. **Funnel with conversion rates between stages** (not three flat bars). Adds a 5th stage ("Booked") that extends the product funnel past email.
6. **AI Recommendations block**: 3 actionable cards with Apply / Dismiss buttons.
7. **Right rail** (new column): live feed, next send, domain health, quick actions.

---

## Visual reference

Open `prototype-campaign-detail.html` in a browser. It's a static HTML mock with dummy data — no backend calls, no state. Use it as a pixel reference for spacing, typography, colors, and component hierarchy.

All design tokens (`--ink`, `--orange`, `--line`, etc.) match the existing app design system (see `design-system-ui.html`). No new tokens introduced.

---

## Section-by-section spec

### 1. Page header

**Keep:** breadcrumb, campaign title, action buttons (Pause / Edit sequence / Add prospects).

**Change:**
- Status badge moves next to the title (not below), styled as a pulsing green "Active" chip.
- Metric subline shows: `333 prospects · 310 sent · 105 opened · 49 clicked · Step 2 of 3 sending`. Numbers are bold, separators are small dots.
- Primary action button = `Add prospects` (black pill). Secondary = `Edit sequence` / `Pause` (white pills).

### 2. Health strip (NEW)

One row, padded 14×18, rounded 12px. Status chip on the left, sentence in the middle, action link on the right.

**States:**
- `.health.ok` — green tint, chip "Healthy"
- `.health.warn` — amber tint, chip "At risk"
- `.health.bad` — red tint, chip "Needs attention"

**Logic (backend decides which):**
- `ok`: all KPIs above their target benchmarks
- `warn`: at least one KPI below benchmark but not critical (e.g. click rate healthy but reply rate 0)
- `bad`: send velocity stalled, spam rate > 1%, domain flagged, or open rate < 15%

**Copy template:**
> "{top-kpi-positive} is above the {bench}% target — {positive-reason}. But {problem-kpi} is {value} (target: ≥ {target}%). {interpretation}."

Example implemented: "Click rate 16% is above the 8% target — emails are working. But reply rate is 0% (target: ≥ 3%). People click but don't reply."

### 3. Goal card (NEW)

Light panel, shows:
- **Goal**: e.g. "Book 25 discovery calls this month"
- **Pace sentence**: "On pace for 8 calls — need 6 meetings/week from here to catch up"
- **Progress bar**: 0–100%, gradient orange
- Buttons: `Adjust goal` / `Booking funnel →`

**Data model:** `Campaign.goal = { type: 'meetings' | 'replies' | 'signups', target: number, deadline: ISO8601 }`. Backend computes pace from current rate vs days remaining.

If no goal set, show an empty-state variant: "Set a campaign goal to track progress" + `[Set goal]` button.

### 4. KPI cards (UPDATED)

**Keep** the 4-card layout (Sent / Opened / Clicked / Replied).

**Add** to each card:
- **Delta vs last 7 days**: `▲ +12% vs last week` / `▼ -4%` / `→ flat`. Colored green/red/grey.
- **Benchmark status**: `34% · healthy` / `0% · below 3% target`. Green when ok, red when bad.
- **Sparkline**: 28px tall SVG polyline, 7 days of daily values. Use dashed line if series is flat-at-zero (Replied case).

**Benchmarks** (B2B cold email medians — tune from real data over time):
- Open rate: ≥ 25% healthy, ≥ 40% strong
- Click rate: ≥ 8% healthy, ≥ 15% strong
- Reply rate: ≥ 3% healthy, ≥ 7% strong
- Bounce rate: ≤ 3% healthy, > 5% red

### 5. Funnel stepper (REBUILT)

**Old:** three horizontal bars (Sent / Opened / Clicked) stacked.
**New:** 5-column horizontal stepper.

**Columns:**
1. `Sent` — absolute + % of prospects
2. `Opened` — absolute + % of sent
3. `Clicked` — absolute + % of opens
4. `Replied` — absolute + % of clicks
5. `Booked` — absolute + % of replies (NEW stage, extends the product funnel)

Each column shows:
- Stage label (all-caps eyebrow with color dot)
- Big serif number
- `% of previous stage` as `b + regular text`
- Benchmark chip: ✓ Healthy / ✗ Below target
- Progress mini-bar (filled to the conversion %)

**Leak highlight:** the column with the biggest drop from benchmark gets a red tint (`.fun-step.leak`) and a small "BIGGEST DROP-OFF" tag in the top-right.

**Footer caption:** product-funnel explainer — "Email → click → landing page → signup → demo booking. Big drop between click and reply — …". Written by backend based on where the leak is.

### 6. Step-by-step table (MOVED from "Board" tab)

Per-sequence-step metrics. One row per step:

| # | Subject line | Sent | Open% | Click% | Reply% |
|---|---|---|---|---|---|
| 1 | Vercel's next 50 customers? | 310 | 34% | 16% | 0% |
| 2 | Quick question about hiring | 245 | 28% | 11% | 2.4% |
| 3 | Last try — 3-min read before you go | — | — | — | — |

Steps not yet sending show `—` with muted color.

Each percentage cell has a tiny horizontal progress bar below it (relative to the step's benchmark, not absolute). Orange/violet tint for best-performing step metric to surface A/B winners.

### 7. AI Recommendations (NEW)

Card with 3 insight rows. Each row:
- Small icon (star / persona / landing page)
- Body sentence — **bold** on the key fact, regular on the recommendation
- `Dismiss` + primary action button (e.g. `Apply & A/B test`, `Pause pre-seed`, `Open landing report`)

**Prototype has 3 concrete examples** — these should be generated server-side by rules + LLM. Rule examples to ship first:

- **Step shuffle**: if step N has ≥ 1.5× reply rate of step 1, suggest moving N earlier.
- **Segment pause**: if any persona/segment has < 0.5% reply rate over 50+ sends, suggest pausing.
- **Landing page leak**: if click rate is healthy but reply rate = 0, link to landing page conversion report.
- **Send-time shift**: if open rate drops on a specific weekday, suggest time adjustment.
- **Deliverability alert**: if spam rate spikes, suggest domain cooldown.

Start with hard-coded rules — LLM narration is nice-to-have.

### 8. Recent activity (UPDATED)

**Old:** raw log of all events.
**New:** same list but with a segmented filter at the top (`All / Replies / Clicks / Opens`) and a priority treatment — **replies get violet background**, other events are neutral. Opens and Sends are counted but grouped ("23 emails sent in Step 2 batch") to reduce noise.

Default filter = `All`. When `Replies` is selected and none exist → empty state "No replies yet. Your clicks are healthy — focus on landing page conversion to turn clicks into calls."

### 9. Right rail (NEW column)

Fixed-width 320px on screens ≥ 1280px. Hidden on narrower. Contains four small cards stacked:

1. **Live · last 24h** — pulsing green dot, last 3 events summarized ("3 new clicks · last hour").
2. **Next send** — "Tomorrow, 9:00 · Step 2 · 23 prospects queued · Warm-up 94/100".
3. **Domain health** — big score number (0–100) + one-liner on SPF/DKIM/bounce/spam.
4. **Quick actions** — shortcut list (Pause / Add prospects / Edit sequence / Export / Schedule report).

Keep this rail sticky so it stays visible while the main column scrolls.

---

## Tabs — what happens to removed ones

| Old tab | New home |
|---|---|
| Performance | Renamed to **Overview** (this spec) |
| Board | Deleted. "Step-by-step table" section in Overview replaces it. |
| Sent emails | Deleted. Fold into **Prospects** tab as a status filter chip ("Sent" / "Opened" / "Clicked" / "Replied" / "Bounced"). |
| Sequence | Keep. Add per-step perf mini-view at top (reuses Step-by-step table block). |
| Settings | Keep. No visual change required. |
| Prospects (333) | Keep. Add status filter chips at top (as above). |
| — | **Inbox** (new) — replies tab. Email threads view. Separate work. |

---

## Data model changes needed

```ts
// Campaign (add)
goal: {
  type: 'meetings' | 'replies' | 'signups' | 'clicks',
  target: number,
  deadline: string,   // ISO8601
  baseline?: number,  // for A/B campaigns
}

// Campaign analytics (add per-campaign)
healthStatus: 'ok' | 'warn' | 'bad'
healthMessage: string        // LLM or rule-generated
deltasVsPrevWeek: {
  sent:   number  // +12 => +12%
  opened: number
  clicked:number
  replied:number
}
dailySeries: {               // 7 days, for sparklines
  sent:    number[]
  opened:  number[]
  clicked: number[]
  replied: number[]
}
benchmarks: {                // returned so frontend doesn't hardcode
  openRate:  { healthy: 25, strong: 40 }
  clickRate: { healthy: 8,  strong: 15 }
  replyRate: { healthy: 3,  strong: 7 }
}

// New endpoint: funnel w/ between-stage conversion
GET /campaigns/:id/funnel
{
  stages: [
    { id:'sent',    count:310, fromPrev:93,  benchmark:'ok', leak:false },
    { id:'opened',  count:105, fromPrev:34,  benchmark:'ok', leak:false },
    { id:'clicked', count:49,  fromPrev:47,  benchmark:'ok', leak:false },
    { id:'replied', count:0,   fromPrev:0,   benchmark:'bad', leak:true  },
    { id:'booked',  count:0,   fromPrev:null,benchmark:null,  leak:false },
  ],
  note: 'Big drop between click and reply...',
}

// New endpoint: recommendations
GET /campaigns/:id/insights
{
  items: [
    {
      id: 'step-shuffle-1',
      severity: 'info' | 'warn' | 'critical',
      iconKind: 'star' | 'persona' | 'landing' | 'clock' | 'shield',
      body: '<b>Step 2 has 2× reply rate...</b>',   // safe HTML
      actions: [
        { label:'Dismiss', kind:'secondary', action:'dismiss' },
        { label:'Apply & A/B test', kind:'primary', action:{type:'reorder-steps', from:2, to:1} },
      ]
    }
  ]
}

// Domain health (already exists? — if not, new)
GET /user/sending-health
{ score: 94, spf:true, dkim:true, dmarc:true, bouncePct:0.9, spamPct:0.3, lastBounce: '2026-04-21' }
```

---

## Implementation order (PR breakdown)

1. **PR 1 — Header + tabs refactor.** Move status chip to header. Drop `Board` and `Sent emails` tabs. Route rewrites. No new components yet.

2. **PR 2 — KPI cards with sparklines + deltas.** Backend: add `deltasVsPrevWeek` and `dailySeries` to campaign analytics. Frontend: update 4 cards. No layout changes.

3. **PR 3 — Funnel rebuild.** New `/funnel` endpoint with per-stage conversion. New `Funnel` component with 5 stages + leak highlight. Replace current 3-bar block.

4. **PR 4 — Health strip + Goal card.** Backend: add `goal` to Campaign model + migration. `healthStatus` computation. Frontend: add the two top blocks above the KPI row. Include goal-creation modal.

5. **PR 5 — Step-by-step table** (from the old `Board` tab). Data already exists (step metrics) — just a new component.

6. **PR 6 — AI Recommendations.** Start with 3–5 hard-coded rules (see list in §7). LLM narration optional. Apply actions trigger existing mutations (reorder steps, pause segments).

7. **PR 7 — Recent activity filter + priority treatment.** Minor. Reuses existing activity feed.

8. **PR 8 — Right rail.** Live feed, next send, domain health, quick actions. Hidden below 1280px. Use existing endpoints; add `/sending-health` if missing.

9. **PR 9 — Inbox tab.** Separate feature, don't block on it for this redesign.

Ship PRs 1–5 as "v1 of the new detail" to beta users. PRs 6–8 as "v2 enhancements". PR 9 can go out anytime.

---

## What NOT to change (keep as-is)

- Sidebar — identical to existing. Don't touch.
- Breadcrumb navigation.
- Action button styles (black primary, white ghost).
- Color tokens.
- Typography (Instrument Serif for display numbers, Inter for UI).
- URL structure (`/campaigns/:id` stays).

---

## Testing checklist

- [ ] Header renders with live status chip (pulsing green dot)
- [ ] All 4 KPI cards show sparkline, delta, benchmark — no layout shift on load
- [ ] Funnel highlights the biggest drop-off stage in red
- [ ] Goal card shows "no goal" empty state when `goal` is null
- [ ] Health strip reflects all 3 states (ok/warn/bad) based on backend
- [ ] AI insights render when `/insights` returns items, hide card otherwise
- [ ] Right rail hidden on viewport < 1280px
- [ ] Tabs navigate correctly, no 404 on deleted `/board` and `/sent-emails` routes (redirect to new locations)
- [ ] All screens work at 1440, 1280, 1024, 768, 375 px widths
- [ ] Dark-mode tokens applied cleanly (if supported — current app is light-only, check with design)

---

## Open questions for the implementer

1. **Where does "Booked" data come from?** If we don't have calendar integration yet, show the stage as `—` with text "Awaiting replies" (matches current prototype).
2. **Who can set/edit goals?** Campaign owner only, or workspace admins too?
3. **AI insights — cache or live?** Recommendation: cache for 15 min, invalidate on significant KPI change (± 5%).
4. **Domain health score** — compute from postmark/sendgrid metrics, or read directly from their API?

---

## Contact

Questions → Lukas (`lukas@plat4m.com`). Design prototype is authoritative for visuals; this doc is authoritative for data/behavior.

Prototype file: `prototype-campaign-detail.html` (this repo).
