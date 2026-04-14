# Outpulse Sales Playbook v4 — Complete Product & Growth Blueprint

> **Cieľ apríl 2026:** 300 platiacich zákazníkov do 30. 4. 2026.
> **Severná hviezda:** Outpulse predáva Outpulse. Každá feature, ktorú napíšeme, musí primárne slúžiť nám na získanie ďalších 300 zákazníkov, a až potom ju púšťame klientom.
> Aktualizované 10.4.2026 08:45.

---

## ČASŤ 0: PRIORITY NA APRÍL 2026 (najdôležitejšia časť dokumentu)

### Rámec rozhodovania: "Posunie to čísla k 300?"
Každá úloha musí odpovedať áno aspoň na jednu z troch otázok:
1. **Získava zákazníkov** — priamo napojené na signupy (distribúcia, tracking, attribution, konverzia)
2. **Umožňuje Outpulse-for-Outpulse** — odomkne kanál, ktorým Outpulse vie sám seba predať (LinkedIn, ProductHunt, Twitter, Reddit)
3. **Zvyšuje per-customer hodnotu** — retention, expansion, agency/team plány

Všetko ostatné ide na neskôr. Polishing, refactoring, vizuálne tweaky → apríl je o objeme a kanáloch.

### Cieľový funnel na 300 zákazníkov
Spätným prepočtom pri konverzných pomeroch, ktoré vidíme (trial-to-paid ~15%):

| Fáza | Target |
|------|--------|
| Návštevy landing page | 20 000 |
| Signups (trial) | 2 000 (10% visit-to-signup) |
| Aktivovaní (odoslali aspoň 1 email) | 1 200 (60%) |
| Platiaci | **300** (15% z trial, 25% z aktivovaných) |

To znamená: **potrebujeme ~670 unikátnych návštev denne** do konca apríla. Dnes máme rádovo desiatky. Celá táto časť playbooku je o tom, ako sa tam dostať.

### TOP 5 priorít (v tomto poradí)

#### Priorita 1: Outpulse-for-Outpulse cold outbound (dáva ~60 zákazníkov)
- **Denne:** 50 novo-nájdených SaaS founderov cez Discover → automatická kampaň cez warmup cron
- **Cieľ:** 1500 oslovených za mesiac × 50% open × 10% reply × 30% trial × 15% paid = **~34 zákazníkov**
- **Blockery:** žiadne — cron už beží, warmup funguje, click tracking je dnes live
- **Čo ešte treba:** do týždňa vyrobiť 3 A/B variácie email copy (náš testbed je samotný Outpulse, výsledky potom odporúčame klientom)

#### Priorita 2: LinkedIn posting automation (feature + distribučný kanál)
- **Prečo teraz:** LinkedIn ma najvyššiu organickú reach na B2B publikum; ty ako founder si credible voice
- **Čo postaviť:**
  1. `/api/generate-linkedin-post` — vygeneruje post na základe užívateľského tone + topic + ICP
  2. **LinkedIn OAuth + API integrácia** v Settings → Connections (postovanie via `ugcPosts` API)
  3. Scheduler v sekcii Content → "LinkedIn" tab: generate → approve → schedule → posted
  4. **Engagement tracking** — read-back likes/comments po 24h → learn z najlepších
- **Outpulse-for-Outpulse:** ty postneš 2×/deň buildInPublic content o tom, ako Outpulse sám píše moje LinkedIn posty → meta je predajný argument
- **Pre klientov:** po launchi vieme hneď ponúknuť "$199 Growth + LinkedIn" tier alebo ako addon ($49/mes)
- **Odhad dopadu:** 200 followers × 2% daily conversion = ~120 nových návštev/deň za 2 týždne, **~40 zákazníkov** za mesiac

#### Priorita 3: Auto-listing na directories (ProductHunt, BetaList, Indie Hackers, G2)
- **Táto feature dáva najviac buzzu** — aj sa dá predať klientom ako súčasť "Growth+" tieru
- **Čo postaviť (fáza 1, 1 týždeň):**
  1. Manuálny ProductHunt launch **pre Outpulse samotný** najbližší pondelok (14.4.)
  2. Pripraviť: hunter (niekto so >500 followers), copy, galéria, teaser tweet, 50 pripravených upvoterov
- **Čo postaviť (fáza 2, feature, 2 týždne):**
  1. **Directory Submission Agent:** užívateľ dá URL + positioning → agent automaticky vyplní formuláre na ProductHunt, BetaList, StartupStash, SaaSHub, AlternativeTo, G2, Capterra, Launching Next (~25 directories)
  2. Tie, ktoré vyžadujú manuálny review, vygenerujú "copy-paste ready" balík so screenshotmi a textom
  3. Tracking dashboard: kde submitnuté, kde approved, kde live, koľko traffic priniesli
- **Výnimočné, pretože:** žiadny konkurent to nemá ako AI-automated. Môžeme to predávať ako samostatný modul $99/mes alebo ako súčasť Agency plánu
- **Odhad dopadu priameho ProductHunt launchu:** top 10 day = 500-2000 signupov, **~50-100 platiacich**. Je to jeden najlepší ROI krok celého mesiaca.

#### Priorita 4: Click-tracking → attribution → conversions pipeline (dokončiť funnel)
- **Dnes live:** click tracking + linkify outpulse.ai v emailoch (commit `738ead1`)
- **Ostáva:** pri signupe spojiť prospect email s user email → vytvoriť `conversions` tabuľku → dashboard metrika "Converted: X / Sent: Y"
- **Prečo to je kritické:** bez toho nevieme, ktorá kampaň funguje, a nevieme klientom ukázať ROI. **Bez ROI metriky trial-to-paid klesne pod 10%.**
- **Effort:** 1 deň práce

#### Priorita 5: Referral + "Powered by Outpulse" footer (viral loop)
- **"Powered by Outpulse"** footer v každom odoslanom emaili (default ON na free trial, OFF na paid). Klikacie → link s ?ref=[user_id]
- **Referral bonus:** "Give 1 mesiac free, get 1 mesiac free" (cez Stripe promo kódy)
- **Odhad:** ak 500 aktívnych trial useri každý pošle 50 emailov × 0.5% click na footer = 125 návštev/deň
- **Effort:** pol dňa

### Časový plán (10.4. → 30.4.)

| Týždeň | Hlavný ťah | Deliverables |
|---|---|---|
| **T1 (10.–13.4.)** | Dokončenie trackingu + príprava PH launchu | conversions pipeline, PH hunter zaistený, copy hotové, 50 upvoterov oslovení |
| **T2 (14.–20.4.)** | **ProductHunt launch 14.4.** + LinkedIn OAuth | PH live, LinkedIn posting MVP, Outpulse postuje za mňa denne |
| **T3 (21.–27.4.)** | Directory Submission Agent | 25 directories podporených, 5 vlastných zápisov pre Outpulse |
| **T4 (28.–30.4.)** | Optimalizácia + referral loop | "Powered by Outpulse" footer, referral kódy, final push |

### Čo zámerne NEROBÍM v apríli
- Refactoring kódu, vizuálne polishing, nová farebná paleta
- Nové onboarding flows (súčasný beží 90s, je to dosť dobré)
- WhatsApp/SMS/Voice AI kanály (nižšia priorita ako LinkedIn)
- Enterprise features (multi-seat, white-label) — po 300 customers
- Gmail reply polling (zatiaľ manual "Mark as replied" button)

---

## STAV K 10.4.2026 — ČO JE HOTOVÉ

### Dnes pridané (10.4.):
- **Click tracking** — nová `/api/track/click/[cpId]` route zapisuje `clicked_at` a presmeruje na `www.outpulse.ai`
- **Linkify outpulse.ai** — v `bodyToHtml()` vo všetkých 3 email pipelinoch (launch, cron, follow-ups) sa všetky mentions `outpulse.ai` automaticky prepisujú na HTML `<a href="tracked-url">www.outpulse.ai</a>`
- **Mark as replied button** — v Campaign Detail → Prospects tab, pre každý `sent`/`opened`/`pending` prospekt tlačidlo, ktoré zavolá existujúci `/api/track/reply` endpoint a flipne status na `replied` (+ auto-pause follow-upov)
- **Migrácia `click_tracking.sql`** — pridá `clicked_at` stĺpce a rozšíri status CHECK o `clicked`. **Treba spustiť v Supabase SQL Editore.**
- **Favicon + OG meta** — landing page má SVG favicon (green logo), theme-color, Open Graph + Twitter card tagy
- **Dashboard metrics fix** — graf používa skutočné per-day `sent_at` timestampy, Recent Activity tiež

### Stav k 7.4.2026:

### Dnes opravené (7.4.):
- Onboarding 3-krokový flow funguje end-to-end: Company → Buyer Persona → Magic Moment (25 prospektov + 5 AI emailov inline)
- Apollo API integrácia funguje (správny endpoint `/api/v1/mixed_people/api_search`, správne parametre)
- Robustný ICP fallback chain (DB → štruktúrované polia → AI extrakcia → keyword matching → generické defaults)
- Buyer Persona sa ukladá do `buyer_personas` tabuľky pri dokončení onboardingu
- 25 prospektov sa ukladá do `prospects` tabuľky počas onboardingu (nie len zobrazenie)
- Duplikátny checklist na dashboarde odstránený (zostal len OnboardingChecklist)
- Stripe promo kódy povolené (`allow_promotion_codes: true`)
- Cena opravená na $149 (Growth Plan)
- Redirect po onboardingu ide priamo na `/dashboard`
- UI: dualtone SVG ikony, expandable email previews, stabilný header

### ✅ Vyriešené (8.–10.4.2026):
- ~~Dashboard po deployi~~ — len 1 checklist, KPI "Prospects Found" ukazuje správne číslo
- ~~Prospekty~~ — zobrazujú sa na dashboarde aj v /prospects
- ~~Buyer Persona~~ — zobrazuje sa v /buyer-personas s edit UI
- ~~Email CTA v AI emailoch~~ — všetky 3 generátory (preview/launch/follow-ups) odkazujú na web/signup, nikdy na call
- ~~Email sending pipeline~~ — campaign launch funguje, cron beží hourly 09–17 UTC, warmup ramp 15→30→50/deň
- ~~Warmup scheduling~~ — `warmupCapForDay` v `lib/smtp.ts` (wk1 15/deň, wk2 30/deň, wk3+ target)
- ~~Hourly send slot spreading~~ — `thisRunAllowance` rozdeľuje denný cap na 9 slotov, žiadne bulk dumpy
- ~~Custom tracking domain~~ — `trackingOrigin()` helper + `TRACKING_DOMAIN` env var wired do open/click URL v 3 send routes

### Čo treba overiť / dorobiť:
- **GA Data API** — `GA_PROPERTY_ID` + `GA_SERVICE_ACCOUNT_JSON` treba nastaviť na Verceli (inak admin dashboard ukazuje "GA not connected")
- **GA property move** — Outpulse property `532417498` presunúť z Evolvium GA account do nového "Outpulse" GA account
- **TRACKING_DOMAIN env var** — nastaviť na Verceli na `track.outpulse.ai` + pridať CNAME → `cname.vercel-dns.com`
- **Add Prospect button** — momentálne schované pod "..." menu, treba vytiahnuť vedľa Discover tlačidla

---

## ZAJTRA RÁNO — PRESNÉ KROKY (8.4.2026)

### 1. Overiť deploy (5 min)
1. Otvor `app.outpulse.ai/dashboard`
2. Skontroluj: len 1 checklist (nie 2)
3. Skontroluj: KPI "Prospects Found" ukazuje 25 (nie 0)
4. Klikni na Buyer Personas v sidebbare → mala by tam byť "Primary Persona"
5. Klikni na Prospects → mali by sa tam zobraziť prospekty z onboardingu
6. Ak niečo nefunguje → Reset Onboarding a prejdi flow znovu

### 2. ~~Opraviť AI email CTA~~ ✅ HOTOVÉ (7.4.)
Prompt zmenený vo všetkých 3 email generátoroch (preview, launch, follow-ups). CTA odkazuje na web/signup, nikdy na call.

### 3. Spustiť prvú kampaň (30 min)
1. Dashboard → Campaigns → New Campaign
2. Vybrať Primary Persona
3. Nastaviť: tone=Friendly+Professional+Direct, length=Short
4. Custom instructions: "Link to outpulse.ai, no calls, self-serve trial"
5. Preview → ak OK → Launch (15 emails/deň warmup)

### 4. Začať predávať — distribučné kanály
- **Apollo/LinkedIn outreach** — použiť samotný Outpulse na oslovovanie SaaS founderov
- **Product Hunt launch** — pripraviť listing
- **Reddit/Indie Hackers** — zdieľať príbeh "AI cold outreach tool"
- **Twitter/X** — daily posting o cold email tips

---

## ČASŤ A: ONBOARDING — PRESNÝ FLOW Z KÓDU

Onboarding beží na `/onboarding` s 3-krokovým stepperom (Company → Buyer Persona → Your Prospects).
Kým nie je `onboarding_completed = true` v profiles table, appka redirectuje na onboarding.
Magic Moment (Step 3) automaticky: nájde 5 prospektov cez Apollo (šetrí kredity) → vygeneruje AI emaily → zobrazí total available count z Apollo breadcrumbs + social proof (PLATFORM $74k, Tripsy 300+ leads) + ROI kalkulačku. Prospekty sa neukladajú do DB — to sa deje cez Discover na dashboarde po zaplatení.

---

### KROK 1: Company (Tell us about your company)

| Pole | Typ | Placeholder | Validácia |
|------|-----|-------------|-----------|
| **Company Name** | text (required) | "e.g. Acme Corp" | Min 1 char na Continue |
| **Website** | url | "https://yourcompany.com" | Spúšťa auto-scan (debounce 1.5s) |
| **What do you sell / offer?** | textarea (3 rows) | "Describe your product or service..." | Auto-fill z website scanu |
| **Who is your ideal buyer?** | textarea (3 rows) | "e.g. VP of Sales at B2B SaaS companies with 50-500 employees looking to scale outbound..." | Auto-fill z website scanu |
| **Tone of voice** | multi-select chips (8) | — | Friendly, Professional, Provocative, Visionary, Witty, Warm, Direct, Playful |

**Auto-scan:** Po zadaní URL volá `/api/scan-website` → vracia: company_name, offer, idealBuyer, tags[], domain. Predvyplní polia + zobrazí AI-generated tagy.

**Vyplň:**
- Company Name: `Outpulse`
- Website: `https://outpulse.ai`
- Offer: `Outpulse is an AI-powered cold outreach platform that writes hyper-personalized emails using real-time prospect data — job changes, funding rounds, hiring signals, and tech stack. Unlike generic email tools, every message feels hand-written. Teams see 3-5x higher reply rates within the first week.`
- Ideal Buyer: `B2B SaaS founders, sales leaders, and agency owners who run outbound campaigns and are frustrated with low reply rates from generic templates. They typically have 5-200 employees, sell to other businesses, and need a tool that scales personalized outreach without hiring more SDRs.`
- Tone: **Friendly** + **Professional** + **Direct**

---

### KROK 2: Ideal (ICP Definition)

| Pole | Typ | Placeholder | Poznámka |
|------|-----|-------------|----------|
| **ICP Description** | textarea (4 rows) | "Example: They run marketing at B2B companies..." | Hlavný popis |
| **✨ AI Generate** | button | "Let AI fill this in for me" | Volá `/api/generate-icp` — disabled ak chýba offer + companyName |
| **Job Titles** | text | "e.g. VP of Sales, Sales Director" | Štruktúrované pole (toggle) |
| **Industry** | text | "e.g. SaaS, Technology, Finance" | Štruktúrované pole (toggle) |
| **Company Size** | text | "e.g. 50-500 employees" | Štruktúrované pole (toggle) |
| **Location** | text | "e.g. North America, US, Remote" | Štruktúrované pole (toggle) |

**AI Generate endpoint:** `/api/generate-icp` — input: companyName, offer, idealBuyer, website → output: icpDescription, icpTitles, icpIndustry, icpSize, icpLocation

**Vyplň (alebo nechaj AI vygenerovať):**
- ICP Description: `Early-stage to mid-market B2B companies actively running or planning cold email outreach. They've tried tools like Lemlist, Instantly, Apollo sequences, or manual outreach and are hitting a wall with <2% reply rates. Decision makers are founders, heads of sales, or revenue leaders who value efficiency and personalization over volume blasting.`
- Job Titles: `CEO, Founder, Co-Founder, Head of Sales, VP Sales, Director of Sales, Chief Revenue Officer, Head of Growth, Sales Director, Business Development Director, Agency Owner, Managing Director`
- Industry: `SaaS, Software, Marketing Agency, Sales Consulting, Staffing & Recruiting, IT Services, Digital Marketing, Lead Generation, Revenue Operations`
- Company Size: `5-200 employees`
- Location: `United States, United Kingdom, Canada, Germany, Netherlands, Australia`

---

### ~~KROK 3: Customers~~ ODSTRÁNENÝ Z ONBOARDINGU
> Krok "Existing Customers" bol odstránený. Onboarding má teraz 3 kroky: Company → Buyer Persona → Magic Moment. Social proof je hardcoded (PLATFORM + Tripsy).

---

### KROK 3: Magic Moment (Your Prospects)

Automaticky sa spustí po Buyer Persona kroku:

1. Fetchne 5 prospektov z Apolla (šetrí kredity)
2. Apollo vráti `total_people_search_count` (napr. 2,847)
3. Vygeneruje AI emaily pre všetkých 5
4. Zobrazí social proof: PLATFORM ($74k pipeline), Tripsy (300+ leads)
5. Zobrazí ROI kalkulačku: "X prospects × 3% reply × $5k deal = $Y pipeline"
6. CTA: "Open Dashboard →"

**Neukladá prospekty do DB** — to sa deje cez "Discover Prospects" na dashboarde.

---

### (Bývalý) KROK 4: Email Connection

- Komponent: `EmailAccountsManager` (compact mode)
- Komponent: `DeliverabilityGuide`
- **"I'll do this later →"** skip je dostupný
- Podpora viacerých email účtov

| Pole | Hodnota |
|------|---------|
| **Email** | `lukas@outpulse.ai` |
| **Provider** | Google (OAuth) |
| **Akcia** | Klikni "Connect with Google" → autorizuj |

---

### KROK 5: Done

- Volá `/api/update-profile` (upsert do profiles table)
- Nastaví `onboarding_completed = true`
- Zobrazí completion screen
- CTA: "Open Dashboard →" → redirect na `/dashboard`

---

## ČASŤ B: POST-ONBOARDING SETTINGS

### Settings → Profile

| Pole | Typ | V onboardingu? | Poznámka |
|------|-----|----------------|----------|
| **Your Name (sender_name)** | text | ❌ Nie | "Used to sign outreach emails" — ťahá sa z Google OAuth, ale treba overiť |
| **Company Name** | text | ✅ | Z onboardingu |
| **Website** | text | ✅ | Z onboardingu |
| **What you offer** | textarea (4 rows) | ✅ | Z onboardingu |
| **Who is your ideal buyer** | textarea (4 rows) | ✅ | Z onboardingu |
| **Tone of voice** | multi-select chips (8) | ✅ | Z onboardingu |
| **Email Signature (plain)** | textarea (4 rows) | ❌ Nie | Fallback podpis |
| **Email Signature (HTML)** | textarea (collapsible) | ❌ Nie | Rich HTML podpis |

**Vyplň po onboardingu:**
- Sender Name: `Lukas Horak`
- Email Signature HTML:
```html
<p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;">
<strong>Lukas Horak</strong><br>
Founder, <a href="https://outpulse.ai" style="color:#5fa883;text-decoration:none;">Outpulse</a><br>
<span style="color:#888;font-size:12px;">AI-powered cold outreach that actually gets replies</span>
</p>
```

### Settings → Email Connection

- `EmailAccountsManager` (full mode)
- `DeliverabilityGuide`
- Správa viacerých email účtov

### Settings → Account

| Sekcia | Polia |
|--------|-------|
| **Account Info** | Name (read-only), Email (read-only) |
| **Subscription** | Current Plan, Status, "Manage billing" (Stripe portal) |
| **Danger Zone** | Reset Onboarding, Sign Out, Delete Account (disabled) |

Endpointy: `/api/stripe/checkout`, `/api/stripe/portal`, `/api/reset-onboarding`

---

## ČASŤ C: BUYER PERSONAS

Sidebar → Buyer Personas (uložené v `buyer_personas` tabuľke). **Max 5 persón, 1 primary.**

| Pole | Typ | Placeholder/Poznámka |
|------|-----|---------------------|
| **Name** | text (required) | "e.g. Redesign Rick, Startup Sam, Agency Anna" |
| **Description** | textarea (5 rows) | "Write anything about who this person is — role, industry, company size, goals, pain points, location..." |
| **Job Titles** | text[] (comma-separated) | "CEO, Founder, Managing Director" |
| **Industries** | text[] (comma-separated) | "Design agency, SaaS, E-commerce" |
| **Company Size** | text | "10-50 employees" |
| **Location** | text | "US, UK, DACH" |
| **Is Primary** | boolean | Unique — len 1 môže byť primary |

**AI Features:**
- "Improve with AI" → `/api/personas/improve` — vylepší description
- "Fill fields from description" → `/api/personas/parse` — auto-fill štruktúrovaných polí z description

*(Persóny 1-3 rovnaké ako v pôvodnom playbooku — SaaS Founder, Sales Leader, Agency Owner)*

---

## ČASŤ D: KAMPANE

Sidebar → Campaigns → Create/Detail. Tabuľky: `campaigns` + `campaign_steps`.

### Campaign Settings

| Pole | Typ | Options |
|------|-----|---------|
| **Name** | text (required) | "e.g., Q2 Outreach" |
| **Tone** | multi-select | Professional, Friendly, Casual, Bold, Witty |
| **Email Length** | select | Short (2-3 par.) / Medium (3-5) / Long (5+) |
| **Custom Instructions** | textarea (3 rows) | Free-form inštrukcie pre AI |
| **Follow-ups Enabled** | toggle | true/false |
| **Follow-up Count** | select | 1 / 2 / 3 (ak enabled) |
| **Follow-up Delay** | number | 1-30 days (ak enabled) |

### Campaign Steps (max 4 per campaign)

| Pole | Typ | Poznámka |
|------|-----|----------|
| **Subject** | text | Required na odoslanie |
| **Body** | text (html/plain) | Required na odoslanie |
| **Delay Days** | number | Dní po predchádzajúcom kroku (0 = initial) |
| **Is Active** | boolean | Enable/disable step |

Endpointy: `PATCH /api/campaigns/[id]/settings`, `POST /api/campaigns/[id]/steps`, `POST /api/campaigns/[id]/preview`, `POST /api/campaigns/[id]/launch`

*(3 kampane rovnaké ako v pôvodnom playbooku — SaaS Founders, Sales Leaders, Agency Owners)*

---

## ČASŤ E: PROSPECTS

Sidebar → Prospects. Tabuľka: `prospects`.

### Pridanie prospectov

**Manual (Add Modal):**

| Pole | Typ | Required |
|------|-----|----------|
| **First Name** | text | ✅ |
| **Last Name** | text | ❌ |
| **Email** | email | ❌ |
| **Company** | text | ❌ |
| **Title** | text | ❌ |
| **LinkedIn URL** | url | ❌ |
| **Phone** | tel | ❌ |

**CSV Import:** `POST /api/import-prospects` — auto-detect columns, vracia imported/failed/skipped

**AI Discovery:** `POST /api/discover-prospects` — input: { limit: 20 } → nájde prospects na základe ICP

### Enrichment

`POST /api/enrich-prospects` → doplní:
- company_domain, company_description, company_industry
- company_employee_count, company_technologies[]
- company_funding_info, company_keywords[]
- intent_signals[] (hiring, recently_funded, expanding, etc.)

### Prospect Statuses
`new` → `contacted` → `replied` → `meeting_booked`

---

## ČASŤ F: LAUNCH TIMELINE

### Týždeň 1 (Setup + Warmup)
- [ ] Deň 1: Onboarding (Kroky 1-5)
- [ ] Deň 1: Settings → sender_name + email signature
- [ ] Deň 2: Vytvoriť 3 buyer persóny
- [ ] Deň 2: Vytvoriť Kampaň 1 (SaaS Founders)
- [ ] Deň 3: AI Discovery → 50 prospects (Persona 1)
- [ ] Deň 3: Enrich prospects
- [ ] Deň 3-7: Launch kampaň — 15 emails/deň

### Týždeň 2 (Scale)
- [ ] Zvýš na 30 emails/deň
- [ ] AI Discovery → 100 prospects (Persona 2)
- [ ] Spusti Kampaň 2 (Sales Leaders)

### Týždeň 3 (Full throttle)
- [ ] Zvýš na 50 emails/deň
- [ ] AI Discovery → 100 prospects (Persona 3)
- [ ] Spusti Kampaň 3 (Agency Owners)

### Týždeň 4 (Optimize)
- [ ] Analyzuj metriky, uprav subject lines
- [ ] Dvojnásob winning kampane
- [ ] Cieľ: 50+ demo calls booked

---

## ČASŤ G: DELIVERABILITY

| Záznam | Stav |
|--------|------|
| **MX** | ✅ Google Workspace |
| **SPF** | ✅ `include:_spf.google.com` |
| **DKIM** | ✅ `google._domainkey` overený |
| **DMARC** | ✅ `_dmarc` TXT záznam |
| **Warmup** | ❌ TODO: 15→30→50/deň |
| **Tracking domain** | ❌ TODO: `track.outpulse.ai` CNAME |

---

## ČASŤ H: GAP ANALÝZA — ČO JE V KÓDE vs. ČO CHÝBA PRE MVP

### ✅ Čo UŽ funguje (z kódu):

| Feature | Stav | Endpointy |
|---------|------|-----------|
| Onboarding (5 krokov) | ✅ Funguje | scan-website, generate-icp, customers, update-profile |
| Website auto-scan + AI fill | ✅ Funguje | /api/scan-website |
| ICP AI generation | ✅ Funguje | /api/generate-icp |
| Buyer Personas (CRUD + AI improve) | ✅ Funguje | /api/personas/improve, /api/personas/parse |
| Campaigns (create, settings, steps) | ✅ Funguje | /api/campaigns/[id]/* |
| Campaign preview | ✅ Funguje | /api/campaigns/[id]/preview |
| Campaign launch | ✅ Funguje | /api/campaigns/[id]/launch |
| Prospects (manual add, CSV import) | ✅ Funguje | /api/import-prospects |
| AI Prospect Discovery | ✅ Funguje | /api/discover-prospects |
| Prospect Enrichment | ✅ Funguje | /api/enrich-prospects |
| Email Connection (Google/Microsoft/SMTP) | ✅ Funguje | EmailAccountsManager |
| Stripe billing (checkout + portal) | ✅ Funguje | /api/stripe/checkout, /api/stripe/portal |
| Email Signature (plain + HTML) | ✅ Funguje | Settings → Profile |
| Deliverability Guide | ✅ Funguje | Settings → Email Connection |

### 🔴 Čo CHÝBA pre self-selling MVP:

#### 1. ~~REPLY DETECTION + AUTO-PAUSE~~ ✅ HOTOVÉ
**Stav:** Implementované. Manual "Mark as replied" + webhook-based detection fungujú. Follow-upy sa auto-pausujú keď prospect odpovie. Gmail API polling (automatické čítanie inbox) zatiaľ nie je implementované — vyžaduje OAuth token storage.

#### 2. ~~UNSUBSCRIBE LINK~~ ✅ HOTOVÉ
**Stav:** Plne implementované. RFC 8058 List-Unsubscribe headers v každom emaili. HTML footer s unsubscribe linkom. One-click unsubscribe endpoint. Enforcement pri odosielaní (odhlásení nedostanú ďalšie emaily).

#### 3. ~~"MAGIC MOMENT" PRED PAYWALL~~ ✅ HOTOVÉ (7.4.2026)
**Stav:** Implementované. Step 3 onboardingu automaticky: Apollo search → enrich top 5 → AI emaily → zobrazí inline s expandable preview. 25 prospektov sa ukladá do DB.

#### 4. ~~ONBOARDING CHECKLIST NA DASHBOARDE~~ ✅ HOTOVÉ (7.4.2026)
**Stav:** Implementované. OnboardingChecklist so 6 krokmi na dashboarde (profile, persona, prospects, email, campaigns, sent). Duplikátny SetupChecklist odstránený.

#### 5. TRACKING & ANALYTICS
**Prečo:** Používateľ nemá dôvod vrátiť sa do appky, ak nevidí výsledky. Open rates, reply rates, click tracking — to je feedback loop.
**Stav v kóde:** Dashboard má "Outreach Activity" section ale chýba podrobná analytika per campaign/step.
**Dopad:** Bez metrík nie je dôvod na daily usage → churn.

#### 6. EMAIL WARMUP ✅ HOTOVÉ (10.4.2026)
**Prečo:** Nový email účet (lukas@outpulse.ai) nemôže hneď poslať 50 emailov/deň bez rizika spam flag. Warmup je kritický.
**Stav v kóde:** `warmupCapForDay(day, target)` v `lib/smtp.ts` — Week 1 = 15/deň, Week 2 = 30/deň, Week 3+ = target (default 50). `thisRunAllowance` rozdeľuje denný cap na 9 slotov medzi 09–17 UTC, cron beží hourly (`vercel.json` `"0 9-17 * * *"`).

#### 7. A/B TESTING
**Prečo:** Bez dát o tom, čo funguje, používateľ nemôže optimalizovať. A/B test subject lines je table stakes pre email tools.
**Stav v kóde:** Campaign má steps ale nie variant testing.

#### 8. CUSTOM TRACKING DOMAIN ✅ HOTOVÉ (10.4.2026)
**Prečo:** Shared tracking domain (ak existuje) znižuje deliverability. Custom domain (track.outpulse.ai) je standard.
**Stav v kóde:** `trackingOrigin()` helper v `lib/smtp.ts` číta `TRACKING_DOMAIN` env var. Open pixel + click redirect URL v 3 send routes (cron, launch, send-followups) idú cez tracking subdoménu. **TODO na Verceli:** nastaviť `TRACKING_DOMAIN=track.outpulse.ai` a pridať CNAME → `cname.vercel-dns.com`.

---

## ČASŤ I: PRODUCT ROADMAP — AKO SA PRODUKT PREDÁVA SÁM

### Princíp: Product-Led Growth Flywheel

```
Signup → Onboarding (2 min) → "Magic Moment" (AI ukáže reálne emaily)
    → Connect Email → Send First Email → See Results (opens, replies)
        → Invite Team / Upgrade → Tell Others
```

Kľúč je minimalizovať Time-to-Value (TTV). Momentálne TTV = 30+ min (onboarding + manual setup). Cieľ = pod 5 min.

### Prioritizovaný backlog podľa revenue dopadu:

#### P0 — ✅ VŠETKO HOTOVÉ

| # | Feature | Revenue dopad | Stav |
|---|---------|---------------|------|
| 1 | **Unsubscribe link** v každom emaili | Právna ochrana + deliverability | ✅ Hotové |
| 2 | **Reply detection + auto-pause** follow-ups | Retencia + trust | ✅ Hotové |
| 3 | **"Magic moment"** — preview emailov v onboardingu | +30-50% activation | ✅ Hotové |
| 4 | **Dashboard onboarding checklist** | +25-35% activation | ✅ Hotové |
| 5 | **Self-selling CTA** — emaily odkazujú na web, nie na call | Konverzia | ✅ Hotové (8.4.) |
| 6 | **Plan-based credit limits** — Growth 1000, Scale 5000, admin unlimited | Monetizácia | ✅ Hotové (8.4.) |

#### P1 — Tento mesiac (scale enablers)

| # | Feature | Revenue dopad | Effort |
|---|---------|---------------|--------|
| 5 | **Open/reply tracking analytika** per campaign | Retencia + daily usage | Stredný |
| 6 | ~~**Email warmup scheduling**~~ ✅ (10.4.) | Deliverability | — |
| 7 | **Tone of voice examples** v onboardingu | +10% onboarding completion | Nízky |
| 8 | **Social proof** v onboardingu ("Join X teams") | +15% signup conversion | Nízky |
| 9 | ~~**Custom tracking domain** setup~~ ✅ (10.4.) | Deliverability | — |

#### P2 — Ďalší mesiac (competitive edge)

| # | Feature | Revenue dopad | Effort |
|---|---------|---------------|--------|
| 10 | **A/B testing** subject lines | Optimizácia reply rates | Stredný |
| 11 | **Referral program** ("Give $25, Get $25") | Virálny rast | Stredný |
| 12 | **Webhook/Zapier** integrácia | Enterprise customers | Vysoký |
| 13 | **Multi-seat team view** | Sales Leader persóna (vyššie ACV) | Vysoký |
| 14 | **White-label** pre agentúry | Agency persóna (highest LTV) | Vysoký |

---

## ČASŤ J: KONVERZNÝ FUNNEL — PSYCHOLÓGIA PREDAJA

### 1. Signup → Onboarding Completion (cieľ: >80%)

| Problém | Riešenie | Princíp |
|---------|----------|---------|
| Step 1 má 5 polí naraz | Rozdeliť na 2 menšie kroky | Progressive Disclosure |
| Website scan je skrytý | Animácia + "AI is reading your site..." | Endowed Progress |
| Chýba progress feedback | Progress bar "Step 2 of 5 — 60% done" | Goal Gradient Effect |
| Tone nemá vysvetlenie | Príklady emailov pri hover | Show, don't tell |
| Používateľ sa zasekne | "Skip" + "Let AI suggest" | Autonomy Bias |

### 2. Onboarding → First Value (cieľ: <2 min TTV) ✅ IMPLEMENTOVANÉ

| Problém | Riešenie | Stav |
|---------|----------|------|
| Prázdny dashboard | Magic Moment v onboardingu — 5 AI emailov inline | ✅ |
| Nevie čo robiť | Checklist so 6 krokmi + časové odhady | ✅ |
| Žiadny social proof | PLATFORM $74k + Tripsy 300+ leads v Magic Moment | ✅ |
| Nevidí ROI | ROI kalkulačka: "X prospects × 3% × $5k = $Y pipeline" | ✅ |

**Aktuálny TTV: ~90 sekúnd** (Company 30s → Buyer Persona 30s → Magic Moment 30s automat)

### 3. First Value → First Send (cieľ: same day)

| Problém | Riešenie | Princíp |
|---------|----------|---------|
| Email setup je friction | 1-click Google OAuth | Reduce Friction |
| Strach z prvého odoslania | "Preview & approve each email" mode | Perceived Control |
| Nevidí prospects | Auto-discovery po onboardingu | Instant Gratification |

### 4. First Send → Paid Conversion (cieľ: >15% trial-to-paid)

| Problém | Riešenie | Princíp |
|---------|----------|---------|
| Nevidí výsledky | Real-time open/reply tracking | Variable Reward |
| Free trial končí | "Your 47 prospects are waiting" reminder | Loss Aversion |
| Nevie či funguje | Celebration po prvom reply | Achievement Unlocked |
| Cena bez kontextu | ROI kalkulačka: "You got X replies worth $Y" | Value Framing |

### 5. Paid → Retention + Expansion (cieľ: <5% monthly churn)

| Problém | Riešenie | Princíp |
|---------|----------|---------|
| Žiadny dôvod vrátiť sa | Daily email digest s výsledkami | Habit Loop |
| Plateau v results | "New prospects matching your ICP" weekly | Fresh Content |
| Single user | Team invite + shared campaigns | Network Effect |
| Žiadna viralita | Referral program + "Powered by Outpulse" footer | Viral Loop |

---

## ČASŤ K: METRIKY

| Metrika | Target | Red Flag |
|---------|--------|----------|
| **Onboarding Completion** | >80% | <50% = friction problém |
| **Time-to-Value** | <5 min | >15 min = churn risk |
| **Day-1 Activation** | >40% sent first email | <20% = value gap |
| **Open Rate** | >50% | <30% = deliverability |
| **Reply Rate** | >8% | <3% = messaging |
| **Trial-to-Paid** | >15% | <5% = value perception |
| **Monthly Churn** | <5% | >10% = product-market fit |
| **NPS** | >50 | <20 = feature gaps |

---

*Tento playbook je tvoja case study. Predávaš Outpulse pomocou Outpulse. Každý reply je dôkaz, že produkt funguje. Každé vylepšenie v tomto dokumente = viac platiacich zákazníkov, ktorí prichádzajú sami.*
