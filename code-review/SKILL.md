---
name: code-review
description: Review task changes first with Matt Pocock's independent Standards and Spec reviewers, then follow the repository's and user's additional review workflow. Collect findings, assess severity and carry authorized repairs through verification and follow-up review.
metadata:
  status: draft
---

# Code review

<!-- Adapted from mattpocock/skills (MIT), revision 5863806dd4e15c63174bee4e7515a4256792ecfa. Project routing, PR coordination, triage and repair integration are documented in references/process-basis.md. -->

Coordinate two ordered review stages: **first Matt Pocock's Standards/Spec review, then the project's and user's specified review process**. The baseline still runs when a project route exists. If none is defined, the baseline is the review; do not invent an additional stage. Preserve the approved spec as the task's behavioral authority and the repository's applicable coding standards. Reviewers inspect independently and report findings; the main implementation agent owns accepted repairs.

## Establish scope and discover the process

Accept the task/run identifier, target repository and worktree, approved spec reference/revision, comparison base, intended changes, checks, branch/PR and existing authorization. An explicit review-only request authorizes a report, not automatic code edits, commits, pushes, PR creation or reviewer requests. A full task lifecycle includes its agreed task-branch pushes and PR workflow; reuse that authorization rather than asking again at every round. Honor local-only or other narrower endpoints.

Read applicable AGENTS.md/CLAUDE.md and their review pointers, README, CONTRIBUTING, coding standards, architecture/decision docs, PR templates, ownership rules, workflows and local review configuration. Follow relevant links to the actual procedure. Discover how to invoke the reviewers, which revision/input they review, what triggers them, where results appear, and what constitutes completion. Use tool documentation/help when needed; do not invent an OCR command, hosted-bot trigger or reviewer identity.

Record the selected additional procedure and its source. Discover it early, but run it after Matt's baseline. Apply the user's current preferences within binding project controls; surface conflicting or stale guidance when it affects the route or a completion requirement. Required human approval and CI remain separate from automated review. If an additional required route is unavailable, report the blocker rather than silently treating the baseline as its replacement.

Prefer an independent reviewer with the configured model/environment different from the code/spec author's when available. Use user-selected settings; do not hardcode a provider/model or automatically escalate. Fresh context does not establish model diversity. Record the actual identities when observable and disclose missing diversity; ask for a choice when a required preference cannot be met. Otherwise the baseline can use fresh-context reviewers under existing settings.

## Preserve branch review and PR feedback as separate skills

When the project provides `review-branch` and `review-pr-comments`, keep and reuse both entry points and their supporting resources. This coordinator does not delete, replace or collapse them:

- **review-branch:** owns the independent assessment of the branch changes and returns its findings/review result.
- **review-pr-comments:** owns collecting and processing PR feedback, including bot/human threads, findings dispositions and authorized replies/resolutions.

After Matt's baseline, load the project's actual skill files at those boundaries and pass the selected route, approved spec, baseline reports/dispositions, exact revisions, artifact paths and caller authorization. Preserve their separately invokable behavior. Resolve differences in repair ownership, settings or approval policy against the user's explicit choices; do not silently edit the project skills or import conflicting legacy defaults.

Use their returned reports and action receipts for the coordinator's status and ledger. The baseline and project review are intentionally separate stages; do not suppress either merely because their checks overlap. Avoid repeating a completed invocation within a stage or re-fixing a finding already addressed. [PR feedback coordination](references/pr-feedback.md) supplements an existing comment skill rather than replacing it.

## Prepare a complete review target

Resolve the fixed comparison base and capture the exact reviewed revision, spec revision, diff and relevant instruction pointers. Include all intended changes, including new files, glossary/ADR edits and any uncommitted work; identify unrelated local edits and preserve them. An empty HEAD-only diff with a dirty worktree is not a completed review.

For the normal full lifecycle, verify the intended changes and create a reviewable commit on the agreed task branch so the baseline sees the actual implementation through HEAD. Record the base and head. Run the baseline before publishing a new PR or requesting the additional project reviewers. If committing is outside the request, use an immutable complete patch locally instead. A reviewable commit is not final approval or merge.

Give each reviewer the exact target, approved spec and applicable standards through its supported inputs. Pass focused paths and revision references rather than the implementation transcript. Ensure a reviewer can actually read those paths: a local ignored spec is not automatically present in a separate checkout or hosted service. Use an authorized supported context input or disclose the missing coverage.

## Stage 1: Matt Standards and Spec review

Read and follow the unchanged [Matt code-review procedure](references/mattpocock/code-review.md). These are bundled reference instructions, not another registered skill. Do not recursively invoke an unqualified `code-review` command, which could resolve to this coordinator or a built-in skill.

Resolve the source's tracker setup requirement from repository conventions instead of requiring its setup command. Supply the caller's fixed base and approved spec directly. Use the complete committed target prepared above; for a review-only uncommitted patch, give both reviewers its immutable diff snapshot and describe that input adaptation explicitly.

Keep the two fresh-context Standards and Spec subagents, the source's prompts and smell baseline, repository-over-baseline precedence, evidence requirements and separate original reports. Use the current harness's supported delegation mechanism. The reviewers are read-only and do not dispatch additional review seats or edit the task worktree. If fresh-context delegation is unavailable, report that limitation and obtain an alternative when independence is required; do not silently call an inline self-review equivalent.

Preserve the two reports and their per-axis summaries as the source instructs. Put the findings dispositions below in a separate section; do not replace or silently rerank the original Standards/Spec reports. If no spec exists in review-only scope, report the source's skipped Spec coverage. A task-driver run expecting an approved spec must reconcile its missing input before claiming spec review.

Verify and handle baseline findings using the disposition/repair rules below before advancing. Preserve its reviewed target and any scoped re-review of baseline repairs. An unresolved scope decision or required blocker remains explicit; do not call an incomplete baseline complete in order to start the next stage.

## Stage 2: project and user review process

After the baseline and its accepted repairs, push normally and create or reuse the task's draft PR for the full lifecycle. Use the project's forge tools, naming and PR conventions. If a PR already exists, record its current head and reuse it; do not issue duplicate reviewer requests. A local project review can run before PR creation when its documented procedure allows it, but still follows the baseline, and the full lifecycle still needs its PR. A review-only request does not acquire publishing authority from this sequence.

Run the discovered project/user route, retaining separate review-branch and review-pr-comments skills when present. Trigger reviewers at the stage their procedure requires: a bot that needs a ready PR must not be assumed to run on a draft. Request designated reviewers when included in the selected authorized workflow. Leave the PR draft until applicable ready conditions are met, unless becoming ready is a documented trigger covered by the task.

Read [PR feedback coordination](references/pr-feedback.md) when review depends on remote requests, comments or threads. Preserve raw reports, reviewed ranges, source run/request identifiers, completion status and coverage for this stage separately from the baseline. A successful launch, empty comment feed, skipped files or a truncated/budget-exhausted run is not evidence of a completed clean review. Continue independent authorized work during asynchronous waits; retain explicit wait boundaries without treating the entire interval as idle.

If no additional route is defined, record `no additional project review configured` and do not manufacture another full review. Do not automatically run every available tool. Record which baseline spec/standards evidence remains applicable after project-stage repairs and refresh affected evidence when those changes invalidate it, rather than claiming an earlier baseline covers a different patch.

## Verify findings and present dispositions

Collect all findings, including tool reports, inline threads and top-level summaries. Preserve source IDs and break multi-point comments into individual findings. Check each claim against the actual code, callers, spec and documented rules. Record a finding as confirmed, disputed or unverified, with evidence; a tool's severity alone does not establish validity or authority.

Use the project's severity scale where defined. Otherwise classify confirmed defects by demonstrated impact: high for substantial correctness/security/data-integrity failures, medium for meaningful behavior or maintainability defects, low/advisory for limited-impact improvements. Keep confidence, implementation effort and blocking status distinct from severity. A heuristic smell is a judgment call, not automatically a standards violation.

Present a compact disposition table: source/ID and evidence, assessed severity and rationale, proposed action, outcome. Preserve original tool severity separately when supplied. Explain false positives or inapplicable rules; account for every finding instead of silently dropping one. Low/advisory suggestions are reported with a disposition and are not automatic scope expansion. Binding repository rules still apply.

For a full lifecycle or explicitly authorized repair loop, announce the scoped repair batch and **automatically fix confirmed high/medium findings within the approved scope**, then verify, commit and push normally. Do not stop for approval of each routine batch. An explicitly review-only request remains report-only. Bring changes to intended behavior, broader scope, consequential architecture, unresolved correctness disagreements or missing permissions to the user with evidence and a recommendation. If project policy conflicts with the agreed repair rule, surface and resolve the conflict rather than silently deferring a substantive defect.

## Repair and refresh evidence

The main agent makes accepted repairs in the task worktree, following the implementation/TDD procedure and its agreed test seams. Independent reviewers remain read-only. Record the repair range, affected checks and actual results; check for concurrent work before committing or pushing. A rejected push requires reconciliation, not an automatic force-push, reset or skipped hook.

After a repair, rerun affected checks and the selected follow-up review required by the procedure or changed behavior. Use a scoped or incremental pass where supported, retaining its actual coverage and prior unresolved findings. Reconcile old comments against the new revision; do not treat an outdated marker, a reply or bot silence as proof of a fix. Required CI and reviewer evidence must apply to the latest relevant pushed revision.

Apply a project-defined round/timeout policy when one exists, reporting unresolved blockers at its limit. Do not invent a universal round count or wait indefinitely without new evidence. If repairs or review attempts stop producing progress, return the blocker and what was tried to the caller. A stopped or incomplete loop is not a clean review.

## Record and return

Keep review evidence in the caller's artifact directory, normally `<main checkout>/.plans/<TASK>/reviews/`, outside disposable worktrees. Record the selected route, spec/base/head or patch hash, reviewer identities, source request/run/thread IDs, raw reports, coverage, finding validity/severity/dispositions, repair revisions, verification and next action. Resume from these identifiers and current remote state rather than issuing duplicate requests or resetting authorization on a new session.

Return observations to the driver, which owns progress and workflow events under the [ledger contract](../task-driver/references/ledger.md). Record the baseline and project stages separately within review, with reviewer dispatch/completion, explicit waits, repair visits, outcomes and evidence pointers. Runtime usage/cost come from actual source data; unsupported local-tool or hosted usage stays unknown. Independent review workers return reports, not concurrent writes to the driver's ledger. When invoked standalone, the calling main agent owns these responsibilities.

Finish when Matt's baseline and any configured project/user review have completed for the relevant changes, each finding has a disposition, accepted repairs are verified/pushed within scope, and applicable follow-up checks/reviews cover the resulting revision. Return `complete`, `pending` or `blocked` with the exact head/patch, PR, evidence for each stage, unresolved findings, remaining human/CI requirements and next action. Scope any completion claim to the requested endpoint; review completion is not merge authorization or proof of deployment.

## Origin and readiness

Matt's baseline procedure and license are bundled unchanged with hashes in [source.json](references/mattpocock/source.json). The [process basis](references/process-basis.md) identifies our adaptations, informed by a project review-process investigation retained in local design-run evidence. This skill is an authored draft, not yet shipped or exercised against a live reviewer/PR repair loop.
