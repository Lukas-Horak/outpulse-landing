import { useState, useEffect } from "react"

// ─── REVERSE FUNNEL ENGINE ───
// User inputs their goal + business type → we reverse-engineer every step
function calculateFunnel(config) {
  const {
    goalType, // 'revenue' | 'clients'
    goalValue, // e.g. 10000 (dollars) or 20 (clients)
    businessType, // 'product' | 'service' | 'signup'
    dealValue, // avg $ per deal/client
    // Smart defaults (user can override later)
    replyRate = 4.5,    // % of emails that get a reply
    meetingRate = 35,    // % of replies that book a meeting
    closeRate = 25,      // % of meetings that close
    timeframeDays = 30,  // target timeframe
  } = config

  // Step 1: How many clients/deals needed?
  let clientsNeeded
  if (goalType === 'revenue') {
    clientsNeeded = Math.ceil(goalValue / (dealValue || 149))
  } else {
    clientsNeeded = goalValue
  }

  // Step 2: Reverse the funnel
  const meetingsNeeded = Math.ceil(clientsNeeded / (closeRate / 100))
  const repliesNeeded = Math.ceil(meetingsNeeded / (meetingRate / 100))
  const emailsNeeded = Math.ceil(repliesNeeded / (replyRate / 100))
  const prospectsNeeded = Math.ceil(emailsNeeded * 1.15) // ~15% bounce/skip buffer

  // Step 3: Daily breakdown
  const dailyEmails = Math.ceil(emailsNeeded / timeframeDays)
  const dailyProspects = Math.ceil(prospectsNeeded / timeframeDays)

  return {
    clientsNeeded,
    meetingsNeeded,
    repliesNeeded,
    emailsNeeded,
    prospectsNeeded,
    dailyEmails,
    dailyProspects,
    timeframeDays,
    revenue: goalType === 'revenue' ? goalValue : clientsNeeded * (dealValue || 0),
  }
}

// ─── STYLES ───
const colors = {
  bg: '#FFFDF8',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#8A8A7A',
  green: '#2D6A4F',
  greenLight: '#52B788',
  greenGlow: '#74D4A0',
  accent: '#D4A843',
  border: '#F0EDE6',
  danger: '#C1553B',
}

// ─── MAIN COMPONENT ───
export default function PulseConcept() {
  const [view, setView] = useState('dashboard') // 'setup' | 'dashboard' | 'email'
  const [step, setStep] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  // Setup state
  const [businessType, setBusinessType] = useState(null)
  const [goalType, setGoalType] = useState(null)
  const [goalValue, setGoalValue] = useState('')
  const [dealValue, setDealValue] = useState('')

  // Demo data for dashboard view
  const demoConfig = {
    goalType: 'revenue',
    goalValue: 10000,
    businessType: 'product',
    dealValue: 149,
    replyRate: 4.5,
    meetingRate: 35,
    closeRate: 25,
    timeframeDays: 30,
  }
  const demoFunnel = calculateFunnel(demoConfig)
  const demoProgress = {
    prospects: 412,
    emailsSent: 287,
    replies: 14,
    meetings: 5,
    clients: 1,
    revenue: 149,
    daysElapsed: 8,
  }
  const progressPct = Math.round((demoProgress.revenue / demoConfig.goalValue) * 100)

  // Animated progress
  const [animPct, setAnimPct] = useState(0)
  useEffect(() => {
    if (view === 'dashboard') {
      const timer = setTimeout(() => setAnimPct(progressPct), 300)
      return () => clearTimeout(timer)
    }
  }, [view, progressPct])

  // ─── SETUP FLOW ───
  if (view === 'setup') {
    return (
      <div style={s.page}>
        <div style={s.setupContainer}>
          <div style={s.setupHeader}>
            <div style={s.logoRow}>
              <div style={s.logoIcon}>◎</div>
              <span style={s.logoText}>Pulse</span>
            </div>
            <p style={s.setupSubtitle}>Set your growth target. We'll reverse-engineer how to get there.</p>
          </div>

          {/* Step indicators */}
          <div style={s.stepDots}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                ...s.dot,
                background: i <= step ? colors.green : colors.border,
                width: i === step ? 24 : 8,
              }} />
            ))}
          </div>

          {/* Step 0: Business type */}
          {step === 0 && (
            <div style={s.stepContent}>
              <h2 style={s.stepTitle}>What do you sell?</h2>
              <p style={s.stepDesc}>This helps us calculate your funnel accurately.</p>
              <div style={s.optionGrid}>
                {[
                  { key: 'product', icon: '📦', label: 'Product / SaaS', desc: 'Fixed-price digital or physical product' },
                  { key: 'service', icon: '🤝', label: 'Service / Agency', desc: 'Custom projects, retainers, consulting' },
                  { key: 'signup', icon: '👤', label: 'Signups / Leads', desc: 'Free trial, demo request, lead gen' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    style={{
                      ...s.optionCard,
                      borderColor: businessType === opt.key ? colors.green : colors.border,
                      background: businessType === opt.key ? '#F0FAF4' : colors.card,
                    }}
                    onClick={() => setBusinessType(opt.key)}
                  >
                    <span style={{ fontSize: 28 }}>{opt.icon}</span>
                    <strong style={{ fontSize: 14, color: colors.text }}>{opt.label}</strong>
                    <span style={{ fontSize: 12, color: colors.textMuted }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
              <button
                style={{ ...s.btnPrimary, opacity: businessType ? 1 : 0.4 }}
                disabled={!businessType}
                onClick={() => setStep(1)}
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 1: Goal */}
          {step === 1 && (
            <div style={s.stepContent}>
              <h2 style={s.stepTitle}>What's your monthly target?</h2>
              <p style={s.stepDesc}>
                {businessType === 'signup'
                  ? 'How many signups per month?'
                  : 'Choose revenue or client count.'}
              </p>

              {businessType !== 'signup' && (
                <div style={s.toggleRow}>
                  <button
                    style={{ ...s.toggleBtn, ...(goalType === 'revenue' ? s.toggleActive : {}) }}
                    onClick={() => setGoalType('revenue')}
                  >
                    💰 Revenue
                  </button>
                  <button
                    style={{ ...s.toggleBtn, ...(goalType === 'clients' ? s.toggleActive : {}) }}
                    onClick={() => setGoalType('clients')}
                  >
                    👥 Clients
                  </button>
                </div>
              )}

              <div style={s.inputGroup}>
                <label style={s.inputLabel}>
                  {businessType === 'signup' ? 'Target signups / month' :
                   goalType === 'revenue' ? 'Monthly revenue target ($)' : 'New clients / month'}
                </label>
                <input
                  style={s.input}
                  type="number"
                  placeholder={businessType === 'signup' ? '100' : goalType === 'revenue' ? '10000' : '20'}
                  value={goalValue}
                  onChange={e => setGoalValue(e.target.value)}
                />
              </div>

              {businessType !== 'signup' && goalType === 'revenue' && (
                <div style={s.inputGroup}>
                  <label style={s.inputLabel}>Average deal value ($)</label>
                  <input
                    style={s.input}
                    type="number"
                    placeholder="149"
                    value={dealValue}
                    onChange={e => setDealValue(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button style={s.btnOutline} onClick={() => setStep(0)}>← Back</button>
                <button
                  style={{ ...s.btnPrimary, flex: 1, opacity: goalValue ? 1 : 0.4 }}
                  disabled={!goalValue}
                  onClick={() => setStep(2)}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Preview funnel */}
          {step === 2 && (
            <div style={s.stepContent}>
              <h2 style={s.stepTitle}>Here's your plan</h2>
              <p style={s.stepDesc}>Outpulse calculated what it takes to hit your goal.</p>

              {(() => {
                const funnel = calculateFunnel({
                  goalType: businessType === 'signup' ? 'clients' : (goalType || 'revenue'),
                  goalValue: Number(goalValue) || 10000,
                  businessType: businessType || 'product',
                  dealValue: Number(dealValue) || 149,
                })
                return (
                  <div style={s.funnelPreview}>
                    <FunnelStep emoji="🎯" label="Goal" value={
                      businessType === 'signup'
                        ? `${goalValue} signups`
                        : goalType === 'revenue'
                          ? `$${Number(goalValue).toLocaleString()}`
                          : `${goalValue} clients`
                    } highlight />
                    {businessType !== 'signup' && (
                      <FunnelStep emoji="🤝" label="Meetings needed" value={funnel.meetingsNeeded} />
                    )}
                    <FunnelStep emoji="💬" label="Replies needed" value={funnel.repliesNeeded} />
                    <FunnelStep emoji="✉️" label="Emails to send" value={funnel.emailsNeeded.toLocaleString()} />
                    <FunnelStep emoji="👥" label="Prospects to find" value={funnel.prospectsNeeded.toLocaleString()} />
                    <div style={s.dailyBox}>
                      <span style={{ fontSize: 13, color: colors.textMuted }}>That's about</span>
                      <strong style={{ fontSize: 20, color: colors.green }}>
                        {funnel.dailyEmails} emails / day
                      </strong>
                      <span style={{ fontSize: 13, color: colors.textMuted }}>Outpulse handles this automatically.</span>
                    </div>
                  </div>
                )
              })()}

              <div style={{ display: 'flex', gap: 12 }}>
                <button style={s.btnOutline} onClick={() => setStep(1)}>← Back</button>
                <button style={{ ...s.btnPrimary, flex: 1 }} onClick={() => setView('dashboard')}>
                  Activate Pulse ◎
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── DAILY EMAIL PREVIEW ───
  if (view === 'email') {
    return (
      <div style={s.page}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
            {/* Email header */}
            <div style={{
              padding: '24px 24px 20px',
              background: 'linear-gradient(135deg, #F0FAF4 0%, #E8F5EE 100%)',
              borderBottom: `1px solid ${colors.border}`,
            }}>
              <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>From: Outpulse Pulse · 8:00 AM</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>Your daily Pulse — Day 8 of 30</div>
            </div>

            <div style={{ padding: 24 }}>
              <p style={{ margin: '0 0 16px', fontSize: 14, color: colors.text, lineHeight: 1.6 }}>
                Good morning, Lukas.
              </p>

              {/* Progress ring */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '20px 0', padding: 20, background: '#FAFAF6', borderRadius: 16 }}>
                <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="30" fill="none" stroke={colors.border} strokeWidth="6" />
                    <circle cx="36" cy="36" r="30" fill="none" stroke={colors.green} strokeWidth="6"
                      strokeDasharray={`${188.5 * 0.15} ${188.5 * 0.85}`}
                      strokeLinecap="round"
                      transform="rotate(-90 36 36)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: colors.green }}>15%</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>$149 of $10,000</div>
                  <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>1 client closed · 22 days remaining</div>
                </div>
              </div>

              <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: '20px 0 8px' }}>Yesterday's activity</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Emails sent', val: '12', color: colors.green },
                  { label: 'Opens', val: '4', color: colors.text },
                  { label: 'Replies', val: '1', color: colors.greenLight },
                  { label: 'New prospects', val: '8', color: colors.text },
                ].map(m => (
                  <div key={m.label} style={{ padding: '10px 12px', background: '#FAFAF6', borderRadius: 10 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: 11, color: colors.textMuted }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 20, padding: 16, borderRadius: 12,
                background: 'linear-gradient(135deg, #F0FAF4 0%, #E8F5EE 100%)',
                border: `1px solid ${colors.greenLight}30`,
              }}>
                <p style={{ margin: 0, fontSize: 13, color: colors.green, lineHeight: 1.5 }}>
                  💡 <strong>At your current pace</strong>, you'll hit $10K in ~47 days. To close the gap, Outpulse is increasing daily sends to 15.
                </p>
              </div>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <div style={{
                  display: 'inline-block', padding: '12px 32px', borderRadius: 100,
                  background: colors.green, color: '#fff', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                }}>
                  Open Dashboard →
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button style={{ ...s.btnOutline, fontSize: 13 }} onClick={() => setView('dashboard')}>← Back to dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  // ─── DASHBOARD WIDGET ───
  return (
    <div style={s.page}>
      {/* Nav tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {['setup', 'dashboard', 'email'].map(v => (
          <button
            key={v}
            style={{
              padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500,
              background: view === v ? colors.green : '#F0EDE6',
              color: view === v ? '#fff' : colors.text,
            }}
            onClick={() => { setView(v); if(v==='setup'){setStep(0);setBusinessType(null);setGoalType(null);setGoalValue('');setDealValue('')} }}
          >
            {v === 'setup' ? '① Setup flow' : v === 'dashboard' ? '② Dashboard widget' : '③ Daily email'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px' }}>

        {/* ─── THE PULSE WIDGET ─── */}
        <div style={s.pulseWidget}>
          {/* Glow background */}
          <div style={s.glowBg} />

          {/* Header row */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14, opacity: 0.7 }}>◎</span>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: colors.green, opacity: 0.8 }}>Pulse</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>
                $149 <span style={{ fontSize: 16, fontWeight: 400, color: colors.textMuted }}>of $10,000</span>
              </div>
            </div>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: colors.textMuted, padding: 4 }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? '▼' : '▲'}
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ position: 'relative', zIndex: 1, marginTop: 16 }}>
            <div style={s.progressTrack}>
              <div style={{
                ...s.progressFill,
                width: `${Math.max(animPct, 2)}%`,
                transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 12, color: colors.textMuted }}>Day 8 of 30</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: colors.green }}>{animPct}%</span>
            </div>
          </div>

          {/* Expanded content */}
          {!collapsed && (
            <div style={{ position: 'relative', zIndex: 1, marginTop: 20 }}>
              {/* Funnel metrics */}
              <div style={s.metricsGrid}>
                <MetricPill label="Prospects" current={demoProgress.prospects} needed={demoFunnel.prospectsNeeded} />
                <MetricPill label="Emails" current={demoProgress.emailsSent} needed={demoFunnel.emailsNeeded} />
                <MetricPill label="Replies" current={demoProgress.replies} needed={demoFunnel.repliesNeeded} />
                <MetricPill label="Meetings" current={demoProgress.meetings} needed={demoFunnel.meetingsNeeded} />
              </div>

              {/* AI insight */}
              <div style={s.insightBox}>
                <span style={{ fontSize: 13 }}>💡</span>
                <span style={{ fontSize: 13, color: colors.text, lineHeight: 1.5 }}>
                  At this pace, you'll reach $10K in <strong>47 days</strong>. Outpulse is ramping daily sends to close the gap.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ─── Fake dashboard content below ─── */}
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={s.card}>
            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>OUTREACH ACTIVITY</div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>287</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>Emails sent</div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: colors.greenLight }}>14</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>Replies</div>
              </div>
            </div>
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>ACTIVE CAMPAIGNS</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>3</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>running</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SMALL COMPONENTS ───

function FunnelStep({ emoji, label, value, highlight }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      background: highlight ? '#F0FAF4' : 'transparent',
      borderRadius: 12,
      borderLeft: highlight ? `3px solid ${colors.green}` : '3px solid transparent',
    }}>
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: colors.textMuted }}>{label}</div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: highlight ? colors.green : colors.text }}>{value}</div>
    </div>
  )
}

function MetricPill({ label, current, needed }) {
  const pct = Math.min(Math.round((current / needed) * 100), 100)
  const onTrack = pct >= ((8/30) * 100) // day 8 of 30 → 26.7% expected

  return (
    <div style={{
      padding: '12px 14px', borderRadius: 14,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${colors.border}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: colors.textMuted }}>{label}</span>
        <span style={{ fontSize: 11, color: onTrack ? colors.green : colors.accent, fontWeight: 600 }}>
          {onTrack ? '✓ on track' : '↑ needs boost'}
        </span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>
        {current} <span style={{ fontSize: 12, fontWeight: 400, color: colors.textMuted }}>/ {needed}</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: colors.border, marginTop: 8 }}>
        <div style={{
          height: 4, borderRadius: 2, width: `${pct}%`,
          background: onTrack ? colors.green : colors.accent,
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  )
}

// ─── STYLE OBJECTS ───
const s = {
  page: {
    minHeight: '100vh',
    background: colors.bg,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '24px 0',
    color: colors.text,
  },

  // Pulse widget
  pulseWidget: {
    position: 'relative',
    padding: '24px 24px 20px',
    borderRadius: 24,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.border}`,
    overflow: 'hidden',
  },
  glowBg: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 280,
    height: 200,
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 70%)',
    filter: 'blur(30px)',
    pointerEvents: 'none',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    background: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    background: `linear-gradient(90deg, ${colors.green}, ${colors.greenLight})`,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  insightBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 14,
    padding: '12px 14px',
    borderRadius: 12,
    background: 'rgba(240,250,244,0.7)',
    border: `1px solid rgba(82,183,136,0.15)`,
  },

  // Cards
  card: {
    padding: 20,
    borderRadius: 16,
    background: colors.card,
    border: `1px solid ${colors.border}`,
  },

  // Setup
  setupContainer: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '0 20px',
  },
  setupHeader: {
    textAlign: 'center',
    marginBottom: 24,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  logoIcon: {
    fontSize: 28,
    color: colors.green,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.text,
  },
  setupSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    margin: 0,
    lineHeight: 1.5,
  },
  stepDots: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s ease',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.text,
    margin: 0,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 14,
    color: colors.textMuted,
    margin: 0,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  optionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 10,
  },
  optionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '20px 12px',
    borderRadius: 16,
    border: '2px solid',
    background: colors.card,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
  },
  funnelPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '12px 0',
  },
  dailyBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    background: '#F0FAF4',
    border: `1px solid ${colors.greenLight}30`,
  },

  // Inputs
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    padding: '14px 16px',
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    fontSize: 16,
    color: colors.text,
    background: colors.card,
    outline: 'none',
  },
  toggleRow: {
    display: 'flex',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 12,
    border: `2px solid ${colors.border}`,
    background: colors.card,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    color: colors.text,
    transition: 'all 0.2s ease',
  },
  toggleActive: {
    borderColor: colors.green,
    background: '#F0FAF4',
    color: colors.green,
    fontWeight: 600,
  },

  // Buttons
  btnPrimary: {
    padding: '14px 24px',
    borderRadius: 100,
    border: 'none',
    background: colors.green,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  btnOutline: {
    padding: '14px 24px',
    borderRadius: 100,
    border: `1px solid ${colors.border}`,
    background: 'transparent',
    color: colors.text,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
}
