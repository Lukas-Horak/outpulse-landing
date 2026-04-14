# Outpulse — AI Outreach Agent Dashboard UI Prompt

## Product Context

Outpulse is an AI-powered outreach agent SaaS. It finds ideal prospects, writes hyper-personalized emails, and books meetings on autopilot. The dashboard is the main workspace where users manage campaigns, monitor performance, and review AI-generated outreach.

## Design System (must follow exactly)

### Colors
- **Background**: `#f2f1ee` (warm off-white)
- **White / Cards**: `#ffffff`
- **Primary text**: `#1a1a1a`
- **Muted text**: `#6b6b6b`
- **Accent green**: `#7cc5a2`
- **Green light (badges/tags)**: `#e8f5ee`
- **Dark (sidebar, CTAs)**: `#1a1a1a`
- **Card borders**: `rgba(0,0,0,0.08)`

### Typography
- **Body / UI font**: DM Sans (weights: 400, 500, 600)
- **Display / numbers**: DM Serif Display (weight: 400)
- Use DM Serif Display for large metric numbers and section titles only
- All UI labels, buttons, and body text use DM Sans

### Style Principles
- Clean, minimal, lots of whitespace
- Rounded corners (cards: 20px, buttons: 14px, inputs: 14px, small badges: 6–8px)
- Subtle borders (`rgba(0,0,0,0.08)`), no harsh shadows
- When using shadows: `0 4px 12px rgba(0,0,0,0.06)` — very soft
- Icons: Lucide icon set, stroke-width 2, 20px size
- No gradients, no heavy effects — keep it flat and editorial

## Dashboard Pages to Design

### 1. Dashboard Overview (Home)
Main view after login. Should include:
- **Top metrics row**: Emails sent, Open rate, Reply rate, Meetings booked — use DM Serif Display for the numbers
- **Campaign performance chart**: Line or area chart showing outreach activity over time (use green `#7cc5a2` as primary chart color)
- **Recent activity feed**: Latest replies, opened emails, booked meetings — small cards or list items
- **Active campaigns summary**: Cards showing campaign name, status (active/paused), sent count, reply rate

### 2. Campaigns Page
List of all outreach campaigns:
- Table or card grid layout
- Each campaign shows: Name, status badge (Active = green, Paused = muted), prospects count, emails sent, open rate, reply rate, meetings booked
- Status badges use `#e8f5ee` background with `#7cc5a2` text for active
- "New Campaign" button — dark `#1a1a1a` background, white text, rounded 14px

### 3. Campaign Detail
Single campaign deep dive:
- Campaign name + status at top
- Tabs: Overview, Prospects, Sequence, Analytics
- **Sequence builder**: Visual steps (Step 1: Initial email → Wait 3 days → Step 2: Follow-up → Wait 2 days → Step 3: Final email) — use connected cards with lines between them
- **Prospect list**: Table with name, company, email, status (Contacted, Opened, Replied, Meeting Booked), last activity date

### 4. Prospects / Contacts
Searchable prospect database:
- Search bar + filters (company, status, source)
- Table with: Name, Company, Title, Email, Status, Campaign, Last Activity
- Prospect detail side panel (slides in from right)

### 5. AI Email Preview
Where users review AI-generated emails before sending:
- Email preview card with From, To, Subject, Body
- "Approve & Send" button (green accent), "Edit" button (outline), "Regenerate" button (outline)
- Show personalization highlights — parts the AI personalized should have a subtle green underline (same technique as the landing page "Books Meetings" highlight: `rgba(124,197,162,0.4)` bar underneath)

### 6. Settings
Clean settings page:
- Sections: Profile, Email Accounts (connected inboxes), Calendar Integration, Team, Billing
- Toggle switches for settings use green `#7cc5a2` when active
- Connected accounts shown as cards with logo + status

## Layout Structure
- **Left sidebar**: Dark (`#1a1a1a`), contains logo (Outpulse + starburst icon in white), nav items with Lucide icons, user avatar at bottom
- **Main content area**: `#f2f1ee` background
- **Cards float on white `#ffffff`** with subtle border and rounded corners

## Additional Notes
- I will provide a visual reference / inspiration screenshot — use it for layout inspiration but strictly follow the color system and typography defined above
- Design for 1440px wide desktop viewport
- Keep the same editorial, calm, premium feel as the landing page
- No flashy UI — think Linear, Notion, or Superhuman level of refinement
