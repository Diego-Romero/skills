# Ledger measurement contract

The ledger measures the cost, time and outcome of task work so we can identify waste and evaluate changes to the process. Record a measured run history, with breakdowns by phase and agent/session. Task recovery state lives separately in [progress.md](progress.md).

This is the contract for the recorder we will build. The draft does not yet collect runtime usage, calculate prices or enforce event writes. Do not claim those measurements are available merely because this reference exists.

## Units of measurement

- **Task:** the stable unit of work, identified by a tracker reference or local identifier.
- **Run:** one execution of the task workflow, identified independently of its ticket. Retries, repairs and session resumptions remain part of the same run. A deliberate fresh attempt or comparison creates a new run; retain the earlier one.
- **Phase visit:** one visit to a phase. Returning from review to execution creates another visit, preserving the earlier visit's duration and usage.
- **Agent/session:** the main session, a worker or a separate session, with its own identifier and parent relationship. One run can span several sessions; one session can contain work outside the run.

Attribute records to the task, run, session and phase visit where the source supports it. Retain unattributed usage explicitly instead of assigning it to the nearest plausible phase. Link delegated work to its dispatch and parent; overlapping timestamps alone are insufficient to distinguish concurrent work.

## What to record

| Record | Required meaning |
| --- | --- |
| Run identity | Task/run identifiers, repository and relevant revision, start/end or open-run state. |
| Session identity | Session and parent identifiers; execution environment and actual model/reasoning settings when observable. Recording settings does not select them. |
| Workflow identity | Skill revisions, selected/skipped phases, agreed endpoint and material changes to scope. |
| Time | Phase/session/run boundaries and explicit wait intervals, with source timestamps. |
| Usage | Available input, output and cache counters, their original field names, source and measurement boundaries. |
| Cost | Reported cost or a derived estimate, currency, basis, pricing source/date and coverage. |
| Rework | Implementation attempts, repair/review rounds, repeated checks, outcome and reason for repetition. |
| Outcome | Completed, blocked, abandoned or still running; verification evidence and unresolved limitations. |
| Coverage | Which data is complete, partial or unavailable, with collection and attribution limitations. |

Identify the work category and relevant scope so comparisons do not imply that unrelated tasks are equivalent. Record the final revision and outcome alongside cost; cheap work that failed its acceptance criteria is not a successful efficiency result.

For review visits, link the selected procedure and its source, reviewer identity when observable, reviewed spec/base/head or patch hash, source run/request identifiers and actual completion/coverage. Retain finding dispositions, repair revisions, repeated checks and follow-up review ranges so cost/time can be compared with substantive defects found and addressed. A local tool or hosted reviewer with unavailable usage remains unpriced rather than inheriting the main session's counters.

## Division of responsibility

**The driver records workflow events:** run/session start and finish, phase entry/exit, worker dispatch/result, approval requested/received, waits started/ended, skipped phases, scope changes, attempts and verification outcomes. A resumed run appends a new session record. A rejected or cancelled request closes its wait without claiming approval.

**A recorder reads runtime measurements:** request identifiers, usage counters, timestamps and reported cost where the execution environment exposes them. Each environment needs an adapter that preserves the source's semantics and declares its limitations. An unsupported source produces unavailable measurements, not guessed values.

The driver never estimates tokens from prose length or asks a worker to invent its consumption. Avoid extra model calls for bookkeeping. Workers return focused reports; runtime usage is collected independently.

Keep one writer for each stream: the driver owns workflow events; the recorder owns imported usage. Workers do not append to the driver's stream. The recorder will need safe creation/append behavior and ownership protection; prose instructions alone do not enforce them.

## Time accounting

- Preserve actual UTC boundaries and timestamp precision. Keep an unfinished interval open; do not invent an end time after interruption.
- Report run wall time from its boundaries. Distinguish explicitly recorded pauses and waits for human decisions, CI or other services from work performed by agents.
- Record session elapsed time separately. The sum of parallel session durations is aggregate session time, not task wall time or active reasoning time.
- Waits can overlap with useful work or with each other. Use interval unions when calculating their contribution to wall time; do not add overlapping durations or subtract every wait from the whole run.
- Call time based on runtime activity active time only when the source measures it. Gaps between messages do not prove human wait, idle time or active reasoning.
- Separate phase wall time, worker elapsed time and usage attribution. Explain the rule used for work spanning a phase boundary; keep ambiguity visible.
- Recorded activity intervals can distinguish investigation, discussion and spec writing within the driver's planning step without requiring separate skills. Record implementation as its own phase visit even though it also lives in task-driver. Keep an activity unclassified when it was not observed; do not infer it from message gaps.

## Token accounting

Preserve raw usage before normalizing it. Document whether a source's input count includes cached tokens, whether cache reads/writes are separate categories, and whether each record is a delta or cumulative counter.

Deduplicate repeated/streamed records using stable source identifiers and retain the final usage values where appropriate. Cumulative session totals and their individual requests are alternative views, not quantities to add together. A parent session's total may already include workers; verify that before aggregating them.

Count each underlying request once. Reconcile run totals against phase/session breakdowns, keeping unattributed usage and known gaps visible. Reprocessing the same source must not increase totals.

Missing counters remain unknown. A zero is valid only when the source establishes zero. Record truncated output counters, missing sessions or other partial capture in the coverage report.

## Cost accounting

Prefer a source-reported cost when its scope and meaning are known; preserve that meaning. Otherwise calculate an estimate from supported usage categories and an identified pricing snapshot. Store currency, rates, source/date and any unsupported categories with the estimate. Unknown rates remain unpriced.

Distinguish billed amounts, runtime-reported estimates and token-priced estimates. Token-priced API-equivalent cost is not necessarily subscription spend or a final invoice. Preserve the original pricing basis when rebuilding a historical report; a new pricing scenario is a separate estimate.

When only part of the usage can be priced, report the priced subtotal and unpriced coverage. Do not present it as a complete run cost. A floor estimate or incomplete capture must remain labelled as such.

## Storage and retention

For the first local version, group measurements under `<main checkout>/.plans/<TASK>/runs/<RUN>/`, outside the task worktree. Retain repository equivalents when already established. Keep run records distinct from the task's `progress.md`, plan and implementation reports.

The run bundle logically contains metadata, append-only workflow events, source usage evidence or durable references, and derived reports. Choose the encoding and exact schemas when implementing the recorder; the measurement semantics above are the contract. Keep existing historical recordings in place unless explicitly migrating them.

Preserve source evidence and correction history. Derived summaries can be rebuilt; they are not a second manually maintained source of measurements. Retain the run after worktree cleanup. Recording blocked and abandoned runs matters as much as recording successful ones.

Local Git-ignored storage does not provide cross-machine sharing or backup. A team runner will need an explicit export/shared-retention mechanism. Do not automatically upload raw session transcripts or unrelated private conversation data. Retain the minimal measurement evidence needed and never copy credentials into records.

## Reports and interpretation

Produce a run summary, phase breakdown and session/agent breakdown with time, usage, cost basis, coverage and outcome. Include the main session's consumption and repair/check repetitions so coordination overhead and rework are visible.

Use comparable tasks and verified outcomes when judging a skill change. Report the configuration and skill revision, number of runs, scope differences and limitations. A single cheaper run does not establish that a workflow change improved efficiency.

Useful questions include where time is spent waiting, whether planning reduces repairs, how much the main session consumes, which review rounds find substantive defects, and which repeated checks add evidence. These are analyses of recorded data, not fields the agent should guess.

## Recorder acceptance criteria

Before calling the ledger operational, verify that:

- A run with a parent, parallel workers and a return to an earlier phase is attributed without duplicate usage or wall time.
- Importing the same source twice leaves totals unchanged, including repeated streamed messages and cumulative counters.
- A restarted session resumes the run without erasing prior measurements; unfinished and abandoned work remain represented.
- Missing usage, cache semantics or prices remain explicit and do not silently become zero or full-cost claims.
- Reports reconcile totals with breakdowns and disclose unassigned usage and overlapping waits.
- Data from each supported execution environment is checked against its own runtime evidence.

The existing Ventura recorder is a reference implementation to inspect, not a compatible collector by assumption. Its transcript format, cached price table and documented output-token limitations must be addressed when adapting it.
