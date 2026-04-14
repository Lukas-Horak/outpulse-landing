# Stripe coupon setup for Product Hunt launch

**Status:** ✅ DONE (as of 11 Apr 2026) — only sanity test remaining
**Owner:** Lukas
**Context:** First comment on PH launch promises "30% off the Growth plan for life, first 100 people today. Code: HUNT30." Needs to exist in Stripe before anyone hits checkout, otherwise we look stupid.

## Final state (verified in Stripe Live mode)

- Coupon: `hunt30_ph_launch` — 30% off, Forever duration, Valid ✅
- Promotion code: **HUNT30** — API ID `promo_1TL6K0PGzvsKjv65hguGtegq`
- Redemptions: 0/100
- Expires: 25 Apr 2026, 23:59

## Prerequisite check (already done)

- [x] `app/src/app/api/stripe/checkout/route.ts` line 94 has `allow_promotion_codes: true`. No code change needed.
- [x] Checkout runs in subscription mode with 7-day trial. The 30% discount applies on top of that.

## Step 1 — Create the coupon (the discount definition) ✅ DONE

1. Open Stripe Dashboard → make sure you are in **Live mode** (toggle top right, not Test)
2. Navigate: **Products → Coupons → New**
3. Fill in:
   - **Name:** Product Hunt launch 30% off
   - **ID:** `hunt30_ph_launch` (internal, not the customer code)
   - **Type:** Percentage discount
   - **Percent off:** `30`
   - **Duration:** Forever *(this is the "for life" promise in the first comment)*
   - **Redemption limit (optional but important):** leave this on the coupon OR set it on the promotion code in step 2, not both. Recommendation: set it on the promotion code, not here, so the coupon stays reusable if you need to extend later.
   - **Redeem by (expiration date):** leave blank, cap is count-based not time-based
4. Save the coupon

## Step 2 — Create the customer-facing promotion code ✅ DONE

The coupon is the rule. The promotion code is what the customer actually types. They are separate in Stripe.

1. Still in **Products → Coupons**, open the coupon you just made
2. Scroll to **Promotion codes → New**
3. Fill in:
   - **Code:** `HUNT30` (exact, uppercase, what's written in the PH first comment)
   - **Max redemptions:** `100` *(this is the "first 100 people" cap)*
   - **Max redemptions per customer:** `1`
   - **First-time transaction only:** leave OFF (trial customers count as first transaction anyway, no need)
   - **Active from:** now
   - **Expires at:** set to 14 days after PH launch day to stop stragglers. Adjust if you want longer
4. Save

## Step 3 — Sanity test in Live mode ⚠️ DO THIS BEFORE LAUNCH

1. Open https://app.outpulse.ai/choose-plan in an incognito window
2. Click Growth → Stripe Checkout opens
3. On the checkout page click **Add promotion code**
4. Paste `HUNT30` → confirm the total shows 30% off, forever
5. Close the tab before actually submitting. Do not test-purchase with your own card.

## Step 4 — After launch ends

- [ ] Check redemption count in Stripe: **Products → Coupons → HUNT30 promotion code → Redemptions**
- [ ] If you want to extend beyond 100, bump Max redemptions or create HUNT30_V2
- [ ] Once the promo expires or hits 100, optionally archive the promotion code (not the coupon, in case you want to reuse it for another launch)

## Gotchas

- **Test vs Live mode:** Stripe Dashboard has two separate environments. The PH traffic will hit Live. If you accidentally create the coupon in Test, HUNT30 will fail for real customers. Triple-check the toggle.
- **Forever duration + 7-day trial:** the trial is in `subscription_data.trial_period_days: 7`. The 30% will apply starting on the first charge after trial, and then every charge after, forever. Stripe handles this automatically.
- **Case sensitivity:** Stripe promotion codes are case-insensitive by default when entered in Checkout, but the comment says `HUNT30` uppercase. Keep it uppercase everywhere.
- **The first comment also says "for life"** → that's the Forever duration. Don't pick "Once" or "Repeating (N months)".

## Promo code reference

Customer-facing: **HUNT30** — 30% off Growth plan, forever, first 100 redemptions
Internal coupon ID: `hunt30_ph_launch`
