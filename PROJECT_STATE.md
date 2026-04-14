# Outpulse — Project State

_Last updated: 2026-04-11 ~15:30 UTC by Claude + Lukas_

Tento dokument je "živá pamäť" pre Outpulse projekt. Zaznamenáva aktuálny stav dogfoodingu, deploy konfigurácie, a rozhodnutí. Čítaj ho na začiatku každej novej Claude session.

---

## 1. Reply detection infrastructure — LIVE

### Čo je nasadené (commit 6a34e16 + follow-up deploy 2026-04-11)

- **Migrácia `supabase/migrations/gmail_oauth.sql`** aplikovaná na prod Supabase. Pridala `oauth_refresh_token`, `oauth_access_token`, `oauth_token_expires_at`, `oauth_scope`, `oauth_connected_at`, `last_reply_check_at`, `replies_detected_count` do `email_accounts`. Vrátane partial indexu `email_accounts_oauth_idx ON (provider, last_reply_check_at) WHERE oauth_refresh_token IS NOT NULL`.

- **Google Cloud OAuth client** vytvorený v projekte `outpulse-analytics`:
  - Client type: Web application, meno `Outpulse Web`
  - Scope: `https://www.googleapis.com/auth/gmail.readonly`
  - Authorized redirect URI: `https://app.outpulse.ai/api/email-accounts/google/oauth/callback`
  - OAuth consent screen: External, Testing mode, test user `lukas@outpulse.ai`
  - Client ID začína `1028694899764-t8creq5ookrjbrru5slur54ar7acf6vq.apps.googleusercontent.com`

- **Vercel env variables** (Production + Preview):
  - `GOOGLE_OAUTH_CLIENT_ID`
  - `GOOGLE_OAUTH_CLIENT_SECRET`
  - `GOOGLE_OAUTH_REDIRECT_URI = https://app.outpulse.ai/api/email-accounts/google/oauth/callback`
  - (existujúce: `CRON_SECRET`, `SMTP_ENCRYPTION_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, etc.)

- **Route handlery** (v `src/app/api/email-accounts/google/oauth/`):
  - `start/route.ts` — GET `?account_id=<uuid>`, user-authenticated, generuje CSRF state, redirect na Google consent
  - `callback/route.ts` — GET, verifies state cookie, exchanges code, enforces Google email == `from_email` v DB, encrypts tokens via `SMTP_ENCRYPTION_KEY`, redirects na `/settings?gmail_oauth_success=1`

- **Reply polling** (`src/app/api/check-replies/route.ts`):
  - POST, supports user session alebo `Bearer CRON_SECRET`
  - Iteruje OAuth-connected Gmail accounts (via partial index)
  - Refreshne access token ak vyprší do 30s
  - List 100 správ `in:inbox newer_than:2d`
  - Match via `In-Reply-To` + `References` hlavičky proti `email_send_log.message_id` (last 7 days)
  - Pre match: fetch body, POST na `/api/track/reply` (existujúci webhook, robí opt-out detection + mark replied)
  - Clears tokens on `invalid_grant`
  - Updates `last_reply_check_at` + `replies_detected_count`

- **Vercel Cron** (v `vercel.json`):
  - `/api/cron/check-replies` bežia **každých 15 minút** (`*/15 * * * *`)
  - `/api/cron/check-replies/route.ts` je thin wrapper ktorý forwarduje na `/api/check-replies` s `CRON_SECRET`

- **Diagnostický endpoint** `/api/internal/account-status` (GET, CRON_SECRET-gated):
  - Query param `?email=<addr>` alebo `?user_id=<uuid>`
  - Vracia email_accounts rows + `_computed` pole s `warmup_day`, `is_warmup`, `effective_cap_today`, `sent_today_effective`, `remaining_today`, `reply_detection_enabled`

### Overené funkčné (2026-04-11 ~15:30 UTC)

- OAuth connect pre `lukas@outpulse.ai` (email_accounts row `1b33cf15-4511-48f8-9601-da9731f8826f`) — `has_refresh_token = true`, `has_access_token = true`, `oauth_scope = gmail.readonly`, `oauth_connected_at = 2026-04-11 13:24:18 UTC`
- Smoke test `POST /api/check-replies` (cez DevTools fetch) → `{ success: true, checked: 5, repliesFound: 0, accountResults: [...] }` — žiadne chyby, polling funguje
- Postmaster Tools TXT verification pre **outpulse.ai** doménu pridaný v GoDaddy ako `@ TXT google-site-verification=bhAnsmMYe-Nye...` (užívateľ potvrdil že je v DNS)

---

## 2. Email accounts — aktuálny stav

### Dva separátne Outpulse tenanty (user registrácie)

| Tenant | Auth email | Zámer |
|---|---|---|
| **Outpulse.ai** | `lukas@outpulse.ai` | Dogfooding Outpulse-u samotného — kampane na propagáciu produktu |
| **PLATFORM** | `lukas@plat4m.com` | Pôvodne pre biznis PLATFORM firmy — **aktuálne dormant, ignorujeme** |

### Email accounts rows

**V Outpulse.ai tenante** (user_id `cdc9db81-d861-44da-8b4c-219701711509`):
- `lukas@outpulse.ai` — Primary, Gmail, **OAuth connected**, Warmup day 4/14, daily_send_limit ~17 (warmup ramp), created 2026-04-08
  - email_accounts.id = `1b33cf15-4511-48f8-9601-da9731f8826f`
- ~~`lukas@plat4m.com`~~ — bolo pridané a Option B SQL ho shiftnul, ale user ho **vymazal** z UI (Settings → X) keď si sadol na rozhodnutie "držať Outpulse.ai čisto". DB row je preč.

**V PLATFORM tenante** (user_id `c0431195-2352-4827-97d4-4d2f843db743`):
- `lukas@plat4m.com` — existuje, Option B aplikovaný (warmup shifted -10 days, daily_send_limit = 50), 1 send_log zaznamenaný (pravdepodobne test email)
  - email_accounts.id = `2237867e-ed35-4209-9344-6192104da27e`
  - **NIE je OAuth connected** — reply detection pre tento riadok nebeží
  - Tento riadok je momentálne zabudnutý — žiadna aktívna kampaň z neho nebeží

### Postmaster Tools stav

- **plat4m.com** — pridané, "Not Verified" (čaká TXT verification; user zatiaľ TXT neaplikoval na plat4m.com DNS)
- **outpulse.ai** — TXT verification záznam pridaný do GoDaddy DNS, čaká na propagáciu + klik Verify v Postmaster Tools

### DMARC / SPF / DKIM

- **plat4m.com** — všetky zelené: `DMARC p=none`, SPF s `include:_spf.google.com include:spf.mtasv.net ~all`, DKIM cez `google._domainkey` (Gmail) + `resend._domainkey` (Resend). Overené cez `dig` z userovho Macu.
- **outpulse.ai** — nie je overené v tomto session, ale user tam už posiela (takže DNS má pravdepodobne aspoň SPF + DKIM nastavené)

---

## 3. Dogfood kampane

### Dogfood V1 (aktuálne beží)

- **Sender**: `lukas@outpulse.ai` (Primary mailbox v Outpulse.ai tenante)
- **Status**: sending, Warmup day 4/14, cap ~17/day
- **Poslaných**: ~25 emailov zatiaľ (cez všetky dni, podľa earlier terminal outputu)
- **Reply rate**: 0% zatiaľ (ale reply detection teraz beží, takže 0% je reálna hodnota, nie false negative)
- **Step 1 pixel/click tracking**: **vypnuté** pre deliverability (viď `src/app/api/cron/send-campaigns/route.ts` riadky 37-39, 218-244). Tracking sa zapne až od step 2+.

### Dogfood V2 (plánované, z plat4m.com domény — **pending decision**)

- **Účel**: druhá kampaň s iným angle + využitie osemročnej plat4m.com reputácie
- **Stav**: nie je spustená, plat4m.com nie je OAuth-connected v správnom tenante
- **Blokátor**: rozhodnúť či
  1. re-addnut plat4m.com do Outpulse.ai tenantu, re-aplikovať Option B SQL na nový row, OAuth-connectnúť → čisté riešenie v jednom tenante ✅ odporúčané
  2. použiť existujúci row v PLATFORM tenante (znamená prepínanie medzi 2 Outpulse účtami — organizačný chaos)
  3. úplne vynechať plat4m.com, poslať V2 tiež z outpulse.ai s iným subject/angle (konzervatívne, ale stráca domain reputation edge)

---

## 4. Self-learning / optimize loop

### Čo beží automaticky

- **`/api/cron/send-campaigns`** — hlavný sending cron, 3× za hodinu v 9-slot window (13-21 UTC). Sends max 3 per run. Rešpektuje warmup cap podľa `warmup_started_at` → `warmupCapForDay(day)` (15/day week 1, 30/day week 2, 50/day week 3+). Viď `src/lib/smtp.ts`.
- **`/api/cron/check-replies`** — polling inbox každých 15 minút (práve zapojené).
- **`/api/cron/optimize`** — denný optimize cron, beží ~06:00 UTC. Pozerá sa na reply rates a upravuje/pauzuje kampane. **PRED dneškom by videl false 0% reply rate a mohol by thrashnúť Dogfood V1.** Teraz vidí pravdivé dáta z reply detection, takže rozhoduje korektne.

### Čo NIE je automatické (v2 enhancements, nie sú implementované)

- **Reply classification** — positive / negative / neutral / question. Zatiaľ sa všetky replies markujú len ako "replied".
- **Thompson sampling A/B** — na subject lines, opening lines, CTA variants. Zatiaľ žiadna bandit logika, kampane idú v jednej variácii.
- **Conversion tracking na downstream event** (napr. trial_started) — zatiaľ len reply ako proxy pre konverziu.
- **Deliverability feedback loop** — Postmaster Tools dáta sa zatiaľ nepoužívajú v optimize logike, len pre manuálnu kontrolu.

---

## 5. Deployment + repo stav

- **Repo**: Outpulse monorepo, Next.js 16 app v `app/` subfolder
- **Aktívna vetva**: `main`
- **Posledný relevantný commit**: `6a34e16` — Gmail OAuth reply detection infrastructure
- **Hosting**: Vercel (Outpulse-app project, Pro plan, user `lukas-7529`)
- **Database**: Supabase (PLATFORM org, `outpulse` project, production DB)

---

## 6. Otvorené rozhodnutia

1. **plat4m.com pre Dogfood V2** — viď sekcia 3. Odporúčanie: re-add do Outpulse.ai tenantu (opcia 1).
2. **Outpulse.ai doména reputation** — nová doména, potrebuje čas. Postmaster Tools verifikácia je prvý krok; reálne dáta prídu za 24-48h po prvých väčších sendoch.
3. **Cleanup PLATFORM tenantu** — nechať tak (dormant) alebo reálne zmazať user_id a všetky jeho email_accounts, campaigns, prospects? Rozhodnutie posunúť na neskôr.

---

## 7. Kontakt pre Claude sessions

Lukas Horak, Founder Outpulse + PLATFORM
- `lukas@outpulse.ai` — pre dogfooding a produktové veci
- `lukas@plat4m.com` — pre biznis PLATFORM (aktuálne dormant v Outpulse kontexte)
- Stack: Next.js 16 App Router, Supabase, Vercel, Resend (pôvodne, teraz aj Gmail API priamo)
- Jazyky: Slovensky primárne, AJ pre code/docs
