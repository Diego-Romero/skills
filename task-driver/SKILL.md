---
name: task-driver
description: Drive one task from context gathering and shared understanding to an approved spec, implementation, review, retrospective and closure. Start only when explicitly requested by the user or an invoking skill.
metadata:
  status: draft
---

# Task driver

<!-- Adapted from mattpocock/skills (MIT), revision 5863806dd4e15c63174bee4e7515a4256792ecfa. Local coordination changes are documented in references/process-basis.md. -->

Drive one unit of work to an agreed outcome. Start only on an explicit request from the user or another skill. An epic or project coordinator can invoke this skill for an individual task and receive its status.

Use the execution environment and settings selected by the user. Assess difficulties from the task and actual attempts; discuss a different model or reasoning setting when useful, without changing it automatically.

Planning and implementation belong to this coordinator; there are no separate task-plan or execute-task wrappers. Reuse the bundled Matt Pocock procedures below instead of inventing replacements. Read [the process basis](references/process-basis.md) for their provenance and the small integration changes. Load only the source needed for the current step, including its supporting references when directed.

The bundled sources are reference files, not installed slash commands. Within this explicitly requested workflow, read and follow their procedural bodies. Resolve their Skill-tool calls through the linked sources below; use the current harness's supported skill-loading and delegation mechanisms. Their original invocation metadata is retained for provenance, not to register additional commands. Project-relative paths refer to the target task repository, not the bundled source directory.

## Establish the task and repository context

Accept a ticket reference or a task described by the caller. Read the root `AGENTS.md`, relevant scoped instructions and the README before asking for information the repository already provides.

Find the repository's guidance for its tracker, Git host, designs, architecture and patterns, local startup, tests, coupled codebases, and review process. Identify the selected review route, reviewer triggers and PR requirements early, so implementation can hand over the right inputs. Use its documented connectors or access methods. Ask for missing decisions or inaccessible information that affects this task; explain what is missing and why it matters.

Keep this setup work to identifying the task, workspace and relevant repository pointers. Investigate task-specific evidence during the discussion below; do not prepare a separate context dossier before it starts. Resolve the repository's tracker, label and document conventions here rather than assuming Matt's setup command is installed.

Encourage durable pointers in root `AGENTS.md` when useful setup information is missing. Keep detailed procedures in their owning documents and link to them. An incomplete setup guide does not by itself block unrelated work. Obtain agreement before changing shared repository guidance.

Use the full lifecycle by default. Honor explicit requests to skip a phase, such as review or retro, and record the skip and its effect on completion evidence. A skipped phase cannot satisfy required checks or protections. Keep an existing approved spec when it remains applicable rather than asking for it again.

Check the procedures and selected downstream skills needed for the requested endpoint before creating a task worktree or starting implementation. Code-review and the combined task-retro (retro plus closure) are authored drafts; their full runtime behavior still needs verification. Record unavailable later phases and proceed through the earlier authorized phases whose procedures are ready; stop at an unavailable boundary without inventing its procedure or claiming the full lifecycle complete. An explicitly requested spec-only endpoint needs only the planning procedures and applicable repository access.

## Prepare or reuse an isolated workspace

Locate the task's existing worktree and branch first. Reuse them when present, preserving work already done. Follow repository naming and setup conventions.

For new work, fetch the latest remote base branch and create the task branch/worktree from that fetched revision. Use the documented base, or `origin/main` when none is specified. Do not pull over local work, reset a resumed branch, or use another task's worktree. Report a failed fetch or unclear base before branching.

Suggest a branch name using repository conventions. Without a convention, suggest `task/<key-or-short-slug>`; use Conventional Commits for commit messages. Honor a name supplied by the user. A branch name and a commit-message convention are separate choices.

Check the required runtime, dependency setup and local checks. Record what the baseline actually proves. An existing failure that prevents meaningful verification needs a decision before dependent work proceeds.

## Record measurements and progress

Keep task state in `.plans/<KEY>/` in the main checkout unless the repository already defines an equivalent location. For a task without a tracker key, choose a stable short identifier. Keep local run measurements and recovery artifacts out of commits. Shared glossary and ADR changes belong in the task's tracked worktree and normal review process.

Follow [the ledger measurement contract](references/ledger.md) to measure time, runtime usage, cost where derivable, and outcomes by run, phase and session/agent. Record lightweight phase, dispatch, wait, retry and outcome events. Runtime measurements come from a recorder; do not estimate token use yourself. Preserve collection gaps and the basis of cost estimates. The recorder is not implemented yet; report unavailable measurements honestly.

Keep recovery state separately as [task progress](references/progress.md). The driver owns `progress.md` and workflow events; workers write reports and a recorder owns imported usage. Preserve history, give resumed sessions the existing run identifier, and reconcile progress with actual files, commits and remote state. Keep measurements outside the worktree so cleanup preserves them.

## Gather context and develop shared understanding

Default to Matt's [grill-with-docs](references/mattpocock/skills/engineering/grill-with-docs/SKILL.md) approach: load and follow both [grilling](references/mattpocock/skills/productivity/grilling/SKILL.md) and [domain-modeling](references/mattpocock/skills/engineering/domain-modeling/SKILL.md) in the main conversation.

Preserve grilling's decision tree, question rounds, recommendations, factual lookups and shared-understanding confirmation. Gather context as those decisions require: inspect relevant code, tests, contracts, designs, ticket discussions, terminology and architectural decisions. Follow useful pointers into coupled codebases and supplied references. Report unavailable evidence that affects the discussion. Do not substitute a fixed interview cap or a shorter custom checklist for the source procedure.

Follow domain-modeling throughout that discussion. Use the repository's existing glossary and ADR conventions; update resolved terminology as it crystallizes, test relationships against concrete scenarios and the code, and offer ADRs under the source's criteria. Keep the glossary focused on domain language. Capture shared documentation in the task's reviewed changes so teammates and future agents can use it; the spec and private run ledger serve different purposes.

## Produce and approve the spec

After shared understanding is confirmed, load and follow [to-spec](references/mattpocock/skills/engineering/to-spec/SKILL.md). Synthesize the conversation and code understanding using its template; do not begin another interview. Retain its user stories, implementation decisions, testing decisions, exclusions and notes. Agree on the public testing seams with the user, as the source requires, and carry that agreement into implementation.

Produce one canonical spec. Use the configured tracker issue when publishing is authorized, or the repository's documented spec location. If neither is available, keep a local draft at `.plans/<KEY>/spec.md` and report that it is not yet shared. Do not create a second mandatory implementation-plan document. Apply tracker labels only according to the repository's configured vocabulary and authorization.

Present the concrete spec and obtain approval before implementation. Record its canonical path or issue reference, exact revision or content snapshot, and the approval scope in progress. A local snapshot for provenance is not a separately maintained spec. If approval requires changes, update the spec and preserve its approval history. Existing approval remains valid for the unchanged scope and test seams.

Once the concrete spec is approved, record its exact approved revision and immediately start the implementation step in the same main session. That approval is the implementation go-ahead for the agreed scope; do not ask for another confirmation to continue. An explicitly requested spec-only endpoint still ends at spec approval. A missing future closure definition does not block authorized implementation or review.

The normal upstream publishing step follows the user's existing authorization. Invoking this coordinator does not itself authorize external messages or tracker mutations. Keep the draft reviewable locally when publishing is not authorized.

## Implement the approved spec

Load and follow [implement](references/mattpocock/skills/engineering/implement/SKILL.md), passing the approved spec reference and the task worktree. Its TDD call resolves to the bundled [tdd](references/mattpocock/skills/engineering/tdd/SKILL.md) procedure and its supporting test and mocking references. When TDD calls for interface-design vocabulary, load [codebase-design](references/mattpocock/skills/engineering/codebase-design/SKILL.md) as a reference, not as another mandatory design session.

Keep Matt's implementation and verification approach in the main session. Do not create an implementation subagent by default. Reuse the agreed test seams; return a materially changed seam to the user rather than silently changing the test agreement. Include the shared glossary and ADR changes in the work being verified and reviewed.

Upstream implement ends with code-review and a commit. Route that review call to the local [code-review coordinator](../code-review/SKILL.md) exactly once. In the full lifecycle it creates a reviewable local commit for Matt's baseline, handles its accepted findings, then pushes/creates or reuses the draft PR and runs the configured project/user process. This adapts the original final-commit order so HEAD-based and hosted reviewers see the actual implementation. The loop makes verified repair commits as needed; do not add another upstream review outside those two intended stages or make a duplicate final commit merely to follow the original sequence. A local review-only request can use a complete captured patch without publishing. An explicitly skipped review remains a recorded skip, not a pass; a full-lifecycle PR/commit handoff is still required before closure.

Routine implementation discoveries stay in execution. A discovery that changes agreed behavior, scope or consequential decisions returns to the discussion and spec; refresh affected approval and verification evidence before continuing.

## Coordinate review and close the task

Load [code-review](../code-review/SKILL.md) at the review boundary. It first runs Matt's Standards/Spec baseline, then the selected project/user review process when configured. Supply the approved spec, actual changes including any uncommitted work, checks, review-route pointers and unresolved issues. It presents verified findings and proposed dispositions from each stage, then the main agent automatically repairs confirmed high/medium findings within approved scope and refreshes verification/push/review evidence as required. Return scope/design decisions to the user; preserve each stage's history and actual reviewed ranges.

Keep project-provided `review-branch` and `review-pr-comments` as separate skills: after the Matt baseline, the review coordinator reuses them for the project's branch assessment and PR feedback respectively. Do not remove or collapse those entry points, or repeat already completed work within a stage.

When the required review process completes for the relevant revision, immediately enter [task-retro](../task-retro/SKILL.md) without a separate continue prompt. It offers an optional retrospective before merge, explaining the potential benefits and honoring an existing choice. If accepted, analyze the run and use our optimize-for-agents process for approved guidance improvements in the same task branch/PR, then refresh affected review/check evidence. If declined, skip that analysis and continue final verification and authorized integration/cleanup. Resolve the choice before merge; silence is not a decline. There is no separate close-task entry point. Use its actual installed definition and report an unavailable boundary honestly rather than inventing a missing procedure. A pending or blocked review does not trigger closure, and an explicitly review-only endpoint returns its findings instead.

Each separate skill receives the task/run identifier, worktree, artifact directory, relevant prior outputs and applicable authorization. It returns its result, evidence paths, unresolved decisions and next action to the driver rather than starting another phase itself. Review and retro can be explicitly skipped subject to binding repository checks; closure still has to verify the agreed endpoint.

Keep implementation and repairs in the main session. Delegate factual lookups and independent review through their selected procedures, without dispatching every phase automatically. Keep briefs and reports in files and pass absolute paths. Return a report path and a short result instead of pasting session history. A separate top-level session is an exception for unusually large work; provide a persistent handover and one clear owner.

Record planning, implementation, review, retro and closure visits even though planning and implementation are internal coordinator steps. Preserve worker relationships, waits and rework across repeated visits; the ledger does not require a separate skill for each measurement boundary. Reading a procedure alone does not create an agent or isolate context; delegated work needs an explicit brief and write ownership.

Advance when the phase's completion condition is met, or when the caller explicitly skipped it and no binding check depends on it. Route a changed design or scope back to planning, scoped repairs to execution, and changed code through the selected review process. Refresh evidence affected by later changes.

## Decisions and communication

The user approves the concrete spec and gives a clear go-ahead for merge. During task-retro, offer the optional analysis before merge, present its findings if accepted, and prepare concrete closure evidence either way. Entering this step or accepting a retrospective does not itself authorize merge; reuse applicable authorization already given. A task description or permission to use a tool does not itself approve a spec or authorize a merge. Honor explicit authorization already given for the action.

Use the conversation, repository rules and harness permissions to establish what is authorized. Discuss unresolved permissions at the relevant action; do not add repeated approval prompts for work already authorized. Continue routine implementation and repair without asking whether to continue.

The requested normal full lifecycle includes its task-branch commits/pushes, creating/reusing the task PR and requesting designated reviewers when included in the selected workflow. Honor narrower/local-only endpoints. Remote messages, publication of local review findings, thread resolutions and other actions outside that selected scope need their applicable authorization; the code-review skill returns drafts when it is absent. None of these actions grants merge authorization.

If attempts stop producing new evidence or progress, summarize the blocker and what was tried, then discuss a changed approach or execution settings with the user. Preserve completed work. Do not treat every failure as a model-capability problem.

Keep the user informed of the current phase, meaningful findings and decisions needed. If invoked by a parent coordinator, return phase/status, evidence and required decisions to that caller. This does not authorize messages to external services or people.

## Completion

The normal endpoint is a verified merge, a completed retro when included, and safe workspace cleanup. Follow any different endpoint explicitly agreed with the caller, such as a reviewed PR awaiting merge, and report that state accurately.

Verify the merge result before cleanup. Remove only this task's worktree and branch after ensuring unique files are preserved. Never force removal of a worktree that contains uncommitted or untracked work. Retain the run measurements, progress and reports.

Return the actual outcome, relevant commit/PR evidence, verification results, skipped phases, remaining limitations and follow-ups. Include available run/phase/session measurements with their coverage and cost basis. Mark progress done only when the agreed endpoint is verified; retain blocked and abandoned runs in measurement history too. A paused or blocked run returns its reason and next action.

## Origin

Coordination and measurement are based on the user's task-driver answers and Ventura workflow. Planning and implementation reuse pinned Matt Pocock sources under the MIT license. Their unchanged files, license and hashes are bundled under `references/mattpocock/`; [the process basis](references/process-basis.md) lists the integration adaptations. Code-review is a project-aware authored draft with Matt's baseline first and configured project review second; the combined task-retro (retro and closure) is also an authored draft. This draft is not shipped or tested end to end.
