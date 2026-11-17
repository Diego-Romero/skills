# Task driver

## What it does

Coordinates one task from investigation and shared understanding to an approved spec, implementation, review, retrospective and closure. Planning and implementation live inside task-driver, composing pinned Matt Pocock procedures rather than separate task-plan and execute-task wrappers.

The default planning approach is grill-with-docs: grilling and domain-modeling together. Task-driver then uses to-spec to capture the understanding and implement/TDD to build from the approved spec. Glossary and ADR updates become shared, reviewed repository changes. The spec is the task's primary handoff document; a second implementation-plan document is not required.

Its ledger measures run, phase and session/agent time, usage, derivable cost and outcome. Recovery state is separate. Planning and implementation remain measurable phases even though they are not separate skills.

This is still a draft. The planning/implementation source procedures are bundled locally and [code-review](code-review.md) is authored, and [task-retro](task-retro.md) is authored for the final retrospective/verification/cleanup step. All three skill definitions remain runtime-untested as a complete lifecycle. A local design-run measurement sample exists; the general runtime recorder is not implemented. The full lifecycle is not operational or included in the plugin's shipping list.

## When to reach for it

Invoke it explicitly when you want one ticket or task driven through its lifecycle. A project/epic coordinator can explicitly invoke it for an individual piece of work.

It uses repository conventions and the user's selected execution settings. Investigation and the decision conversation stay together; factual lookups follow Matt's grilling procedure. Review or retro can be skipped on explicit instruction, with the resulting evidence gap recorded and mandatory repository checks preserved.

## Common questions

**Does it pick a model?** No. It uses the user's settings. Difficulties can prompt a discussion about a different approach or settings.

**Does it require Jira or GitHub?** No. It accepts a ticket reference or task description and reads the repository's tracker and Git conventions.

**What does planning produce?** One canonical spec using Matt's to-spec template, with user stories, implementation decisions, agreed testing decisions, exclusions and notes. Use the configured tracker issue when publishing is authorized, or the repository's spec convention. The fallback is a local `.plans/<TASK>/spec.md` draft, explicitly identified as not yet shared. Record exactly what was approved before implementation.

**Why grill-with-docs for a team?** Resolved domain language and significant decisions survive the conversation in the repository's glossary and ADRs. Follow Matt's criteria for creating them; every task does not need new docs. Include shared-document changes in normal task review rather than hiding them in ignored run artifacts.

**Are Matt's instructions rewritten?** No. The driver bundles unchanged upstream source files and their supporting references, pinned to a revision with hashes and the original license. It loads their procedural bodies only when needed. Invocation, repository conventions, spec approval/publishing, the single review handoff and ledger integration are local adaptations documented in the [process basis](../task-driver/references/process-basis.md).

**Do I need to install extra slash commands?** The source procedures are bundled as references within task-driver. They are not registered as extra commands or implicitly loaded skills. The driver resolves their procedural dependencies through those local references and the selected review skill, using the current harness's supported mechanisms. Cross-harness behavior still needs runtime verification.

**What is the review order?** Matt's implement includes one review call, which the driver routes once to the coordinator. That coordinator runs Matt's Standards/Spec baseline first, then the configured project/user review, retaining separate review-branch and review-pr-comments skills. A reviewable local commit enables the baseline; accepted repairs precede publishing/requesting the additional project review. The two stages are intentional, with no duplicate invocation within a stage. This adapts the source's original final-commit order.

**When does it advance?** Spec approval immediately starts implementation without another go-ahead. Completed code review immediately enters task-retro and offers the optional retrospective before merge, explaining its potential benefits. If accepted, agreed improvements can use the current PR; if declined, analysis is skipped and verified, authorized closure continues. Guidance improvements follow optimize-for-agents. Existing choices are honored, and silence is not treated as a decline. Explicit spec-only/review-only endpoints still stop as requested; merge retains its applicable authorization.

**Who fixes review findings?** The main implementation agent announces and automatically repairs confirmed high/medium findings within the approved scope, verifies and pushes normally. Reviewers are independent and read-only. Product/scope/consequential design decisions return to the user; a review-only request remains report-only.

**Can it merge automatically?** It requires a clear user go-ahead for the merge. Existing authorization for the action is honored; harness access alone is not merge authorization.

**Where are measurements and state kept?** Local run bundles live in `.plans/<TASK>/runs/<RUN>/` in the main checkout; recovery state stays in `.plans/<TASK>/progress.md`. Both survive task worktree cleanup. Source usage and append-only workflow events feed derived summaries. The local design-run sample does not establish a complete recorder or cross-harness schema. See the [measurement contract](../task-driver/references/ledger.md) and [progress contract](../task-driver/references/progress.md).

**Does the agent count its own tokens?** No. The recorder must read runtime evidence and disclose unsupported sources and partial capture. Phase events provide attribution. The current draft does not collect usage automatically.

**Does estimated cost equal money paid?** Not necessarily. Reports distinguish billed amounts, runtime-reported estimates and token-priced estimates, with currency, pricing source/date and unpriced coverage. Subscription spend cannot be inferred from token prices alone.

**What is ready to use?** All three canonical skill definitions are authored drafts. Check actual installed procedures and evidence before running each step. Normal project-driver calls proceed from approved spec into implementation; explicitly limited endpoints remain honored. OpenAuth has the review coordinator, Ventura still needs that port, and task-retro has not yet been installed in either project. A missing installed phase is an explicit boundary, not an invented procedure.

## It's working if

- It starts only after an explicit request from a user or invoking skill.
- It reuses an existing task workspace and preserves local work.
- It follows Matt's grilling and domain-modeling approach, produces one concrete spec for approval, implements that spec and requires merge authorization.
- It preserves shared terminology and significant decisions in reviewed repository docs and avoids duplicating the implementation review.
- It records phase/worker/wait/retry events and derives measurement breakdowns from runtime evidence, without double-counting concurrent work or imported usage.
- It labels unavailable measurements and partial or estimated cost and retains outcomes alongside efficiency figures.
- It preserves task progress, decisions and evidence and can resume without replaying completed work.
- It returns the actual closure or blocked state, preserving unique files and the task record.

The draft has not yet been exercised on a real task. Structural validation does not establish these behavioral outcomes.
