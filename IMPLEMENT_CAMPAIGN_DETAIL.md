# IMPLEMENT — New Campaign Detail View (Outpulse app)

> Copy this entire document as your task brief. It is self-contained.
> You're working on the Outpulse app (app.outpulse.ai) — a cold-email
> automation tool for founders and sales leaders. Your job: rebuild
> the campaign detail page to match the new prototype.

---

## 1. Reference assets

| What | Where |
|---|---|
| Visual prototype (live) | `https://outpulse.ai/prototype-campaign-detail` |
| Prototype source HTML | `prototype-campaign-detail.html` in the landing repo (`Lukas-Horak/outpulse-landing`) |
| This brief | `IMPLEMENT_CAMPAIGN_DETAIL.md` (same repo) |
| Design system reference | `design-system-ui.html` (same repo) |

**Before writing any code, open the prototype in a browser and click through all 5 tabs.** That is the pixel-level source of truth. This document is the source of truth for *behavior, data, and implementation priority*.

---

## 2. Current state (what's live — the thing you're replacing)

The live page at `app.outpulse.ai/campaigns/<id>` is an informational dashboard. Looking at the production screenshot:

- **Page header**: title, ACTIVE badge, "333 prospects · 310 sent · 105 opened" metadata
- **Tabs**: `Performance | Board | Sent emails | Sequence | Settings | Prospects (333)` — 6 tabs, parallel features, unclear hierarchy
- **4 KPI cards**: SENT 310 / OPENED 105 / CLICKED 49 / REPLIED 0 — big serif numbers on soft pastel cards
- **Funnel section**: 3 horizontal progress bars (Sent / Opened / Clicked) stacked vertically — no between-stage conversion rates, no "Booked" stage
- **Product funnel caption**: one line of text explaining click-rate is healthy
- **RECENT ACTIVITY**: raw chronological log of opens/clicks/email-sents, no filter, no priority

### Problems with the live version

1. Tabs don't tell a story — 6 parallel features with unclear hierarchy.
2. KPI cards duplicate what the funnel shows (the "49 clicked" card and the "Clicked" bar in the funnel are the same number twice).
3. Funnel has no conversion rates between stages, no "biggest drop" indication, no per-step context.
4. No goal tracking — there's no target, so no sense of "am I winning?".
5. No AI recommendations — it's reporting, not an assistant.
6. Recent Activity is a raw log. With 310 sends and 105 opens, the user wades through 400 rows to find the 1 reply (or lack thereof).
7. Right rail (live feed, next send, domain health) doesn't exist — user has no awareness of current system state without navigating elsewhere.

---

## 3. Target state (what to build)

A goal-oriented **operator cockpit** split into 5 tabs. Each tab corresponds to one mental mode:

| Tab | Question it answers | Mode |
|---|---|---|
| **Overview** | "How is the campaign doing?" | diagnostics |
| **Sequence** | "What are we saying to prospects?" | content editor |
| **Prospects** | "Who is at what stage?" | CRM |
| **Inbox** | "Who replied?" | conversation |
| **Settings** | "How is the machine configured?" | config |

### Tab restructure summary (live → new)

| Live tab | New home |
|---|---|
| `Performance` | Renamed to **Overview**; rebuilt from scratch (see §4) |
| `Board` | **Deleted.** Step-level performance now lives in Overview + Sequence |
| `Sent emails` | **Deleted.** Filter chip on the Prospects tab replaces it |
| `Sequence` | Kept, rebuilt as a visual flow (see §5) |
| `Settings` | Kept, structured into 5 sections (see §8) |
| `Prospects (333)` | Kept, rebuilt with status filter chips + CRM table (see §6) |
| — | **Inbox** (new tab, see §7) |

---

## 4. OVERVIEW tab — the new main panel

Four visual tiers, stacked vertically in `.main`, with a fixed right-rail beside them.

### Tier 1 — Orient (two-line text block, not a card)

```
● status dot   At risk. Click rate 16% healthy, but reply rate 0% is below
               the 3% target. People click but don't reply.              [Jump to insights ↓]

● goal dot    [GOAL]  25 discovery calls this month · 0 booked · off pace
               — need 6/week                      [●━━━━━━━━━━━]  [Adjust]
```

- Two rows. No background, no border. Just a small colored dot + text + a progress mini-bar on the goal row.
- Status chip (bold tint) indicates severity: `ok` / `warn` / `bad` (green / amber / red dot).
- `[Jump to insights ↓]` is an in-page anchor to the Recommendations block below.

### Tier 2 — Hero Funnel (the star of the page)

Replaces both the old KPI cards AND the old funnel bars. Pattern: **interlocking chevron cards** (the same pattern used in the Pulse dashboard's funnel — `prototype-preview.html` → `pulse-funnel`).

- Cream background panel (`--bg-panel`) with rounded corners
- 5 chevron cards in a row: `Sent 310/333 | Opened 105 | Clicked 49 | Replied 0 | Booked —`
- Each card's point fits into the next card's notch (1px stroke outline via clip-path trick — see prototype CSS `.pf`, `.pf-inner`)
- Inside each chevron: **only** a big serif number (34px) + a small uppercase label. That's it. No sparklines, no arrows, no benchmark chips inside.
- Leak stage ("Replied 0") has red-tinted number only (card stays white)
- Below the row: a single quiet caption separated by hairlines:
  > `93% delivered · 34% open rate · 47% of opens click · **0% reply — biggest drop** · booking awaits`

Period selector (7d / 30d / All) top-right of the panel.

Mobile: chevrons collapse to normal stacked cards (clip-path cleared).

### Tier 3 — Tactics (two columns, different visual treatments)

Two-column grid (`1.2fr 1fr`), stacks to single column below 1080px.

**LEFT — Per-step performance** (stark white data table)
- Columns: `# | Subject | Open% | Click% | Reply%`
- 3 rows for the 3 steps
- Step 2 row has orange-soft background + "best" tag + bold Step-2 number circle (orange)
- Pending step 3 row muted

**RIGHT — Recommendations** (colored left-bar list, no borders between)
- 3 cards, each with a colored left-bar (orange / violet / red), round icon, title, short paragraph, 2 buttons (`Apply` / `Dismiss`)
- Copy templates:
  1. "Swap step 2 to first position" — orange, star icon
  2. "Pause the pre-seed segment" — violet, persona icon
  3. "Landing page is the leak, not the email" — red, alert icon

The two columns look **visually different** so they can't blur together.

### Tier 4 — Log (plain list, bottom)

- No card chrome. Just a header + vertical list of hairline rows.
- Filter chips top-right: `All 47 | Replies 0 | Clicks 49 | Opens 105`
- Each row: colored dot (violet=reply, blue=click, green=open, grey=send) + "Name · Company · action · detail" + timestamp
- Opens and Sends get grouped to reduce noise ("23 emails sent in Step 2 batch")

### Right rail (320px fixed, hidden below 1280px)

Sticky column beside Overview. Four small white cards:
1. **Live · last 24h** (pulsing green dot) — last 3 events summarized
2. **Next send** — "Tomorrow, 9:00 · Step 2 · 23 prospects queued · Warm-up 94/100"
3. **Domain health** — big score (e.g. "94") + one-liner on SPF/DKIM/bounce/spam
4. **Quick actions** — shortcut list (Pause, Add prospects, Edit sequence, Export, Schedule report)

---

## 5. SEQUENCE tab

Shows the 3 email steps as a visual flow. Think "email thread": each step is a message card connected by a dashed vertical line, with "Wait 2 days" pills between them.

### Layout

- **Panel head**: eyebrow "Sequence", h2 "3 steps, 2-day delay between each", subtitle, actions `[Test send to me]` `[+ Add step]`
- **Flow of 3 step-cards** (vertical, connected by dashed line)
- Each step card:
  - Left: numbered circle (orange for active step, grey for pending)
  - Right: white/panel card containing:
    - Status chip (`Sent to all · 310` / `Sending · 245 so far` / `Pending · queued`) + optional `Best performer` tag or "Starts tomorrow" info
    - Big subject line (16px semibold)
    - Body preview (italic serif-feeling, left-bordered block)
    - Metrics row: `34% open · 16% click · 0% reply` (color-coded)
    - Actions: `[Edit] [A/B test] [Variables]`
- "Wait 2 days" pill between steps (inline text, no card)
- **Below the flow**: `Sequence rules` card (reuses the Rules list component — 4 rows with `On/Off` pills)

### Step statuses

| Status | Visual |
|---|---|
| `Sent to all · N` | green dot + green-soft background |
| `Sending · N so far` | blue dot + blue-soft background |
| `Pending · queued` | grey dot + muted; card has dashed border |

---

## 6. PROSPECTS tab

CRM-style table of all prospects with status filter chips.

### Layout

- **Panel head**: eyebrow "Prospects", h2 "333 in this campaign", subtitle, actions `[Import CSV]` `[+ Find more like these]`
- **Filter chips** (segmented control, not tabs): `All 333 | Not sent yet 23 | Sent 310 | Opened 105 | Clicked 49 | Replied 0 (muted) | Bounced 3`
- **Toolbar**: search input (full-width-ish) + sort select
- **Table**: checkbox | `Avatar + Name/Company` | `Role` | `Status pill` | `Last activity` | `Match score`
- 8–12 rows per page, "Showing 1–8 of 333" + pagination footer

### Status pills (colored)

- `Sent` — grey
- `Opened` — green
- `Clicked` — blue
- `Replied` — violet
- `Bounced` — red

### Match score chip

- 80+ → orange tint (`.hi`)
- 40–80 → neutral
- <40 → muted (`.lo`)

### Avatars

Use colored gradient circles with initials. No photos. Gradient pool: orange / violet / pink / green / red-pink / blue — roll through for variety. (See prototype JS for exact palette.)

---

## 7. INBOX tab

Two-pane split view (like Gmail). Empty state by default since the campaign has 0 replies.

### Layout

- **Panel head**: "Inbox", "Replies & conversations"
- **Split pane**: `320px | 1fr` (stacks below 980px)
  - **Left (thread list)**: filter chips at top (`All | Unread | Positive | Needs reply`), then thread list OR empty state
    - Empty state: small mail SVG + "No replies yet" + hint linking to Recommendations in Overview
  - **Right (reading pane)**: empty state with target SVG + "Select a thread to reply"
- When a thread is selected, reading pane shows the email chain + reply composer at bottom (not shipped in v1, but design for it — see open questions)

---

## 8. SETTINGS tab

Stacked sections, each a white card with a serif h3 and form rows.

### Sections

1. **General** — Name (text input), Status (Active chip + Pause button), Owner (avatar + name), Goal (text + Edit)
2. **Sending** — From address (with warm-up score), Schedule (days + hours + timezone), Daily cap, Signature
3. **Rules** — 5 toggleable rules (Stop on reply, Stop on meeting booked, Skip weekends, Bounce threshold, Domain throttle)
4. **Integrations** — CRM (HubSpot connected), Calendar (Google connected), Slack (not connected — link to connect)
5. **Danger zone** — red-bordered card with Archive + Delete buttons

Rules list uses the same visual as Sequence → same component.

---

## 9. Header (all tabs share)

- Breadcrumb: `Campaigns / Dogfood campaign V2 (plat4m)`
- Title: h1 (serif, 28–38px) with the workspace in parentheses as muted
- Subline: status chip (pulsing green "Active") + metadata dots (`333 prospects · 310 sent · 105 opened · 49 clicked · Step 2 of 3 sending`)
- Actions right-aligned: `[Pause] [Edit sequence] [+ Add prospects]` (last one is primary black pill)

Nav tabs below the header (see §3 for list).

---

## 10. Sidebar (left, 240px, fixed)

No change from current app. Brand mark, search, "+ New campaign" button, sections Find Clients / Engage (active: Campaigns) / Growth, user footer. Keep as-is.

---

## 11. Data model changes required

```ts
// Campaign
goal: {
  type: 'meetings' | 'replies' | 'signups' | 'clicks',
  target: number,
  deadline: string,              // ISO8601
}

// Campaign analytics
healthStatus: 'ok' | 'warn' | 'bad'
healthMessage: string             // LLM or rule-generated TL;DR
deltasVsPrevWeek: {
  sent:   number                  // +12 => +12%
  opened: number
  clicked:number
  replied:number
}
dailySeries: {                    // 7 days for sparklines (if we keep any — prototype v2 dropped them from funnel chevrons)
  sent:    number[]
  opened:  number[]
  clicked: number[]
  replied: number[]
}
benchmarks: {                     // returned so FE doesn't hardcode
  openRate:  { healthy: 25, strong: 40 }
  clickRate: { healthy: 8,  strong: 15 }
  replyRate: { healthy: 3,  strong: 7 }
}
```

### New endpoints

```ts
GET /campaigns/:id/funnel
{
  stages: [
    { id:'sent',    count:310, total:333, fromPrev:93,  benchmark:'ok', leak:false },
    { id:'opened',  count:105, fromPrev:34, benchmark:'ok', leak:false },
    { id:'clicked', count:49,  fromPrev:47, benchmark:'ok', leak:false },
    { id:'replied', count:0,   fromPrev:0,  benchmark:'bad', leak:true  },
    { id:'booked',  count:0,   fromPrev:null,benchmark:null, leak:false },
  ],
  caption: '93% delivered · 34% open rate · 47% of opens click · **0% reply — biggest drop** · booking awaits',
}

GET /campaigns/:id/insights
{
  items: [
    {
      id: 'step-shuffle-1',
      severity: 'info' | 'warn' | 'critical',
      color: 'orange' | 'violet' | 'red',
      iconChar: '★' | '◎' | '!',
      title: 'Swap step 2 to the first position',
      body: 'Step 2 has 2× the reply rate of Step 1...',
      actions: [
        { label:'Apply', kind:'primary', action:{type:'reorder-steps', from:2, to:1} },
        { label:'Dismiss', kind:'secondary', action:'dismiss' },
      ]
    }
  ]
}

GET /user/sending-health
{ score: 94, spf:true, dkim:true, dmarc:true, bouncePct:0.9, spamPct:0.3, lastBounce: '2026-04-21' }
```

### Benchmarks (B2B cold email medians — tune from real data over time)

- Open rate: `≥ 25%` healthy, `≥ 40%` strong
- Click rate: `≥ 8%` healthy, `≥ 15%` strong
- Reply rate: `≥ 3%` healthy, `≥ 7%` strong
- Bounce rate: `≤ 3%` healthy, `> 5%` red

### Rules for `healthStatus`

- `ok`: all KPIs above healthy benchmark
- `warn`: at least one KPI below benchmark but not critical (e.g. click rate healthy, reply rate 0)
- `bad`: send velocity stalled, spam rate > 1%, domain flagged, or open rate < 15%

### Rules for generating insights

Start with hard-coded rules before reaching for LLM narration:

1. **Step shuffle**: if step N has ≥ 1.5× the reply rate of step 1, suggest moving N earlier.
2. **Segment pause**: if any persona/segment has < 0.5% reply rate over 50+ sends, suggest pausing.
3. **Landing page leak**: if click rate is healthy but reply rate = 0, link to landing-page conversion report.
4. **Send-time shift**: if open rate drops on a specific weekday, suggest time adjustment.
5. **Deliverability alert**: if spam rate spikes, suggest domain cooldown.

---

## 12. Implementation order (PR-by-PR)

Ship Overview first, other tabs later. Users land on Overview; the rest can be iterated.

| PR | Scope | Depends on |
|---|---|---|
| 1 | Header refactor + tab nav (5 tabs, drop Board & Sent emails) | — |
| 2 | Tier 1 Orient strip + Goal card (backend: `goal` field + pace calc) | — |
| 3 | Tier 2 Hero Funnel — chevron stepper replaces KPI cards + old funnel | new `/funnel` endpoint |
| 4 | Tier 3 Per-step table (data already exists) | — |
| 5 | Tier 3 Recommendations — hard-coded rules, 3 card types | new `/insights` endpoint |
| 6 | Tier 4 Activity log w/ filter | — |
| 7 | Right rail (live feed, next send, domain, quick actions) | `/sending-health` if missing |
| 8 | Sequence tab — flow view + rules list | step data exists |
| 9 | Prospects tab — filter chips + CRM table | prospect data exists |
| 10 | Inbox tab — empty state v1; thread view v2 | replies data |
| 11 | Settings tab — 5 sections | — |

PRs 1–7 = "new Overview ships". Launch to beta. PRs 8–11 roll out the other tabs.

---

## 13. What stays the same (do NOT change)

- Left sidebar (layout, brand, nav items, user footer)
- Breadcrumb + main header action buttons style
- Design tokens: `--ink`, `--ink-2`, `--muted`, `--line`, `--orange`, `--violet`, `--blue`, `--green`, `--bg-panel`, `--bg-subtle`
- Typography: **Instrument Serif** for display/big numbers, **Inter** for UI, **JetBrains Mono** for step numbers / numeric IDs
- URL structure: `/campaigns/:id` stays; no sub-routes per tab unless you want deep-linking (nice-to-have, e.g. `/campaigns/:id?tab=sequence`)
- Color palette + pill styles for statuses (live/pending/etc.)

---

## 14. Visual rules — "minimalism" the user cares about

The user explicitly asked for this. Uphold these rules when building:

1. **One hero per screen.** In Overview, the hero is the chevron funnel. Everything else sits below it at lower visual weight.
2. **No duplicate numbers.** If a number is in the funnel, don't also put it in a card above or below. (This is why KPI cards were removed.)
3. **Different tiers get different visual treatments.** Tier 2 has cream panel + chevron cards. Tier 3 has white tables (left) and bordered list (right). Tier 4 has no chrome at all. Never use the same card style for two adjacent blocks.
4. **Prefer inline text over cards.** The status line and goal line in Tier 1 are NOT cards. They're text with small colored dots. Reserve card chrome for things with internal structure.
5. **Big numbers are the only decoration.** Serif 34–48px serif numbers carry the visual weight. Avoid extra icons, background tints, or color splashes around them.
6. **Color = meaning, not decoration.** Green = healthy, red = problem, orange = action, violet = reply/positive, blue = click. Never use color just to make something "pop".
7. **40px between major tiers.** Generous whitespace is part of the hierarchy — do not tighten the grid gap when things feel empty.

---

## 15. Testing checklist before shipping

Overview tab:
- [ ] Health strip renders all 3 states (ok/warn/bad) based on API
- [ ] Goal card shows empty state when `goal` is null ("Set a campaign goal" + button)
- [ ] Chevron funnel renders correctly at 1440, 1280, 1080 (collapses below 1080)
- [ ] Leak stage red-tints the number only, not the whole card
- [ ] Per-step table highlights the winning step (highest reply rate) with orange tint
- [ ] Recommendations hide entirely when `/insights` returns empty
- [ ] Activity log filter chips work, "Replies 0" shows empty state
- [ ] Right rail hidden below 1280px

Sequence tab:
- [ ] Active step has orange numbered circle, pending step has dashed border
- [ ] "Wait 2 days" pill renders between each step
- [ ] Rules list toggles via API (not prototype-only)

Prospects tab:
- [ ] All status filters filter the table correctly
- [ ] Bulk-select bar appears when one or more rows are selected
- [ ] Search filters by name, company, email
- [ ] Pagination works (20 per page default)

Inbox tab:
- [ ] Empty state renders when replies = 0
- [ ] Thread list populates when replies > 0
- [ ] Selecting a thread opens it in the right pane
- [ ] Reply composer sends a real email via the sending endpoint

Settings tab:
- [ ] Each section saves changes via API
- [ ] Danger zone requires confirmation dialog before archive/delete
- [ ] Rule toggles persist across reloads

Cross-cutting:
- [ ] All 5 tabs render correctly at 1440, 1280, 1024, 768, 375
- [ ] Tab switch scrolls back to top of main
- [ ] Deleted `/board` and `/sent-emails` routes redirect to new locations (302)

---

## 16. Open questions you should raise before shipping

1. **Goal permissions** — campaign owner only, or any workspace admin?
2. **"Booked" data source** — do we have calendar integration? If no, show stage as `—` with "Awaiting replies" caption (prototype does this).
3. **Insights caching** — recommend 15-min cache, invalidate on significant KPI change (±5%).
4. **Domain health** — compute from postmark/sendgrid metrics directly or keep an aggregated `sending-health` doc?
5. **Deep-link tabs** — `?tab=sequence` URL param, or is in-session state enough?
6. **Inbox threading** — how do we group replies into a thread if they land in different Gmail conversations?

---

## 17. Contact

- Product & design: Lukas Horak (`lukas@plat4m.com`)
- Prototype source: `prototype-campaign-detail.html` in `Lukas-Horak/outpulse-landing`
- Prototype is authoritative for visuals; this document is authoritative for data, behavior, and priority.

**Go build it. When you hit a judgment call the prototype + this doc can't answer, ask.**
