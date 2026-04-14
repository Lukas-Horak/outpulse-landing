# Outpulse Launch Checklist — Stav k 9.4.2026 16:30

> Ciel: Outpulse predava sam seba. Ty robis finalne rozhodnutia — system robi zvysok.

---

## INFRASTRUKTURA

- [x] Next.js app na Vercel (app.outpulse.ai)
- [x] Supabase databaza + RLS politiky
- [x] Stripe billing (Growth Plan $149)
- [x] Stripe promo kody povolene
- [x] Google OAuth prihlasenie
- [x] Admin bypass pre @outpulse.ai a @plat4m.com (neobmedzene kredity)

---

## ONBOARDING

- [x] 3-krokovy flow: Company → Buyer Persona → Magic Moment
- [x] Website auto-scan (AI precita stranku a predvyplni polia)
- [x] AI ICP generation z popisu firmy
- [x] Magic Moment: 5 prospektov + AI emaily v onboardingu pred paywallom
- [x] ROI kalkulacka + social proof (PLATFORM $74k, Tripsy 300+ leads)
- [x] Dashboard redirect po dokonceni
- [x] Onboarding checklist na dashboarde (6 krokov)
- [x] Switch account button (signout → /signup)
- [x] Timer zjednoteny na 120s ("about 2 minutes")
- [x] Favicon preview v onboardingu

---

## APP FEATURES

- [x] Password toggle na signup (eye icon)
- [x] Buyer Personas CRUD + max 5, AI Improve, Parse fields
- [x] Prospect pipeline: manual add, CSV import, Apollo discovery + enrichment
- [x] Intent signals (hiring, expanding, tech_change, growing_team)
- [x] Credit system, graceful handling
- [x] Email connection (Google OAuth, SMTP, Postmark)
- [x] AI email generation (Claude) + LinkedIn messages
- [x] Campaign creation, launch, tracking
- [x] Reply detection + auto-pause follow-ups (webhook + manual mark)
- [x] Stripe billing + promo codes
- [ ] **Re-enrichment existujucich prospektov** — dat Enrich na existujucich 20 prospektov

---

## LANDING PAGE (outpulse-landing-v3.html)

- [x] Dark premium design, responsive (Linear-style)
- [x] Hero mockup: floating onboarding card + skeleton dashboard s typewriter animaciou
- [x] Skeleton labely → real labely reveal
- [x] 10 real prospect rows nabiehaju po typewriter (stagger 120ms)
- [x] Feature mockup #1: Prospects — interaktivne intent signal filtre (klikatelne, menia tabuľku)
- [x] Feature mockup #2: AI Email — personalny email s "Structure" overlay
- [x] Feature mockup #3: Campaign Dashboard — KPI cards, bar chart, funnel items
- [x] Testimonials (pastelove farby: zelena, broskyňova, pieskova, lavandulova)
- [x] Pricing section ($7,500 → $149 strikethrough)
- [x] FAQ, trust strip, CTA section
- [x] Urbanist → DM Serif Display (fonty zjednotene s appkou)
- [ ] **LOGO UPDATE** — novy logo vsade (app + landing + emaily)
- [ ] **Deploy landing page** na outpulse.ai

---

## EMAIL SETUP

- [x] lukas@outpulse.ai pripojeny a VERIFIED
- [x] Warmup started (Den 2 z 14)
- [x] SPF, DKIM, DMARC zaznamy OK
- [ ] **Email podpis (HTML)** — nastav v Settings → Profile
- [ ] **Custom tracking domena** — track.outpulse.ai CNAME (zvysi deliverability)

---

## KAMPANE — NEXT STEP 👈

### Kampaň 1: SaaS Founders (PRIMARY)

- [ ] Aktualizuj logo vsade (app, landing, email podpis)
- [ ] Nastav email podpis v Settings
- [ ] Vytvor kampan — "SaaS Founders — Cold Outreach v1"
  - Persona: SaaS Founder / CEO
  - Tone: Friendly + Professional + Direct
  - Length: Short (2-3 paragrafy)
  - Follow-ups: ENABLED, 2 follow-upy, 3 dni delay
- [ ] Prirad prospektov (enrichnutych s emailami)
- [ ] Preview 2-3 vygenerovane emaily
- [ ] Launch (warmup den 2 = max 8-15 emailov)
- [ ] Monitoruj za 24h

### Kampaň 2: Sales Leaders (Tyžden 2, den 7+)
### Kampaň 3: Agency Owners (Tyžden 3, den 14+)

---

## WARMUP SCHEDULE

| Den | Max emailov/den | Stav |
|-----|----------------|------|
| 1-3 | 8 | ← SI TU (9.4.2026) |
| 4-7 | 15 | Zvys po 3 dnoch |
| 8-14 | 30 | Polovicna kapacita |
| 15+ | 50 | Plna kapacita |

---

## DISTRIBUCNE KANALY (po prvych emailoch)

- [ ] Product Hunt launch — screenshots, video demo
- [ ] Reddit r/SaaS + r/Entrepreneur — "How I built..." story
- [ ] Indie Hackers — building in public
- [ ] Twitter/X — daily cold email tips
- [ ] LinkedIn — behind the scenes

---

## CO MOZE POCKAT

- A/B testing (P2 — po 100+ emailoch)
- Referral program (P2 — po 10 platiacich)
- Team/multi-seat (P2)
- White-label (P3)
- Webhook/Zapier (P3)
- Gmail API polling (P2 — manual "Mark as replied" staci)
- Book meetings / calendar integration (P2 — landing page to mentions, ale nie je kriticke pre MVP)

---

## SUMAR: CO TREBA SPRAVIT TERAZ

1. ~~Tech stack, tabulka, password toggle, onboarding UX~~ ✅
2. ~~Landing page redesign (dark, hero mockup, interaktivne filtre)~~ ✅
3. ~~Reply detection + auto-pause~~ ✅
4. **LOGO** — aktualizuj novy logo v: app sidebar, app navbar, landing page, email podpis, favicon
5. **Email podpis** — nastav HTML podpis v Settings
6. **Vytvor kampan #1** — SaaS Founders
7. **Launch** — prvy emaily odidu dnes/zajtra

*Outpulse sa predava sam. Kazdy email co odosles JE demo produktu.*
