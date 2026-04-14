# Outpulse — "Define Your Customer" Screen (ICP Builder)

## Where This Screen Lives

This screen appears as a **full-page modal or dedicated page** after the user clicks **"+ New Campaign"** in the dashboard. It's the first step of campaign creation — before the user gets to email sequence or prospect list.

**Navigation flow:**
Dashboard → Click "+ New Campaign" → **Step 1: Define Your Customer (this screen)** → Step 2: Email Sequence → Step 3: Review & Launch

In the sidebar, it can be highlighted under **Campaigns**, with a top breadcrumb: `Campaigns / New Campaign / Define Customer`

---

## Screen Design Prompt for Figma AI

Design a "Define Your Ideal Customer" screen for Outpulse (AI outreach SaaS). This is where users tell the AI who to target. The form should feel smart and modern — fields auto-fill as a demo to show the AI working.

### Layout

Use the existing Outpulse dashboard layout:
- **Left sidebar**: Dark (#1a1a1a), with Outpulse logo, nav items (Dashboard, Campaigns active, Prospects, AI Emails, Settings)
- **Main content area**: #f2f1ee background
- **Content card**: Centered white (#ffffff) card, max-width 720px, border-radius 20px, border 1px solid rgba(0,0,0,0.08), padding 48px

### Screen Header (inside the card)

- **Step indicator**: Small pill badge top-left — "Step 1 of 3" in #6b6b6b, font-size 13px, DM Sans 500
- **Title**: "Define your dream customer" — DM Serif Display, 32px, #1a1a1a
- **Subtitle**: "Tell us who you want to reach. Our AI will find matching prospects and personalize outreach for each one." — DM Sans 400, 16px, #6b6b6b, max-width 520px

### Form Fields

Design these fields in a clean vertical stack with 20px gap between groups. Each field has a label (DM Sans 500, 13px, #6b6b6b, uppercase, letter-spacing 0.5px) above the input.

**Group 1 — Who**

1. **Job Titles** (tag input)
   - Label: "TARGET JOB TITLES"
   - Show as tag/chip input with green (#e8f5ee) tags
   - Demo values filled in: `VP of Sales`, `Head of Growth`, `CTO`
   - Placeholder when empty: "e.g. VP of Sales, Head of Marketing"

2. **Seniority Level** (multi-select chips)
   - Label: "SENIORITY"
   - Horizontal row of selectable chips: `C-Suite` `VP` `Director` `Manager` `Individual Contributor`
   - Demo state: `VP` and `Director` are selected (filled with #1a1a1a background, white text), rest are outline only

**Group 2 — Where**

3. **Industries** (tag input)
   - Label: "INDUSTRIES"
   - Demo values: `SaaS`, `FinTech`, `E-commerce`
   - Placeholder: "e.g. SaaS, Healthcare, Manufacturing"

4. **Company Size** (range selector)
   - Label: "COMPANY SIZE (EMPLOYEES)"
   - Two connected dropdown-style inputs: `50` — `500`
   - Or a visual range slider with green (#7cc5a2) track
   - Show min-max values beneath: "50 – 500 employees"

5. **Locations** (tag input)
   - Label: "COMPANY HQ LOCATION"
   - Demo values: `United States`, `United Kingdom`, `Germany`
   - Placeholder: "e.g. San Francisco, Europe, DACH region"

**Group 3 — Signals (Advanced)**

6. **Technologies Used** (tag input)
   - Label: "TECH STACK"
   - Demo values: `Salesforce`, `HubSpot`, `Slack`
   - Placeholder: "e.g. Salesforce, Stripe, AWS"

7. **Hiring Signals** (toggle + input)
   - Label: "ACTIVELY HIRING FOR"
   - A toggle switch (green when active) next to tag input
   - Demo: Toggle ON, tags: `Sales Manager`, `SDR`
   - Hint text below: "Companies hiring for these roles are likely scaling their sales team"

8. **Funding Signals** (toggle + dropdown)
   - Label: "RECENTLY FUNDED"
   - Toggle ON, dropdown showing: `Last 6 months`
   - Options: Last 3 months, Last 6 months, Last 12 months
   - Hint: "Freshly funded companies have budget to invest in new tools"

### AI Confidence Indicator

Below the form, show a horizontal bar:
- Label: "Estimated prospect pool" — DM Sans 500, 14px
- A green (#7cc5a2) filled bar that shows progress
- Number on the right: **"~2,340 prospects"** in DM Serif Display, 24px
- Below the bar, subtle text: "Based on your criteria. We recommend 500–2,000 for optimal results." in #6b6b6b, 13px

### Bottom Actions

- **Back** button: Text only, left-aligned, "← Back" in #6b6b6b
- **Continue** button: Right-aligned, dark (#1a1a1a) background, white text, rounded 14px, "Continue to Email Sequence →"
- Spacing between form and buttons: 40px, with a subtle divider line (1px rgba(0,0,0,0.06))

### Demo / Auto-Fill Animation State

Design TWO variants of this screen:

**Variant A — Empty State:**
All fields are empty with placeholders visible. The AI confidence bar shows 0. This is what the user sees initially.

**Variant B — Demo Filled State (main showcase):**
All fields are auto-filled with the demo values listed above. Tags are populated, chips are selected, toggles are on, the confidence bar is filled showing "~2,340 prospects".

For the Figma prototype, create a **Smart Animate** transition between Variant A → Variant B that takes ~2 seconds, simulating the AI filling in the form. Fields should appear to fill in top-to-bottom with a slight stagger (each field fills ~200ms after the previous one). Tags slide in from left, chips highlight, toggles flip, and the prospect bar fills smoothly.

### Design System Reference

- Background: #f2f1ee
- Cards: #ffffff, border-radius 20px, border 1px solid rgba(0,0,0,0.08)
- Primary text: #1a1a1a
- Muted/labels: #6b6b6b
- Accent green: #7cc5a2
- Green light (tags): #e8f5ee
- Body font: DM Sans (400, 500, 600)
- Display font: DM Serif Display (400) — for large numbers and the prospect count only
- Icons: Phosphor Icons (Duotone style), 20px
- Inputs: Height 44px, border-radius 14px, border 1px solid rgba(0,0,0,0.12), padding 0 16px
- Input focus: border-color #7cc5a2, box-shadow 0 0 0 3px rgba(124,197,162,0.15)
- Tags: padding 6px 12px, border-radius 8px, font-size 14px, DM Sans 500
- Toggle: 40px wide, 22px tall, border-radius 11px, green when active

### Viewport

Design for 1440 × 900px desktop. The form card should feel spacious — no cramming. Keep the same calm, editorial aesthetic as the rest of the Outpulse dashboard.
