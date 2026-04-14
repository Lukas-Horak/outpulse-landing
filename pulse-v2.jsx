import { useState, useEffect, useCallback } from "react"

// ═══════════════════════════════════════════════════════════════
// PULSE v2 — Interactive Prototype
// Thiel-inspired pricing tiers × sales motion × reverse funnel
// ═══════════════════════════════════════════════════════════════

// ─── THIEL PRICING TIERS ───
// From Zero to One: distribution method is dictated by price point
const PRICING_TIERS = [
  {
    id: 'micro',
    range: '$1 – $100',
    label: 'Viral / Self-serve',
    icon: '🚀',
    color: '#52B788',
    description: 'Product sells itself. Zero friction signup. Outpulse drives awareness at scale.',
    insight: 'At this price, every dollar spent on sales must be near-zero. Your product needs to convert visitors on its own — Outpulse fills the top of your funnel with volume.',
    salesMotion: 'self_serve',
    defaults: {
      emailToClick: 6,       // % who click the link
      clickToSignup: 15,     // % who sign up after clicking
      signupToPaid: 8,       // % who convert to paid (low — viral/free tier)
      timeframeDays: 30,
    },
    funnelSteps: ['emails', 'clicks', 'signups', 'customers'],
  },
  {
    id: 'low',
    range: '$100 – $1K',
    label: 'Self-serve + Nudge',
    icon: '✉️',
    color: '#2D6A4F',
    description: 'Customer clicks, tries, pays. Sometimes one reply seals it. No calls needed.',
    insight: 'The sweet spot for AI outreach. Personalized emails drive trials, and the product closes the deal. This is where Outpulse shines brightest.',
    salesMotion: 'self_serve_nudge',
    defaults: {
      emailToClick: 8,
      clickToTrial: 12,
      trialToPaid: 25,
      timeframeDays: 30,
    },
    funnelSteps: ['emails', 'clicks', 'trials', 'customers'],
  },
  {
    id: 'mid',
    range: '$1K – $10K',
    label: 'Inside Sales',
    icon: '📞',
    color: '#1B4332',
    description: 'Customer needs a demo or call before buying. Outpulse gets the reply, you close.',
    insight: 'At this price, customers need to talk to someone. Outpulse is your SDR — it books the meeting, you run the demo and close.',
    salesMotion: 'inside_sales',
    defaults: {
      replyRate: 4.5,
      replyToCall: 40,
      callToClose: 25,
      timeframeDays: 30,
    },
    funnelSteps: ['emails', 'replies', 'calls', 'customers'],
  },
  {
    id: 'high',
    range: '$10K – $100K',
    label: 'Field Sales',
    icon: '🤝',
    color: '#14291E',
    description: 'Longer sales cycle, multiple stakeholders. Outpulse opens doors.',
    insight: 'Complex deals need warm intros. Outpulse gets you in front of the right person — the relationship and proposal work is yours.',
    salesMotion: 'field_sales',
    defaults: {
      replyRate: 3.5,
      replyToMeeting: 35,
      meetingToProposal: 50,
      proposalToClose: 30,
      timeframeDays: 60,
    },
    funnelSteps: ['emails', 'replies', 'meetings', 'proposals', 'customers'],
  },
  {
    id: 'enterprise',
    range: '$100K+',
    label: 'Complex Sales',
    icon: '🏢',
    color: '#0B1F15',
    description: 'Enterprise deals measured in months. Outpulse warms up relationships.',
    insight: 'At enterprise scale, one deal changes everything. Outpulse builds your pipeline of warm relationships — the rest is trust, timing, and negotiation.',
    salesMotion: 'complex',
    defaults: {
      replyRate: 2.5,
      replyToMeeting: 30,
      meetingToClose: 15,
      timeframeDays: 90,
    },
    funnelSteps: ['emails', 'replies', 'meetings', 'customers'],
  },
]

// ─── REVERSE FUNNEL CALCULATOR ───
function calculateFunnel(tier, goalValue, dealValue) {
  const d = tier.defaults
  const customersNeeded = Math.ceil(goalValue / dealValue)
  const timeframe = d.timeframeDays

  let steps = []
  let currentNeed = customersNeeded

  if (tier.id === 'micro') {
    const signups = Math.ceil(currentNeed / (d.signupToPaid / 100))
    const clicks = Math.ceil(signups / (d.clickToSignup / 100))
    const emails = Math.ceil(clicks / (d.emailToClick / 100))
    steps = [
      { key: 'customers', label: 'Paying customers', value: customersNeeded, icon: '💰' },
      { key: 'signups', label: 'Signups needed', value: signups, icon: '👤', rate: `${d.signupToPaid}% convert to paid` },
      { key: 'clicks', label: 'Link clicks needed', value: clicks, icon: '🔗', rate: `${d.clickToSignup}% click → signup` },
      { key: 'emails', label: 'Emails to send', value: emails, icon: '✉️', rate: `${d.emailToClick}% email → click` },
    ]
  } else if (tier.id === 'low') {
    const trials = Math.ceil(currentNeed / (d.trialToPaid / 100))
    const clicks = Math.ceil(trials / (d.clickToTrial / 100))
    const emails = Math.ceil(clicks / (d.emailToClick / 100))
    steps = [
      { key: 'customers', label: 'Paying customers', value: customersNeeded, icon: '💰' },
      { key: 'trials', label: 'Trials / signups', value: trials, icon: '🧪', rate: `${d.trialToPaid}% trial → paid` },
      { key: 'clicks', label: 'Link clicks', value: clicks, icon: '🔗', rate: `${d.clickToTrial}% click → trial` },
      { key: 'emails', label: 'Emails to send', value: emails, icon: '✉️', rate: `${d.emailToClick}% email → click` },
    ]
  } else if (tier.id === 'mid') {
    const calls = Math.ceil(currentNeed / (d.callToClose / 100))
    const replies = Math.ceil(calls / (d.replyToCall / 100))
    const emails = Math.ceil(replies / (d.replyRate / 100))
    steps = [
      { key: 'customers', label: 'Closed deals', value: customersNeeded, icon: '💰' },
      { key: 'calls', label: 'Calls / demos', value: calls, icon: '📞', rate: `${d.callToClose}% call → close` },
      { key: 'replies', label: 'Replies needed', value: replies, icon: '💬', rate: `${d.replyToCall}% reply → call` },
      { key: 'emails', label: 'Emails to send', value: emails, icon: '✉️', rate: `${d.replyRate}% reply rate` },
    ]
  } else if (tier.id === 'high') {
    const proposals = Math.ceil(currentNeed / (d.proposalToClose / 100))
    const meetings = Math.ceil(proposals / (d.meetingToProposal / 100))
    const replies = Math.ceil(meetings / (d.replyToMeeting / 100))
    const emails = Math.ceil(replies / (d.replyRate / 100))
    steps = [
      { key: 'customers', label: 'Closed deals', value: customersNeeded, icon: '💰' },
      { key: 'proposals', label: 'Proposals sent', value: proposals, icon: '📋', rate: `${d.proposalToClose}% proposal → close` },
      { key: 'meetings', label: 'Meetings booked', value: meetings, icon: '🤝', rate: `${d.meetingToProposal}% meeting → proposal` },
      { key: 'replies', label: 'Replies needed', value: replies, icon: '💬', rate: `${d.replyToMeeting}% reply → meeting` },
      { key: 'emails', label: 'Emails to send', value: emails, icon: '✉️', rate: `${d.replyRate}% reply rate` },
    ]
  } else {
    // enterprise
    const meetings = Math.ceil(currentNeed / (d.meetingToClose / 100))
    const replies = Math.ceil(meetings / (d.replyToMeeting / 100))
    const emails = Math.ceil(replies / (d.replyRate / 100))
    steps = [
      { key: 'customers', label: 'Closed deals', value: customersNeeded, icon: '💰' },
      { key: 'meetings', label: 'Meetings', value: meetings, icon: '🤝', rate: `${d.meetingToClose}% meeting → close` },
      { key: 'replies', label: 'Replies', value: replies, icon: '💬', rate: `${d.replyToMeeting}% reply → meeting` },
      { key: 'emails', label: 'Emails to send', value: emails, icon: '✉️', rate: `${d.replyRate}% reply rate` },
    ]
  }

  const totalEmails = steps.find(s => s.key === 'emails')?.value || 0
  const dailyEmails = Math.ceil(totalEmails / timeframe)
  const dailyProspects = Math.ceil(dailyEmails * 1.15)

  return { steps, totalEmails, dailyEmails, dailyProspects, timeframe, customersNeeded }
}

// ─── COLORS ───
const C = {
  bg: '#FFFDF8',
  card: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#8A8A7A',
  green: '#2D6A4F',
  greenLight: '#52B788',
  greenPale: '#F0FAF4',
  border: '#F0EDE6',
  accent: '#D4A843',
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function PulseV2() {
  const [screen, setScreen] = useState('home') // home | setup | plan | dashboard | email
  const [setupStep, setSetupStep] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  // Setup state
  const [dealValue, setDealValue] = useState('')
  const [selectedTier, setSelectedTier] = useState(null)
  const [goalType, setGoalType] = useState('revenue') // revenue | clients
  const [goalValue, setGoalValue] = useState('')

  // Derived
  const detectedTier = dealValue ? PRICING_TIERS.find(t => {
    const v = Number(dealValue)
    if (t.id === 'micro') return v >= 1 && v < 100
    if (t.id === 'low') return v >= 100 && v < 1000
    if (t.id === 'mid') return v >= 1000 && v < 10000
    if (t.id === 'high') return v >= 10000 && v < 100000
    if (t.id === 'enterprise') return v >= 100000
    return false
  }) : null

  const funnel = (selectedTier || detectedTier) && goalValue && dealValue
    ? calculateFunnel(
        selectedTier || detectedTier,
        goalType === 'revenue' ? Number(goalValue) : Number(goalValue) * Number(dealValue),
        Number(dealValue)
      )
    : null

  const tier = selectedTier || detectedTier

  // Demo progress for dashboard
  const demoProgress = {
    revenue: 2980,
    customers: 20,
    emailsSent: 1847,
    clicks: 156,
    trials: 19,
    replies: 83,
    daysElapsed: 12,
  }

  const goalNum = goalType === 'revenue' ? Number(goalValue) : Number(goalValue) * Number(dealValue)
  const progressPct = goalNum > 0 ? Math.min(Math.round((demoProgress.revenue / goalNum) * 100), 100) : 0
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
    setSelectedTier(null)
    setGoalType('revenue')
    setGoalValue('')
    setScreen('setup')
  }

  // ─── HOME ───
  if (screen === 'home') {
    return (
      <div style={st.page}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>◎</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>Pulse</h1>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: '0 0 32px' }}>
            Set your growth target. Outpulse reverse-engineers what it takes to get there — and then does it for you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
            <Btn onClick={() => { reset() }} primary>① Setup flow</Btn>
            <Btn onClick={() => setScreen('dashboard')}>② Dashboard widget</Btn>
            <Btn onClick={() => setScreen('email')}>③ Daily email</Btn>
          </div>

          <div style={{ marginTop: 40, padding: 20, borderRadius: 16, background: C.greenPale, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.green, marginBottom: 8 }}>PETER THIEL — ZERO TO ONE</div>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: 0 }}>
              "The engineering question is whether you can create breakthrough technology. The distribution question is whether you have a way to not just create but deliver your product. Most businesses get this wrong — poor sales rather than bad product is the most common cause of failure."
            </p>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 8, marginBottom: 0 }}>
              Pulse uses Thiel's pricing-distribution framework to calculate your exact funnel based on your price point.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ─── SETUP STEP 0: Deal Value ───
  if (screen === 'setup' && setupStep === 0) {
    return (
      <div style={st.page}>
        <SetupShell step={0} total={3}>
          <h2 style={st.title}>How much does your product or service cost?</h2>
          <p style={st.subtitle}>This determines your ideal distribution strategy.</p>

          <div style={{ marginTop: 8 }}>
            <label style={st.label}>Average deal / sale value ($)</label>
            <input
              style={st.input}
              type="number"
              placeholder="e.g. 149"
              value={dealValue}
              onChange={e => setDealValue(e.target.value)}
              autoFocus
            />
          </div>

          {/* Thiel tier detection */}
          {detectedTier && (
            <div style={{
              marginTop: 20, padding: 20, borderRadius: 16,
              background: C.greenPale,
              border: `1px solid ${detectedTier.color}22`,
              animation: 'fadeIn 0.4s ease',
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
                  💡 {detectedTier.insight}
                </p>
              </div>
            </div>
          )}

          {/* All tiers preview */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Distribution tiers (Thiel framework)
            </div>
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
            Continue →
          </Btn>
        </SetupShell>
      </div>
    )
  }

  // ─── SETUP STEP 1: Goal ───
  if (screen === 'setup' && setupStep === 1) {
    return (
      <div style={st.page}>
        <SetupShell step={1} total={3}>
          <h2 style={st.title}>What's your monthly target?</h2>
          <p style={st.subtitle}>
            {tier?.label} model — {tier?.range} per deal
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              style={{ ...st.toggleBtn, ...(goalType === 'revenue' ? st.toggleActive : {}) }}
              onClick={() => setGoalType('revenue')}
            >
              💰 Revenue
            </button>
            <button
              style={{ ...st.toggleBtn, ...(goalType === 'clients' ? st.toggleActive : {}) }}
              onClick={() => setGoalType('clients')}
            >
              👥 Clients
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={st.label}>
              {goalType === 'revenue' ? 'Monthly revenue target ($)' : 'New clients per month'}
            </label>
            <input
              style={st.input}
              type="number"
              placeholder={goalType === 'revenue' ? '10000' : '20'}
              value={goalValue}
              onChange={e => setGoalValue(e.target.value)}
              autoFocus
            />
          </div>

          {goalValue && dealValue && (
            <div style={{ padding: '12px 16px', borderRadius: 12, background: '#FAFAF6', marginTop: 12 }}>
              <span style={{ fontSize: 13, color: C.muted }}>
                {goalType === 'revenue'
                  ? `= ${Math.ceil(Number(goalValue) / Number(dealValue))} customers at $${Number(dealValue).toLocaleString()} each`
                  : `= $${(Number(goalValue) * Number(dealValue)).toLocaleString()} in revenue`
                }
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Btn onClick={() => setSetupStep(0)}>← Back</Btn>
            <Btn onClick={() => setSetupStep(2)} primary disabled={!goalValue} style={{ flex: 1 }}>
              Show my plan →
            </Btn>
          </div>
        </SetupShell>
      </div>
    )
  }

  // ─── SETUP STEP 2: Plan Preview ───
  if (screen === 'setup' && setupStep === 2) {
    return (
      <div style={st.page}>
        <SetupShell step={2} total={3}>
          <h2 style={st.title}>Here's your Pulse plan</h2>
          <p style={st.subtitle}>Based on {tier?.label} distribution model</p>

          {funnel && (
            <>
              {/* Funnel steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 16 }}>
                {funnel.steps.map((step, i) => (
                  <div key={step.key} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', borderRadius: 14,
                    background: i === 0 ? C.greenPale : 'transparent',
                    borderLeft: i === 0 ? `3px solid ${C.green}` : '3px solid transparent',
                  }}>
                    <span style={{ fontSize: 20 }}>{step.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: i === 0 ? C.green : C.muted }}>{step.label}</div>
                      {step.rate && (
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{step.rate}</div>
                      )}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: i === 0 ? C.green : C.text }}>
                      {step.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Connector line between funnel and daily box */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                <div style={{ width: 2, height: 16, background: C.border }} />
              </div>

              {/* Daily breakdown */}
              <div style={{
                padding: 20, borderRadius: 16,
                background: C.greenPale,
                border: `1px solid ${C.green}20`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Outpulse will handle</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.green }}>
                  {funnel.dailyEmails.toLocaleString()} emails / day
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                  ~{funnel.dailyProspects.toLocaleString()} new prospects daily · {funnel.timeframe} day plan
                </div>
              </div>

              {/* Insight */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                marginTop: 16, padding: '14px 16px', borderRadius: 12,
                background: '#FAFAF6', border: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 16 }}>💡</span>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                  <strong style={{ color: C.green }}>{tier?.label}:</strong> {tier?.insight}
                </div>
              </div>

              {/* Conversion disclaimer */}
              <div style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                Conversion rates are industry averages. Your actual rates will appear here once Pulse has enough data. You can customize rates anytime in settings.
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Btn onClick={() => setSetupStep(1)}>← Back</Btn>
            <Btn onClick={() => { setScreen('dashboard'); setCollapsed(false) }} primary style={{ flex: 1 }}>
              Activate Pulse ◎
            </Btn>
          </div>
        </SetupShell>
      </div>
    )
  }

  // ─── DAILY EMAIL ───
  if (screen === 'email') {
    const goalDisplay = goalValue ? `$${Number(goalValue).toLocaleString()}` : '$10,000'
    return (
      <div style={st.page}>
        <NavBar screen={screen} setScreen={setScreen} reset={reset} />
        <div style={{ maxWidth: 500, margin: '0 auto', padding: '0 20px 40px' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', background: C.card, border: `1px solid ${C.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #F0FAF4 0%, #E8F5EE 100%)', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted }}>From: Outpulse Pulse · 8:00 AM your time</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginTop: 4 }}>Your daily Pulse — Day 12 of 30</div>
            </div>

            <div style={{ padding: 24 }}>
              <p style={{ margin: '0 0 16px', fontSize: 14, color: C.text }}>Good morning, Lukas.</p>

              {/* Progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 14, background: '#FAFAF6', marginBottom: 20 }}>
                <ProgressRing pct={30} size={64} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>$2,980 of {goalDisplay}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>20 customers · 18 days left</div>
                </div>
              </div>

              {/* Yesterday */}
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>Yesterday</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
                {[
                  { v: '42', l: 'Sent', c: C.text },
                  { v: '6', l: 'Clicks', c: C.greenLight },
                  { v: '2', l: 'Replies', c: C.green },
                  { v: '1', l: 'Trial', c: C.accent },
                ].map(m => (
                  <div key={m.l} style={{ padding: '10px 8px', borderRadius: 10, background: '#FAFAF6', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.c }}>{m.v}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{m.l}</div>
                  </div>
                ))}
              </div>

              {/* AI insight */}
              <div style={{
                marginTop: 16, padding: 14, borderRadius: 12,
                background: C.greenPale, border: `1px solid ${C.green}15`,
              }}>
                <p style={{ margin: 0, fontSize: 13, color: C.green, lineHeight: 1.5 }}>
                  💡 <strong>On track.</strong> At your current reply rate of 5.2%, you're ahead of the 4.5% benchmark. Projected to hit {goalDisplay} in 24 days — 6 days early.
                </p>
              </div>

              {/* CTA */}
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Btn onClick={() => setScreen('dashboard')} primary small>Open Dashboard →</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── DASHBOARD ───
  return (
    <div style={st.page}>
      <NavBar screen={screen} setScreen={setScreen} reset={reset} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 40px' }}>

        {/* PULSE WIDGET */}
        <div style={{
          position: 'relative', borderRadius: 24, overflow: 'hidden',
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
          border: `1px solid ${C.border}`, padding: collapsed ? '20px 24px' : '24px 24px 20px',
          transition: 'padding 0.3s ease',
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', top: -80, right: -60, width: 320, height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(82,183,136,0.2) 0%, rgba(82,183,136,0.05) 50%, transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: -40, width: 200, height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(82,183,136,0.1) 0%, transparent 60%)',
            filter: 'blur(30px)', pointerEvents: 'none',
          }} />

          {/* Header */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: C.green }}>◎</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: C.green }}>Pulse</span>
                {tier && <span style={{ fontSize: 10, color: C.muted, background: '#F0EDE6', padding: '2px 8px', borderRadius: 6 }}>{tier.icon} {tier.label}</span>}
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
                $2,980 <span style={{ fontSize: 16, fontWeight: 400, color: C.muted }}>of ${(goalNum || 10000).toLocaleString()}</span>
              </div>
            </div>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: C.muted, padding: 8 }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? '▾' : '▴'}
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ position: 'relative', zIndex: 1, marginTop: 14 }}>
            <div style={{ height: 8, borderRadius: 4, background: C.border, overflow: 'hidden' }}>
              <div style={{
                height: 8, borderRadius: 4,
                background: `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
                width: `${Math.max(animPct, 2)}%`,
                transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 12, color: C.muted }}>Day 12 of {funnel?.timeframe || 30}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>{animPct}%</span>
            </div>
          </div>

          {/* Expanded */}
          {!collapsed && (
            <div style={{ position: 'relative', zIndex: 1, marginTop: 20 }}>
              {/* Metric pills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(funnel?.steps || []).slice().reverse().map((step, i) => {
                  // Demo current values
                  const currentMap = { emails: 1847, clicks: 156, trials: 19, customers: 20, replies: 83, calls: 8, meetings: 5, proposals: 3, signups: 22 }
                  const current = currentMap[step.key] || 0
                  const pct = step.value > 0 ? Math.min(Math.round((current / step.value) * 100), 100) : 0
                  const expectedPct = Math.round((12 / (funnel?.timeframe || 30)) * 100)
                  const onTrack = pct >= expectedPct

                  return (
                    <div key={step.key} style={{
                      padding: '12px 14px', borderRadius: 14,
                      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
                      border: `1px solid ${C.border}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: C.muted }}>{step.icon} {step.label.split(' ')[0]}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: onTrack ? C.green : C.accent }}>
                          {onTrack ? '✓ on track' : '↑ boost'}
                        </span>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
                        {current.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>/ {step.value.toLocaleString()}</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: C.border, marginTop: 8 }}>
                        <div style={{ height: 4, borderRadius: 2, width: `${pct}%`, background: onTrack ? C.green : C.accent, transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Insight */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                marginTop: 14, padding: '12px 14px', borderRadius: 12,
                background: 'rgba(240,250,244,0.7)', border: `1px solid rgba(82,183,136,0.15)`,
              }}>
                <span>💡</span>
                <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                  Reply rate is <strong>5.2%</strong> (above 4.5% benchmark). At this pace, you'll hit your goal <strong>6 days early</strong>. Outpulse is maintaining {funnel?.dailyEmails || 42} sends/day.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Fake dashboard cards */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Card>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Outreach Activity</div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>1,847</div>
                <div style={{ fontSize: 11, color: C.muted }}>Sent</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.greenLight }}>83</div>
                <div style={{ fontSize: 11, color: C.muted }}>Replies</div>
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Active Campaigns</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>3</div>
            <div style={{ fontSize: 11, color: C.muted }}>running</div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function NavBar({ screen, setScreen, reset }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
      {[
        { key: 'home', label: 'Home' },
        { key: 'setup', label: '① Setup' },
        { key: 'dashboard', label: '② Dashboard' },
        { key: 'email', label: '③ Email' },
      ].map(v => (
        <button
          key={v.key}
          onClick={() => { if (v.key === 'setup') reset(); else setScreen(v.key) }}
          style={{
            padding: '7px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 500,
            background: screen === v.key ? C.green : '#F0EDE6',
            color: screen === v.key ? '#fff' : C.text,
          }}
        >
          {v.label}
        </button>
      ))}
    </div>
  )
}

function SetupShell({ step, total, children }) {
  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 40px' }}>
      {/* Step dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{
            height: 8, borderRadius: 4,
            width: i === step ? 28 : 8,
            background: i <= step ? C.green : C.border,
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
      {children}
    </div>
  )
}

function Btn({ children, onClick, primary, disabled, small, style: extraStyle }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? '10px 20px' : '14px 24px',
        borderRadius: 100,
        border: primary ? 'none' : `1px solid ${C.border}`,
        background: primary ? C.green : 'transparent',
        color: primary ? '#fff' : C.text,
        fontSize: small ? 13 : 14,
        fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'opacity 0.2s',
        ...extraStyle,
      }}
    >
      {children}
    </button>
  )
}

function Card({ children }) {
  return (
    <div style={{ padding: 18, borderRadius: 16, background: C.card, border: `1px solid ${C.border}` }}>
      {children}
    </div>
  )
}

function ProgressRing({ pct, size = 64 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.green} strokeWidth="6"
          strokeDasharray={`${circ * (pct/100)} ${circ * (1-pct/100)}`}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: C.green }}>
        {pct}%
      </div>
    </div>
  )
}

// ─── STYLE HELPERS ───
const st = {
  page: {
    minHeight: '100vh', background: C.bg, padding: '24px 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: C.text,
  },
  title: { fontSize: 24, fontWeight: 700, color: C.text, margin: 0, textAlign: 'center' },
  subtitle: { fontSize: 14, color: C.muted, margin: '8px 0 0', textAlign: 'center', lineHeight: 1.5 },
  label: { fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    width: '100%', padding: '14px 16px', borderRadius: 12,
    border: `1px solid ${C.border}`, fontSize: 18, color: C.text,
    background: C.card, outline: 'none', boxSizing: 'border-box', marginTop: 6,
  },
  toggleBtn: {
    flex: 1, padding: '12px 16px', borderRadius: 12,
    border: `2px solid ${C.border}`, background: C.card,
    fontSize: 14, fontWeight: 500, cursor: 'pointer', color: C.text,
    transition: 'all 0.2s',
  },
  toggleActive: {
    borderColor: C.green, background: C.greenPale, color: C.green, fontWeight: 600,
  },
}
