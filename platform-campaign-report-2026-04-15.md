# Platform Campaign Daily Report — 2026-04-15

**Status:** ⚠️ Unable to fetch live metrics

## What happened
The scheduled tracker tried to query the Outpulse Supabase database
(`aqxyrggzddxmahuqjgpa.supabase.co`) but the sandbox proxy blocked the
request (`403 blocked-by-allowlist`). No campaign/prospect/reply data
could be pulled this run.

## What's needed to unblock
- Allowlist the Supabase host in the scheduled-task sandbox, **or**
- Provide a server-side export endpoint (e.g. a Next.js API route on the
  Outpulse app returning JSON metrics) that the task can fetch, **or**
- Add a Supabase MCP connector so the task can query via tools instead
  of raw HTTP.

The anon key alone (what's in `.env.local`) also wouldn't return
campaign rows if RLS is enabled — a service-role key or a signed-in
session would be needed. A dedicated read-only RPC (e.g.
`get_campaign_stats(user_email)`) is the cleanest fix.

## Targets (for reference when data is available)
- Open rate > 50%
- Reply rate > 5%
- Positive reply rate > 2%
- Bounce rate < 3%
- 3-step sequence: Day 0 / Day 3 / Day 7
- First batch: 50 prospects, warmup 15→30→full

## Next action
Pick one of the three unblock paths above; re-run the task once the
data source is reachable.
