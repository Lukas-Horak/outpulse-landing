# Pulse — Feature Specification

**Version:** v3.1
**Date:** April 12, 2026
**Status:** Pre-implementation — approved concept, pending final prototype sign-off

---

## 1. Overview

Pulse is a goal-tracking retention feature for Outpulse. Users set a revenue or client goal; the system reverse-calculates what's needed to get there, shows daily progress on the dashboard, and sends a daily morning email with status + actionable advice.

Pulse positions Outpulse as a **multi-channel growth platform**, not just an email tool. Cold outreach is one channel among many — Pulse tracks the full picture.

---

## 2. Core Concept

### Reverse Funnel (Visits-First)

The funnel always works backwards from the goal to **website visits needed** — NOT emails sent. Emails are a tactic within one channel, not the primary output.

**Two distinct funnel types based on business model:**

#### Product / SaaS Funnel (5 steps)
```
Goal (revenue/clients)
  ↑ Paying customers needed
  ↑ Activated users needed      (activated → paying %)
  ↑ Signups needed              (signup → activated %)
  ↑ Engaged visitors needed     (engaged → signup %)
  ↑ WEBSITE VISITS NEEDED       (visit → engaged %)
```
"Website visits" = all unique visitors from any source (outreach clicks, organic, social, ads).
"Engaged" = visitors who viewed product/pricing page (not just bounced).

#### Service Funnel (6 steps)
```
Goal (revenue/clients)
  ↑ Closed deals needed
  ↑ Proposals sent              (proposal → close %)
  ↑ Calls / Meetings            (call → proposal %)
  ↑ Inquiries / Replies         (inquiry → call %)
  ↑ Engaged visitors needed     (engaged → inquiry %)
  ↑ WEBSITE VISITS NEEDED       (visit → engaged %)
```
"Engaged" = visitors who viewed services/contact page.
"Inquiries" = contact form submissions, email replies, DMs.

Key difference: services don't have "signups" or "activated" — they have inquiries, calls, proposals.

### Dual-Channel Architecture

Customers come from TWO parallel channels, each with its own funnel:

#### Channel 1: Cold Outreach (reply-based, tracked in Outpulse)
```
Unique prospects
  → Emails sent (3 per sequence)
  → Total replies (4% reply rate)
  → Positive replies (50% of replies)
  → Customers (25% of positive replies convert)
```
NOT measured in "visits." Cold email generates direct conversations, not website traffic.

Realistic limits: ~60 emails/day per email account. If daily volume exceeds this, Pulse recommends additional email accounts (e.g., "Use 3 accounts sending ~55 emails each for best deliverability").

#### Channel 2: Website Traffic (visits-based, tracked via GA4)
Uses the Product or Service funnel above. Traffic from SEO, listings, LinkedIn content, referrals, ads.

#### Customer Split
User sets % split: e.g., "35% from outreach, 65% from website." Each channel calculates independently toward the shared goal.

### Compound Improvement Insight
Under each funnel preview, show: "Improving each step by just 2 percentage points would reduce [visits/emails] needed by X%. Every step matters." This is calculated live from current conversion rates.

---

## 3. Setup Flow (Onboarding)

Last step of the onboarding checklist. 4-step wizard:

### Step 0: Business Type + Deal Value
- **"Do you sell a product or a service?"** — toggle between Product and Service
- **"Average deal / sale value ($)"** — input field
- Auto-detects Thiel pricing tier based on value
- Shows tier card with distribution insight (educational)
- Shows all 5 Thiel tiers for context

### Step 1: Goal
- Toggle: Revenue ($) or Clients (#)
- Input: monthly target
- Live calculation: "X paying customers needed"

### Step 2: Conversion Rates
- Editable fields with industry defaults
- **Product funnel defaults:**
  - Visit → Signup: 15% (SaaS avg 2-5%, landing page 10-30%)
  - Signup → Activated: 40% (good: 40-60%, great: 60-80%)
  - Activated → Paying: 25% (freemium: 2-5%, free trial: 15-30%)
- **Service funnel defaults:**
  - Visit → Reply/Inquiry: 3% (cold traffic), 8% (warm/referral)
  - Reply → Call booked: 40%
  - Call → Proposal: 50%
  - Proposal → Close: 30%
- Live reverse funnel preview updates as user edits numbers
- Benchmark hints shown under each field

### Step 3: Growth Channels
- Shows: "You need X visits this month. Here's how to get there."
- Channel sliders (% of total visits):
  - Cold outreach (marked OUTPULSE — automated)
  - LinkedIn (marked OUTPULSE — automated)
  - Product listings (PH, G2, directories)
  - SEO & Content
  - Referrals & Other
- Default percentages vary by Thiel tier
- Total must equal 100% (warning if not)
- Cold email detail breakdown below: emails needed, prospects needed, emails/day

---

## 4. Thiel Pricing Tiers (Zero to One Framework)

Distribution method is dictated by price point. Included educationally during setup.

| Tier | Range | Label | Sales Motion |
|------|-------|-------|-------------|
| Micro | $1–$100 | Viral / Self-serve | Product sells itself, zero friction |
| Low | $100–$1K | Self-serve + Nudge | Click, try, pay. One email seals it |
| Mid | $1K–$10K | Inside Sales | Demo/call needed. Outpulse books it |
| High | $10K–$100K | Field Sales | Multiple stakeholders, longer cycle |
| Enterprise | $100K+ | Complex Sales | Months-long, relationship-driven |

Each tier has:
- Default channel mix percentages
- Contextual insight text
- Appropriate funnel model (product tiers use product funnel, high/enterprise always use service funnel)
- Mid tier ($1K-$10K) asks explicitly: product or service? (could be either)

---

## 5. Dashboard Widget

### Design: Green gradient card (approved direction)
- Dark green gradient background (135deg, #1B4332 → #2D6A4F → #40916C)
- Subtle glow effect (radial gradient, top-right)
- Glass-like transparency on inner elements

### Layout:
```
┌──────────────────────────────────────┐
│ PULSE                    ↑ On track  │
│ 14 / 68                             │
│ paying customers                     │
│                                      │
│ ████████░░░░░░░░░░░░  21% · 18 left │
│                                      │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│ │312 │ │ 58 │ │ 22 │ │ 14 │        │
│ │/4534│ │/680│ │/272│ │/68 │        │
│ │Visit│ │Sign│ │Actv│ │Pay │        │
│ └────┘ └────┘ └────┘ └────┘        │
│                                      │
│ Today's target    Outpulse sending   │
│ 152 visits        LinkedIn active    │
└──────────────────────────────────────┘
```

For **service funnel**, the 4 boxes change to:
```
Visits | Replies | Calls | Closed
```

### Status badge logic:
- **On track** (green): current pace meets or exceeds target
- **Behind** (orange): current pace below target
- **Ahead** (bright green): significantly ahead of schedule

---

## 6. Statistical Sample Warning

When conversion data is based on small numbers, the dashboard and Pulse plan should show a warming-up indicator.

### Minimum sample sizes:
- **Visits:** need ~200+ for reliable visit→signup conversion rate
- **Signups:** need ~50+ for reliable signup→activated rate
- **Activated:** need ~30+ for reliable activated→paying rate

### Display:
- When sample is below minimum: show amber badge "Warming up · X/200 visits for reliable data"
- Conversion percentages shown with "~" prefix to indicate estimate
- Tooltip/info: "These conversion rates will become more accurate as you get more traffic. We recommend at least 200 visits before adjusting your growth plan."

### On admin dashboard:
- Current metrics (11 visits, 3 signups) should show "Early data" indicator
- Conversion rates displayed as "~27%" with note about sample size
- Progress bar or indicator toward statistical significance

---

## 7. Daily Morning Email

Sent daily (e.g., 7:00 AM user's timezone). Personalized based on actual performance data.

### Structure:
1. **Subject line:** "Day X: Y paying customers (Z% to goal)"
2. **Funnel snapshot** — 4 metrics with progress bars (visits, signups/replies, activated/calls, paying)
3. **Outpulse activity yesterday** — emails sent, clicks, replies, LinkedIn activity
4. **Adaptive advice section** (see below)

### Adaptive Logic:

#### When BEHIND target:
- Tone: supportive but action-oriented
- Provide specific, actionable advice based on which metric is weakest:
  - Low visits → "Your traffic is below target. Consider: sharing a LinkedIn post about [topic], submitting to [relevant directory], boosting cold outreach volume."
  - Low signup rate → "Visitors aren't converting. Try: updating your landing page headline, adding social proof, simplifying the signup flow."
  - Low activation → "Users sign up but don't activate. Try: improving your onboarding email sequence, reducing steps to first value, adding a welcome video."
  - Low conversion to paid → "Active users aren't paying. Try: adjusting your pricing page, adding urgency (limited offer), reaching out personally to active users."
- For services (low replies/calls): "Reply rate is below target. Try: A/B testing subject lines, sending at different times, personalizing the opening line more."
- Link to relevant Outpulse features or settings that can help

#### When ON TRACK:
- Tone: encouraging, brief
- "Looking good! Your campaigns are performing well. Keep the momentum going."
- Highlight best-performing metric
- Optional: "At this pace, you'll hit your goal by [date]."

#### When AHEAD of target:
- Tone: celebratory
- "You're ahead of schedule! Consider raising your target or reinvesting in a new channel."
- Suggest expanding to new channels or increasing volume

---

## 8. Multi-Channel Strategy

Pulse's key messaging: **Outpulse is not just email.** It's a growth platform that helps across channels.

### Channels Outpulse handles automatically:
- **Cold email outreach** — finds prospects, writes personalized emails, sends sequences, handles follow-ups
- **LinkedIn outreach** (future) — connection requests, profile engagement, DMs

### Channels Outpulse helps with (guidance/tools):
- **Product listings** — templates for PH launch, directory submissions, G2 profile optimization
- **Content / SEO** — AI-generated blog post ideas, email-to-blog repurposing
- **Landing page optimization** — A/B testing (already built), conversion tips

### Channels tracked but user-driven:
- **Referrals** — track referral traffic, suggest referral program setup
- **Events / Conferences** — log networking contacts, import into Outpulse
- **Paid ads** — track ad-driven traffic separately

---

## 9. Technical Implementation Notes

### Database:
- New table: `pulse_goals` — user_id, business_type (product/service), deal_value, goal_type, goal_value, tier_id, conversions (jsonb), channels (jsonb), created_at, updated_at
- New table: `pulse_daily_snapshots` — user_id, date, visits, signups, activated, paying, replies, calls, proposals (nullable based on funnel type)
- Add to onboarding checklist: pulse_setup_complete boolean on profiles

### Cron jobs:
- `pulse-daily-email` — runs at 07:00 UTC, sends personalized Pulse email to all users with active goals
- `pulse-snapshot` — runs at 00:00 UTC, captures daily metrics for each user

### Google Analytics Integration (MVP required):
- Final step of Pulse setup: "Connect Google Analytics"
- Simplest method: user pastes their GA4 Measurement ID (G-XXXXXXX)
- We use GA4 Data API (or Measurement Protocol) to pull visit counts
- Fallback: manual entry ("How many visits did you get this week?")
- This is the ONLY way we track visits — no custom pixel in MVP
- Store GA4 measurement_id in pulse_goals table

### Dashboard integration:
- Pulse widget renders on main dashboard (not admin)
- Pulse is the LAST step of the onboarding checklist — user is guided toward it
- After checklist complete, Pulse widget is always visible and prominent
- Collapsible — users can minimize if they want
- Data source: visits from GA4 API, signups/activated/paying from Supabase profiles + subscriptions

### Daily email:
- Uses existing email infrastructure (Resend/SES)
- Adaptive advice: rule-based initially, can upgrade to AI-generated advice later
- Unsubscribe option in footer

---

## 10. Implementation Priority

### Phase 1 (MVP — ship with PH launch if possible):
1. Setup flow (4 steps, stored in pulse_goals)
2. Dashboard widget (the green card)
3. Basic daily email (funnel snapshot + static advice)

### Phase 2 (Week after launch):
4. Adaptive email advice (rule-based)
5. Statistical sample warnings on admin + Pulse
6. Channel breakdown in plan view

### Phase 3 (Future):
7. LinkedIn outreach integration
8. AI-generated daily advice (using Claude)
9. Product listing templates
10. Referral tracking

---

## 11. Landing Page A/B Test (Decided)

**Variant A (current):** "Your AI Outreach Agent"
**Variant B (new):**
- Headline: "Your next 10 clients are already waiting"
- Subtitle: "From cold prospect to paying customer. Zero manual work."

Implementation: cookie-based assignment, tracked in GA4 + profiles.landing_variant, visible in admin dashboard.

---

## 12. Open Questions

1. ~~**Visits tracking for users:**~~ RESOLVED — GA4 integration. User connects GA4 Measurement ID in Pulse setup.
2. **LinkedIn integration timeline:** When can we realistically ship LinkedIn outreach? This affects whether we show it as "coming soon" or "active" in Pulse
3. **Service funnel data sources:** For service businesses, where do we track replies and calls? Currently campaign_prospects has reply data, but calls/proposals need manual input or CRM integration
4. **Goal adjustment:** Should users be able to change their goal mid-month? If yes, how do we handle the historical data?
