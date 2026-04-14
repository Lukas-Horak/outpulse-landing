# Outpulse Sales Playbook — "Sell Outpulse with Outpulse"

> Cieľ: 300 platiacich zákazníkov tento mesiac. Každý krok je presne to, čo vyplníš v appke.

---

## KROK 1: Onboarding (Settings → Profile)

### Company Information

| Pole | Vyplň presne toto |
|------|-------------------|
| **Company Name** | `Outpulse` |
| **Website** | `https://outpulse.ai` |
| **Sender Name** | `Lukas Horak` |

### Offer (čo predávaš)

```
Outpulse is an AI-powered cold outreach platform that writes hyper-personalized emails using real-time prospect data — job changes, funding rounds, hiring signals, and tech stack. Unlike generic email tools, every message feels hand-written. Teams see 3-5x higher reply rates within the first week.
```

### Ideal Buyer (komu predávaš)

```
B2B SaaS founders, sales leaders, and agency owners who run outbound campaigns and are frustrated with low reply rates from generic templates. They typically have 5-200 employees, sell to other businesses, and need a tool that scales personalized outreach without hiring more SDRs.
```

### Tone (vyber tieto)

- [x] **Direct**
- [x] **Professional**
- [x] **Friendly**

### Email Signature

```
Lukas Horak
Founder, Outpulse
https://outpulse.ai
```

### Email Signature HTML

```html
<p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;">
<strong>Lukas Horak</strong><br>
Founder, <a href="https://outpulse.ai" style="color:#5fa883;text-decoration:none;">Outpulse</a><br>
<span style="color:#888;font-size:12px;">AI-powered cold outreach that actually gets replies</span>
</p>
```

---

## KROK 2: ICP (Ideal Customer Profile)

### ICP Description

```
Early-stage to mid-market B2B companies actively running or planning cold email outreach. They've tried tools like Lemlist, Instantly, Apollo sequences, or manual outreach and are hitting a wall with <2% reply rates. Decision makers are founders, heads of sales, or revenue leaders who value efficiency and personalization over volume blasting.
```

### ICP Titles (comma-separated)

```
CEO, Founder, Co-Founder, Head of Sales, VP Sales, Director of Sales, Chief Revenue Officer, Head of Growth, Sales Director, Business Development Director, Agency Owner, Managing Director
```

### ICP Industry

```
SaaS, Software, Marketing Agency, Sales Consulting, Staffing & Recruiting, IT Services, Digital Marketing, Lead Generation, Revenue Operations
```

### ICP Size

```
5-200 employees
```

### ICP Location

```
United States, United Kingdom, Canada, Germany, Netherlands, Australia
```

---

## KROK 3: Buyer Personas (vytvor 3)

### Persona 1: SaaS Founder (PRIMARY)

| Pole | Hodnota |
|------|---------|
| **Name** | `SaaS Founder / CEO` |
| **Is Primary** | `Yes` |
| **Description** | `Early-stage SaaS founders (Seed to Series B) who are doing outbound themselves or with a small sales team of 1-3 people. They need to book demos but don't have budget for a full SDR team. They value tools that save time and feel personal, not spammy. Often technical, data-driven, and skeptical of "growth hacks."` |
| **Job Titles** | `CEO`, `Founder`, `Co-Founder`, `CTO`, `Head of Growth` |
| **Industries** | `SaaS`, `Software`, `Developer Tools`, `FinTech`, `HealthTech`, `MarTech` |
| **Company Size** | `5-50 employees` |
| **Location** | `United States, United Kingdom, Canada` |

### Persona 2: Sales Leader

| Pole | Hodnota |
|------|---------|
| **Name** | `Sales Leader / VP Sales` |
| **Description** | `Heads of sales at B2B companies with existing SDR teams (3-15 reps). They're measured on pipeline generated and reply rates. Currently using Outreach/Salesloft/Apollo but frustrated with template fatigue and declining response rates. Looking for AI personalization to boost team performance without adding headcount.` |
| **Job Titles** | `VP Sales`, `Head of Sales`, `Director of Sales`, `Chief Revenue Officer`, `Sales Director`, `Director of Business Development` |
| **Industries** | `SaaS`, `IT Services`, `Staffing & Recruiting`, `Professional Services`, `Consulting` |
| **Company Size** | `50-200 employees` |
| **Location** | `United States, United Kingdom, Germany, Netherlands` |

### Persona 3: Agency Owner

| Pole | Hodnota |
|------|---------|
| **Name** | `Agency Owner / Lead Gen` |
| **Description** | `Owners of B2B lead generation, marketing, or sales development agencies who manage outreach for multiple clients. They need white-label capabilities, multi-client management, and AI that adapts to different offers and ICPs. Volume is high (10k+ emails/month across clients) and deliverability is critical to their business model.` |
| **Job Titles** | `Agency Owner`, `Managing Director`, `CEO`, `Founder`, `Head of Client Services`, `Director of Operations` |
| **Industries** | `Marketing Agency`, `Lead Generation`, `Sales Consulting`, `Digital Marketing`, `Growth Agency` |
| **Company Size** | `5-30 employees` |
| **Location** | `United States, United Kingdom, Australia, Canada` |

---

## KROK 4: Email Account

| Pole | Hodnota |
|------|---------|
| **From Email** | `lukas@outpulse.ai` |
| **From Name** | `Lukas from Outpulse` |
| **Provider** | Gmail OAuth alebo SMTP |
| **Daily Send Limit** | `30` (prvé 2 týždne warmup), potom `50` |
| **Is Primary** | `Yes` |

> **WARMUP PLÁN:** Prvý týždeň 15 emails/deň, druhý týždeň 30/deň, tretí týždeň 50/deň. Toto je kľúčové pre deliverability.

---

## KROK 5: Kampane — Email Sequences

### Kampaň 1: SaaS Founders (hlavná)

**Campaign Settings:**

| Pole | Hodnota |
|------|---------|
| **Name** | `SaaS Founders — Outpulse Launch Q2` |
| **Persona** | `SaaS Founder / CEO` |
| **Tone** | `Direct`, `Friendly` |
| **Email Length** | `Short` |
| **Follow-ups Enabled** | `Yes` |
| **Follow-up Count** | `2` |
| **Follow-up Delay** | `3` days |

**Custom Instructions:**

```
Never use phrases like "I hope this finds you well" or "Just reaching out." Lead with a specific observation about their company — a recent hire, product launch, funding, or tech stack change. Keep it under 80 words. Sound like a founder talking to a founder, not a salesperson. End with a soft question, never a hard CTA. No links in the first email. Reference that Outpulse is what I use to send this very email — that's the proof.
```

#### Step 1: Initial Email

**Subject:**
```
{{first_name}}, quick thought on your outbound
```

**Body:**
```
Hey {{first_name}},

Noticed {{company}} is {{intent_signal_context}} — usually means outbound is top of mind.

I built Outpulse because I was tired of sending 500 emails that all sounded the same. It uses real-time signals (like what you're doing right now) to write emails that actually feel personal.

This email was written by Outpulse, btw. Was the personalization obvious or did it feel real?

Curious to hear your take.

Lukas
```

#### Step 2: Follow-up 1 (Day 3)

**Subject:**
```
re: {{first_name}}, quick thought on your outbound
```

**Body:**
```
{{first_name}} — not trying to fill your inbox.

Just wanted to share: founders using Outpulse are seeing 8-12% reply rates on cold outreach vs. the 1-2% industry average.

The difference is AI personalization based on real signals (hiring, funding, tech changes) — not just "Hey {first_name}, love what you're doing at {company}."

Worth a 15-min look?

Lukas
```

#### Step 3: Follow-up 2 (Day 6)

**Subject:**
```
last one, {{first_name}}
```

**Body:**
```
{{first_name}}, I'll keep this short.

If outbound is on your roadmap this quarter, Outpulse can save you ~10 hours/week on email writing while 3-5x your reply rates.

Here's the 2-minute version: outpulse.ai

Either way, rooting for {{company}}.

Lukas
```

---

### Kampaň 2: Sales Leaders

**Campaign Settings:**

| Pole | Hodnota |
|------|---------|
| **Name** | `Sales Leaders — Pipeline Boost` |
| **Persona** | `Sales Leader / VP Sales` |
| **Tone** | `Professional`, `Direct` |
| **Email Length** | `Medium` |
| **Follow-ups Enabled** | `Yes` |
| **Follow-up Count** | `2` |
| **Follow-up Delay** | `4` days |

**Custom Instructions:**

```
Speak to their pain: declining reply rates, template fatigue, SDR ramp time. Use data points and ROI language. These are metrics-driven buyers — mention reply rates, time saved, pipeline impact. Don't be salesy, be a peer sharing a solution. Reference that this email itself is proof the AI works.
```

#### Step 1: Initial Email

**Subject:**
```
your SDRs' reply rates, {{first_name}}
```

**Body:**
```
{{first_name}},

Most sales teams I talk to are stuck at 1-2% reply rates on cold email. Templates get stale, personalization takes forever, and adding more SDRs doesn't fix the quality problem.

We built Outpulse to solve exactly this. It reads real-time signals — job changes, funding, hiring patterns, tech stack — and writes emails that sound like your best rep on their best day.

Teams using it are hitting 8-12% reply rates without increasing headcount.

This email is a live example. Worth discussing how this could work for {{company}}'s outbound?

Lukas Horak
Founder, Outpulse
```

#### Step 2: Follow-up 1 (Day 4)

**Subject:**
```
re: your SDRs' reply rates, {{first_name}}
```

**Body:**
```
{{first_name}}, one data point:

A 15-person sales team switched from manual personalization to Outpulse. Result: 3.2x more replies, 40% less time on email writing, and their pipeline grew 28% in 6 weeks.

The AI uses intent signals (hiring surges, funding rounds, technology changes) that your reps would never have time to research manually.

Happy to show you a 15-minute demo with your actual ICP data. When works this week?

Lukas
```

#### Step 3: Follow-up 2 (Day 8)

**Subject:**
```
{{first_name}} — closing the loop
```

**Body:**
```
{{first_name}}, last note on this.

If your team's outbound could use a boost, Outpulse is free to try for 7 days — no card needed.

We're at outpulse.ai. Either way, no hard feelings.

Best,
Lukas
```

---

### Kampaň 3: Agency Owners

**Campaign Settings:**

| Pole | Hodnota |
|------|---------|
| **Name** | `Agency Owners — Scale Client Outreach` |
| **Persona** | `Agency Owner / Lead Gen` |
| **Tone** | `Friendly`, `Direct` |
| **Email Length** | `Short` |
| **Follow-ups Enabled** | `Yes` |
| **Follow-up Count** | `2` |
| **Follow-up Delay** | `3` days |

**Custom Instructions:**

```
Agencies care about: managing multiple clients efficiently, deliverability at scale, results they can show clients, and margins. Lead with how Outpulse helps them scale without adding team members. Mention multi-client management. These are operators — be practical, not visionary.
```

#### Step 1: Initial Email

**Subject:**
```
scaling outreach across clients, {{first_name}}?
```

**Body:**
```
{{first_name}},

Running outbound for multiple clients means writing dozens of personalized sequences — different ICPs, different offers, different tones. That doesn't scale.

Outpulse handles it: AI-written emails based on each client's ICP and real-time prospect signals. One platform, multiple campaigns, all personalized.

Agencies using it are managing 3x more clients without adding headcount.

Want to see how it'd work for your setup?

Lukas
```

#### Step 2: Follow-up 1 (Day 3)

**Subject:**
```
re: scaling outreach across clients, {{first_name}}?
```

**Body:**
```
{{first_name}} — quick follow-up.

The biggest unlock for agencies is AI that adapts to each client's voice and ICP automatically. No more rewriting templates per client.

Outpulse reads hiring signals, funding, tech changes — and writes emails your clients' prospects actually reply to.

Happy to do a 15-min walkthrough with one of your client ICPs as the example.

Lukas
```

#### Step 3: Follow-up 2 (Day 6)

**Subject:**
```
{{first_name}}, last one
```

**Body:**
```
{{first_name}}, keeping it brief.

If scaling client outreach without scaling your team is a priority, check out outpulse.ai.

Free 7-day trial. Would love your honest feedback even if it's not a fit.

Lukas
```

---

## KROK 6: Prospecting — Koho hľadať cez Apollo/Discover

### Filtre pre Apollo Search

**Persona 1 (SaaS Founders):**
- Job Titles: CEO, Founder, Co-Founder
- Industries: Computer Software, Internet, Information Technology
- Employee Count: 5-50
- Location: United States
- Intent Signals: `recently_funded`, `hiring`, `tech_change`
- Limit: 200 prospects na začiatok

**Persona 2 (Sales Leaders):**
- Job Titles: VP Sales, Head of Sales, Director of Sales, CRO
- Industries: SaaS, Software, IT Services
- Employee Count: 50-200
- Location: United States, UK
- Intent Signals: `hiring`, `growing_team`
- Limit: 200 prospects

**Persona 3 (Agency Owners):**
- Job Titles: CEO, Founder, Managing Director, Owner
- Industries: Marketing & Advertising, Staffing & Recruiting
- Employee Count: 5-30
- Location: United States, UK, Australia
- Intent Signals: `expanding`, `hiring`
- Limit: 100 prospects

---

## KROK 7: Launch Sequence

### Týždeň 1 (Warmup)
- [ ] Deň 1-2: Nastav všetko podľa tohto playbooku
- [ ] Deň 3: Importuj 50 prospects (Persona 1 only)
- [ ] Deň 4-7: Pošli 15 emails/deň, sleduj bounces

### Týždeň 2 (Scale)
- [ ] Zvýš na 30 emails/deň
- [ ] Pridaj Persona 2 prospects (100)
- [ ] Spusti Kampaň 2

### Týždeň 3 (Full throttle)
- [ ] Zvýš na 50 emails/deň
- [ ] Pridaj Persona 3 prospects (100)
- [ ] Spusti Kampaň 3
- [ ] Vyhodnoť reply rates z Týždeň 1-2, uprav subject lines ak <5%

### Týždeň 4 (Optimize)
- [ ] A/B test najlepšie subject lines
- [ ] Dvojnásob winning kampane
- [ ] Pridaj 200+ nových prospects
- [ ] Cieľ: 50 demo calls booked

---

## KROK 8: Deliverability Checklist

- [x] **DMARC** — `v=DMARC1; p=quarantine` ✅ (overené)
- [ ] **SPF** — Overiť: `dig TXT outpulse.ai` → musí obsahovať `include:_spf.google.com`
- [ ] **DKIM** — Overiť cez Google Admin / email provider
- [ ] **MX Records** — Overiť: `dig MX outpulse.ai`
- [ ] **Custom Tracking Domain** — Nastaviť `track.outpulse.ai` CNAME (znižuje spam score)
- [ ] **Warmup Tool** — Zvážiť Warmup Inbox alebo Instantly warmup prvé 2 týždne
- [ ] **Unsubscribe Link** — Pridať do Outpulse (TODO: implementovať v app)

---

## KROK 9: Metriky na sledovanie

| Metrika | Target | Red Flag |
|---------|--------|----------|
| **Open Rate** | >50% | <30% = deliverability problém |
| **Reply Rate** | >8% | <3% = messaging problém |
| **Bounce Rate** | <3% | >5% = list quality problém |
| **Demo Booked** | >2% of total sent | <0.5% = offer/CTA problém |
| **Unsubscribe** | <1% | >2% = targeting problém |

---

## KROK 10: Čo ešte doplniť do produktu (pre max. úspech)

### Must-have (tento mesiac):
1. **Unsubscribe link** — automaticky na konci každého emailu (CAN-SPAM compliance)
2. **Custom tracking domain** — `track.outpulse.ai` namiesto shared domain (zlepší deliverability)
3. **Email warmup integrácia** — alebo aspoň guide v onboardingu

### Nice-to-have (ďalší mesiac):
4. **A/B testing subject lines** — automaticky testovať 2 varianty
5. **Reply detection & auto-pause** — keď prospect odpovie, stopni follow-upy
6. **Webhook/Zapier integration** — pre CRM sync
7. **Team seats** — pre Sales Leader persónu (multi-user)

---

*Tento playbook je tvoja case study. Predávaš Outpulse pomocou Outpulse. Každý reply je dôkaz, že produkt funguje.*
