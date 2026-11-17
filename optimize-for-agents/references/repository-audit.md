# Audit structure, building blocks, terminology, and decisions

Use after establishing the repository's purpose, stack, and application/package boundaries. The output is evidence for the guidance proposal, not an implementation change.

## Structure and instructions investigator

Map the current application/package directories and documentation locations. List root and nested `AGENTS.md`, other supported instruction files, symlinks, and imports/pointers. Report their intended scopes, inherited guidance, and observed loading behavior separately. Identify missing targets, conflicting or duplicated advice, and reviewed areas without local instruction files. Absence alone is not a reason to add a file.

Return a concise current tree and an instruction map: **path → scope → how reached/loaded → issues**. Keep observed structure separate from proposed changes and distinguish uninspected areas from confirmed absence.

## Terminology investigator

Find recurring domain terms in code, schemas, tests, and docs. Identify repo-specific meanings, multiple names for the same concept, and the same word used with different meanings. Compare existing glossary entries against usage.

Return candidates as **term → meaning and scope → aliases/deviations → source evidence → proposed entry or question**. Preserve legitimate scoped meanings. Flag conflicts for review rather than silently choosing a canonical name, renaming code, or filling the glossary with generic framework vocabulary.

## Documented decisions investigator

Find existing ADRs, decision indexes, architecture/design docs, and plans that explicitly record a choice. Follow relevant linked discussions when accessible; report missing evidence rather than guessing. For each decision, capture the source, stated choice, scope, rationale and consequences if recorded, and known date/status.

Return **existing ADRs to link**, **documented decisions that could become ADR drafts**, and **unresolved or inferred choices** separately. Check for duplicate and superseding records. A plan can be a proposal, and implemented code alone does not prove an accepted decision or its rationale. Mark missing details unknown.

Reuse existing ADRs rather than copying them into new records. Bring supported backfill candidates to the maintainer; use the separate `record-adr` skill when available to draft and review decisions already made. The investigator does not create accepted ADRs during the audit.

## Building-block investigators

Delegate scopes based on the actual repository. These are examples, not a checklist every repository must satisfy:

| Scope | Building blocks and variation to investigate |
| --- | --- |
| Pages and routing | Page/layout creation, public and authenticated access, loading/error states |
| Forms | Create/edit forms, shared fields, validation, submission and server errors |
| Endpoints | Registration, inputs, validation, responses/errors, authentication, authorization, CSRF handling |
| UI and styling | Styling library, shared components, button variants/sizes, loading/disabled states, link versus action |
| Database access | Client setup, queries/mutations, scoping, transactions, shared access helpers |

## Shared testing and CI investigator

Map suites by level and scope, shared fixtures/helpers/services, local commands and working directories, and their source configuration. Inspect CI workflows for triggers, path filters, jobs, dependencies, commands, and outputs. Connect each component's focused command to the shared suite/job where possible, avoiding repeated setup instructions in every guide.

Report configuration evidence separately from observed run results. Record required-check status only with supporting evidence; otherwise mark it unknown. A workflow file does not establish that a run completed or that it gates a merge. Return **suite → scope/command/setup → CI job/trigger → evidence/status/gaps**. Keep component-specific case mappings with their building-block findings.

Inspect existing documentation checks too. Propose additions for demonstrated gaps: per-scope size budgets, file/anchor validity, navigation reachability, and linked-source drift. State the mechanism, rollout, exceptions, and whether the signal is a deterministic failure or a request for review. No CI change is installed during the read-only audit.

Unreachable is different from stale: a file can exist but lack a discoverable route; an old guide can remain correct. Review suspected drift against changed owning code, tests, commands, and explicit replacement/deprecation evidence. Do not delete or fail historical ADRs or unchanged accurate guides merely because of age.

## Common investigator handoff

Give every investigator the same overview and pinned revision, relevant directories, a clear ownership boundary, and the findings format for its scope. Include existing instructions and docs. Keep investigations read-only and return evidence to the coordinating agent. Building-block investigators also return terms and decision sources they encounter to the terminology and decision investigators. Shared code may be inspected by multiple investigators; reconcile overlapping conclusions centrally.

## Compare implementations

For each building block, find its shared abstraction and representative call sites, including materially different implementations. Follow helpers and middleware far enough to understand inherited behavior. Inspect relevant tests and current configuration.

Investigate implementation and tests together. Record the framework/runner, test level and locations, shared testing helpers, fixtures/mocks and other prerequisites, and the focused command with its working directory. Cite the config or scripts supporting the command and mark inferred commands unverified. Map actual test cases to the component's variants, separating existing coverage, observed gaps, and suggested additions. Do not infer coverage merely from a nearby test file.

Use **none found** only after searching identified locations; use **not inspected** when the evidence has not been reviewed. Record tests as **not executed** unless they were actually run. For an execution, capture the exact command, working directory, revision, result, and limits. The audit does not automatically authorize implementing missing tests or running expensive/integration suites.

Describe variants as conditions: “Use this when…” Keep independent dimensions separate. Endpoint authentication, authorization, validation, and CSRF are different concerns; a public/protected label does not describe all of them. Identify the repository's actual mechanisms and applicability rather than assuming every combination exists or is valid.

Investigate variants that change how a developer should implement or use the block. Avoid enumerating every prop combination or inventing missing variants. Group a common rule with its variations; suggest separate guides when responsibilities or rules differ enough to warrant independent reading.

## Establish which pattern is current

Look for evidence in maintained shared APIs and templates, active call sites and tests, explicit repository guidance, deprecation notices, and migration work. Inspect targeted Git history when it helps explain competing implementations. A recent edit, the most frequent implementation, or a passing test alone does not establish the preferred pattern.

Classify findings as **preferred for new work**, **supported variant**, **legacy**, or **uncertain**, with reasons and confidence. Legacy requires evidence of replacement or deprecation, not merely an older file. Describe “what the code does” separately from “what new work should follow.” Flag contradictions, missing protections, or potentially unsafe behavior rather than turning repetition into a recommendation. Ask the maintainer to resolve choices the evidence cannot settle.

## Return concise findings

For each proposed pattern, report:

- **Building block and scope:** what it does and which areas use it.
- **Shared rule and variants:** when each variant applies and what changes.
- **Evidence:** source paths, symbols/lines at the starting revision, a short representative snippet, and relevant tests or guidance.
- **Testing:** framework/runner, locations, setup/helpers, focused command and its evidence, variant-to-case mapping, gaps, and inspected/executed status. Keep proposed tests distinct from existing cases.
- **Status:** preferred/variant/legacy/uncertain, with evidence and confidence for that judgment.
- **Guardrails and gaps:** what breaks if ignored; stale or missing advice and unresolved questions.
- **Suggested home:** existing guidance to reuse or a proposed guide boundary.

Group each pattern's presentation into **base** (when it applies, shared rule, canonical snippet, guardrail, status/evidence), **variants** (condition, difference from the base, specific snippet), and **testing** (case-to-base/variant mapping, focused command, setup references, gaps, execution evidence). Split variants into separate guides only when their responsibilities justify it.

The coordinating agent checks key evidence and reconciles shared concerns before presenting the file layout, pattern guides, glossary candidates, and ADR candidates. Task walkthroughs come afterward, to test whether these building blocks are easy to discover for real work.
