# Code-review process basis

<!-- Adapted from mattpocock/skills (MIT), revision 5863806dd4e15c63174bee4e7515a4256792ecfa. Local adaptations are identified below. -->

The user approved a project-aware review coordinator on 17 November 2026 and then clarified the order: always run Matt's Standards/Spec review first, then the project/user's configured process. The baseline is not replaced by a project workflow. When no additional process is defined, Matt's review is sufficient; do not invent another review stage.

## Unchanged upstream discipline

The bundled [Matt code-review source](mattpocock/code-review.md) is an unchanged copy from [revision 5863806dd4e15c63174bee4e7515a4256792ecfa](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/code-review/SKILL.md). The [manifest](mattpocock/source.json) records its original path, pinned URL and SHA-256 alongside the original [MIT license](mattpocock/LICENSE).

Keep Matt's independent Standards/Spec reviewers, fresh contexts, prompt bodies, standards precedence, heuristic smell baseline, evidence and separate reports. The outer coordinator records dispositions separately; it does not rewrite or collapse that review discipline.

The upstream procedure is stored as `code-review.md`, preserving its original bytes. A nested file named SKILL.md is recursively discovered by Codex as another skill; the reference filename prevents duplicate registration while source.json retains the original upstream path.

## Our integration adaptations

- **Project routing and order:** discover reviewer procedure and policy through repo instructions, architecture/workflow docs and actual configuration, then run that process after the Matt baseline. Preserve and reuse separate `review-branch` and `review-pr-comments` skills when provided. The two review stages are intentional; avoid duplicate invocations within a stage rather than suppressing either stage because of overlapping checks. Support a documented local or hosted route; do not invent a generic OCR invocation or bot trigger. Matt's setup command is not an installation prerequisite when repository conventions are available.
- **Invocation:** task-driver explicitly loads this local skill by path. The bundled upstream source is a reference body, not a second registered code-review command; this avoids recursion and ambiguity with similarly named built-ins. Use the current harness's delegation mechanism for its reviewer seats.
- **Input and PR timing:** review the complete intended change. In the full lifecycle, create a reviewable local commit for Matt's baseline, handle its accepted findings, then push/create or reuse the draft PR for the additional project process. Do not trigger a newly requested project review before the baseline. An explicitly local review-only request can use an immutable full patch without committing. This corrects the HEAD-only/pre-final-commit ambiguity in the original implement/review handoff.
- **Independent settings:** prefer a configured different reviewer model/environment, use user-selected settings and report actual identity/coverage. No automatic model selection or escalation. Same-model fresh context is disclosed as such, not claimed as cross-model review.
- **Findings:** verify claims, retain raw reports and source identities per stage, assess severity/impact and record one disposition per finding. Present proposed actions. Project-stage repairs that invalidate baseline evidence require affected checks/review to be refreshed; retain the actual reviewed ranges instead of claiming old evidence covers new code.
- **Accepted repair policy:** the main agent automatically repairs confirmed high/medium findings within the approved scope after announcing the batch, then verifies, commits and pushes normally. Review-only requests stay report-only. Product/scope/consequential design changes and unresolved policy conflicts return to the user. Low/advisory findings do not automatically expand scope.
- **Feedback loop:** follow the selected tool's asynchronous completion and revision semantics; collect both threads and summaries, avoid duplicate requests, and preserve earlier findings during incremental passes. The [remote feedback reference](pr-feedback.md) handles receipts, replies and resolution boundaries.
- **Measurement:** task-driver owns progress/workflow events; reviewer tools and sessions provide measured usage where available. Distinguish baseline and project-stage visits, actual waits/repairs, revisions and outcomes rather than guessing cost or treating green CI as completed review.

## Project-process influence

A project-specific investigation is retained in local design-run evidence rather than distributed with this reusable skill. It informed these boundaries:

- Keep branch assessment and PR-comment handling as separate project skills and reuse them without duplicating completed work.
- Separate execution, triage policy, saved review packages, finding dispositions, revision identity and PR feedback.
- Do not import fixed model tiers, mandatory fix workers, universal round caps, session-based approval resets or one project's deferral policy as defaults.
- Discover and reconcile the current project's rules and user instructions before execution rather than rewriting its retained review skills.

## Readiness

This is an authored draft, not a placeholder. Source hashes, links and frontmatter can be checked locally. Actual local-tool/hosted-review behavior, authorization handoffs and repair convergence still need realistic runtime verification. No live PR, reviewer request, comment, code repair or push is performed by creating this skill. The combined task-retro (retro plus closure) is now an authored draft awaiting user review/runtime verification; nothing has been added to the plugin shipping manifest.
