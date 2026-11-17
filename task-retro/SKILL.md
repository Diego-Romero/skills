---
name: task-retro
description: Finish a reviewed task by offering an optional retrospective before merge, then verifying the outcome, performing authorized integration and cleaning up safely. Accepted retrospectives use Matt Pocock's analysis, ledger evidence and our optimize-for-agents guidance process. Explicit retrospective-only requests remain analysis-only.
metadata:
  status: draft
---

# Task retro

<!-- Adapted from mattpocock/skills (MIT), revision 5863806dd4e15c63174bee4e7515a4256792ecfa. Run/ledger integration and verified closure/cleanup are local additions documented in references/process-basis.md. -->

Task-driver enters this final step automatically when the required code-review process completes. Offer the retrospective before merge; running it is optional. Final verification and authorized closure continue when it is declined. This skill owns both reflection and task cleanup; there is no separate close-task skill. Keep implementation and any approved repairs in the main session, under the user's selected settings.

## Offer the retrospective before merge

Briefly explain the potential value in terms of this run: find repeated investigation or avoidable review repairs, improve instructions/tools/checks for future tasks, and use available time/token/cost evidence to identify efficiency experiments. Accepted improvements can be included in the current PR before merge, avoiding a separate follow-up PR when their scope fits. Describe these as potential benefits, not guaranteed savings.

Ask whether the user wants that retrospective before merging or prefers to proceed to closure without it. Honor an existing choice or standing preference without asking again; an explicit retrospective-only request already selects it. Offer once per run rather than again after every repair. While awaiting a choice, prepare independent closure evidence, but do not start the retrospective or merge past this decision. Silence is neither acceptance nor a decline.

If accepted, run the analysis and discuss improvements below before integration. If declined or previously excluded, record that choice and skip retrospective analysis, candidate generation and its documentation work. Continue final verification, authorized integration and safe cleanup; declining the retro does not waive required checks or authorize removing an unmerged workspace. Preserve the ledger and its coverage either way.

## Establish scope and retain the evidence

Receive the task/run identifier, main checkout, task worktree/branch, approved spec, agreed endpoint, review/check reports, PR and applicable authorization. Read the project's closure, integration and cleanup conventions and relevant instructions before acting. A standalone retrospective-only request authorizes analysis and a report, not code edits, publishing, merging or workspace removal. Preserve any explicitly narrower endpoint.

For an accepted retrospective, locate the run's primary session records, associated workers/tool reports, progress, spec decisions and review findings/dispositions. Include the relevant sessions of a resumed run rather than only the last conversation. Keep unrelated session activity and missing evidence explicit. When no task/session is supplied, use the current session, as Matt does.

Choose the report's durable location before cleanup: use the caller's artifact directory or repository convention, otherwise `<main checkout>/.plans/<TASK>/runs/<RUN>/close.md`, with retrospective and closure sections in one report. If declined, record the skip instead of inventing retrospective findings. A standalone session can use the project's existing artifact location. Link this report from progress rather than keeping competing copies. Preserve task-owned source notes and measurement evidence outside any worktree that may be removed.

## Run the accepted retrospective

Follow the bundled [Matt retro procedure](references/mattpocock/retro.md), replacing its first-step writing-for-agents call with our [optimize-for-agents guidance process](../optimize-for-agents/SKILL.md). Keep Matt's session analysis and improvement criteria. For agent-facing documentation candidates, read our layout principles, “Refine and activate the agreed guidance” and “Check the result” sections; load their supporting references only as needed. Do not load Matt's writing-for-agents dependency as another required step.

This reuse is scoped to the task's observed documentation gaps and approved improvements. Use the existing task worktree and PR; do not start optimize-for-agents' full repository audit, detached worktree, HTML proposal or optional evaluation as part of every retro. A broader reorganization can be proposed as a separate task. Before a project port, make this dependency available and check its relative link; report missing guidance rather than silently claiming the process was followed.

Preserve Matt's focus on improving the coding agent's environment and his improvement categories and criteria. Inspect the actual instructions, tools, check commands and CI wiring behind a candidate before recommending another mechanism. Keep mechanical failures in deterministic checks, judgment in reviewer standards, and root agent guidance focused on useful navigation. Use our guidance process for proposed agent-facing documentation: existing homes and direct pointers, evidence-backed patterns and relevant variants/tests, maintainer-reviewed drafts, and verified discovery.

Present evidence-backed candidates ordered by severity. For each, identify the observed problem, supporting session/review evidence, proposed change and owning artifact/tool/check, and how we could verify it helped. Distinguish a verified failure from a possible explanation or experiment. An empty candidate list is valid; do not manufacture instructions or changes to satisfy a lesson quota.

## Use the ledger to assess efficiency

Read the run's measured summaries and source coverage under the [ledger contract](../task-driver/references/ledger.md). Use available wall/wait intervals, session/worker usage, the baseline and project review stages, repair rounds and repeated investigations/checks to support the observations. Keep raw counter semantics and cost basis intact; missing attribution or prices remain unknown.

Separate observations, explanations and proposed experiments. A gap between messages does not establish idle time or human wait; overlapping worker durations do not add up to task wall time; a large session counter does not identify one expensive tool. Compare similar scope and verified outcomes before claiming that a process change improved efficiency.

State the measurement cutoff and coverage in the report. Retrospective measurements are provisional while integration, cleanup or the current session is still running. Capture this skill's own observed overhead too; the driver/recorder can refresh the derived totals later without rewriting the evidence or inventing final consumption.

## Discuss improvements and prepare closure

Present the candidates and concrete task outcome to the user. Record accepted, rejected, deferred or pending decisions with their reasons. Default to recommendations, matching Matt; a proposed change does not authorize edits to shared instructions, global configuration, tools or model settings. Honor existing authorization for an improvement rather than requesting it again.

For an authorized improvement that changes task code, behavior, tooling or shared guidance, return the scoped change through implementation in the current task branch/PR and affected verification/review before integration. Resume this same closing record afterwards, retaining earlier decisions; do not repeat the offer or entire retro, or propose an already decided change without new evidence. Defer improvements that do not fit the agreed task rather than expanding the PR by default. The code-review rule for automatic high/medium repairs does not by itself authorize every retro idea.

Keep nonblocking improvement candidates visible without treating each as a new approval gate. Resolve actual product/scope decisions, required blockers or an explicit user request to hold before proceeding. A paused discussion or missing authorization is not approval through silence or elapsed time.

## Verify the agreed endpoint and integrate when authorized

Reconcile actual repository and remote state for the candidate revision. Confirm the intended changes/spec, accepted findings and dispositions, required reviewer/human approvals, relevant CI/local checks and any agreed manual verification. Preserve the difference between a completed automated review, green CI and the user's acceptance. Later code or guidance changes can invalidate earlier evidence; refresh the affected checks/reviews instead of relying on a stale green result.

Prepare a concise closure summary containing the exact branch/PR and revision, outcome evidence, remaining findings/follow-ups, retrospective decision and any recommendations, and available measurements. Resolve the retrospective choice and any accepted changes before integration. If merge/integration authorization already covers the action, proceed under the repository's strategy. Otherwise present this concrete result and request only the missing final decision. Starting task-retro, accepting its analysis or approving the spec does not itself authorize merge.

Immediately before integration, verify that the current head and target still match the evidence and scope of authorization. Reconcile a changed head or concurrent work rather than overwriting it. Use the project's documented merge/integration mechanism and required controls. Verify the actual result through its receipt and resulting repository/remote state; a submitted request is not a verified merge.

For an explicitly reviewed-PR or retrospective-only endpoint, report that actual state without treating it as a merge. Preserve a workspace needed for ongoing PR feedback or later work. If a required check, approval or action is blocked, retain the work and report the specific next action; do not bypass the requirement to produce a completed label.

## Clean up safely and return

After verified integration, preserve the report, spec approval evidence, progress, session/review references, measurements and unique task files before removing the task workspace. Inspect uncommitted/untracked work and concurrent ownership. Preserve clearly task-owned artifacts in the durable run location; ask for a concrete disposition when ownership or intended retention is unclear.

Remove only this task's worktree and branch according to repository conventions and the agreed scope, from a surviving checkout outside the worktree being removed. Keep the main checkout and other tasks intact. Follow documented squash-merge cleanup rules rather than assuming ancestry alone proves what was retained. A refusal because unique work remains needs preservation or a decision, not forced removal to satisfy the cleanup step.

Record what was actually removed or retained, the verified integration receipt/revision, unresolved follow-ups and the final report location. Return the actual endpoint and status: completed for the agreed scope, pending a decision/action, or blocked with evidence. A merged task with cleanup still pending is not fully cleaned up; a merged PR is not proof of deployment or live behavior.

Return observed boundaries and evidence to task-driver, which owns progress and workflow events under the [progress contract](../task-driver/references/progress.md). Runtime usage/cost still come from recording sources; workers do not invent consumption or concurrently write the driver's ledger. Preserve the run across resumed sessions. Mark the run done only after its agreed endpoint and required cleanup are verified, with measurement cutoff/coverage made explicit. A standalone calling main agent owns this bookkeeping.

## Origin and readiness

Matt's retro and license are bundled with provenance in [source.json](references/mattpocock/source.json). The original style dependencies remain only as provenance; this adapter replaces their active role with our optimize-for-agents process. [The process basis](references/process-basis.md) identifies that substitution and the optional offer, measurement and closure additions. This is an authored draft for user review, not a tested merge/cleanup workflow or a shipped plugin skill.
