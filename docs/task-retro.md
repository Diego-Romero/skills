# Task retro

## What it does

Offers an optional Matt Pocock-based retrospective before merge, then performs final verification, authorized integration and safe cleanup. Accepted retrospectives use primary session evidence and available ledger measurements to propose improvements. Agent-facing documentation follows our optimize-for-agents process.

Task-driver enters it automatically after completed required code review and explains the potential benefits: fewer repeated investigations or avoidable review repairs, better guidance/checks/tools, and measured efficiency experiments. The user chooses whether to run the analysis. If declined, it proceeds to closure with the same verification and authorization requirements. A separate retrospective-only request stays analysis-only. This is an authored draft for user review, not a live-tested closing workflow or a shipped plugin skill.

## When to reach for it

Use it as the final task-driver step, or explicitly request a retrospective on a task/run/session. The main session owns the discussion and any authorized changes. There is no separate close-task skill.

## Common questions

**Why before merge?** Agreed improvements that fit the task can be implemented, checked and reviewed in the current branch/PR. Broader ideas can be deferred rather than expanding the task. An outstanding retrospective choice is not silently treated as a decline.

**Does it use Matt's writing guide?** It keeps Matt's retrospective analysis, replacing his writing-for-agents step with the relevant guidance-writing and verification parts of [optimize-for-agents](../optimize-for-agents/SKILL.md). This does not automatically launch a full repository audit or another worktree. Make that dependency available when porting the skill.

**Does it rewrite skills automatically?** No. Following Matt, it presents evidence-backed recommendations. Already authorized improvements can proceed through the normal implementation/check/review path. Scope, policy and consequential design decisions return to the user.

**Does review completion automatically merge?** It starts this final step and the optional retrospective offer. Resolve that choice and any accepted changes before merge. Merge still needs applicable authorization, current evidence and the repository's required controls. Existing choices and authorization are honored without repeated prompts.

**What does the ledger add?** Observed time, waits, usage, cost where derivable and rework can support the recommendations. Missing attribution/prices remain unknown, and early totals have a cutoff because closure may still be running. Measurement is distinct from proof that a process change caused an improvement.

**What survives cleanup?** The report, spec approval evidence, progress, review/session references, run measurements and unique task artifacts. Store them outside the disposable worktree. Preserve a workspace still needed for PR feedback or an explicitly nonmerged endpoint.

**Where can I read the actual instructions?** [task-retro/SKILL.md](../task-retro/SKILL.md). The [process basis](../task-retro/references/process-basis.md) distinguishes Matt's procedures from our measurement and closure integration.

## It's working if

- The user chooses the retrospective before merge; a decline skips analysis while preserving required closure checks and the ledger.
- Accepted recommendations cite observed session/review/configuration evidence and follow Matt's categories and severity ordering.
- Approved improvements that fit the task use the current PR and refresh affected verification/review; guidance follows optimize-for-agents.
- The report separates measurements, possible explanations, decisions and actual improvements.
- Required reviews/checks and authorization match the revision being integrated.
- Integration and cleanup are verified as separate outcomes, with unique files and run evidence retained.
- The final report accurately distinguishes completed, pending and blocked states and discloses measurement coverage.
