import { useState, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════
// PULSE v4 — Final Prototype
// Product vs Service funnels, GA4 connect, visits-first,
// multi-channel, editable conversions, statistical warnings
// ═══════════════════════════════════════════════════════════════

const THIEL_TIERS = [
  { id: 'micro', range: '$1–$100', label: 'Viral / Self-serve',
    insight: 'At this price, your product must convert on its own. Volume wins — Outpulse fills the top of funnel.',
    education: 'Products under $100 can\'t afford any sales touch. Growth must be viral or self-serve — think Spotify, Notion, Canva. The product IS the marketing.',
    example: 'Spotify, Canva, mobile apps',
    outreachPct: 40, defaultVisitChannels: { linkedin: 20, listings: 30, seo: 30, referrals: 10, other: 10 },
  },
  { id: 'low', range: '$100–$1K', label: 'Self-serve + Nudge',
    insight: 'The sweet spot for AI outreach. Personalized emails drive trials, the product closes the deal.',
    education: 'At $100–$1K, you can afford lightweight sales touches — a personalized email, a follow-up nudge. But the product still needs to close the deal after a trial or demo.',
    example: 'Basecamp, Mailchimp, most SaaS tools',
    outreachPct: 35, defaultVisitChannels: { linkedin: 20, listings: 20, seo: 35, referrals: 15, other: 10 },
  },
  { id: 'mid', range: '$1K–$10K', label: 'Inside Sales',
    insight: 'Customers need a conversation. Outpulse is your SDR — it gets the reply, you close.',
    education: 'Deals at $1K–$10K justify a phone call or demo. The customer wants to talk to someone before buying. Your job: get on the call. Outpulse\'s job: get you there.',
    example: 'HubSpot, Salesforce seats, consulting retainers',
    outreachPct: 45, defaultVisitChannels: { linkedin: 25, listings: 10, seo: 30, referrals: 25, other: 10 },
  },
  { id: 'high', range: '$10K–$100K', label: 'Field Sales',
    insight: 'Complex deals need warm intros. Outpulse opens doors — relationships and proposals are yours.',
    education: 'At $10K–$100K, deals involve multiple stakeholders, longer timelines, and custom proposals. Relationships matter more than volume. One warm intro is worth 1,000 cold emails.',
    example: 'Enterprise software, agency retainers, B2B services',
    outreachPct: 50, defaultVisitChannels: { linkedin: 30, listings: 0, seo: 25, referrals: 30, other: 15 },
  },
  { id: 'enterprise', range: '$100K+', label: 'Complex Sales',
    insight: 'One deal changes everything. Outpulse builds pipeline — the rest is trust and timing.',
    education: 'Enterprise deals are measured in months, not days. They require trust, multiple meetings, legal review, and executive buy-in. But one closed deal can transform your business.',
    example: 'Enterprise contracts, large consulting, custom solutions',
    outreachPct: 55, defaultVisitChannels: { linkedin: 35, listings: 0, seo: 15, referrals: 30, other: 20 },
  },
]

// Website channels (drive visits → GA4 tracked)
const VISIT_CHANNELS = {
  linkedin: { label: 'LinkedIn content', desc: 'Posts, articles, profile visits driving traffic', auto: false },
  listings: { label: 'Product listings', desc: 'Product Hunt, G2, directories', auto: false },
  seo: { label: 'SEO & Content', desc: 'Blog, guides, organic search', auto: false },
  referrals: { label: 'Referrals', desc: 'Word of mouth, partners, affiliate links', auto: false },
  other: { label: 'Other', desc: 'Paid ads, events, conferences, communities', auto: false },
}

// Product funnel defaults — each step is realistic on its own
const PRODUCT_CONV = {
  visitToEngaged: 35,       // % of all visitors who view product/pricing page
  engagedToSignup: 10,      // % of engaged visitors who sign up
  signupToActivated: 40,    // % of signups who complete onboarding (industry avg: 36%, good: 40-60%)
  activatedToPaying: 25,    // % of activated users who convert to paid (opt-in trial avg: 18-25%)
  // Overall: 35% × 10% × 40% × 25% = 0.35% visit-to-paying (realistic SaaS)
}
// Service funnel defaults
const SERVICE_CONV = {
  visitToEngaged: 30,       // % of visitors who view services/contact page
  engagedToInquiry: 8,      // % of engaged who submit inquiry / reply to outreach
  inquiryToCall: 40,        // % of inquiries that become calls/meetings (form→meeting avg: 30%, qualified: 67%)
  callToProposal: 50,       // % of calls that lead to a proposal
  proposalToClose: 30,      // % of proposals that close
  // Overall: 30% × 8% × 45% × 50% × 30% = 0.16% visit-to-close (realistic B2B services)
}

// Cold outreach — separate reply-based funnel (NOT visits-based)
const COLD_OUTREACH = {
  replyRate: 4,               // % of emails that get a reply
  positiveReplyRate: 50,      // % of replies that are positive/interested
  positiveToCustomer: 25,     // % of positive replies that become customers (product: signup+pay, service: call+close)
  emailsPerSequence: 4,       // emails in a follow-up sequence (optimal: 3-5, sweet spot: 4)
  maxPerAccountPerDay: 40,    // safe sending limit per email account/day (recommended: 25-50)
}

// ─── COLORS ───
const C = {
  bg: '#FFFDF8', card: '#FFFFFF', text: '#1A1A1A', muted: '#8A8A7A',
  green: '#2D6A4F', greenLight: '#52B788', greenGlow: '#40C07B',
  greenPale: '#F0FAF4', border: '#F0EDE6', accent: '#D4A843',
  warn: '#E07B4C', warnPale: '#FFF4EC',
}

// ═══════════════════════════════════════════════════════════════
export default function PulseV4() {
  const [screen, setScreen] = useState('home')
  const [step, setStep] = useState(0)

  // Setup state
  const [bizType, setBizType] = useState('') // 'product' | 'service'
  const [bizName, setBizName] = useState('')
  const [dealValue, setDealValue] = useState('')
  const [goalType, setGoalType] = useState('revenue')
  const [goalValue, setGoalValue] = useState('')
  const [ga4Id, setGa4Id] = useState('')

  // Editable conversions
  const [pConv, setPConv] = useState({ ...PRODUCT_CONV })
  const [sConv, setSConv] = useState({ ...SERVICE_CONV })

  // Channels (visit-based only, cold outreach is separate)
  const [visitChannels, setVisitChannels] = useState(null)
  // Outreach split: what % of customers come from cold outreach vs website
  const [outreachPct, setOutreachPct] = useState(null)

  // Tier
  const tier = dealValue ? THIEL_TIERS.find(t => {
    const v = Number(dealValue)
    if (t.id === 'micro') return v >= 1 && v < 100
    if (t.id === 'low') return v >= 100 && v < 1000
    if (t.id === 'mid') return v >= 1000 && v < 10000
    if (t.id === 'high') return v >= 10000 && v < 100000
    if (t.id === 'enterprise') return v >= 100000
    return false
  }) : null

  useEffect(() => {
    if (tier && !visitChannels) {
      setVisitChannels({ ...tier.defaultVisitChannels })
      setOutreachPct(tier.outreachPct)
    }
  }, [tier])

  // ─── FUNNEL MATH ───
  const customers = goalValue && dealValue
    ? (goalType === 'revenue' ? Math.ceil(Number(goalValue) / Number(dealValue)) : Number(goalValue))
    : 0

  // Split customers between two channels
  const oPct = outreachPct || 0
  const outreachCustomers = Math.ceil(customers * (oPct / 100))
  const websiteCustomers = customers - outreachCustomers

  // ─── WEBSITE FUNNEL (visits-based, tracked via GA4) ───
  let websiteFunnel = []
  let visitsNeeded = 0

  if (bizType === 'product' && websiteCustomers > 0) {
    const activated = Math.ceil(websiteCustomers / (pConv.activatedToPaying / 100))
    const signups = Math.ceil(activated / (pConv.signupToActivated / 100))
    const engaged = Math.ceil(signups / (pConv.engagedToSignup / 100))
    const visits = Math.ceil(engaged / (pConv.visitToEngaged / 100))
    visitsNeeded = visits
    websiteFunnel = [
      { key: 'paying', label: 'Paying customers (from web)', value: websiteCustomers, highlight: true },
      { key: 'activated', label: 'Activated users', value: activated, rate: `${pConv.activatedToPaying}% → paid`, desc: 'Completed onboarding' },
      { key: 'signups', label: 'Signups', value: signups, rate: `${pConv.signupToActivated}% → activated`, desc: 'Created an account' },
      { key: 'engaged', label: 'Engaged visitors', value: engaged, rate: `${pConv.engagedToSignup}% → signup`, desc: 'Viewed product or pricing' },
      { key: 'visits', label: 'Website visits', value: visits, rate: `${pConv.visitToEngaged}% → engaged`, highlight: true, desc: 'All visitors (GA4)' },
    ]
  } else if (bizType === 'service' && websiteCustomers > 0) {
    const proposals = Math.ceil(websiteCustomers / (sConv.proposalToClose / 100))
    const calls = Math.ceil(proposals / (sConv.callToProposal / 100))
    const inquiries = Math.ceil(calls / (sConv.inquiryToCall / 100))
    const engaged = Math.ceil(inquiries / (sConv.engagedToInquiry / 100))
    const visits = Math.ceil(engaged / (sConv.visitToEngaged / 100))
    visitsNeeded = visits
    websiteFunnel = [
      { key: 'closed', label: 'Closed deals (from web)', value: websiteCustomers, highlight: true },
      { key: 'proposals', label: 'Proposals sent', value: proposals, rate: `${sConv.proposalToClose}% → close` },
      { key: 'calls', label: 'Calls / meetings', value: calls, rate: `${sConv.callToProposal}% → proposal` },
      { key: 'inquiries', label: 'Inquiries', value: inquiries, rate: `${sConv.inquiryToCall}% → call`, desc: 'Forms, replies, DMs' },
      { key: 'engaged', label: 'Engaged visitors', value: engaged, rate: `${sConv.engagedToInquiry}% → inquiry`, desc: 'Viewed services page' },
      { key: 'visits', label: 'Website visits', value: visits, rate: `${sConv.visitToEngaged}% → engaged`, highlight: true, desc: 'All visitors (GA4)' },
    ]
  }

  // ─── COLD OUTREACH FUNNEL (reply-based, tracked in Outpulse) ───
  const co = COLD_OUTREACH
  const outreachPositiveReplies = outreachCustomers > 0
    ? Math.ceil(outreachCustomers / (co.positiveToCustomer / 100)) : 0
  const outreachReplies = outreachPositiveReplies > 0
    ? Math.ceil(outreachPositiveReplies / (co.positiveReplyRate / 100)) : 0
  const outreachEmails = outreachReplies > 0
    ? Math.ceil(outreachReplies / (co.replyRate / 100)) : 0
  const outreachProspects = co.emailsPerSequence > 0
    ? Math.ceil(outreachEmails / co.emailsPerSequence) : 0

  const outreachFunnel = outreachCustomers > 0 ? [
    { key: 'customers', label: `${bizType === 'product' ? 'Customers' : 'Closed deals'} (from outreach)`, value: outreachCustomers, highlight: true },
    { key: 'positive', label: 'Positive replies', value: outreachPositiveReplies, rate: `${co.positiveToCustomer}% → customer` },
    { key: 'replies', label: 'Total replies', value: outreachReplies, rate: `${co.positiveReplyRate}% are positive` },
    { key: 'emails', label: 'Emails (incl. follow-ups)', value: outreachEmails, rate: `${co.replyRate}% reply rate` },
    { key: 'prospects', label: 'Unique prospects', value: outreachProspects, rate: `${co.emailsPerSequence} emails per sequence`, highlight: true },
  ] : []

  const timeframe = 30
  const dailyVisits = visitsNeeded > 0 ? Math.ceil(visitsNeeded / timeframe) : 0
  const dailyEmails = outreachEmails > 0 ? Math.ceil(outreachEmails / timeframe) : 0
  const dailyProspects = outreachProspects > 0 ? Math.ceil(outreachProspects / timeframe) : 0
  const emailAccountsNeeded = Math.max(1, Math.ceil(dailyEmails / co.maxPerAccountPerDay))

  // Visit channel breakdown
  const chVisits = visitChannels ? Object.entries(visitChannels).reduce((a, [k, pct]) => {
    a[k] = Math.ceil(visitsNeeded * (pct / 100))
    return a
  }, {}) : {}

  // Combined funnel for preview (simplified)
  const funnelSteps = websiteFunnel

  // Demo data for dashboard/email
  const demo = bizType === 'service'
    ? { visits: 156, engaged: 48, inquiries: 5, calls: 3, proposals: 2, closed: 1, daysIn: 12 }
    : { visits: 143, engaged: 52, signups: 6, activated: 4, paying: 2, daysIn: 12 }

  const demoPaying = bizType === 'service' ? demo.closed : demo.paying
  const progressPct = customers > 0 ? Math.min(Math.round((demoPaying / customers) * 100), 100) : 0
  const [animPct, setAnimPct] = useState(0)
  useEffect(() => {
    if (screen === 'dashboard') {
      const t = setTimeout(() => setAnimPct(progressPct), 300)
      return () => clearTimeout(t)
    }
  }, [screen, progressPct])

  function reset() {
    setStep(0); setBizType(''); setBizName(''); setDealValue('')
    setGoalType('revenue'); setGoalValue(''); setGa4Id('')
    setPConv({ ...PRODUCT_CONV }); setSConv({ ...SERVICE_CONV })
    setVisitChannels(null); setOutreachPct(null); setScreen('setup')
  }

  // ═══════════════════════════════════════════════════════════
  // HOME
  // ═══════════════════════════════════════════════════════════
  if (screen === 'home') {
    return (
      <Page>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <PulseLogo />
          <h1 style={{ fontSize: 32, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>Pulse</h1>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: '0 0 32px' }}>
            Set your growth target. See exactly what it takes.
            <br/>Outpulse helps you get there — across every channel.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
            <Btn onClick={reset} primary>Set up your Pulse</Btn>
            <Btn onClick={() => { prefillDemo(); setScreen('dashboard') }}>Preview: Dashboard</Btn>
            <Btn onClick={() => { prefillDemo(); setScreen('email') }}>Preview: Daily email</Btn>
          </div>
          <div style={{ marginTop: 40, textAlign: 'left' }}>
            <QuestionReveal question="How does Pulse work?">
              <div style={{ lineHeight: 1.8 }}>
                ① Choose: product or service<br/>
                ② Set your revenue/client goal<br/>
                ③ Pulse reverse-calculates: paying → ... → <strong>visits needed</strong><br/>
                ④ Connect Google Analytics for real tracking<br/>
                ⑤ Outpulse handles outreach — you track progress daily
              </div>
            </QuestionReveal>
          </div>
        </div>
      </Page>
    )
  }

  function prefillDemo() {
    if (!goalValue) {
      setBizType('product'); setDealValue('149'); setGoalValue('30000'); setGoalType('revenue')
      setPConv({ visitToEngaged: 35, engagedToSignup: 27, signupToActivated: 67, activatedToPaying: 100 })
      setVisitChannels({ linkedin: 20, listings: 20, seo: 35, referrals: 15, other: 10 })
      setOutreachPct(35)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // SETUP STEP 0: Product or Service
  // ═══════════════════════════════════════════════════════════
  if (screen === 'setup' && step === 0) {
    return (
      <Page><SetupShell step={0} total={5}>
        <h2 style={st.title}>What does your business sell?</h2>
        <p style={st.subtitle}>This determines how we calculate your growth funnel.</p>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <TypeCard
            selected={bizType === 'product'}
            onClick={() => setBizType('product')}
            icon="📦"
            title="Product"
            desc="SaaS, app, digital product, e-commerce. Customers sign up and activate online."
            funnel="Visits → Signups → Activated → Paying"
          />
          <TypeCard
            selected={bizType === 'service'}
            onClick={() => setBizType('service')}
            icon="🤝"
            title="Service"
            desc="Consulting, agency, freelance, B2B services. Customers book calls and sign proposals."
            funnel="Visits → Replies → Calls → Proposals → Closed"
          />
        </div>

        <Btn onClick={() => setStep(1)} primary disabled={!bizType} style={{ marginTop: 24, width: '100%' }}>
          Continue
        </Btn>
      </SetupShell></Page>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // SETUP STEP 1: Deal Value + Name
  // ═══════════════════════════════════════════════════════════
  if (screen === 'setup' && step === 1) {
    return (
      <Page><SetupShell step={1} total={5}>
        <h2 style={st.title}>Tell us about your {bizType === 'product' ? 'product' : 'service'}</h2>
        <p style={st.subtitle}>We'll use this to find your ideal distribution strategy.</p>

        <Field label="Name" placeholder={bizType === 'product' ? 'e.g. Outpulse' : 'e.g. PLATFORM consulting'}
          value={bizName} onChange={setBizName} />
        <Field label="Average deal / sale value ($)" placeholder="e.g. 149" type="number"
          value={dealValue} onChange={v => { setDealValue(v); setVisitChannels(null) }} />

        {tier && (
          <div style={{ marginTop: 20, padding: 16, borderRadius: 16, background: C.greenPale, border: `1px solid ${C.green}22` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{tier.label}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{tier.range}</div>
            </div>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.5, margin: 0 }}>{tier.insight}</p>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <QuestionReveal question="Why does my price point matter for distribution?" defaultOpen={true} variant="neutral">
            <div style={{ marginBottom: 8 }}>
              Based on Peter Thiel's <em>Zero to One</em>: the way you sell should match your price point. Each tier has a fundamentally different sales motion.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {THIEL_TIERS.map(t => {
                const isActive = tier?.id === t.id
                return (
                  <TierRow key={t.id} tier={t} isActive={isActive} />
                )
              })}
            </div>
          </QuestionReveal>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <Btn onClick={() => setStep(0)}>← Back</Btn>
          <Btn onClick={() => setStep(2)} primary disabled={!tier} style={{ flex: 1 }}>Continue</Btn>
        </div>
      </SetupShell></Page>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // SETUP STEP 2: Goal
  // ═══════════════════════════════════════════════════════════
  if (screen === 'setup' && step === 2) {
    return (
      <Page><SetupShell step={2} total={5}>
        <h2 style={st.title}>What's your monthly target?</h2>
        <p style={st.subtitle}>{tier?.label} — {tier?.range} per {bizType === 'product' ? 'sale' : 'deal'}</p>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {['revenue', 'clients'].map(t => (
            <button key={t} onClick={() => setGoalType(t)}
              style={{ ...st.toggleBtn, ...(goalType === t ? st.toggleActive : {}), flex: 1 }}>
              {t === 'revenue' ? '💰 Revenue' : '👥 Clients'}
            </button>
          ))}
        </div>

        <Field label={goalType === 'revenue' ? 'Monthly revenue target ($)' : 'New clients per month'}
          placeholder={goalType === 'revenue' ? '30000' : '20'} type="number"
          value={goalValue} onChange={setGoalValue} />

        {customers > 0 && (
          <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: C.greenPale }}>
            <span style={{ fontSize: 14, color: C.text }}>
              {goalType === 'revenue' ? `$${Number(goalValue).toLocaleString()} ÷ $${Number(dealValue).toLocaleString()} = ` : ''}
              <strong>{customers} {bizType === 'product' ? 'paying customers' : 'closed deals'}</strong> needed
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <Btn onClick={() => setStep(1)}>← Back</Btn>
          <Btn onClick={() => setStep(3)} primary disabled={!goalValue} style={{ flex: 1 }}>Continue</Btn>
        </div>
      </SetupShell></Page>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // SETUP STEP 3: Conversion Rates
  // ═══════════════════════════════════════════════════════════
  if (screen === 'setup' && step === 3) {
    const isProduct = bizType === 'product'

    return (
      <Page><SetupShell step={3} total={5}>
        <h2 style={st.title}>Your conversion funnel</h2>
        <p style={st.subtitle}>
          Adjust based on your real data. We've set industry defaults.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isProduct ? (<>
            <ConvRow label="Visit → Engaged" hint="Engaged = viewed product or pricing page. Avg: 25-45%"
              value={pConv.visitToEngaged} onChange={v => setPConv(p => ({ ...p, visitToEngaged: v }))} />
            <ConvRow label="Engaged → Signup" hint="Of those who explored your product. Avg: 5-15%"
              value={pConv.engagedToSignup} onChange={v => setPConv(p => ({ ...p, engagedToSignup: v }))} />
            <ConvRow label="Signup → Activated" hint="Completed onboarding. Avg: 36%, Good: 40-60%"
              value={pConv.signupToActivated} onChange={v => setPConv(p => ({ ...p, signupToActivated: v }))} />
            <ConvRow label="Activated → Paying" hint="Free trial: 15-30%, Freemium: 2-5%"
              value={pConv.activatedToPaying} onChange={v => setPConv(p => ({ ...p, activatedToPaying: v }))} />
          </>) : (<>
            <ConvRow label="Visit → Engaged" hint="Engaged = viewed services or contact page. Avg: 20-40%"
              value={sConv.visitToEngaged} onChange={v => setSConv(p => ({ ...p, visitToEngaged: v }))} />
            <ConvRow label="Engaged → Inquiry" hint="Submitted contact form, replied to email. Avg: 5-12%"
              value={sConv.engagedToInquiry} onChange={v => setSConv(p => ({ ...p, engagedToInquiry: v }))} />
            <ConvRow label="Inquiry → Call booked" hint="Avg: 30%, Qualified leads: 40-67%"
              value={sConv.inquiryToCall} onChange={v => setSConv(p => ({ ...p, inquiryToCall: v }))} />
            <ConvRow label="Call → Proposal" hint="Good qualification: 40-60%"
              value={sConv.callToProposal} onChange={v => setSConv(p => ({ ...p, callToProposal: v }))} />
            <ConvRow label="Proposal → Close" hint="Industry avg: 20-40%"
              value={sConv.proposalToClose} onChange={v => setSConv(p => ({ ...p, proposalToClose: v }))} />
          </>)}
        </div>

        {/* Live funnel preview (website channel only for now — outreach shown in step 4) */}
        {websiteFunnel.length > 0 && (
          <div style={{ marginTop: 24, padding: 20, borderRadius: 16, background: C.greenPale, border: `1px solid ${C.green}15` }}>
            <div style={st.sectionLabel}>Reverse funnel preview (website channel)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              {websiteFunnel.map(s => (
                <div key={s.key} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: s.highlight ? '8px 12px' : '4px 12px',
                  borderRadius: 10, background: s.highlight ? 'rgba(255,255,255,0.7)' : 'transparent',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 4, flexShrink: 0,
                    background: s.highlight ? C.green : C.border,
                  }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, color: C.text }}>{s.label}</span>
                    {s.rate && <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>{s.rate}</span>}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: s.highlight ? C.green : C.text }}>
                    {s.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Compound improvement insight */}
            <div style={{ marginTop: 14 }}>
              <QuestionReveal question={`What if I improve each conversion step by 2%?`}>
                {bizType === 'product'
                  ? `Your visits needed would drop from ${visitsNeeded.toLocaleString()} to ~${(() => {
                      const a2 = Math.ceil(websiteCustomers / ((pConv.activatedToPaying + 2) / 100))
                      const s2 = Math.ceil(a2 / ((pConv.signupToActivated + 2) / 100))
                      const e2 = Math.ceil(s2 / ((pConv.engagedToSignup + 2) / 100))
                      return Math.ceil(e2 / ((pConv.visitToEngaged + 2) / 100)).toLocaleString()
                    })()} — that's ${(() => {
                      const a2 = Math.ceil(websiteCustomers / ((pConv.activatedToPaying + 2) / 100))
                      const s2 = Math.ceil(a2 / ((pConv.signupToActivated + 2) / 100))
                      const e2 = Math.ceil(s2 / ((pConv.engagedToSignup + 2) / 100))
                      const v2 = Math.ceil(e2 / ((pConv.visitToEngaged + 2) / 100))
                      return Math.round((1 - v2 / visitsNeeded) * 100)
                    })()}% fewer visitors needed. Small improvements at each step compound into big results.`
                  : `Your visits needed would drop from ${visitsNeeded.toLocaleString()} to ~${(() => {
                      const p2 = Math.ceil(websiteCustomers / ((sConv.proposalToClose + 2) / 100))
                      const c2 = Math.ceil(p2 / ((sConv.callToProposal + 2) / 100))
                      const i2 = Math.ceil(c2 / ((sConv.inquiryToCall + 2) / 100))
                      const e2 = Math.ceil(i2 / ((sConv.engagedToInquiry + 2) / 100))
                      return Math.ceil(e2 / ((sConv.visitToEngaged + 2) / 100)).toLocaleString()
                    })()} — a ${(() => {
                      const p2 = Math.ceil(websiteCustomers / ((sConv.proposalToClose + 2) / 100))
                      const c2 = Math.ceil(p2 / ((sConv.callToProposal + 2) / 100))
                      const i2 = Math.ceil(c2 / ((sConv.inquiryToCall + 2) / 100))
                      const e2 = Math.ceil(i2 / ((sConv.engagedToInquiry + 2) / 100))
                      const v2 = Math.ceil(e2 / ((sConv.visitToEngaged + 2) / 100))
                      return Math.round((1 - v2 / visitsNeeded) * 100)
                    })()}% reduction. Every step matters.`
                }
              </QuestionReveal>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <Btn onClick={() => setStep(2)}>← Back</Btn>
          <Btn onClick={() => setStep(4)} primary style={{ flex: 1 }}>Continue</Btn>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
          <QuestionReveal question="How accurate are these conversion rates?">
            These are industry-standard estimates. Pulse needs ~200 website visits to calculate reliable conversion rates from your actual data.
            Until then, numbers are shown with "~" to indicate they're estimates. Pulse updates automatically as your traffic grows.
          </QuestionReveal>
          <QuestionReveal question="What counts as a website visit?">
            All unique visitors to your website — from Outpulse outreach clicks, organic search, social media, ads, referrals. Tracked automatically via Google Analytics (GA4).
          </QuestionReveal>
        </div>
      </SetupShell></Page>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // SETUP STEP 4: Customer Split + Channels + GA4
  // ═══════════════════════════════════════════════════════════
  if (screen === 'setup' && step === 4) {
    const vcTotalPct = visitChannels ? Object.values(visitChannels).reduce((a, b) => a + b, 0) : 0

    return (
      <Page><SetupShell step={4} total={5}>
        <h2 style={st.title}>How will you reach {customers} {bizType === 'product' ? 'customers' : 'deals'}?</h2>
        <p style={st.subtitle}>
          Split your goal between cold outreach (Outpulse) and website traffic (GA4).
        </p>

        {/* Outreach vs Website split */}
        <div style={{
          padding: 20, borderRadius: 16, marginBottom: 20,
          background: C.card, border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Customer acquisition split</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.green }}>Cold outreach</div>
              <div style={{ fontSize: 11, color: C.muted }}>Outpulse emails → replies → customers</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.green }}>{outreachCustomers}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{oPct}%</div>
            </div>
          </div>

          <input type="range" min="0" max="80" value={oPct}
            onChange={e => setOutreachPct(Number(e.target.value))}
            style={{ width: '100%', accentColor: C.green, marginBottom: 12 }} />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>Website traffic</div>
              <div style={{ fontSize: 11, color: C.muted }}>SEO, listings, LinkedIn, referrals → visits → customers</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>{websiteCustomers}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{100 - oPct}%</div>
            </div>
          </div>
        </div>

        {/* Cold outreach detail */}
        {outreachCustomers > 0 && (
          <div style={{
            padding: 16, borderRadius: 14, marginBottom: 16,
            background: C.greenPale, border: `1px solid ${C.green}15`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Cold outreach plan</div>
              <span style={{ fontSize: 9, fontWeight: 700, color: C.green, background: '#fff', padding: '1px 6px', borderRadius: 4 }}>OUTPULSE</span>
            </div>
            <div style={{
              padding: 12, borderRadius: 10,
              background: 'rgba(255,255,255,0.7)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.green }}>{dailyEmails} emails/day</div>
                <div style={{ fontSize: 11, color: C.muted }}>{dailyProspects} new prospects/day</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                  {emailAccountsNeeded} email {emailAccountsNeeded === 1 ? 'account' : 'accounts'}
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>
                  ~{co.maxPerAccountPerDay} emails/account/day
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <QuestionReveal question={`How does Outpulse get ${outreachCustomers} customers from outreach?`}>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8 }}>
                  {outreachProspects.toLocaleString()} prospects → {outreachEmails.toLocaleString()} emails ({co.emailsPerSequence} per sequence) → {outreachReplies} replies ({co.replyRate}% reply rate) → {outreachPositiveReplies} positive ({co.positiveReplyRate}% of replies) → <strong>{outreachCustomers} customers</strong> ({co.positiveToCustomer}% convert)
                </div>
              </QuestionReveal>
              {emailAccountsNeeded > 1 && (
                <QuestionReveal question={`Do I need more email accounts to send ${dailyEmails} emails/day?`}>
                  Yes — for best deliverability, use <strong>{emailAccountsNeeded} separate email accounts</strong> sending ~{Math.ceil(dailyEmails / emailAccountsNeeded)} emails each.
                  Sending more than {co.maxPerAccountPerDay} emails per account per day risks spam filters and hurts sender reputation.
                </QuestionReveal>
              )}
            </div>
          </div>
        )}

        {/* GA4 Connect */}
        <div style={{
          padding: 20, borderRadius: 16, marginBottom: 16,
          background: `linear-gradient(135deg, ${C.greenPale}, #E8F5EC)`,
          border: `1px solid ${C.green}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, border: `1px solid ${C.border}`, color: C.green,
            }}>GA</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Connect Google Analytics</div>
              <div style={{ fontSize: 12, color: C.muted }}>Tracks website visits for the {100 - oPct}% web channel</div>
            </div>
          </div>
          <input
            style={{ ...st.input, background: '#fff', fontSize: 14 }}
            placeholder="GA4 Measurement ID (G-XXXXXXXXXX)"
            value={ga4Id}
            onChange={e => setGa4Id(e.target.value)}
          />
          {ga4Id && ga4Id.startsWith('G-') && (
            <div style={{ marginTop: 8, fontSize: 12, color: C.green, fontWeight: 600 }}>Connected</div>
          )}
        </div>

        {/* Website visit channel sliders */}
        {websiteCustomers > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>
              Website traffic sources ({visitsNeeded.toLocaleString()} visits needed)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visitChannels && Object.entries(visitChannels).map(([key, pct]) => {
                const meta = VISIT_CHANNELS[key]
                if (!meta || (key === 'listings' && pct === 0)) return null
                const visits = Math.ceil(visitsNeeded * (pct / 100))
                return (
                  <div key={key} style={{
                    padding: 12, borderRadius: 12, background: C.card, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{meta.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{visits.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="range" min="0" max="80" value={pct}
                        onChange={e => setVisitChannels(p => ({ ...p, [key]: Number(e.target.value) }))}
                        style={{ flex: 1, accentColor: C.accent }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, width: 32, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
            {vcTotalPct !== 100 && (
              <div style={{ marginTop: 8, fontSize: 11, color: C.warn, textAlign: 'center' }}>
                Visit channels: {vcTotalPct}% (should be 100%)
              </div>
            )}
          </>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <Btn onClick={() => setStep(3)}>← Back</Btn>
          <Btn onClick={() => setScreen('plan')} primary style={{ flex: 1 }}>See your Pulse plan</Btn>
        </div>
      </SetupShell></Page>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // PLAN SUMMARY
  // ═══════════════════════════════════════════════════════════
  if (screen === 'plan') {
    const activeVisitCh = visitChannels ? Object.entries(visitChannels).filter(([_, p]) => p > 0) : []

    return (
      <Page><div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px' }}>
        <Dots current={5} total={5} />

        <h2 style={{ fontSize: 26, fontWeight: 700, color: C.text, textAlign: 'center', margin: '0 0 4px' }}>
          Here's your Pulse plan
        </h2>
        <p style={{ fontSize: 14, color: C.muted, textAlign: 'center', margin: '0 0 28px' }}>
          {bizName ? `${bizName} · ` : ''}{bizType === 'product' ? 'Product' : 'Service'} · {tier?.label} · 30 days
        </p>

        {/* Goal */}
        <div style={{
          padding: '20px 24px', borderRadius: 20,
          background: `linear-gradient(135deg, ${C.greenPale}, #E8F5EC)`,
          border: `1px solid ${C.green}15`, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: 'uppercase' }}>Your goal</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.green }}>
                {customers} {bizType === 'product' ? 'paying customers' : 'closed deals'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>
                ${(customers * Number(dealValue)).toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>monthly revenue</div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <div style={{ flex: oPct, height: 6, borderRadius: 3, background: C.green }} />
            <div style={{ flex: 100 - oPct, height: 6, borderRadius: 3, background: C.accent }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>Outreach: {outreachCustomers} ({oPct}%)</span>
            <span style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>Website: {websiteCustomers} ({100 - oPct}%)</span>
          </div>
        </div>

        {/* COLD OUTREACH FUNNEL */}
        {outreachFunnel.length > 0 && (
          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.green}25`, marginBottom: 16 }}>
            <div style={{ padding: '14px 20px', background: C.greenPale, borderBottom: `1px solid ${C.green}10`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Cold outreach funnel</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: C.green, padding: '1px 6px', borderRadius: 4 }}>OUTPULSE</span>
            </div>
            <div style={{ padding: '4px 0', background: C.card }}>
              {outreachFunnel.map((s, i) => (
                <div key={s.key} style={{ padding: '10px 20px', borderBottom: i < outreachFunnel.length - 1 ? `1px solid ${C.border}50` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: s.highlight ? 700 : 400, color: C.text }}>{s.label}</div>
                      {s.rate && <div style={{ fontSize: 11, color: C.muted }}>{s.rate}</div>}
                    </div>
                    <div style={{ fontSize: s.highlight ? 18 : 15, fontWeight: 700, color: s.highlight ? C.green : C.text }}>
                      {s.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', background: C.greenPale, borderTop: `1px solid ${C.green}10` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.green }}>{dailyEmails} emails/day</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{dailyProspects} new prospects/day</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                    {emailAccountsNeeded} email {emailAccountsNeeded === 1 ? 'account' : 'accounts'}
                  </div>
                </div>
              </div>
              {emailAccountsNeeded > 1 && (
                <div style={{ marginTop: 8 }}>
                  <QuestionReveal question={`Why ${emailAccountsNeeded} email accounts?`}>
                    Sending more than {co.maxPerAccountPerDay} emails per day from a single account risks spam filters.
                    With {emailAccountsNeeded} accounts sending ~{Math.ceil(dailyEmails / emailAccountsNeeded)} each, you stay under safe limits and maintain strong deliverability.
                  </QuestionReveal>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WEBSITE FUNNEL */}
        {websiteFunnel.length > 0 && (
          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.accent}25`, marginBottom: 16 }}>
            <div style={{ padding: '14px 20px', background: '#FFFBF0', borderBottom: `1px solid ${C.accent}10` }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>Website funnel</span>
              <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>tracked via GA4</span>
            </div>
            <div style={{ padding: '4px 0', background: C.card }}>
              {websiteFunnel.map((s, i) => (
                <div key={s.key} style={{ padding: '10px 20px', borderBottom: i < websiteFunnel.length - 1 ? `1px solid ${C.border}50` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: s.highlight ? 700 : 400, color: C.text }}>{s.label}</div>
                      {s.rate && <div style={{ fontSize: 11, color: C.muted }}>{s.rate}</div>}
                    </div>
                    <div style={{ fontSize: s.highlight ? 18 : 15, fontWeight: 700, color: s.highlight ? C.accent : C.text }}>
                      {s.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', background: '#FFFBF0', borderTop: `1px solid ${C.accent}10` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>{dailyVisits} visits/day needed</div>
              <div style={{ fontSize: 11, color: C.muted }}>{visitsNeeded.toLocaleString()} total over 30 days</div>
            </div>
          </div>
        )}

        {/* Visit traffic sources */}
        {activeVisitCh.length > 0 && visitsNeeded > 0 && (
          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: 16 }}>
            <div style={{ padding: '12px 20px', background: '#FAFAF7', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Website traffic sources</span>
            </div>
            {activeVisitCh.map(([key, pct], i) => {
              const meta = VISIT_CHANNELS[key]
              const visits = Math.ceil(visitsNeeded * (pct / 100))
              return (
                <div key={key} style={{
                  padding: '10px 20px', background: C.card,
                  borderBottom: i < activeVisitCh.length - 1 ? `1px solid ${C.border}` : 'none',
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <div>
                    <span style={{ fontSize: 13, color: C.text }}>{meta?.label}</span>
                    <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>{pct}%</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{visits.toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Thiel insight */}
        {tier && (
          <QuestionReveal question={`Why is "${tier.label}" the right strategy for $${Number(dealValue).toLocaleString()} deals?`}>
            {tier.insight}
            <div style={{ marginTop: 6, fontSize: 11, color: C.muted, fontStyle: 'italic' }}>
              {tier.education}
            </div>
          </QuestionReveal>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <Btn onClick={() => { setStep(4); setScreen('setup') }}>← Edit</Btn>
          <Btn onClick={() => setScreen('dashboard')} primary style={{ flex: 1 }}>Activate Pulse</Btn>
        </div>
      </div></Page>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD WIDGET
  // ═══════════════════════════════════════════════════════════
  if (screen === 'dashboard') {
    const daysLeft = timeframe - demo.daysIn
    const onTrack = demoPaying >= (customers * demo.daysIn / timeframe)

    // Funnel mini boxes
    // Show 4 key metrics on dashboard card (skip "engaged" — it's a middle step)
    const miniBoxes = bizType === 'service'
      ? [
          { label: 'Visits', cur: demo.visits, tgt: visitsNeeded },
          { label: 'Inquiries', cur: demo.inquiries, tgt: funnelSteps.find(s => s.key === 'inquiries')?.value || 0 },
          { label: 'Calls', cur: demo.calls, tgt: funnelSteps.find(s => s.key === 'calls')?.value || 0 },
          { label: 'Closed', cur: demo.closed, tgt: customers },
        ]
      : [
          { label: 'Visits', cur: demo.visits, tgt: visitsNeeded },
          { label: 'Signups', cur: demo.signups, tgt: funnelSteps.find(s => s.key === 'signups')?.value || 0 },
          { label: 'Activated', cur: demo.activated, tgt: funnelSteps.find(s => s.key === 'activated')?.value || 0 },
          { label: 'Paying', cur: demo.paying, tgt: customers },
        ]

    return (
      <Page><div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', marginBottom: 16 }}>
          Dashboard widget · Day {demo.daysIn} of {timeframe} · {bizType === 'product' ? 'Product' : 'Service'} funnel
        </div>

        {/* THE CARD */}
        <div style={{
          borderRadius: 24, overflow: 'hidden',
          background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 40%, #40916C 100%)',
          padding: 28,
          boxShadow: `0 12px 48px ${C.green}30`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%',
            background: `radial-gradient(circle, ${C.greenGlow}30 0%, transparent 70%)`,
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>PULSE</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                  {demoPaying} / {customers}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  {bizType === 'product' ? 'paying customers' : 'closed deals'}
                </div>
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

            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
              {miniBoxes.map(m => (
                <div key={m.label} style={{
                  padding: '10px 8px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{m.cur}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>/ {m.tgt}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{m.label}</div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 14,
              background: 'rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Today's target</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{dailyVisits} visits</div>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                Outpulse sending · LinkedIn active
              </div>
            </div>
          </div>
        </div>

        {/* Statistical warning — only shown when visits < 200 */}
        {demo.visits < 200 && (
          <div style={{
            marginTop: 16, padding: 14, borderRadius: 14,
            background: C.warnPale, border: `1px solid ${C.warn}20`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18,
              background: C.card, border: `2px solid ${C.warn}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="10" width="3" height="4" rx="0.5" fill={C.warn} opacity="0.4"/>
                <rect x="6.5" y="7" width="3" height="7" rx="0.5" fill={C.warn} opacity="0.6"/>
                <rect x="11" y="3" width="3" height="11" rx="0.5" fill={C.warn} opacity="0.3"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.warn }}>
                Warming up · {demo.visits} of 200 visits
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>
                Conversion rates are estimates until you reach ~200 visits
              </div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 20,
              background: `conic-gradient(${C.warn} ${Math.round(demo.visits / 200 * 360)}deg, ${C.border} 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 16, background: C.warnPale,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: C.warn,
              }}>{Math.round(demo.visits / 200 * 100)}%</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <Btn onClick={() => setScreen('plan')}>← Plan</Btn>
          <Btn onClick={() => setScreen('email')} style={{ flex: 1 }}>Daily email preview</Btn>
          <Btn onClick={() => setScreen('home')}>Home</Btn>
        </div>
      </div></Page>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // DAILY EMAIL
  // ═══════════════════════════════════════════════════════════
  if (screen === 'email') {
    const onTrack = demoPaying >= (customers * demo.daysIn / timeframe)
    const behindMetric = (() => {
      if (bizType === 'product') {
        const visitPct = visitsNeeded > 0 ? demo.visits / visitsNeeded : 0
        const signupPct = (funnelSteps.find(s => s.key === 'signups')?.value || 1)
        const signupRatio = demo.signups / signupPct
        if (visitPct < signupRatio) return 'visits'
        if (signupRatio < 0.3) return 'signups'
        return 'activation'
      } else {
        return 'replies'
      }
    })()

    const adviceMap = {
      visits: {
        title: 'Traffic is below target',
        tips: [
          'Share a LinkedIn post about your latest feature or client win',
          'Submit to 2-3 relevant directories (Product Hunt, G2, Capterra)',
          'Ask Outpulse to increase cold outreach volume by 20%',
          'Consider a guest post on a relevant industry blog',
        ],
      },
      signups: {
        title: 'Visitors aren\'t converting to signups',
        tips: [
          'Review your landing page — is the value prop clear above the fold?',
          'Add social proof (testimonials, client logos, user count)',
          'Simplify the signup flow — reduce fields to email only',
          'Try a different CTA: "Start free" often outperforms "Sign up"',
        ],
      },
      activation: {
        title: 'Signups aren\'t activating',
        tips: [
          'Improve your welcome email — send within 1 minute of signup',
          'Reduce steps to first value — what\'s the quickest win?',
          'Add an onboarding checklist (like the one in Outpulse)',
          'Consider a personal outreach to inactive signups',
        ],
      },
      replies: {
        title: 'Reply rate is below target',
        tips: [
          'A/B test subject lines — shorter often works better',
          'Personalize the opening line with company-specific detail',
          'Try different send times (Tuesday-Thursday, 8-10 AM)',
          'Review your call-to-action — ask a question, don\'t pitch',
        ],
      },
    }

    const advice = onTrack ? null : adviceMap[behindMetric]

    const emailMetrics = bizType === 'service'
      ? [
          { label: 'Visits', val: demo.visits, tgt: visitsNeeded },
          { label: 'Inquiries', val: demo.inquiries, tgt: funnelSteps.find(s => s.key === 'inquiries')?.value || 0 },
          { label: 'Calls', val: demo.calls, tgt: funnelSteps.find(s => s.key === 'calls')?.value || 0 },
          { label: 'Closed', val: demo.closed, tgt: customers },
        ]
      : [
          { label: 'Visits', val: demo.visits, tgt: visitsNeeded },
          { label: 'Signups', val: demo.signups, tgt: funnelSteps.find(s => s.key === 'signups')?.value || 0 },
          { label: 'Activated', val: demo.activated, tgt: funnelSteps.find(s => s.key === 'activated')?.value || 0 },
          { label: 'Paying', val: demo.paying, tgt: customers },
        ]

    return (
      <Page><div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', marginBottom: 16 }}>
          Daily morning email · {bizType === 'product' ? 'Product' : 'Service'} funnel · {onTrack ? 'On track' : 'Behind'} scenario
        </div>

        <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.card }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, background: '#FAFAF7' }}>
            <div style={{ fontSize: 11, color: C.muted }}>From: Outpulse Pulse &lt;pulse@outpulse.ai&gt;</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginTop: 6 }}>
              Day {demo.daysIn}: {demoPaying} {bizType === 'product' ? 'paying customers' : 'closed deals'} ({progressPct}% to goal)
            </div>
          </div>

          <div style={{ padding: 24 }}>
            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: '0 0 20px' }}>
              Good morning{bizName ? `, ${bizName} team` : ''}! Here's your Pulse update.
            </p>

            {/* Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {emailMetrics.map(m => {
                const pct = m.tgt > 0 ? Math.round((m.val / m.tgt) * 100) : 0
                return (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: 4, flexShrink: 0,
                      background: pct >= 40 ? C.green : pct >= 20 ? C.accent : C.warn,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 13, color: C.text }}>{m.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{m.val} / {m.tgt}</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: C.border }}>
                        <div style={{ height: 4, borderRadius: 2, background: C.green, width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Outpulse activity */}
            <div style={{ padding: 16, borderRadius: 12, background: C.greenPale, border: `1px solid ${C.green}15`, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 8 }}>Outpulse activity yesterday</div>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
                📧 127 emails sent → 9 link clicks<br/>
                💬 3 replies received (2 positive)<br/>
                🔗 45 LinkedIn profile views driven
              </div>
            </div>

            {/* Adaptive advice */}
            {onTrack ? (
              <div style={{ padding: 16, borderRadius: 12, background: C.greenPale, border: `1px solid ${C.green}15` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 6 }}>
                  ✓ You're on track
                </div>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: 0 }}>
                  Keep the momentum going. Your campaigns are performing well.
                  At this pace, you'll hit your goal by day {Math.ceil(timeframe * (demoPaying / customers) / (demo.daysIn / timeframe))}.
                </p>
              </div>
            ) : (
              <div style={{ padding: 16, borderRadius: 12, background: C.warnPale, border: `1px solid ${C.warn}20` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.warn, marginBottom: 8 }}>
                  ⚠️ {advice?.title}
                </div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
                  {advice?.tips.map((tip, i) => (
                    <div key={i} style={{ marginBottom: 4 }}>→ {tip}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <Btn onClick={() => setScreen('dashboard')}>← Dashboard</Btn>
          <Btn onClick={() => setScreen('home')} style={{ flex: 1 }}>Home</Btn>
        </div>
      </div></Page>
    )
  }

  return null
}

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════
function Page({ children }) {
  return <div style={st.page}>{children}</div>
}

function PulseLogo() {
  return (
    <div style={{
      width: 64, height: 64, borderRadius: 20, margin: '0 auto 20px',
      background: `linear-gradient(135deg, ${C.greenLight}, ${C.green})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 8px 32px ${C.green}40`,
    }}>
      <span style={{ fontSize: 28, color: '#fff', fontWeight: 800 }}>◎</span>
    </div>
  )
}

function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 18, height: 18, borderRadius: 9,
          background: C.border, color: C.muted,
          fontSize: 11, fontWeight: 700, cursor: 'pointer',
          border: `1px solid ${C.border}`,
        }}
      >i</span>
      {open && (
        <div style={{
          position: 'absolute', top: 26, left: -120, width: 280,
          padding: 16, borderRadius: 12, background: C.card,
          border: `1px solid ${C.border}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          zIndex: 100, fontSize: 12, color: C.text, lineHeight: 1.6,
        }}>
          {text}
          <div style={{ marginTop: 8, fontSize: 11, color: C.muted, fontStyle: 'italic' }}>
            Click to close
          </div>
        </div>
      )}
    </span>
  )
}

function QuestionReveal({ question, children, defaultOpen = false, variant = 'default' }) {
  const [open, setOpen] = useState(defaultOpen)
  const isNeutral = variant === 'neutral'
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${isNeutral ? C.border : (open ? C.green + '25' : C.border)}`,
      background: isNeutral ? C.card : (open ? C.greenPale : C.card),
      transition: 'all 0.2s ease',
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', cursor: 'pointer',
        }}
      >
        <span style={{
          fontSize: 14, color: isNeutral ? C.muted : (open ? C.green : C.muted),
          transition: 'transform 0.2s ease',
          display: 'inline-block',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          flexShrink: 0,
        }}>›</span>
        <span style={{
          fontSize: 13, fontWeight: 500,
          color: isNeutral ? C.text : (open ? C.green : C.text),
          flex: 1, lineHeight: 1.4,
        }}>{question}</span>
      </div>
      {open && (
        <div style={{
          padding: '0 16px 14px 38px',
          fontSize: 12, color: C.text, lineHeight: 1.6,
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

function TierRow({ tier, isActive }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
          background: isActive ? C.greenPale : 'transparent',
          border: isActive ? `1px solid ${C.green}30` : '1px solid transparent',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{
          width: 8, height: 8, borderRadius: 4,
          background: isActive ? C.green : C.border,
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: 13, fontWeight: isActive ? 700 : 500,
          color: isActive ? C.green : C.text, flex: 1,
        }}>{tier.range}</span>
        <span style={{
          fontSize: 12, color: isActive ? C.green : C.muted,
        }}>{tier.label}</span>
        <span style={{
          fontSize: 11, color: C.muted, marginLeft: 4,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}>▾</span>
      </div>
      {expanded && (
        <div style={{
          padding: '8px 14px 12px 32px',
          fontSize: 12, color: C.muted, lineHeight: 1.6,
        }}>
          {tier.education}
          <div style={{ marginTop: 4, fontSize: 11, fontStyle: 'italic', color: C.accent }}>
            e.g. {tier.example}
          </div>
        </div>
      )}
    </div>
  )
}

function SetupShell({ step, total, children }) {
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px' }}>
      <Dots current={step} total={total} />
      {children}
    </div>
  )
}

function Dots({ current, total }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 24 : 8, height: 8, borderRadius: 4,
          background: i <= current ? C.green : C.border,
          transition: 'all 0.3s ease',
        }} />
      ))}
    </div>
  )
}

function TypeCard({ selected, onClick, icon, title, desc, funnel }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: 20, borderRadius: 16, textAlign: 'left', cursor: 'pointer',
      background: selected ? C.greenPale : C.card,
      border: `2px solid ${selected ? C.green : C.border}`,
      transition: 'all 0.2s ease',
    }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 10 }}>{desc}</div>
      <div style={{
        fontSize: 10, fontWeight: 600, color: C.green,
        padding: '4px 8px', borderRadius: 6, background: 'rgba(45,106,79,0.08)',
        display: 'inline-block',
      }}>{funnel}</div>
    </button>
  )
}

function Field({ label, placeholder, type = 'text', value, onChange }) {
  return (
    <div style={{ marginTop: 12 }}>
      <label style={st.label}>{label}</label>
      <input style={st.input} type={type} placeholder={placeholder}
        value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

function ConvRow({ label, hint, value, onChange }) {
  return (
    <div style={{ padding: 14, borderRadius: 14, background: C.card, border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="number" value={value}
            onChange={e => onChange(Math.max(0, Math.min(100, Number(e.target.value))))}
            style={{
              width: 56, padding: '4px 8px', fontSize: 16, fontWeight: 700,
              color: C.green, textAlign: 'right', border: `1px solid ${C.border}`,
              borderRadius: 8, outline: 'none', background: C.greenPale,
            }} />
          <span style={{ fontSize: 14, color: C.muted }}>%</span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.accent }}>{hint}</div>
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

const st = {
  page: { minHeight: '100vh', background: C.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  title: { fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 6px' },
  subtitle: { fontSize: 14, color: C.muted, margin: '0 0 16px', lineHeight: 1.5 },
  label: { fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 },
  input: { width: '100%', padding: '12px 16px', fontSize: 16, border: `1px solid ${C.border}`, borderRadius: 12, outline: 'none', background: '#FAFAF7', boxSizing: 'border-box' },
  toggleBtn: { padding: '10px 16px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, fontSize: 13, fontWeight: 500, color: C.muted, cursor: 'pointer' },
  toggleActive: { background: C.greenPale, borderColor: `${C.green}40`, color: C.green, fontWeight: 700 },
  sectionLabel: { fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
}
