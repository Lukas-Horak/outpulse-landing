# Outpulse — Empty State / First-Time User Experience

## Where This Lives in the Figma Prototype

Create these screens as a **separate flow (section)** in the same Figma file, next to the existing dashboard screens.

**Structure in Figma:**
- **Section 1: "Main App"** — existing screens (Dashboard, Campaigns, AI Emails, Define Customer, etc.) — these show the app WITH data
- **Section 2: "Onboarding / Empty State"** — the new screens below (Welcome → ICP → Email → Done → Empty Dashboard)

**How to connect it to the prototype:**
- On the **landing page**, add a second hotspot/link labeled "First time experience →" or duplicate the "Get Started" button and link one to the main dashboard and the other to the onboarding flow (Screen 1: Welcome)
- Inside the onboarding flow, the last screen ("You're all set") links to the **Empty Dashboard** — which is a separate frame from the existing Dashboard (same layout, but with skeleton/empty content instead of real data)

**Naming convention for frames:**
- `Onboarding / 1 - Welcome`
- `Onboarding / 2A - Your Company (Empty)`
- `Onboarding / 2B - Your Company (Scanning)`
- `Onboarding / 2C - Your Company (Filled)`
- `Onboarding / 3A - Define Customer (Idle)`
- `Onboarding / 3B - Define Customer (Listening)`
- `Onboarding / 3C - Define Customer (Transcribing)`
- `Onboarding / 3D - Define Customer (Processing)`
- `Onboarding / 3E - Define Customer (Ready)` (optional)
- `Onboarding / 4 - Connect Email`
- `Onboarding / 5 - All Set`
- `Onboarding / 6 - Dashboard Empty State`

This keeps the file organized and the two flows (new user vs. active user) clearly separated.

---

## Important: Preserve Existing Design

If screens from the main app (Dashboard, Campaigns, AI Emails, etc.) already exist in the Figma file, do NOT change their design, layout, or styling. Only ADD new onboarding screens. The existing screens may have manual design refinements that must be preserved.

---

## Design Philosophy (Wispr Flow inspired)

The first-time experience should feel **calm, personal, and intelligent**. No information overload. No 6-step wizard. Think of it as a quiet conversation — the app greets the user, understands what they need, and gently guides them to their first campaign.

**Key principles:**
- Generous whitespace — let the content breathe
- One action per screen — never overwhelm
- Warm, conversational copy — not corporate/robotic
- Subtle motion — elements float in gently, nothing snaps
- Progressive disclosure — reveal complexity only when needed
- The UI should feel like it's thinking with you, not at you

---

## Screen 1: Welcome (after first login)

**Layout:** Full-screen centered content on #f2f1ee background. No sidebar visible yet — the sidebar slides in after onboarding. This feels like a landing moment, not a dashboard.

**Content (vertically centered, max-width 480px):**

- Outpulse starburst logo — 48px, animated with a slow subtle rotation (one cycle over 8 seconds), color #7cc5a2
- **Greeting:** "Good morning, Lukas." — DM Serif Display, 40px, #1a1a1a
  - Use actual user name from signup, time-aware greeting (morning/afternoon/evening)
- **Subtext:** "Let's set up your first outreach in about 2 minutes." — DM Sans 400, 18px, #6b6b6b, appears with 0.5s delay fade-in
- **Single CTA button:** "Let's go →" — #1a1a1a background, white text, 16px DM Sans 500, padding 16px 40px, border-radius 14px, centered
- Below button, tiny muted text: "4 quick steps · about 3 minutes" — 13px, #6b6b6b, 0.4 opacity

**Animation:** Logo fades in first (0.3s), then greeting slides up (0.5s), then subtext (0.8s), then button (1.1s). Staggered, smooth, never rushed.

---

## Onboarding Progress Stepper (used in Screens 2, 3, 4, and 5)

A visual progress indicator at the top of every onboarding card. It shows where the user is, what's done, what's next, and how long it takes.

### Layout

Horizontal auto layout, fill container width, gap 0. Positioned at the top of the card, margin-bottom 32px.

**4 step nodes connected by lines:**

```
[ ● Your Company ] ——— [ ○ Dream Customer ] ——— [ ○ Connect Email ] ——— [ ○ Ready ]
      ~1 min                ~1 min                   ~30 sec               done!
```

### Step Node (repeated 4 times)

Each node is a vertical stack (auto layout, center-aligned, gap 6px):

**Top row:** Horizontal — icon circle + connecting line

- **Circle:** 28px diameter, border-radius 50% (slightly smaller to fit 4 nodes)
  - **Completed state:** background #7cc5a2, white Phosphor duotone checkmark icon inside (12px)
  - **Active state:** background #1a1a1a, white Phosphor duotone icon inside (12px) — each step has its own icon:
    - Step 1: Phosphor `buildings` (your company)
    - Step 2: Phosphor `user-focus` (define customer)
    - Step 3: Phosphor `envelope` (connect email)
    - Step 4: Phosphor `check-circle` (ready)
  - **Upcoming state:** background transparent, border 1.5px solid rgba(0,0,0,0.15), Phosphor icon inside in #b5b5b5 (12px)

- **Connecting line** (between circles):
  - Width: fill container (stretches between nodes), height: 2px
  - Vertically centered with the circle (top: 13px from node top)
  - **Completed segment:** #7cc5a2 (solid green)
  - **Active/upcoming segment:** rgba(0,0,0,0.08) (light grey)

**Bottom: Step label + time estimate**

- **Label:** DM Sans 500, 11px
  - Completed: #7cc5a2
  - Active: #1a1a1a
  - Upcoming: #b5b5b5
- **Time estimate** (below label): DM Sans 400, 10px
  - Active: #6b6b6b — shows estimated time: "~1 min" / "~30 sec"
  - Completed: #7cc5a2 — shows "Done ✓"
  - Upcoming: #b5b5b5 — shows the time estimate dimmed

### Stepper States Per Screen

**Screen 2 (Your Company):**
```
[ ● ACTIVE ]  ———  [ ○ upcoming ]  ———  [ ○ upcoming ]  ———  [ ○ upcoming ]
  Your Company      Dream Customer      Connect Email          Ready
    ~1 min              ~1 min              ~30 sec
```
- Step 1 circle: #1a1a1a with white buildings icon
- All lines: grey
- Steps 2, 3, 4 circles: outline only, grey icons

**Screen 3 (Define Customer):**
```
[ ✓ DONE ]  ———  [ ● ACTIVE ]  ———  [ ○ upcoming ]  ———  [ ○ upcoming ]
  Your Company    Dream Customer      Connect Email          Ready
    Done ✓            ~1 min              ~30 sec
```
- Step 1 circle: #7cc5a2 with white checkmark
- First line: green (#7cc5a2)
- Step 2 circle: #1a1a1a with white user-focus icon
- Remaining lines: grey
- Steps 3, 4 circles: outline only

**Screen 4 (Connect Email):**
```
[ ✓ DONE ]  ———  [ ✓ DONE ]  ———  [ ● ACTIVE ]  ———  [ ○ upcoming ]
  Your Company    Dream Customer      Connect Email          Ready
    Done ✓           Done ✓              ~30 sec
```
- Steps 1, 2 circles: green with checkmarks
- Lines 1–2, 2–3: green
- Step 3 circle: #1a1a1a with white envelope icon
- Line 3–4: grey
- Step 4 circle: outline only

**Screen 5 (All Set):**
```
[ ✓ DONE ]  ———  [ ✓ DONE ]  ———  [ ✓ DONE ]  ———  [ ● ACTIVE ]
  Your Company    Dream Customer      Connect Email          Ready
    Done ✓           Done ✓              Done ✓           You're set!
```
- Steps 1, 2, 3: green circles with checkmarks
- All lines: green
- Step 4 circle: #1a1a1a with white check-circle icon
- Step 4 label: "You're set!" in #1a1a1a

### Overall Time Estimate

Below the stepper, centered:
- **Text:** "About 3 minutes total" — DM Sans 400, 12px, #b5b5b5
- On Screen 3 this updates to: "About 2 minutes left"
- On Screen 4 this updates to: "Less than a minute left"
- On Screen 5: this line is hidden (not needed anymore)

### Layer Naming

```
card / stepper
card / stepper / step-1
card / stepper / step-1 / circle
card / stepper / step-1 / circle / icon
card / stepper / step-1 / label
card / stepper / step-1 / time
card / stepper / line-1-2
card / stepper / step-2
card / stepper / step-2 / circle
card / stepper / step-2 / circle / icon
card / stepper / step-2 / label
card / stepper / step-2 / time
card / stepper / line-2-3
card / stepper / step-3
card / stepper / step-3 / circle
card / stepper / step-3 / circle / icon
card / stepper / step-3 / label
card / stepper / step-3 / time
card / stepper / line-3-4
card / stepper / step-4
card / stepper / step-4 / circle
card / stepper / step-4 / circle / icon
card / stepper / step-4 / label
card / stepper / step-4 / time
card / stepper / time-estimate
```

Keep all layers present in every frame (Screens 2, 3A–3D, 4, 5). Only change colors, icon content, and text between frames. Smart Animate will smoothly transition the circle fills and line colors.

---

## Screen 2: "Tell us about your company" (Sender Profile)

This is the new first step after Welcome. The AI needs to know who the user is, what they sell, and how they want to sound — otherwise it can't write compelling, personalized outreach.

### Base Layout

- Full-screen centered content on #f2f1ee background, no sidebar
- White card: max-width 560px, border-radius 24px, padding 48px, shadow 0 8px 32px rgba(0,0,0,0.06)

### Card Content

- **Progress stepper** — Step 1 active (Your Company), steps 2–4 upcoming
- **Title:** "First, tell us about you." — DM Serif Display, 28px, #1a1a1a
- **Subtitle:** "This helps our AI write emails that actually sound like they're from you." — DM Sans 400, 15px, #6b6b6b

### Form Fields (vertical stack, 20px gap)

Each field has a label (DM Sans 500, 12px, #6b6b6b, uppercase, letter-spacing 0.5px) above the input.

1. **Company Name**
   - Label: "YOUR COMPANY"
   - Input: text, placeholder "e.g. Acme Inc."
   - Demo value: `PLATFORM`

2. **Website**
   - Label: "WEBSITE"
   - Input: text with URL icon (Phosphor `globe`), placeholder "e.g. yourcompany.com"
   - Demo value: `plat4m.com`
   - Hint below (default): "We'll scan your site to understand what you offer" — 12px, #6b6b6b
   - **Scanning animation** (appears after URL is entered):
     - The hint text changes to a green animated state: Phosphor duotone `magnifying-glass` icon (14px, #7cc5a2, spinning slowly) + "Scanning plat4m.com..." — 12px, DM Sans 500, #7cc5a2
     - After 2 seconds, icon changes to Phosphor `check-circle` (14px, #7cc5a2) + "Analyzed ✓" — 12px, #7cc5a2
     - This simulates the AI reading and understanding the company's website

3. **What do you offer?** (AUTO-FILLED by AI after website scan)
   - Label: "WHAT DO YOU SELL / OFFER?"
   - Textarea: 80px height, placeholder "e.g. We help companies scale their sales pipeline"
   - Demo value (auto-filled with green typewriter animation): `Digital product design & development for startups and enterprises — mobile apps, web platforms, and growth-driven UX`
   - Small indicator: Phosphor `magic-wand` icon (12px, #7cc5a2) + "Auto-filled from your website" — 11px, #7cc5a2, italic — appears next to the label after auto-fill

4. **Who is it for?** (AUTO-FILLED by AI after website scan)
   - Label: "WHO IS YOUR IDEAL BUYER?"
   - Input: text, placeholder "e.g. Sales leaders at B2B SaaS companies"
   - Demo value (auto-filled): `Startup founders, CTOs, and product leaders looking to build or scale digital products`
   - Same "Auto-filled from your website" indicator

5. **Tone of voice** (single-select chips)
   - Label: "TONE OF VOICE"
   - Horizontal row of selectable chips: `Friendly` `Professional` `Casual` `Bold` `Witty`
   - Demo state: `Professional` is selected (filled with #1a1a1a background, white text), rest are outline only (border 1px solid rgba(0,0,0,0.12), #6b6b6b text)
   - Hint below: "This shapes how your AI writes — you can always adjust later" — 12px, #6b6b6b

### AI Website Analysis (appears after URL scan completes)

Below the website field, after the scanning animation finishes, show a detection block that smoothly slides in:

- Small card: background #f9f9f7, border 1px solid rgba(0,0,0,0.06), border-radius 12px, padding 12px 16px
- Top: Phosphor duotone `magic-wand` icon (16px, #7cc5a2) + "Here's what we found on plat4m.com:" — 13px, DM Sans 500, #1a1a1a
- Tags below (horizontal wrap, gap 6px): `Digital Agency` `Product Design` `Development` `UX/UI` `Startups` `Enterprise` — small green (#e8f5ee) tags, 12px, DM Sans 500
- Below tags: "Fields 3 & 4 were auto-filled. Feel free to edit." — 11px, #6b6b6b
- This demonstrates the AI scanning the website and pre-filling the form, reducing friction

### Bottom Actions

- **Back:** "← Back" text link, left-aligned, 14px, #6b6b6b → goes to Screen 1 (Welcome)
- **Continue:** "Continue →" button, right-aligned, full width below, #1a1a1a background, white text, border-radius 14px, padding 16px, DM Sans 500 16px

### Demo Variants

### Demo Animation Sequence (for prototype)

Create **3 variants** of this screen for the demo animation:

**Variant 2A — Empty State:** All fields empty with placeholders. No AI analysis visible. User sees this initially.

**Variant 2B — Scanning:** Company name "PLATFORM" is typed. Website "plat4m.com" is typed. Scanning animation visible ("Scanning plat4m.com..."). Fields 3–5 still empty. This is the "AI thinking" moment.

**Variant 2C — Filled (showcase):** Scanning complete ("Analyzed ✓"). AI analysis card visible with tags. Fields 3 & 4 auto-filled with green typewriter animation. "Auto-filled from your website" labels visible. Tone chip "Professional" selected. Continue button ready.

**Prototype connections:**
- Variant 2A → after delay 1000ms → Variant 2B (Smart Animate, 300ms) — company name and URL appear
- Variant 2B → after delay 2500ms → Variant 2C (Smart Animate, 500ms) — scanning completes, fields auto-fill, tags appear
- Variant 2C → Click "Continue →" → Frame 3A (Define Customer - Idle)
- All variants → Click "← Back" → Screen 1 (Welcome)

**Important:** The animation should feel like the AI is actively doing work — scanning the website, understanding the business, and intelligently pre-filling the form. This saves the user time and demonstrates AI value immediately.

**Layer naming:** Same principle as Screen 3 frames — keep all layers present in all variants, toggle visibility/opacity. Name the outer frames `Onboarding / 2A - Your Company (Empty)`, `Onboarding / 2B - Your Company (Scanning)`, `Onboarding / 2C - Your Company (Filled)`.

---

## Screen 3: "Who do you want to reach?" (ICP Quick Setup)

This screen has a voice input demo animation. Create it as **5 separate frames** that are connected via prototype interactions. All 5 frames share the same base layout — only the textarea area and elements below it change between frames.

### Base Layout (same in all 5 frames)

- Full-screen centered content on #f2f1ee background, no sidebar
- White card: max-width 560px, border-radius 24px, padding 48px, shadow 0 8px 32px rgba(0,0,0,0.06)
- Inside card top:
  - **Progress stepper** — shows Step 1 (Your Company) completed, Step 2 (Dream Customer) active
  - Title: "Who's your dream customer?" — DM Serif Display, 28px, #1a1a1a
  - Subtitle: "Describe them like you'd tell a colleague. Our AI handles the rest." — DM Sans 400, 15px, #6b6b6b
- Below textarea area (in all frames):
  - Left text: "Be as specific as you want — industry, role, company size, location, tech stack" — 13px, #6b6b6b
  - Right text: "Prefer structured fields? →" — 13px, #7cc5a2
- Bottom of card: "Continue →" button — full width, #1a1a1a background, white text, border-radius 14px, padding 16px, DM Sans 500 16px

### Frame 3A: `Onboarding / 3A - Define Customer (Idle)`

The starting state. This is the frame the user lands on from the Welcome screen.

**Textarea:**
- Width: fill container, height: 140px, border-radius 16px
- Border: 1px solid rgba(0,0,0,0.10)
- Placeholder text inside: "VPs of Sales at Series A SaaS companies in the US..." — 16px, DM Sans 400, color #b5b5b5

**Mic button** (inside textarea, bottom-right corner, 14px from edges):
- Circle: 40px diameter, background #f2f1ee, no border
- Icon: Phosphor duotone microphone, 20px, color #6b6b6b
- No additional elements visible

**Prototype interaction:** Click on mic button → go to Frame 3B (Smart Animate, 300ms, ease-out)

---

### Frame 3B: `Onboarding / 3B - Define Customer (Listening)`

The mic has been clicked. The app is listening.

**Textarea:**
- Same size, but border changes to: 1px solid #7cc5a2
- Box-shadow: 0 0 0 3px rgba(124,197,162,0.15)
- Placeholder text removed (textarea is empty)
- Inside textarea, centered vertically, three dots: "..." — each dot is a separate text element for animation, 20px, color #6b6b6b, spaced 4px apart

**Mic button:**
- Circle: 40px, background #e8f5ee
- Icon: Phosphor microphone, 20px, color #7cc5a2
- Green glow ring around button: a second circle behind the button, 56px, background rgba(124,197,162,0.12), for the pulsing effect

**"Listening..." label:**
- Positioned above the mic button, right-aligned
- Text: "Listening..." — 12px, DM Sans 500, color #7cc5a2

**Prototype interaction:** After delay 1800ms → auto-navigate to Frame 3C (Smart Animate, 300ms, ease-out)

---

### Frame 3C: `Onboarding / 3C - Define Customer (Transcribing)`

Voice has been captured, text is appearing.

**Textarea:**
- Border: 1px solid #7cc5a2 (still green)
- Box-shadow: 0 0 0 3px rgba(124,197,162,0.15)
- Text inside: "I want to reach VPs of Sales at SaaS startups in the US, 50 to 200 employees" — 16px, DM Sans 400, color #1a1a1a
- A green text cursor (blinking) after the last character: 2px wide, 18px tall, color #7cc5a2

**Mic button:**
- Circle: 40px, background #e8f5ee
- Icon: CHANGES to Phosphor duotone checkmark, 20px, color #7cc5a2 (replaces the microphone icon)

**"Transcribing..." label** (same position as "Listening..."):
- Text: "Done" — 12px, DM Sans 500, color #7cc5a2

**Prototype interaction:** After delay 2000ms → auto-navigate to Frame 3D (Smart Animate, 400ms, ease-out)

---

### Frame 3D: `Onboarding / 3D - Define Customer (Processing)`

AI is analyzing the input. The textarea fades and processing elements appear below.

**Textarea:**
- Border reverts to: 1px solid rgba(0,0,0,0.10) (no longer green)
- No box-shadow
- Text still visible but at **50% opacity**: "I want to reach VPs of Sales at SaaS startups in the US, 50 to 200 employees"
- No cursor, no label above mic button

**Mic button:**
- Back to idle: circle #f2f1ee, microphone icon #6b6b6b

**NEW — AI Processing block** (appears below the textarea, above the helper text):

1. **Progress row** (horizontal layout, space-between):
   - Left: "Estimated prospect pool" — 14px, DM Sans 500, #1a1a1a
   - Center: Progress bar — fill container, height 6px, background rgba(0,0,0,0.06), border-radius 3px. Inside: green fill (#7cc5a2) at **72% width**, border-radius 3px
   - Right: "~2,340" — DM Serif Display, 22px, color #7cc5a2

2. **Hint text:** "Based on your criteria. We recommend 500–2,000 for optimal results." — 13px, #6b6b6b

3. **Tag chips row** (horizontal auto layout, wrap, gap 8px, margin-top 16px):
   - Tags: `VP of Sales` `SaaS` `Startups` `United States` `50–200 employees`
   - Each tag: background #e8f5ee, color #1a1a1a, 14px DM Sans 500, padding 6px 14px, border-radius 8px

**Prototype interaction:** Click "Continue →" button → go to Frame 3E or directly to Screen 4: Connect Email (Smart Animate, 400ms, ease-out)

---

### Frame 3E (optional): `Onboarding / 3E - Define Customer (Ready)`

Same as 3D but textarea is back to full opacity, processing is complete, and the "Continue →" button has a subtle green left-border or highlight to draw attention. This frame can be skipped if the flow feels smooth enough with 3D going directly to Screen 4 (Connect Email).

---

### Prototype Flow for Screen 3 (ICP with Voice)

Connect these frames in the prototype panel:

```
Screen 2 (Your Company)
  └─ Click "Continue →" → Frame 3A (Idle) [Smart Animate, 400ms]

Frame 3A (Idle)
  ├─ Click mic button → Frame 3B (Listening) [Smart Animate, 300ms]
  └─ Click "← Back" → Screen 2 (Your Company) [Smart Animate, 300ms, reverse]

Frame 3B (Listening)
  └─ After delay 1800ms → Frame 3C (Transcribing) [Smart Animate, 300ms]

Frame 3C (Transcribing)
  └─ After delay 2000ms → Frame 3D (Processing) [Smart Animate, 400ms]

Frame 3D (Processing)
  ├─ Click "Continue →" → Screen 4: Connect Email [Smart Animate, 400ms]
  └─ Click "← Back" → Frame 3A (Idle) [Smart Animate, 300ms, reverse]
```

**Back button:** Add a "← Back" text link at the bottom-left of the card in every frame. Style: 14px, DM Sans 500, color #6b6b6b. Present in Frame 3A and 3D. In Frames 3B and 3C (auto-advancing), not needed.

Also add "← Back" to **Screen 4 (Connect Email)** and **Screen 5 (All Set)**:
- Screen 4 "← Back" → Frame 3A (Idle)
- Screen 5 "← Back" → Screen 4

**Important for Smart Animate to work:** All 5 frames must have identical layer names and hierarchy. Only change the properties that differ (text content, colors, opacity, visibility, position). Figma's Smart Animate interpolates between matching layers — if layers are named differently, it won't animate smoothly.

**Layer naming convention (use exactly these names in all frames):**
- `card` (the white card)
- `card / step-pill`
- `card / title`
- `card / subtitle`
- `card / textarea-wrap`
- `card / textarea-wrap / textarea`
- `card / textarea-wrap / textarea-text` (the typed text, or placeholder)
- `card / textarea-wrap / mic-btn`
- `card / textarea-wrap / mic-btn / icon`
- `card / textarea-wrap / mic-glow` (the pulsing ring, hidden in 2A/2C/2D)
- `card / textarea-wrap / listening-label`
- `card / textarea-wrap / cursor` (blinking cursor, hidden except in 2C)
- `card / helpers`
- `card / ai-processing` (hidden in 2A/2B/2C, visible in 2D)
- `card / ai-processing / progress-row`
- `card / ai-processing / hint`
- `card / ai-processing / tags`
- `card / continue-btn`

For elements that should be hidden in certain frames: keep the layer in the frame but set **opacity to 0%**. Do NOT delete the layer — Smart Animate needs it in every frame to interpolate.

---

## Screen 4: "Connect your email" (Mailbox Setup)

**Layout:** Same centered card (max-width 560px, border-radius 24px, padding 48px).

**Header:**
- **Progress stepper:** Steps 1–2 = completed (green checkmarks), Step 3 = active (dark circle, envelope icon), Step 4 = upcoming. Time estimate: "Less than a minute left"
- **Title:** "Where should emails come from?" — DM Serif Display, 28px
- **Subtitle:** "Connect your work email. Outpulse sends as you — no weird aliases." — DM Sans 400, 15px, #6b6b6b

**Email Provider Cards (vertical stack, 12px gap):**

Three provider cards, each: white background, border 1px solid rgba(0,0,0,0.08), border-radius 16px, padding 20px 24px, display flex with icon + text + connect button

1. **Google Workspace** — Google "G" icon (colorful), "Gmail / Google Workspace", connect button outline
2. **Microsoft 365** — Microsoft icon, "Outlook / Microsoft 365", connect button outline
3. **Other SMTP** — Mail icon (Phosphor duotone), "Custom SMTP server", connect button outline

**Selected/Connected state:** Card gets a green left border (3px solid #7cc5a2), checkmark replaces connect button, email address shown (e.g. "lukas@plat4m.com" in green text)

**Skip option:** Below the cards, "I'll do this later →" as muted text link. Never force — but gently nudge.

**Bottom:** "Continue →" button

---

## Screen 5: "You're all set" (Success / Transition to Dashboard)

**Layout:** Same centered card (max-width 560px, border-radius 24px, padding 48px).

**Header:**
- **Progress stepper:** All 4 steps completed (green checkmarks). Lines all green. Step 4 label: "You're set!". Time estimate line hidden.

**Content (inside the card, below stepper):**
- A large green checkmark animation — Phosphor duotone `check-circle` icon, 64px, color #7cc5a2, with a subtle scale-up entrance (1.0 → 1.05 → 1.0), centered
- **Title:** "You're ready to go." — DM Serif Display, 36px, #1a1a1a, centered
- **Subtitle:** "Your first campaign is being prepared. Here's what happens next:" — DM Sans 400, 16px, #6b6b6b

**Three small info items (vertical, 16px gap, max-width 400px, left-aligned):**
- Each: Phosphor duotone icon (20px, #7cc5a2) + text (DM Sans 400, 15px, #1a1a1a)
- 🔍 "AI is finding prospects matching your criteria"
- ✉️ "Personalized emails are being drafted for review"
- 📅 "You'll be notified when the first batch is ready"

**CTA:** "Open Dashboard →" — green (#7cc5a2) background, #1a1a1a text, rounded 14px, padding 16px 40px
- Below: "Takes about 5 minutes to prepare your first prospects" — 13px, #6b6b6b

**Transition:** When clicking "Open Dashboard", the entire screen slides left and the full dashboard (with sidebar) slides in from right.

---

## Dashboard Empty State (after onboarding)

When the user lands on the dashboard for the first time, the usual metrics and charts are replaced with contextual empty states.

**Top greeting stays:** "Good afternoon, Lukas" + "Your first campaign is being prepared"

**Metrics row — Skeleton + Real:**
- The 4 metric cards (Emails Sent, Open Rate, Reply Rate, Meetings Booked) show as elegant skeletons
- Not grey blocks — use subtle animated shimmer (left-to-right gradient sweep) on #f2f1ee → #e8e7e4 → #f2f1ee
- Below each skeleton number, muted text: "Warming up..."

**Outreach Activity Chart — Empty:**
- The chart area shows a flat dotted line at 0 with a gentle pulse animation
- Centered overlay text: "Your first data will appear here within 24 hours" — DM Sans 400, 14px, #6b6b6b
- Small Phosphor duotone chart icon above the text, 32px, 30% opacity

**Recent Activity — Single Welcome Item:**
- Instead of empty, show one item:
  - Outpulse AI avatar (starburst icon in green circle)
  - "Outpulse AI · just now"
  - "Working on your first campaign — I'll notify you when prospects are ready for review."
- This feels alive, like the AI is actually working in the background

**Active Campaigns — Single Card:**
- One campaign card in "Preparing" state:
  - Campaign name: The name derived from ICP input (e.g. "VP Sales — SaaS — US")
  - Status badge: "Preparing" in amber/warm (#f5a623) on light amber background
  - Progress: "Finding prospects... 847 found so far" with an animated counter
  - Subtle pulsing dot next to status to indicate active processing

**Upgrade CTA in sidebar:**
- Hidden during first session — don't sell before delivering value
- Appears after first campaign results come in

---

## Design System Reference

- Background: #f2f1ee
- Cards: #ffffff, border-radius 20-24px, border 1px solid rgba(0,0,0,0.08)
- Shadows (cards during onboarding): 0 8px 32px rgba(0,0,0,0.06) — softer and more elevated than dashboard cards
- Primary text: #1a1a1a
- Muted text: #6b6b6b
- Accent green: #7cc5a2
- Green light: #e8f5ee
- Body font: DM Sans (400, 500, 600)
- Display font: DM Serif Display (400)
- Icons: Phosphor Icons (Duotone style)
- Buttons: border-radius 14px, padding 14px 32px
- Inputs: border-radius 16px, height 48px (larger than dashboard inputs for onboarding comfort)
- All animations: ease-out curves, 300-500ms duration, staggered entrances
- Viewport: 1440 × 900px

## Responsive Layout Rules

These screens MUST use Auto Layout so they adapt properly:

**Screens 1–4 (onboarding, no sidebar):**
- Root frame: 1440 × 900px, Auto Layout vertical, align center both axes
- Content wrapper: max-width 480–560px (depending on screen), **Hug contents** vertically, centered horizontally
- All text: **Fill container** width (not fixed pixel widths)
- Buttons: **Hug contents** (width adapts to text)
- Cards: Fixed max-width (560px for ICP, 480px for email), centered with auto margins

**Screen 5 (Empty Dashboard):**
- Same layout as the main Dashboard — sidebar 260px fixed, main content Fill container
- All metric cards, charts, and tables: **Fill container** width
- Follow the same responsive rules from the responsive-fix-prompt

**Important:** Never set text or container frames to fixed pixel widths inside the main content area. Always use Fill container so content adapts when the frame is resized.

---

## Prototype Interactions

Build the Figma prototype with these connections:

**Entry point:** On the landing page, add a visible link or button that leads to `Onboarding / 1 - Welcome`. This can be a second "Get Started" variant, or a separate "See onboarding →" text link.

**Flow:**
1. `Onboarding / 1 - Welcome` → Click "Let's go" → `Onboarding / 2A - Your Company (Empty)` (Smart Animate, 400ms, ease-out)
2. `2A (Empty)` → auto 1s → `2B (Scanning)` → auto 2.5s → `2C (Filled)` → Click "Continue" → `Onboarding / 3A - Define Customer (Idle)` (Smart Animate, 400ms)
3. `3A–3D` → Voice demo flow (see Screen 3 prototype flow above) → Click "Continue" → `Onboarding / 4 - Connect Email` (Smart Animate, 400ms)
4. `Onboarding / 4 - Connect Email` → Click "Continue" → `Onboarding / 5 - All Set` (Smart Animate, 400ms)
5. `Onboarding / 5 - All Set` → Click "Open Dashboard" → `Onboarding / 6 - Dashboard Empty State` (Slide left, 500ms, ease-out)

Each screen transition should feel like turning a page — smooth, directional, never jarring.
