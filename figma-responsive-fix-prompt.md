# Outpulse — Responsive Layout & Bug Fix Prompt

## Problem

The current screens have layout issues:
1. Content is not responsive — elements don't adapt to the viewport width
2. The Campaigns page has a duplicate "+ New Campaign" button (appears twice in the top-right area)

## Global Layout Rules (apply to ALL screens)

### Frame Setup
- Every screen frame must be set to **1440 × 900px**
- The root frame uses **Auto Layout** (horizontal, fill container)
- **Left sidebar**: Fixed width **260px**, vertical auto layout, fill height
- **Main content area**: **Fill container** (takes remaining width), vertical auto layout

### Sidebar (fixed, never changes)
- Width: exactly **260px** (not fill, not hug — fixed)
- Background: #1a1a1a
- Padding: 24px 20px
- Direction: Vertical, gap 4px between nav items
- The sidebar does NOT scale or resize — it stays 260px always

### Main Content Area
- **Fill container** horizontally (= 1180px on a 1440px frame)
- Padding: **40px 48px**
- Direction: Vertical auto layout
- All child elements inside should be set to **Fill container** width (not fixed pixel widths)

### Content Constraints
- Tables, cards, and content blocks: **Fill container** (stretch to available width)
- Maximum content width for forms and centered content: use a **max-width wrapper frame** set to 720px, centered with auto margins (left and right alignment: center)
- Metric cards row: Horizontal auto layout, each card **Fill container** (equal width distribution)

### How to Make Elements Responsive in Figma
- Select any element inside the main content area
- In the right panel under "Resizing", set horizontal to **"Fill container"** instead of "Fixed" or "Hug contents"
- For the main content wrapper itself: horizontal resizing = **Fill container**
- For text elements: set to **Fill container** width so text reflows
- For tables: the table frame = Fill container, each column uses **Fill container** or proportional fixed widths

---

## Screen-Specific Fixes

### Dashboard
- Top metrics row: Horizontal auto layout with **4 cards**, each set to **Fill container** (equal 25% width), gap 16px
- Outreach Activity chart + Recent Activity: Horizontal auto layout, chart = **Fill container** (takes remaining space), Recent Activity = **Fixed 320px**
- Active Campaigns table: **Fill container** width, columns distribute proportionally

### Campaigns Page
- **BUG FIX:** Remove the duplicate "+ New Campaign" button. Keep only ONE in the top-right header area, aligned right. The page title "Campaigns" and subtitle are on the left, the single "+ New Campaign" button is on the right. Use a horizontal auto layout frame with space-between distribution.
- Search bar: **Fill container** width, max-width 640px
- Campaign table: **Fill container** width
- Table columns suggested proportions: Campaign name 30%, Status 10%, Prospects 10%, Sent 10%, Open Rate 12%, Reply Rate 12%, Meetings 10%, Actions 6%

### AI Email Preview
- Email card: **Fill container** width with max-width 800px, centered
- The FROM / TO / SUBJECT header block: Fill container
- Email body text: Fill container, comfortable line-height (1.7)

### Define Your Customer (New Campaign - Step 1)
- Form card: **Fill container** with max-width 720px, centered in the main content area
- All form inputs: **Fill container** width
- Seniority chips: Horizontal auto layout with **wrap** enabled (so chips flow to next line on narrow widths)
- Tag inputs: **Fill container** width

---

## Quick Checklist

Go through every screen and verify:

- [ ] Root frame = Auto layout (horizontal)
- [ ] Sidebar = Fixed 260px width
- [ ] Main content = Fill container
- [ ] Main content padding = 40px 48px
- [ ] Page title row = horizontal auto layout, space-between, Fill container
- [ ] Only ONE "+ New Campaign" button per screen (top-right)
- [ ] All tables = Fill container width
- [ ] All cards in rows = Fill container (equal distribution)
- [ ] All form inputs = Fill container width
- [ ] Text blocks = Fill container (not fixed width)
- [ ] No element has a hardcoded pixel width that exceeds the main content area
