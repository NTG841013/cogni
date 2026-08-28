# PostHog Self-driving Setup Report

*Generated 2026-08-27 for project Cogni (id: 254614)*

## Summary

PostHog Self-driving has been configured for Cogni: Session Replay, Error Tracking, and Support products are enabled; six signal sources are wired to the inbox; a six-scout troop (four canonical + two Cogni-specific custom scouts) is active; and two Replay Vision scanners are armed to push session-level breakage and frustration findings into the inbox. Findings will start appearing in the [Self-driving inbox](https://eu.posthog.com/project/254614/inbox) within approximately 30 minutes.

---

## AI data processing

**Approved.** Organization-level AI data processing consent was granted before this run started.

---

## GitHub

**Connected during this run.** Integration id: 80680 (account: NTG841013). Self-driving can now research findings against the Cogni repository and open draft fix PRs.

---

## Products enabled

| Product | Result |
|---|---|
| Session Replay | **enabled** |
| Error Tracking | **enabled** |
| Support (Conversations) | **enabled** |

The `posthog.init` in `web/instrumentation-client.ts` was checked — no `disable_session_recording` or `capture_exceptions: false` overrides are present. The server-side flips take effect immediately.

**Support note:** Conversations is enabled but tickets only arrive once an inbound channel (email / inbox / Slack) is connected. See follow-ups.

---

## Signal sources

| Source product | Source type | Action |
|---|---|---|
| `signals_scout` | `cross_source_issue` | **On by default** — no row needed |
| `health_checks` | `health_issue` | **Enabled** (id: 01a044ce-fb6b-74b2-9d42-fa6205ab3d42) |
| `error_tracking` | `issue_created` | **Enabled** (id: 01a044cf-00ec-72b4-a582-7b7c2746dd4d) |
| `error_tracking` | `issue_reopened` | **Enabled** (id: 01a044cf-03ea-71e7-9848-275dcae000cd) |
| `error_tracking` | `issue_spiking` | **Enabled** (id: 01a044cf-0661-7ac8-aeae-bddc0a7b12de) |
| `session_replay` | `session_analysis_cluster` | **Enabled** (id: 01a044cf-0c4c-73ae-8bb9-b70fda6382cc, sample_rate: 0.1) |
| `conversations` | `ticket` | **Enabled** (id: 01a044cf-0e3a-780f-8faa-4b9b49f86ce1) |
| `llm_analytics` | — | Skipped — internal only, not a user-facing responder |
| `logs` | — | Skipped — not a v1 responder |
| `replay_vision` | — | Skipped — self-authorizing via scanner `emits_signals` flag (step 6c) |

---

## Connected tools

No connected-tool sources were selected. All external tool integrations (GitHub Issues, Linear, Jira, Sentry, Zendesk, etc.) were skipped — not used.

---

## Scout troop

**Run budget:** 100 runs/day (published early-access default; `scout-metadata-get` confirmed this figure). 0 runs used today. Announcement: *"Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."*

**6 enabled, 23 disabled.**

### Enabled scouts

| Scout | Why enabled |
|---|---|
| `general` | Always on — cross-product correlations and surfaces no specialist covers |
| `product-analytics` | 6 explicit `posthog.capture()` calls in code (`course_started`, `course_card_clicked`, etc.) |
| `web-analytics` | Next.js web app; `posthog-js` auto-captures `$pageview` for learner traffic |
| `web-vitals` | `posthog-js` auto-captures `$web_vitals`; important for learner experience on lesson/course pages |
| `cogni-catalog-conversion` | **Custom.** Watches `course_card_clicked` → `course_started` conversion rate. No built-in scout covers event-level funnel conversion without saved insights. |
| `cogni-learner-retention` | **Custom.** Watches `course_continued` relative to `course_started` for return-rate drops. Covers the learner re-engagement surface no canonical scout watches. |

### Disabled scouts (notable)

| Scout | Reason |
|---|---|
| `error-tracking` | Covered by the native `error_tracking` signal source (step 4) — duplicating it adds noise |
| `session-replay` | Covered by the native `session_replay` signal source (step 4) — duplicating it adds noise |
| `feature-flags` | No feature flags in use — enable later if flags are adopted |
| `experiments` | No A/B experiments running — enable when experiments start |
| `surveys` | No surveys in use |
| `ai-observability` | No LLM/`$ai_*` usage detected |
| `revenue-analytics` | No payment SDK found |
| `csp-violations` | No CSP reporting configured |
| All others | Surface not in use or not applicable to current project state |

To enable any disabled scout later, go to PostHog → Self-driving → Scouts and toggle it on.

---

## Custom scouts

### Gap analysis

Surfaces considered and their outcome:

| Surface | Decision | Filter that decided it |
|---|---|---|
| Catalog-to-enrollment conversion | **Created** | Events confirmed in code; product-analytics needs saved funnels (none yet) |
| Learner re-engagement (return rate) | **Created** | Events confirmed in code; no built-in covers course_continued vs course_started |
| Search quality (`search_performed`) | Ruled out | Event not yet instrumented — scout would be dead on arrival |
| Lesson completion funnel | Ruled out | `lesson_completed` event not yet in code |
| Video engagement depth | Ruled out | Video play events not instrumented yet |
| Auth conversion (sign-up → start) | Ruled out | Clerk auth events not clearly watchable in PostHog event stream |

### Created scouts

**`signals-scout-cogni-catalog-conversion`**
- Surface: `course_card_clicked` → `course_started` conversion rate
- Discriminator: ratio drops >20% relative to prior 7d while click volume holds → CTA, pricing, or layout issue
- Explore patterns: 14-day trend query, per-course breakdown, bookmarks vs starts
- Not covered by built-ins because `product-analytics` only reads saved funnel insights (none exist yet); `web-analytics` watches page traffic, not event conversion
- Noise escape hatch: set `emit: false` on its config in PostHog to switch to dry-run

**`signals-scout-cogni-learner-retention`**
- Surface: `course_continued` events relative to recent `course_started` events
- Discriminator: return rate drops >25% vs prior 14d average when starters are ≥10 distinct users → learners not coming back
- Explore patterns: weekly return rate trend (28d), per-course return breakdown, distinct-user return rate
- Not covered by built-ins for the same reason — no saved retention insights yet; `general` won't have the domain vocabulary to catch this specifically
- Noise escape hatch: set `emit: false` on its config in PostHog to switch to dry-run

---

## Replay Vision scanners

Replay Vision is an LLM that watches individual session recordings on a schedule and pushes what it finds to the Self-driving inbox. Findings arrive at half weight; a report is promoted when corroborated (half weight + half weight = full). The sizing skill (`creating-replay-vision-scanners`) was not available on this deploy — spend was not verified, but both briefs are deliberately small (scoped query + 0.5 sampling rate for breakage, rage-click gate for frustration) so projected spend is a small fraction of the typical budget.

No recordings exist yet. Both scanners are armed and start working the day recordings begin, with no second setup.

| Scanner | Type | What it watches | Query scope | Sampling | `emits_signals` | Status |
|---|---|---|---|---|---|---|
| Lesson and course page loading failures | monitor | Video embeds that don't load, blank lesson pages, unresponsive CTAs, empty catalogs | Sessions on any `/courses/` URL | 0.5 | true | **Created** (id: 01a044dd-5646-7088-a482-d5d9dc460cdf) |
| Learner course navigation frustration | monitor | Rage-clicking course cards, hammering Start/Continue buttons, stuck module accordions | Sessions with `$rageclick` events | 1.0 | true | **Created** (id: 01a044dd-6131-7055-9ce1-773d7430da5c) |

---

## Follow-ups

- [ ] **Connect a Conversations inbound channel.** Support tickets only reach the inbox once an email, inbox, or Slack channel is connected. Go to PostHog → Support to add one.
- [ ] **Add a `lesson_completed` capture event.** Once learners can complete lessons, instrument it so the `cogni-catalog-conversion` and `cogni-learner-retention` scouts have richer data to work with — and so a dedicated lesson completion funnel scout becomes viable.
- [ ] **Instrument search events.** When the search feature ships, add `posthog.capture("search_performed", { query, result_count })`. This will unlock a search quality custom scout.
- [ ] **Verify spend after first recordings arrive.** Run `vision-scanners-estimate-create` + `vision-quota-retrieve` once sessions are flowing to confirm the scanner credit spend is within budget.
- [ ] **Consider connected issue trackers.** If the team adopts Linear, Jira, GitHub Issues, or Sentry, re-run the connected-tools step to wire them into the inbox.

---

## What happens next

The scout coordinator picks up fresh configs within ~30 minutes. Scout runs draw from the project's daily budget (100 runs/day during early access). Findings cluster into reports in the inbox. Immediately-actionable reports can start coding tasks from the inbox at [https://eu.posthog.com/project/254614/inbox](https://eu.posthog.com/project/254614/inbox).
