# Product Hunt launch — Outpulse

**Launch day:** Tuesday, 14 April 2026 ⚠️ CONFIRMED BY LUKAS — NOT SUNDAY
**Status on PH:** Draft saved, not yet scheduled
**Draft URL:** https://www.producthunt.com/products/outpulse?launch=outpulse-2
**Edit Launch URL:** https://www.producthunt.com/posts/outpulse-2/edit
**Prelaunch dashboard:** https://www.producthunt.com/products/outpulse/outpulse-2/prelaunch

## 🔔 STANDING REMINDER FOR CLAUDE

**Every conversation until Tue 14 Apr 2026, remind Lukas at start of session:**

> "PH launch je v utorok 14. apríla. Máš draft uložený na PH ale ešte nie je naplánovaný. Treba:
> 1. Pustiť sanity test HUNT30 kódu v Stripe Live mode
> 2. Naplánovať launch na utorok 14 Apr 00:01 PST cez Schedule button na draft stránke
> 3. Pripraviť share assety (PH badge, zoznam DMs na deň launchu)"

---

## What's already done ✅

- [x] PH submission form 100% complete (name, tagline, description, thumbnail, gallery, launch tags, makers, first comment)
- [x] First comment posted as Maker by Lukas on 11 Apr 2026, 20:37 (includes HUNT30 promo code callout, sales-hire pain story, no em-dashes)
- [x] Launch tags: Sales, Email Marketing, Artificial Intelligence
- [x] Free Options pricing badge set
- [x] Draft saved on PH
- [x] Stripe coupon `hunt30_ph_launch` created in Live mode (30% off Growth plan, Forever)
- [x] Stripe promotion code HUNT30 created, 0/100 redemptions, expires 25 Apr 23:59
- [x] Stripe API ID: `promo_1TL6K0PGzvsKjv65hguGtegq`
- [x] `allow_promotion_codes: true` already in `app/src/app/api/stripe/checkout/route.ts` line 94

## What's left before Tuesday

### Before Sunday night (sanity checks)

- [ ] **Sanity test HUNT30 in Stripe Live mode** — incognito → app.outpulse.ai/choose-plan → Growth → Stripe Checkout → paste HUNT30 → confirm "30% off forever" + 7-day trial → close tab (don't submit). See `launch-stripe-tasks.md`.
- [ ] **Final review of PH draft** — open https://www.producthunt.com/posts/outpulse-2/edit and skim all 5 sections one more time

### Monday (day before launch)

- [ ] **Schedule the PH launch** — go to draft, click Schedule, pick **14 Apr 2026 at 00:01 PST** (that's 09:01 CEST Tuesday morning for Lukas). PH launches run 00:01–23:59 Pacific time.
- [ ] **Prepare share assets** — have ready the PH badge + link (embed code available at /posts/outpulse-2/embed after launch goes live)
- [ ] **Prepare DM list** — ~20-30 close contacts to message personally on launch morning
- [ ] **Draft social posts** — X/Twitter thread, LinkedIn personal, LinkedIn PLATFORM page, relevant Slack communities

### Tuesday morning (launch day)

- [ ] Check PH post is live at ~09:00 CEST
- [ ] Post the PH link to:
  - Personal X/Twitter
  - LinkedIn personal + PLATFORM company page
  - Slack communities (relevant ones only, not spam)
  - Personal network via DM to ~20 close contacts
- [ ] Pin Stripe dashboard tab to watch HUNT30 redemptions in real-time
- [ ] Reply to EVERY comment within 30 minutes (PH Q1 2026 algorithm weights comment quality heavily)
- [ ] Prepare a few Q&A responses for common questions:
  - "How is this different from Apollo/Lemlist/Instantly?"
  - "What about deliverability?"
  - "Can I use my own inbox?"
  - "Does it work for B2C?"

### Tuesday evening / Wednesday

- [ ] Check final upvote count + rank
- [ ] Thank the top commenters in a follow-up comment
- [ ] Export PH visitor signup list from Supabase for retargeting
- [ ] Tally HUNT30 redemption count and decide whether to extend past 100

## First comment as posted on PH draft

Already saved in the draft. Starts with: "Hey Product Hunt! Lukas here 👋 I built Outpulse because I hate doing sales..." — full text visible on draft page itself.

## Links for quick access

- PH draft: https://www.producthunt.com/products/outpulse?launch=outpulse-2
- PH edit: https://www.producthunt.com/posts/outpulse-2/edit
- PH prelaunch dashboard: https://www.producthunt.com/products/outpulse/outpulse-2/prelaunch
- Stripe coupon: https://dashboard.stripe.com/acct_1TChlxPGzvsKjv65/coupons/hunt30_ph_launch
- Outpulse choose-plan: https://app.outpulse.ai/choose-plan
- Stripe setup memory: `launch-stripe-tasks.md`
