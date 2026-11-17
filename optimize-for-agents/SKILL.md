---
name: optimize-for-agents
description: Audit a repository's agent instructions and recurring code patterns, then help its maintainer organize short instructions and useful pattern guides. Use when asked to make repository-specific knowledge easier for coding agents to find.
---

# Optimize for agents

Help an agent find the repository rules and patterns it needs without loading unrelated guidance. Work with the maintainer to understand the code, review a proposed structure, and apply it.

## Start clean and audit the repository

Read the repository instructions and README for its setup and worktree conventions. Fetch the latest remote `main` (or the repository's default branch), then create a separate worktree at that revision using `git worktree add --detach`. Do not create a branch at this stage. Confirm the new worktree is clean and record its full starting commit. Leave existing checkouts and uncommitted work untouched; do not reset, stash, or switch them to prepare this work.

Do the audit, guidance edits, and verification in this new worktree. First establish what the repository is for, how it is built and run, its main applications and packages, and their boundaries. Check manifests, configuration, entry points, and existing guidance against the code.

Then read [repository-audit.md](references/repository-audit.md) and delegate focused, read-only investigations in parallel:

- **Structure and instructions:** current file layout, existing instruction files, their scopes and pointers, and areas with no local guidance.
- **Building blocks and tests:** separate investigations for areas actually present, such as pages, forms, endpoints, UI/styling, and database access. Include each component's existing test approach, setup, focused commands, and cases covering its variants; distinguish inspected tests, executed results, gaps, and areas not inspected.
- **Shared testing and CI:** map repository-wide suites, shared setup, local commands, workflow jobs, triggers, dependencies, and evidence of required checks. Separate configured jobs from observed runs and component-specific cases.
- **Terminology:** repository-specific meanings, aliases, and inconsistent names or definitions, with proposed glossary entries.
- **Documented decisions:** existing ADRs and decisions recorded elsewhere, with sources and candidates to turn into ADR drafts.

Give each investigator the overview, starting revision, scope, and relevant findings format. Share terminology and decision evidence across scopes and reconcile overlaps centrally. When subagents are unavailable, investigate those scopes sequentially.

Find each building block's shared pattern, meaningful variants, and evidence for which implementations should guide new work. Compare examples and distinguish preferred patterns, supported variants, legacy code, and unresolved choices. Recent changes are evidence, not proof that a pattern is preferred. Reconcile findings across investigators before proposing documentation boundaries.

Start with individual building blocks and their variants, rather than tracing a whole feature flow. Use real task walkthroughs later to validate the proposed guidance. Relevant PRs can resolve a disputed pattern; reviewing the entire history is not a prerequisite.

Check which instruction files the intended agent actually loads from the relevant working directories, rather than assuming every `AGENTS.md` is loaded.

## Prepare editable drafts and the proposal

Write the full draft guidance into the target worktree before presenting the proposal, so the maintainer can edit real files. Put pattern guides, variant and testing details, glossary candidates, and shared testing/CI guidance at their proposed paths when available. Preserve existing content and user edits. For changes to active instructions or existing guides, use clearly named proposed copies where necessary; keep active instruction routing and existing guardrails intact until review. Mark draft status and unresolved choices explicitly. ADR candidates remain drafts, not accepted records.

The repository files hold the full content. The HTML is an at-a-glance review: base rules, variant/test-case summaries, and links to the editable drafts. Verify every draft link exists. Read back maintainer edits and refresh the summary before finalizing; a saved HTML report is a snapshot, not a live editor.

Present the proposal in this order:

1. **File layout:** a unified diff of the proposed structure against the current one, marking additions, changes, moves, and removals.
2. **Building blocks and variants:** show the shared pattern, when each variant applies, and which approach is preferred for new work, with evidence and unresolved choices.
3. **Pattern and testing summaries:** compact base/variant/test-case comparisons and draft links. Keep full snippets, test setup, commands, and gaps in the repository drafts, with optional source references in the report. Keep test existence separate from execution results.
4. **Glossary and decisions:** proposed entries and naming discrepancies, existing ADR links, and evidenced decisions that could become ADR drafts. Surface unresolved meanings or decisions for review.

Include a shared testing/CI map and a guidance-maintenance proposal. Distinguish existing checks from proposed adoption: scoped size budgets, file/anchor validation, guide reachability, and source-drift review signals. Agree on thresholds, exceptions, and rollout rather than imposing universal limits. An old file alone is not evidence of stale guidance; preserve historical ADRs.

Present one long page named “Optimise for agents proposal”, with no tabs. Use headings and reusable visual components for file diffs, patterns, variants, tests, terminology, and decisions; keep explanatory prose in shared documentation available as a side panel or full-page reader. Include an interactive component/variant reading plan showing cumulative reads, later reads, excluded material, and unverified instruction loading. Label proposed routes as illustrative rather than measured context or token savings. Collect feedback and decisions in the conversation; do not add review or approval forms to the static report. Read [proposal.md](references/proposal.md) for the input shape and export commands. Keep private source and proposals outside the public skill repository, and open the report in the maintainer’s browser.

Use these principles to choose the layout:

- Keep shared instructions at the root and scoped instructions near their code. Follow existing documentation conventions when placing detailed guides.
- Prefer direct pointers such as “Changing a scheduled job? Read `worker/job-pattern.md`.” Avoid chains of index pages or importing every guide automatically.
- Give each pattern one concern. Keep rules that change together in the same file.
- Prefer lint, types, tests, or CI for enforceable rules. Link to README/scripts for running commands.
- Add glossary entries only for useful repository-specific meanings, preserving legitimate differences by scope. Link existing ADRs. Use the separate `record-adr` skill when available to draft already-made decisions from documented evidence or maintainer confirmation; do not invent rationale, dates, or acceptance from code alone.

Show what moves, stays, changes, or is removed. Review the editable drafts and agree on final placement, active instruction changes, and removals before activating them, honoring choices already made in the conversation.

## Refine and activate the agreed guidance

Read back edits to the draft files and refine them with the maintainer. Finalize the agreed layout and instruction pointers in the worktree created at the start, promoting proposed copies where needed. Move existing guidance before trimming it so important guardrails remain traceable. Keep code behavior unchanged during this guidance work.

Write short instructions and pattern guides grounded in the inspected code. Include enough of each example to explain the pattern, rather than providing a source path alone. Avoid documenting every file or inventing universal line limits.

Organize each pattern as a common base with source evidence and guardrails, conditional variants describing their differences, and testing material mapping existing cases to the base/variants. Link shared testing setup and CI instructions instead of repeating them in every guide.

## Check the result

Verify relative links and section anchors, ensure each guide is reachable, and check snippets against their source. Now choose realistic tasks with the maintainer and walk them from both the root and relevant subdirectories: starting instructions → direct pointer → relevant pattern and code. Show which unrelated guides stay out of that task's context. Check instruction loading for the intended agent and run the repository's relevant checks.

Report what changed and what was verified. Explain what an agent loads initially and what it reads for a task. A document read during a conversation may remain in later turns; do not imply that irrelevant context is automatically removed each turn.

If the maintainer wants a measured comparison, use [evaluation.md](references/evaluation.md). Compare factual retrieval and effort at recorded revisions using the same questions and model settings. Smaller instructions do not guarantee fewer turns, lower total context, or better code. Say when the change has not been measured.

## Report and optional evaluation

- `scripts/proposal-report.mjs`: the combined proposal and documentation report; see [proposal.md](references/proposal.md). Use pinned DaisyUI CDN styles by default or `--offline` for embedded component CSS.
- [evaluation.md](references/evaluation.md): instruction-loading controls and the bundled Claude evaluation runner. Read it when preparing a measured comparison.
