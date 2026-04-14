import { useState, useEffect, useCallback } from "react"

// ═══════════════════════════════════════════════════════════════
// PULSE v3 — Visits-First Reverse Funnel
// Goal → Paying → Activated → Signups → VISITS needed
// Then: "Here's how Outpulse helps you get there" (multi-channel)
// Real conversion data from admin dashboard
// ═══════════════════════════════════════════════════════════════

// ─── THIEL PRICING TIERS (distribution strategy context) ───
const PRICING_TIERS = [
  {
    id: 'micro', range: '$1 – $100', label: 'Viral / Self-serve', icon: '🚀',
    description: 'Product sells itself. Zero-friction signup. Volume wins.',
    insight: 'At this price point, your product must convert visitors on its own. Focus on driving traffic — Outpulse fills the top of funnel.',
    channels: {
      coldEmail: { pct: 30, label: 'Cold outreach', desc: 'Automated personalized emails driving traffic to your landing page' },
      linkedin: { pct: 15, label: 'LinkedIn', desc: 'Profile visits, connection requests, DMs' },
      listings: { pct: 25, label: 'Product listings', desc: 'Product Hunt, directories, marketplaces' },
      organic: { pct: 20, label: 'SEO & Content', desc: 'Blog posts, guides, organic search' },
      other: { pct: 10, label: 'Referrals & Other', desc: 'Word of mouth, partnerships, ads' },
    },
  },
  {
    id: 'low', range: '$100 – $1K', label: 'Self-serve + Nudge', icon: '✉️',
    description: 'Customer clicks, tries, pays. A nudge email seals it.',
    insight: 'The sweet spot for AI outreach. Personalized emails drive trials, the product closes. Outpulse shines here.',
    channels: {
      coldEmail: { pct: 35, label: 'Cold outreach', desc: 'Personalized emails with trial/demo links' },
      linkedin: { pct: 15, label: 'LinkedIn', desc: 'Thought leadership, direct outreach' },
      listings: { pct: 15, label: 'Product listings', desc: 'Product Hunt, G2, Capterra, directories' },
      organic: { pct: 20, label: 'SEO & Content', desc: 'Case studies, comparison pages, tutorials' },
      other: { pct: 15, label: 'Referrals & Other', desc: 'Word of mouth, partnerships, communities' },
    },
  },
  {
    id: 'mid', range: '$1K – $10K', label: 'Inside Sales', icon: '📞',
    description: 'Customer needs a call before buying. Outpulse books the meeting.',
    insight: 'At this price, people need to talk to someone. Outpulse acts as your SDR — it gets the reply, you close the deal.',
    channels: {
      coldEmail: { pct: 40, label: 'Cold outreach', desc: 'Outreach → reply → demo call → close' },
      linkedin: { pct: 20, label: 'LinkedIn', desc: 'Direct outreach to decision makers' },
      listings: { pct: 5, label: 'Listings & directories', desc: 'G2, Clutch, industry directories' },
      organic: { pct: 15, label: 'SEO & Content', desc: 'Whitepapers, webinars, SEO' },
      other: { pct: 20, label: 'Referrals & Events', desc: 'Conferences, referrals, partnerships' },
    },
  },
  {
    id: 'high', range: '$10K – $100K', label: 'Field Sales', icon: '🤝',
    description: 'Longer cycles, multiple stakeholders. Outpulse opens doors.',
    insight: 'Complex deals need warm intros. Outpulse gets you in front of the right person — the relationship is yours.',
    channels: {
      coldEmail: { pct: 30, label: 'Cold outreach', desc: 'Multi-touch sequences to key stakeholders' },
      linkedin: { pct: 25, label: 'LinkedIn', desc: 'Executive-level engagement, InMails' },
      listings: { pct: 0, label: 'Listings', desc: '' },
      organic: { pct: 15, label: 'Content & SEO', desc: 'Industry reports, thought leadership' },
      other: { pct: 30, label: 'Referrals & Events', desc: 'Conferences, intros, partnerships' },
    },
  },
  {
    id: 'enterprise', range: '$100K+', label: 'Complex Sales', icon: '🏢',
    description: 'Enterprise deals measured in months. Outpulse warms relationships.',
    insight: 'One deal changes everything. Outpulse builds your pipeline of warm relationships — the rest is trust and timing.',
    channels: {
      coldEmail: { pct: 20, label: 'Cold outreach', desc: 'Highly targeted executive outreach' },
      linkedin: { pct: 25, label: 'LinkedIn', desc: 'C-level relationship building' },
      listings: { pct: 0, label: 'Listings', desc: '' },
      organic: { pct: 10, label: 'Content', desc: 'Industry reports, keynotes' },
      other: { pct: 45, label: 'Referrals & Events', desc: 'Warm intros, conferences, advisory' },
    },
  },
]

// ─── DEFAULT CONVERSION RATES (industry benchmarks, user can edit) ───
const DEFAULT_CONVERSIONS = {
  visitToSignup: 15,      // % of visits that sign up (conservative default)
  signupToActivated: 40,  // % of signups that activate (complete onboarding)
  activatedToPaying: 25,  // % of activated that convert to paid
}

// ─── COLD EMAIL METRICS (for channel breakdown) ───
const COLD_EMAIL_DEFAULTS = {
  emailToClick: 6,        // % of emails that get a click
  avgEmailsPerProspect: 3, // emails in a sequence
}

// ─── COLORS ───
const C = {
  bg: '#FFFDF8',
  card: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#8A8A7A',
  green: '#2D6A4F',
  greenLight: '#52B788',
  greenGlow: '#40C07B',
  greenPale: '#F0FAF4',
  border: '#F0EDE6',
  accent: '#D4A843',
  warn: '#E07B4C',
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function PulseV3() {
  const [screen, setScreen] = useState('home')
  const [setupStep, setSetupStep] = useState(0)

  // Setup
  const [dealValue, setDealValue] = useState('')
  const [goalType, setGoalType] = useState('revenue')
  const [goalValue, setGoalValue] = useState('')
  const [businessName, setBusinessName] = useState('')

  // Editable conversions
  const [conv, setConv] = useState({ ...DEFAULT_CONVERSIONS })

  // Editable channel mix (set from tier defaults)
  const [channels, setChannels] = useState(null)

  // Tier detection
  const detectedTier = dealValue ? PRICING_TIERS.find(t => {
    const v = Number(dealValue)
    if (t.id === 'micro') return v >= 1 && v < 100
    if (t.id === 'low') return v >= 100 && v < 1000
    if (t.id === 'mid') return v >= 1000 && v < 10000
    if (t.id === 'high') return v >= 10000 && v < 100000
    if (t.id === 'enterprise') return v >= 100000
    return false
  }) : null

  // Initialize channels when tier changes
  useEffect(() => {
    if (detectedTier && !channels) {
      setChannels({ ...detectedTier.channels })
    }
  }, [detectedTier])

  const tier = detectedTier

  // ─── REVERSE FUNNEL CALCULATION ───
  const customersNeeded = goalValue && dealValue
    ? (goalType === 'revenue' ? Math.ceil(Number(goalValue) / Number(dealValue)) : Number(goalValue))
    : 0

  const activatedNeeded = customersNeeded > 0
    ? Math.ceil(customersNeeded / (conv.activatedToPaying / 100)) : 0
  const signupsNeeded = activatedNeeded > 0
    ? Math.ceil(activatedNeeded / (conv.signupToActivated / 100)) : 0
  const visitsNeeded = signupsNeeded > 0
    ? Math.ceil(signupsNeeded / (conv.visitToSignup / 100)) : 0

  // Channel breakdown of visits
  const channelVisits = channels ? Object.entries(channels).reduce((acc, [key, ch]) => {
    acc[key] = { ...ch, visits: Math.ceil(visitsNeeded * (ch.pct / 100)) }
    return acc
  }, {}) : {}

  // Cold email specific: how many visits come from email, how many emails needed
  const emailVisits = channelVisits.coldEmail?.visits || 0
  const emailsForVisits = COLD_EMAIL_DEFAULTS.emailToClick > 0
    ? Math.ceil(emailVisits / (COLD_EMAIL_DEFAULTS.emailToClick / 100)) : 0
  const prospectsNeeded = COLD_EMAIL_DEFAULTS.avgEmailsPerProspect > 0
    ? Math.ceil(emailsForVisits / COLD_EMAIL_DEFAULTS.avgEmailsPerProspect) : 0

  const timeframeDays = 30

  // Demo progress
  const demoProgress = {
    paying: 14,
    activated: 22,
    signups: 58,
    visits: 312,
    daysElapsed: 12,
  }

  const progressPct = customersNeeded > 0 ? Math.min(Math.round((demoProgress.paying / customersNeeded) * 100), 100) : 0
  const [animPct, setAnimPct] = useState(0)
  useEffect(() => {
    if (screen === 'dashboard') {
      const t = setTimeout(() => setAnimPct(progressPct), 300)
      return () => clearTimeout(t)
    }
  }, [screen, progressPct])

  function reset() {
    setSetupStep(0)
    setDealValue('')
    setGoalType('revenue')
    setGoalValue('')
    setBusinessName('')
    setConv({ ...DEFAULT_CONVERSIONS })
    setChannels(null)
    setScreen('setup')
  }

  // ═══════════════════════════════════════════════════════════
  // HOME
  // ═══════════════════════════════════════════════════════════
  if (screen === 'home') {
    return (
      <div style={st.page}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 20px',
            background: `linear-gradient(135deg, ${C.greenLight}, ${C.green})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 32px ${C.green}40`,
          }}>
            <span style={{ fontSize: 28, color: '#fff', fontWeight: 800 }}>◎</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>Pulse</h1>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: '0 0 32px' }}>
            Set your growth target. See exactly what it takes.
            <br />Outpulse helps you get there — across every channel.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
            <Btn onClick={() => reset()} primary>Set up your Pulse</Btn>
            <Btn onClick={() => { if (!goalValue) { setGoalValue('30000'); setDealValue('149'); setConv({ visitToSignup: 27, signupToActivated: 67, activatedToPaying: 100 }) }; setScreen('dashboard') }}>Preview: Dashboard widget</Btn>
            <Btn onClick={() => { if (!goalValue) { setGoalValue('30000'); setDealValue('149'); setConv({ visitToSignup: 27, signupToActivated: 67, activatedToPaying: 100 }) }; setScreen('email') }}>Preview: Daily email</Btn>
          </div>

          <div style={{ marginTop: 40, padding: 20, borderRadius: 16, background: C.greenPale, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.green, marginBottom: 8 }}>HOW PULSE WORKS</div>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 }}>
              ① You set a revenue or client goal<br />
              ② Pulse reverse-calculates: paying → activated → signups → <strong>visits needed</strong><br />
              ③ Your growth channels (cold email, LinkedIn, listings, SEO...) each contribute a share of those visits<br />
              ④ Outpulse handles the outreach channels automatically — you track progress daily
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // SETUP STEP 0: Deal Value + Thiel Tier
  // ═══════════════════════════════════════════════════════════
  if (screen === 'setup' && setupStep === 0) {
    return (
      <div style={st.page}>
        <SetupShell step={0} total={4}>
          <h2 style={st.title}>What do you sell, and for how much?</h2>
          <p style={st.subtitle}>This determines your ideal growth strategy.</p>

          <div style={{ marginTop: 8 }}>
            <label style={st.label}>Your product / service name</label>
            <input
              style={st.input}
              placeholder="e.g. Outpulse, Design consulting"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={st.label}>Average deal / sale value ($)</label>
            <input
              style={st.input}
              type="number"
              placeholder="e.g. 149"
              value={dealValue}
              onChange={e => { setDealValue(e.target.value); setChannels(null) }}
            />
          </div>

          {detectedTier && (
            <div style={{
              marginTop: 20, padding: 20, borderRadius: 16,
              background: C.greenPale,
              border: `1px solid ${C.green}22`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{detectedTier.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{detectedTier.label}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{detectedTier.range}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: '0 0 10px' }}>
                {detectedTier.description}
              </p>
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.7)',
                border: `1px solid ${C.border}`,
              }}>
                <p style={{ fontSize: 12, color: C.green, lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                  {detectedTier.insight}
                </p>
              </div>
            </div>
          )}

          {/* All tiers */}
          <div style={{ marginTop: 24 }}>
            <div style={st.sectionLabel}>Distribution tiers (Thiel framework)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {PRICING_TIERS.map(t => {
                const isActive = detectedTier?.id === t.id
                return (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 10,
                    background: isActive ? C.greenPale : 'transparent',
                    border: isActive ? `1px solid ${C.green}30` : '1px solid transparent',
                    transition: 'all 0.3s ease',
                  }}>
                    <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>{t.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400, color: isActive ? C.green : C.muted, flex: 1 }}>{t.range}</span>
                    <span style={{ fontSize: 12, color: isActive ? C.green : C.muted }}>{t.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <Btn onClick={() => setSetupStep(1)} primary disabled={!detectedTier} style={{ marginTop: 20 }}>
            Continue
          </Btn>
        </SetupShell>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // SETUP STEP 1: Goal
  // ═══════════════════════════════════════════════════════════
  if (screen === 'setup' && setupStep === 1) {
    return (
      <div style={st.page}>
        <SetupShell step={1} total={4}>
          <h2 style={st.title}>What's your monthly target?</h2>
          <p style={st.subtitle}>{tier?.label} — {tier?.range} per deal</p>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              style={{ ...st.toggleBtn, ...(goalType === 'revenue' ? st.toggleActive : {}) }}
              onClick={() => setGoalType('revenue')}
            >Revenue ($)</button>
            <button
              style={{ ...st.toggleBtn, ...(goalType === 'clients' ? st.toggleActive : {}) }}
              onClick={() => setGoalType('clients')}
            >Clients (#)</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={st.label}>
              {goalType === 'revenue' ? 'Monthly revenue target ($)' : 'New clients per month'}
            </label>
            <input
              style={st.input}
              type="number"
              placeholder={goalType === 'revenue' ? '30000' : '20'}
              value={goalValue}
              onChange={e => setGoalValue(e.target.value)}
              autoFocus
            />
          </div>

          {goalValue && (
            <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: C.greenPale }}>
              <div style={{ fontSize: 14, color: C.text }}>
                {goalType === 'revenue'
                  ? `$${Number(goalValue).toLocaleString()} ÷ $${Number(dealValue).toLocaleString()} = `
                  : ''}
                <strong>{customersNeeded} paying customers</strong> needed this month
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <Btn onClick={() => setSetupStep(0)}>← Back</Btn>
            <Btn onClick={() => setSetupStep(2)} primary disabled={!goalValue} style={{ flex: 1 }}>Continue</Btn>
          </div>
        </SetupShell>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // SETUP STEP 2: Conversion Rates (editable, with your data)
  // ═══════════════════════════════════════════════════════════
  if (screen === 'setup' && setupStep === 2) {
    return (
      <div style={st.page}>
        <SetupShell step={2} total={4}>
          <h2 style={st.title}>Your conversion funnel</h2>
          <p style={st.subtitle}>
            Adjust these based on your real data. We've set industry defaults — edit any number.
          </p>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ConversionRow
              label="Visit → Signup"
              sublabel="% of website visitors that sign up"
              value={conv.visitToSignup}
              onChange={v => setConv(p => ({ ...p, visitToSignup: v }))}
              example="SaaS avg: 2-5%, Landing page: 10-30%"
            />
            <ConversionRow
              label="Signup → Activated"
              sublabel="% of signups that complete onboarding"
              value={conv.signupToActivated}
              onChange={v => setConv(p => ({ ...p, signupToActivated: v }))}
              example="Good onboarding: 40-60%, Great: 60-80%"
            />
            <ConversionRow
              label="Activated → Paying"
              sublabel="% of active users that convert to paid"
              value={conv.activatedToPaying}
              onChange={v => setConv(p => ({ ...p, activatedToPaying: v }))}
              example="Freemium: 2-5%, Free trial: 15-30%"
            />
          </div>

          {/* Live preview */}
          {customersNeeded > 0 && (
            <div style={{ marginTop: 24, padding: 20, borderRadius: 16, background: C.greenPale, border: `1px solid ${C.green}15` }}>
              <div style={st.sectionLabel}>Reverse funnel preview</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                <FunnelPreviewRow emoji="💰" label="Paying customers" value={customersNeeded} highlight />
                <FunnelPreviewRow emoji="⚡" label="Activated users needed" value={activatedNeeded} rate={`${conv.activatedToPaying}% convert to paid`} />
                <FunnelPreviewRow emoji="✍️" label="Signups needed" value={signupsNeeded} rate={`${conv.signupToActivated}% activate`} />
                <FunnelPreviewRow emoji="👁️" label="Visits needed" value={visitsNeeded} rate={`${conv.visitToSignup}% sign up`} highlight />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <Btn onClick={() => setSetupStep(1)}>← Back</Btn>
            <Btn onClick={() => setSetupStep(3)} primary style={{ flex: 1 }}>Continue</Btn>
          </div>
        </SetupShell>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // SETUP STEP 3: Channel Mix + Plan
  // ═══════════════════════════════════════════════════════════
  if (screen === 'setup' && setupStep === 3) {
    const activeChannels = channels ? Object.entries(channels).filter(([_, ch]) => ch.pct > 0) : []
    const totalPct = activeChannels.reduce((s, [_, ch]) => s + ch.pct, 0)

    return (
      <div style={st.page}>
        <SetupShell step={3} total={4}>
          <h2 style={st.title}>Your growth channels</h2>
          <p style={st.subtitle}>
            You need <strong>{visitsNeeded.toLocaleString()} visits</strong> this month.
            Here's how different channels contribute. Adjust the mix.
          </p>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {channels && Object.entries(channels).map(([key, ch]) => {
              if (key === 'listings' && ch.pct === 0 && tier?.id === 'enterprise') return null
              const visits = Math.ceil(visitsNeeded * (ch.pct / 100))
              const isOutpulse = key === 'coldEmail' || key === 'linkedin'
              return (
                <div key={key} style={{
                  padding: 16, borderRadius: 14,
                  background: C.card,
                  border: `1px solid ${isOutpulse ? C.green + '30' : C.border}`,
                  position: 'relative',
                }}>
                  {isOutpulse && (
                    <div style={{
                      position: 'absolute', top: 8, right: 12,
                      fontSize: 10, fontWeight: 600, color: C.green,
                      background: C.greenPale, padding: '2px 8px', borderRadius: 6,
                    }}>
                      OUTPULSE
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{ch.label}</div>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{ch.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="range" min="0" max="80" value={ch.pct}
                      onChange={e => {
                        const newPct = Number(e.target.value)
                        setChannels(prev => ({ ...prev, [key]: { ...ch, pct: newPct } }))
                      }}
                      style={{ flex: 1, accentColor: C.green }}
                    />
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.green, minWidth: 50, textAlign: 'right' }}>
                      {ch.pct}%
                    </div>
                    <div style={{ fontSize: 13, color: C.text, fontWeight: 600, minWidth: 60, textAlign: 'right' }}>
                      {visits.toLocaleString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {totalPct !== 100 && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: '#FFF4EC', border: `1px solid ${C.warn}30` }}>
              <div style={{ fontSize: 13, color: C.warn, fontWeight: 600 }}>
                Channel mix: {totalPct}% (should be 100%)
              </div>
            </div>
          )}

          {/* Cold email detail */}
          {channels?.coldEmail?.pct > 0 && (
            <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: C.greenPale, border: `1px solid ${C.green}15` }}>
              <div style={st.sectionLabel}>Cold outreach detail</div>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7, marginTop: 8 }}>
                {emailVisits.toLocaleString()} visits from cold email →{' '}
                ~{emailsForVisits.toLocaleString()} emails needed →{' '}
                ~{prospectsNeeded.toLocaleString()} unique prospects<br />
                <span style={{ color: C.muted }}>
                  At {COLD_EMAIL_DEFAULTS.emailToClick}% click rate, {COLD_EMAIL_DEFAULTS.avgEmailsPerProspect} emails per sequence
                </span>
              </div>
              <div style={{ fontSize: 13, color: C.green, fontWeight: 600, marginTop: 8 }}>
                ≈ {Math.ceil(emailsForVisits / timeframeDays).toLocaleString()} emails/day · {Math.ceil(prospectsNeeded / timeframeDays).toLocaleString()} new prospects/day
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <Btn onClick={() => setSetupStep(2)}>← Back</Btn>
            <Btn onClick={() => setScreen('plan')} primary style={{ flex: 1 }}>See your Pulse plan</Btn>
          </div>
        </SetupShell>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // PLAN (summary)
  // ═══════════════════════════════════════════════════════════
  if (screen === 'plan') {
    const activeChannels = channels ? Object.entries(channels).filter(([_, ch]) => ch.pct > 0) : []
    const outpulseChannels = activeChannels.filter(([k]) => k === 'coldEmail' || k === 'linkedin')
    const outpulseVisits = outpulseChannels.reduce((s, [_, ch]) => s + Math.ceil(visitsNeeded * (ch.pct / 100)), 0)
    const outpulsePct = channels ? (channels.coldEmail?.pct || 0) + (channels.linkedin?.pct || 0) : 0

    return (
      <div style={st.page}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px' }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} />
            ))}
            <div style={{ width: 20, height: 8, borderRadius: 4, background: C.green }} />
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700, color: C.text, textAlign: 'center', margin: '0 0 4px' }}>
            Here's your Pulse plan
          </h2>
          <p style={{ fontSize: 14, color: C.muted, textAlign: 'center', margin: '0 0 28px' }}>
            {businessName ? `${businessName} · ` : ''}{tier?.label} distribution · 30 day plan
          </p>

          {/* THE FUNNEL — visits first */}
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            border: `1px solid ${C.green}20`,
          }}>
            {/* Goal */}
            <div style={{
              padding: '20px 24px',
              background: `linear-gradient(135deg, ${C.greenPale}, #E8F5EC)`,
              borderBottom: `1px solid ${C.green}15`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Your goal</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.green }}>
                    {customersNeeded} paying customers
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>
                    ${(customersNeeded * Number(dealValue)).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>monthly revenue</div>
                </div>
              </div>
            </div>

            {/* Funnel steps */}
            <div style={{ padding: '4px 0', background: C.card }}>
              <FunnelStep icon="💰" label="Paying customers" value={customersNeeded} isFirst />
              <FunnelStep icon="⚡" label="Activated users" value={activatedNeeded}
                rate={`${conv.activatedToPaying}% activated → paid`} />
              <FunnelStep icon="✍️" label="Signups" value={signupsNeeded}
                rate={`${conv.signupToActivated}% signup → activated`} />
              <FunnelStep icon="👁️" label="Website visits" value={visitsNeeded}
                rate={`${conv.visitToSignup}% visit → signup`} isLast />
            </div>
          </div>

          {/* Key number */}
          <div style={{
            marginTop: 16, padding: 24, borderRadius: 20,
            background: C.card,
            border: `1px solid ${C.green}20`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, color: C.muted }}>You need</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: C.green, lineHeight: 1.1, margin: '4px 0' }}>
              {Math.ceil(visitsNeeded / timeframeDays).toLocaleString()} visits / day
            </div>
            <div style={{ fontSize: 13, color: C.muted }}>
              {visitsNeeded.toLocaleString()} total over 30 days
            </div>
          </div>

          {/* Channel breakdown */}
          <div style={{ marginTop: 16, borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}` }}>
            <div style={{ padding: '16px 24px', background: C.greenPale, borderBottom: `1px solid ${C.green}10` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>How you'll get there</div>
              <div style={{ fontSize: 12, color: C.muted }}>
                Outpulse handles {outpulsePct}% of your visits ({outpulseVisits.toLocaleString()} visits)
              </div>
            </div>

            {activeChannels.map(([key, ch], i) => {
              const visits = Math.ceil(visitsNeeded * (ch.pct / 100))
              const isOutpulse = key === 'coldEmail' || key === 'linkedin'
              const dailyVisits = Math.ceil(visits / timeframeDays)
              return (
                <div key={key} style={{
                  padding: '14px 24px',
                  borderBottom: i < activeChannels.length - 1 ? `1px solid ${C.border}` : 'none',
                  background: C.card,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{ch.label}</div>
                      {isOutpulse && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: C.green, padding: '1px 6px', borderRadius: 4 }}>
                          AUTO
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: C.muted }}>{ch.pct}% · ~{dailyVisits}/day</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
                    {visits.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cold email detail */}
          {emailsForVisits > 0 && (
            <div style={{
              marginTop: 16, padding: 20, borderRadius: 16,
              background: C.greenPale, border: `1px solid ${C.green}15`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 8 }}>
                Cold outreach breakdown
              </div>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
                {emailVisits.toLocaleString()} visits needed from email<br />
                ÷ {COLD_EMAIL_DEFAULTS.emailToClick}% click rate = ~{emailsForVisits.toLocaleString()} emails<br />
                ÷ {COLD_EMAIL_DEFAULTS.avgEmailsPerProspect} emails/sequence = ~{prospectsNeeded.toLocaleString()} prospects<br />
              </div>
              <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.7)' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.green }}>
                  {Math.ceil(emailsForVisits / timeframeDays)} emails/day
                </span>
                <span style={{ fontSize: 12, color: C.muted }}> · {Math.ceil(prospectsNeeded / timeframeDays)} new prospects/day</span>
              </div>
            </div>
          )}

          {/* Thiel insight */}
          {tier && (
            <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: '#FFFBF0', border: '1px solid #F0E6CC' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: 1 }}>
                {tier.icon} {tier.label} · ZERO TO ONE
              </div>
              <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6, margin: '6px 0 0' }}>
                {tier.insight}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            <Btn onClick={() => { setSetupStep(3); setScreen('setup') }}>← Edit</Btn>
            <Btn onClick={() => setScreen('dashboard')} primary style={{ flex: 1 }}>See dashboard widget</Btn>
          </div>
          <Btn onClick={() => setScreen('email')} style={{ marginTop: 8, width: '100%' }}>Preview daily email</Btn>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD WIDGET
  // ═══════════════════════════════════════════════════════════
  if (screen === 'dashboard') {
    const dailyTarget = Math.ceil(visitsNeeded / timeframeDays)
    const daysLeft = timeframeDays - demoProgress.daysElapsed
    const onTrack = demoProgress.paying >= (customersNeeded * demoProgress.daysElapsed / timeframeDays)

    return (
      <div style={st.page}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', marginBottom: 16 }}>
            Dashboard widget preview · Day {demoProgress.daysElapsed} of {timeframeDays}
          </div>

          {/* Main widget */}
          <div style={{
            borderRadius: 24, overflow: 'hidden',
            background: `linear-gradient(160deg, #1B4332 0%, #2D6A4F 40%, #40916C 100%)`,
            padding: 28,
            boxShadow: `0 12px 48px ${C.green}30`,
            position: 'relative',
          }}>
            {/* Glow effect */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 160, height: 160, borderRadius: '50%',
              background: `radial-gradient(circle, ${C.greenGlow}30 0%, transparent 70%)`,
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>PULSE</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                    {demoProgress.paying} / {customersNeeded}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>paying customers</div>
                </div>
                <div style={{
                  padding: '6px 14px', borderRadius: 12,
                  background: onTrack ? 'rgba(64,192,123,0.25)' : 'rgba(224,123,76,0.25)',
                  color: onTrack ? '#7DFFB3' : '#FFB088',
                  fontSize: 13, fontWeight: 700,
                }}>
                  {onTrack ? '↑ On track' : '↓ Behind'}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.15)', marginBottom: 8 }}>
                <div style={{
                  height: 8, borderRadius: 4,
                  background: 'linear-gradient(90deg, #7DFFB3, #40C07B)',
                  width: `${animPct}%`,
                  transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 16px rgba(125,255,179,0.4)',
                }} />
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
                {animPct}% · {daysLeft} days left
              </div>

              {/* Mini funnel */}
              <div style={{
                marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8,
              }}>
                {[
                  { label: 'Visits', current: demoProgress.visits, target: visitsNeeded },
                  { label: 'Signups', current: demoProgress.signups, target: signupsNeeded },
                  { label: 'Activated', current: demoProgress.activated, target: activatedNeeded },
                  { label: 'Paying', current: demoProgress.paying, target: customersNeeded },
                ].map(m => (
                  <div key={m.label} style={{
                    padding: '10px 8px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.08)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{m.current}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>/ {m.target}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Daily target */}
              <div style={{
                marginTop: 16, padding: '12px 16px', borderRadius: 14,
                background: 'rgba(255,255,255,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Today's target</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{dailyTarget} visits</div>
                </div>
                <div style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.5)',
                }}>
                  Outpulse sending · LinkedIn active
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            <Btn onClick={() => setScreen('plan')}>← Plan</Btn>
            <Btn onClick={() => setScreen('email')} style={{ flex: 1 }}>Daily email preview</Btn>
            <Btn onClick={() => setScreen('home')}>Home</Btn>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // DAILY EMAIL PREVIEW
  // ═══════════════════════════════════════════════════════════
  if (screen === 'email') {
    const dailyVisitTarget = Math.ceil(visitsNeeded / timeframeDays)
    const d = demoProgress

    return (
      <div style={st.page}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', marginBottom: 16 }}>
            Daily morning email preview
          </div>

          <div style={{
            borderRadius: 20, overflow: 'hidden',
            border: `1px solid ${C.border}`,
            background: C.card,
          }}>
            {/* Email header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, background: '#FAFAF7' }}>
              <div style={{ fontSize: 11, color: C.muted }}>From: Outpulse Pulse &lt;pulse@outpulse.ai&gt;</div>
              <div style={{ fontSize: 11, color: C.muted }}>To: {businessName ? businessName : 'you'}@email.com</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginTop: 6 }}>
                Day {d.daysElapsed}: {d.paying} paying customers ({progressPct}% to goal)
              </div>
            </div>

            <div style={{ padding: '24px 24px' }}>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: '0 0 20px' }}>
                Good morning! Here's your Pulse update.
              </p>

              {/* Funnel status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {[
                  { label: 'Visits', val: d.visits, target: visitsNeeded, emoji: '👁️' },
                  { label: 'Signups', val: d.signups, target: signupsNeeded, emoji: '✍️' },
                  { label: 'Activated', val: d.activated, target: activatedNeeded, emoji: '⚡' },
                  { label: 'Paying', val: d.paying, target: customersNeeded, emoji: '💰' },
                ].map(m => {
                  const pct = m.target > 0 ? Math.round((m.val / m.target) * 100) : 0
                  return (
                    <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 16, width: 24 }}>{m.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 13, color: C.text }}>{m.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{m.val} / {m.target}</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: C.border }}>
                          <div style={{ height: 4, borderRadius: 2, background: C.green, width: `${Math.min(pct, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Channel activity */}
              <div style={{
                padding: 16, borderRadius: 12, background: C.greenPale,
                border: `1px solid ${C.green}15`, marginBottom: 20,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 8 }}>Outpulse activity yesterday</div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
                  📧 127 cold emails sent → 9 link clicks<br />
                  💬 3 replies received (2 positive)<br />
                  🔗 LinkedIn: 45 profile views driven
                </div>
              </div>

              {/* Recommendation */}
              <div style={{
                padding: 16, borderRadius: 12, background: '#FFFBF0',
                border: '1px solid #F0E6CC',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 6 }}>
                  Today's focus
                </div>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: 0 }}>
                  Your visit→signup rate is strong at {conv.visitToSignup}%. Focus on driving more traffic today.
                  Outpulse is sending campaigns to {Math.ceil(prospectsNeeded / timeframeDays)} new prospects automatically.
                  Consider sharing a post on LinkedIn to boost organic visits.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            <Btn onClick={() => setScreen('dashboard')}>← Dashboard</Btn>
            <Btn onClick={() => setScreen('home')} style={{ flex: 1 }}>Home</Btn>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════
function SetupShell({ step, total, children }) {
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8, height: 8, borderRadius: 4,
            background: i <= step ? C.green : C.border,
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
      {children}
    </div>
  )
}

function ConversionRow({ label, sublabel, value, onChange, example }) {
  return (
    <div style={{
      padding: 16, borderRadius: 14,
      background: C.card,
      border: `1px solid ${C.border}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="number"
            value={value}
            onChange={e => onChange(Math.max(0, Math.min(100, Number(e.target.value))))}
            style={{
              width: 56, padding: '4px 8px', fontSize: 16, fontWeight: 700,
              color: C.green, textAlign: 'right',
              border: `1px solid ${C.border}`, borderRadius: 8,
              outline: 'none', background: C.greenPale,
            }}
          />
          <span style={{ fontSize: 14, color: C.muted }}>%</span>
        </div>
      </div>
      <div style={{ fontSize: 12, color: C.muted }}>{sublabel}</div>
      <div style={{ fontSize: 11, color: C.accent, marginTop: 4 }}>{example}</div>
    </div>
  )
}

function FunnelPreviewRow({ emoji, label, value, rate, highlight }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: highlight ? '8px 12px' : '4px 12px',
      borderRadius: 10,
      background: highlight ? 'rgba(255,255,255,0.7)' : 'transparent',
    }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 13, color: C.text }}>{label}</span>
        {rate && <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>{rate}</span>}
      </div>
      <span style={{ fontSize: 15, fontWeight: 700, color: highlight ? C.green : C.text }}>
        {value.toLocaleString()}
      </span>
    </div>
  )
}

function FunnelStep({ icon, label, value, rate, isFirst, isLast }) {
  return (
    <div style={{ padding: '14px 24px', position: 'relative' }}>
      {!isFirst && (
        <div style={{
          position: 'absolute', top: 0, left: 40,
          width: 2, height: 14, background: C.border,
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{icon}</span>
          <div>
            <div style={{
              fontSize: 14, color: C.text,
              fontWeight: (isFirst || isLast) ? 700 : 400,
            }}>{label}</div>
            {rate && <div style={{ fontSize: 11, color: C.muted }}>{rate}</div>}
          </div>
        </div>
        <div style={{
          fontSize: (isFirst || isLast) ? 22 : 18,
          fontWeight: 700,
          color: (isFirst || isLast) ? C.green : C.text,
        }}>
          {value.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

function Btn({ children, onClick, primary, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
      border: primary ? 'none' : `1px solid ${C.border}`,
      background: primary ? (disabled ? '#ccc' : C.green) : C.card,
      color: primary ? '#fff' : C.text,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      ...style,
    }}>
      {children}
    </button>
  )
}

// ─── SHARED STYLES ───
const st = {
  page: {
    minHeight: '100vh', background: C.bg,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  title: { fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 6px' },
  subtitle: { fontSize: 14, color: C.muted, margin: '0 0 16px', lineHeight: 1.5 },
  label: { fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 },
  input: {
    width: '100%', padding: '12px 16px', fontSize: 16,
    border: `1px solid ${C.border}`, borderRadius: 12,
    outline: 'none', background: '#FAFAF7',
    boxSizing: 'border-box',
  },
  toggleBtn: {
    flex: 1, padding: '10px 16px', borderRadius: 10,
    border: `1px solid ${C.border}`, background: C.card,
    fontSize: 13, fontWeight: 500, color: C.muted,
    cursor: 'pointer', transition: 'all 0.2s ease',
  },
  toggleActive: {
    background: C.greenPale, borderColor: `${C.green}40`,
    color: C.green, fontWeight: 700,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, color: C.muted,
    textTransform: 'uppercase', letterSpacing: 1,
  },
}
