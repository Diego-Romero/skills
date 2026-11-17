# Task progress and recovery

Keep operational state in `<main checkout>/.plans/<TASK>/progress.md`, or the repository's equivalent, alongside the local run artifacts and reports. Use it to resume work; use [the ledger measurement contract](ledger.md) for time, usage and cost accounting. Link the canonical spec even when it lives in the tracker or tracked repository docs.

The driver is the single writer. Workers write reports at assigned paths. A parent coordinator keeps its own project record rather than concurrently editing this task's state. Transfer ownership explicitly when another session takes over.

Record the current task/run identifier, owner, workspace, branch, agreed endpoint, selected/skipped phases, canonical spec reference and approved revision/content snapshot, approvals and their scope, shared glossary/ADR changes, completed task commit ranges, evidence paths, blockers and next action. Record planning and implementation visits even though they are internal task-driver steps. Append decisions and corrections without replacing prior history. Do not treat the file as the authoritative source of measured usage.

At review, retain the selected procedure/policy, PR and latest head, review/request identifiers, report/disposition pointers, repair/check ranges and remaining remote approval requirements. Resume those requests and applicable authorization instead of reposting or resetting them on a new session. Keep detailed findings in the review report rather than maintaining another divergent copy in progress.

After an interruption, reconcile the record with actual files, git history and remote checks/review state. Preserve completed work and resume the earliest incomplete step. A claim that a task is complete must be supported by its named evidence.

Retain progress, approved spec evidence and reports after task worktree cleanup. Keep a paused or blocked state distinct from a verified completed endpoint. Do not copy credentials into the record.
