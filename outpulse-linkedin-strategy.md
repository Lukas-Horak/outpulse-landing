# Outpulse — LinkedIn Multichannel Strategy

**Author:** planning doc for Lukas Horak
**Date:** 2026-04-11
**Status:** Planning only — not to be implemented in April. Target implementation window: May 2026.

---

## Why this matters

Outpulse today is email-only. The biggest competitive differentiator in the outbound tooling market is multichannel: the ability to run a prospect through email + LinkedIn + (optionally) WhatsApp in one coordinated sequence.

The market split right now:

- **Email-first tools:** Instantly, Smartlead, Lemlist — dominant in email, weak or absent on LinkedIn.
- **LinkedIn-first tools:** HeyReach, Expandi, Dripify — strong LinkedIn automation, weak on email.
- **Multichannel leaders:** Salesmotion, Amplemarket, Outreach — unified but priced at $150–$500/seat/mo, enterprise-focused.

Outpulse's opportunity is to be the first **multichannel tool priced for solo founders and small teams** ($149/mo Growth plan) with AI-native copy generation baked in. LinkedIn is the single feature that unlocks that positioning.

The data also backs it: coordinated email + LinkedIn + phone sequences boost results by ~287% over email-only (Martal 2026 benchmarks). LinkedIn lead-to-opportunity conversion sits at 12–18% vs 1–3% for cold email. Combining the two roughly doubles meeting volume per prospect.

---

## Why not now (April)

April goal is 300 paying customers by end of month. Building LinkedIn automation is 5–10 days of dev + testing, which consumes most of the runway and produces no signups. The correct sequence is:

1. **April:** Prove email-only base works with dogfooding. Get first paying customers, fix funnel leaks, stabilize.
2. **May:** Build LinkedIn as the "second channel," using learnings from April to inform UX.
3. **June:** Launch multichannel as a headline feature with a pricing bump and a public launch (ProductHunt, HN, Twitter).

---

## Recommended technical approach: Unipile API

After reviewing the options, I recommend building on **Unipile** (https://unipile.com) rather than scraping or building a Chrome extension.

**Why Unipile:**

- Single unified API for LinkedIn, WhatsApp, Instagram, Telegram, Gmail, Outlook. One integration gives Outpulse access to multiple channels in the future.
- They handle the LinkedIn auth complexity (cookie + user agent + proxy rotation) and take ban risk on themselves.
- Webhook events for incoming messages — same pattern as the existing Gmail OAuth reply detection, so the reply-handling code can be reused.
- Pricing: ~€39/month per connected account, billed per seat. Cheap enough to pass through in the Growth plan without changing Outpulse's margin.
- Compliant with LinkedIn's published API where possible, falls back to automation where not. LinkedIn has tolerated Unipile-style integrations longer than raw scraping tools.

**Alternatives considered and rejected:**

- **Raw scraping + headless Chrome:** High ban risk, high maintenance, zero leverage on other channels. Rejected.
- **HeyReach-style desktop agent:** Ships faster but locks user into keeping a laptop running. Not a fit for Outpulse's "cloud SaaS, set and forget" positioning. Rejected.
- **Official LinkedIn Sales Navigator API:** Requires enterprise partnership, 6+ month onboarding, gated behind MSA. Not realistic for a solo founder. Rejected.

---

## Implementation phases

### Phase 1: Foundation (2–3 days)

- Sign up for Unipile, get sandbox + prod API keys.
- Add `linkedin_accounts` table mirroring the shape of `email_accounts` (user_id, unipile_account_id, profile_url, daily_send_limit, warmup_started_at, connected_at).
- Add OAuth-style connect flow: user clicks "Connect LinkedIn," Outpulse redirects to Unipile hosted auth, Unipile returns account_id.
- Build a `LinkedInClient` wrapper mirroring the existing `GmailClient` interface (sendMessage, listMessages, getThread).

### Phase 2: Campaign model changes (2 days)

- Schema: add `channel` column to `campaign_steps` with enum `('email', 'linkedin_connection', 'linkedin_message', 'linkedin_inmail')`.
- Schema: add `linkedin_account_id` FK on `campaigns` alongside existing `email_account_id`. Campaigns can now have one, the other, or both.
- Update `send-campaigns` cron to branch on step channel — call GmailClient for email steps, LinkedInClient for LinkedIn steps.
- Extend prospect table with `linkedin_url` column + Apollo enrichment path to populate it.

### Phase 3: Reply / event handling (1 day)

- Wire Unipile webhook endpoint `/api/webhooks/unipile` — verify signature, parse incoming message or connection accept, mark the `campaign_prospect.replied_at`.
- Reuse existing reply → pause-sequence logic so LinkedIn replies behave identically to email replies.

### Phase 4: UI (2 days)

- Campaign builder: channel picker per step. Default new campaigns to "email only" to avoid breaking existing flow.
- Settings: "Connected channels" section showing both email + LinkedIn accounts with status.
- Prospect detail: show LinkedIn URL + activity timeline across channels.

### Phase 5: Dogfood + launch (ongoing)

- Run Outpulse's own dogfood campaign through both channels simultaneously as the first real test.
- Publish a case-study post documenting the build → launch cycle. This itself becomes top-of-funnel content.

**Total estimated dev time:** 7–8 working days. Realistic calendar time: 2–3 weeks including testing, edge cases, and writing the Unipile integration tests.

---

## Pricing + positioning implications

When LinkedIn ships:

- Growth plan ($149/mo) keeps email-only to protect margin.
- New **Multichannel plan** at $249/mo — includes 1 email account + 1 LinkedIn account, 500 prospects/mo.
- **Agency plan** at $499/mo — 3 of each, 2000 prospects/mo.

This creates a clean upsell path for April's email-only signups and gives sales a reason to re-engage churned trials in May.

---

## Risks

- **LinkedIn TOS enforcement.** LinkedIn has been tightening automation enforcement. Unipile mitigates but doesn't eliminate. Mitigation: rate limits per account, warmup ramp, no aggressive connection requests beyond 20/day.
- **Unipile as single point of failure.** If Unipile raises prices or goes down, Outpulse's multichannel claim collapses. Mitigation: keep LinkedInClient interface abstract so it can be swapped to a different provider (HeyReach API, Expandi API) in a week.
- **Schema migration complexity.** Adding a second channel to an existing campaign model without breaking running campaigns requires a careful migration. Mitigation: gate behind a feature flag for a week, migrate test accounts first.

---

## Open questions for May

- Do we support LinkedIn voice notes as a step type? (Higher reply rates, much harder to batch.)
- Do we bundle WhatsApp or keep it reserved for a later plan tier?
- Does Outpulse generate the LinkedIn connection request copy, or do users write their own? (Recommendation: generate, same pattern as email.)
- What's the right warmup ramp for a new LinkedIn account? (Recommendation: 5 connection requests/day week 1, 10 week 2, 20 week 3+.)

---

## Summary — one paragraph

Outpulse becomes multichannel in May via Unipile API, adding LinkedIn connection requests and messages as new step types alongside existing email steps. The integration reuses the existing reply-detection pattern via webhooks. Total build cost is ~8 working days. It unlocks a $249/mo Multichannel plan and repositions Outpulse from "email tool" to "cheapest multichannel outbound tool for solo founders." April stays focused on proving the email base works and hitting the 300 paying customer target with email-only dogfooding.
