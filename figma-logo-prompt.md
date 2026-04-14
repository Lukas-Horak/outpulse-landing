# Outpulse Logo — Figma Usage Guide

## Logo Description

The Outpulse logo is a **sphere made of 3 overlapping orbital rings** (like electron paths around an atom) with **5 short starburst rays** emanating from the top. It symbolizes AI intelligence, connectivity, and outward energy (outreach = "outpulse").

**Structure:**
- 3 elliptical orbital rings at different tilt angles (-15°, +30°, +65°)
- Each ring has a "front" arc (full opacity) and a "back" arc (reduced opacity for depth)
- 5 rays above the sphere, spread in a fan pattern, with rounded caps
- All strokes use rounded linecaps

## SVG Files Available

Import these SVGs into Figma as components:

| File | Color | Use |
|------|-------|-----|
| `outpulse-logo.svg` | Blue→Purple gradient | Brand, social media, OG image |
| `outpulse-logo-dark.svg` | #1a1a1a | Navbar on cream bg, footer, docs |
| `outpulse-logo-white.svg` | #ffffff | Dark backgrounds, loading screens |
| `outpulse-logo-green.svg` | #7cc5a2 | Onboarding, accent, AI avatar |

## How to Import Into Figma

1. Open Figma file
2. Drag-and-drop each SVG file onto the canvas
3. Select each imported logo → right-click → **Create Component**
4. Name the components:
   - `Logo / Gradient`
   - `Logo / Dark`
   - `Logo / White`
   - `Logo / Green`
5. Move all 4 components into a **"Logo"** section/page for organization

## Where to Use Each Variant

### Navbar (all screens)
- **Logo / Dark** — 28px height, left-aligned in sidebar or top navbar
- Next to text "Outpulse" in DM Serif Display, 20px, #1a1a1a

### Onboarding Welcome Screen (Screen 1)
- **Logo / Green** — 48px height, centered
- Animated with slow subtle rotation (one cycle over 8 seconds)

### Onboarding AI Activity Messages
- **Logo / Green** — 24px height, inside a circle (#e8f5ee background, 36px diameter)
- Used as the "Outpulse AI" avatar in activity feed items

### Dashboard Sidebar
- **Logo / Dark** — 24px height, top-left of sidebar
- Paired with "Outpulse" wordmark

### Loading / Splash States
- **Logo / White** — 56px height, centered on #1a1a1a background
- Pulse animation (opacity 0.4 → 1.0, 1.5s loop)

### Email Footer / Signature
- **Logo / Dark** — 20px height, small inline logo

### Favicon (already implemented in HTML)
- Uses a simplified version (just the starburst rays) — already embedded as SVG data URI in index.html

### Social / OG Image
- **Logo / Gradient** — 64px height, on dark or gradient background
- This is the original blue→purple version for brand recognition

## Sizing Guidelines

| Context | Height | Notes |
|---------|--------|-------|
| Navbar / Sidebar | 24–28px | Always paired with wordmark |
| Onboarding hero | 48px | Standalone, centered |
| AI avatar | 20–24px | Inside circular container |
| Loading screen | 48–56px | Centered, animated |
| Social / OG | 56–64px | Prominent placement |
| Favicon | 16–32px | Simplified if needed |

## Important Rules

1. **Never stretch** the logo — always maintain 1:1 aspect ratio
2. **Minimum clear space** around the logo should be equal to the height of one ray
3. **Never place** the gradient version on a colorful/busy background — use solid colors only
4. **On the #f2f1ee cream background**, always use the Dark or Green variant (never White or Gradient)
5. **Consistent usage** — don't mix variants on the same screen (e.g., don't use Green in navbar and Dark in sidebar on the same page)
