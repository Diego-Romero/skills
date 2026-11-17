# Optimise for agents proposal

Use when presenting audit findings to the maintainer. Generate one long local HTML page, without tabs, titled “Optimise for agents proposal”. Keep explanatory prose in the shared documentation side panel. “Read as page” opens the same content as a documentation reader at `?view=docs#guide-skill`, with a contents rail and a route back to the proposal. Maintain one shared template for both views. The main page uses headings and reusable visual components: a unified file-tree diff, component cards, variant comparisons, source/test evidence, a reading-plan interaction, glossary entries, and documented decisions.

Use [proposal.example.json](proposal.example.json) as a synthetic input example. Required fields are `repository`, `revision`, `layout`, and `patterns`. Optional presentation fields include `glossary`, `decisions`, `context` and `tasks`. Keep repository overviews and instruction-file inventories as audit evidence rather than extra cards in the proposal. Mark demonstrations with `synthetic: true`; the visible label is “Example · not your repository”. Real proposals must contain inspected evidence rather than sample findings.

## Structure diff

Prefer `layout.entries`, one item per file: `path`, `status` (`added`, `modified`, `removed`, `moved`, `unchanged`), optional `from` for a move, and a short `purpose`. Include unchanged relevant files so the structure remains legible. Report the complete observed old path for moves. The report displays one proposed tree with current-to-proposed change markers and a “Changes only” filter. Older inputs with `layout.current` and `layout.proposed` arrays render as a line-level tree diff.

Use optional `layout.folders` to map folder paths to short, plain descriptions, shown directly beside the folder in the diff. Explain unfamiliar paths only where needed; avoid labels such as “instruction map”, “scope”, or “discovery” as audit bookkeeping in the main proposal.

## Editable files before review

Prepare the complete Markdown drafts in the target worktree before generating the report. New guides can use their proposed locations. Preserve existing files and user edits; stage active instruction changes in ordinary proposed copies (for example `AGENTS.proposed.md`) until reviewed. Drafts do not create accepted ADRs or install CI changes.

Set `draftPath` on each pattern and any file-diff entry with an editable draft. Decisions and `testingCi` can also have `draftPath`; use `glossaryDraftPath` and `guidanceDraftPath` for shared drafts. Paths must name existing Markdown files inside the target repository. The renderer validates them and generates file links relative to the report. These open the file for viewing; editing happens in the maintainer’s editor.

The HTML is an at-a-glance snapshot: base rules, variant/test-case comparison, testing status and draft links. Full code examples, test recipes, rationale and gaps belong in the Markdown files. Re-read edited drafts and regenerate their summaries; the page does not sync file edits automatically. Source references, when expanded, still come from the pinned starting revision.

## Components and tests

Patterns include `path`, `title`, short `rules`, source `examples`, and optionally `status`, `statusReason`, `consequence`, and `variants` with `name`, `when`, rules, and source examples. Use the same compact pattern summary throughout, with optional collapsed source references. Avoid repeating the full draft or adding introductory paragraphs in the proposal.

Each component has a `testing` object:

- `status`: `found`, `none-found`, or `not-inspected`. Omission renders as not inspected, not as no tests.
- `sharedGuide`: repository-level testing/setup guide to link rather than duplicate.
- `framework`, `cwd`, `command`, `commandEvidence`: actual framework/level and focused command with evidence; label inferred commands unverified.
- `setup`, `fixtures`: prerequisite/helper/fixture lists.
- `cases`: existing case `name`, covered `variants`, and source `examples`.
- `gaps`, `suggestions`: observed gaps and suggested new tests, kept separate.
- `searched`: inspected locations, especially when no tests were found.
- `execution`: `status: not-run` by default. Recorded executions require `command` and `revision`; include `cwd` and result `evidence`.

Variants can carry their own `testing` object when the approach differs. Test existence and inspected cases do not imply successful execution or complete coverage.

## Shared testing and CI

Use `testingCi` for the repository-wide map: audit `status`, `sharedSetup`, `gaps`, `suites`, and `workflows`. Suites carry `name`, `level`, `framework`, `scope`, `cwd`, `command`, `setup`, `ciJob`, `evidence`, optional related `components` (guide paths), and source `examples`.

Workflows carry `name`, `path`, configuration `status`, `triggers`, `filters`, `required` with separate `requiredEvidence`, observed `run` evidence, `jobs`, and source `examples`. Each job has `name`, dependency `needs`, `commands`, and optional `artifacts`. Do not imply a linear pipeline when jobs are independent. Configuration, completed runs, and required merge gates are distinct facts; missing evidence remains unknown.

## Guidance maintenance proposals

Use `guidanceChecks` for existing checks and proposed adoption: `title`, `status`, `signal`, `mechanism`, `scope`, `command`, `policy`, `limits`/exceptions, `rollout`, `evidence`, and optional source `examples`. Show proposed checks as read-only material. Discuss rollout decisions in the conversation.

Propose scoped growth budgets, deterministic local pointer/anchor validation, reachability from agreed entry points, and source-drift review signals. Do not use age alone as a failure condition or delete historical ADRs. A proposed or merely implemented checker must not be labelled enabled in CI without evidence of wiring and results.

The documentation reader includes anatomy for the skill package, root/scoped instructions, patterns/variants/testing, glossary entries, decision records, shared test/CI infrastructure, and maintenance checks. Shared test/CI and check-plan summaries come from the same proposal data; the shape explanations come from `assets/process-guide.html`.

## Interactive reading plan

Supply `context.scenarios` with a `pattern` matching a guide path, a `variant` label, a starting `cwd`, and `files`. Each file has `path`, `kind`, optional `proposed: true`, and `phase`: `0` for initial instructions, `1` for reading guides, `2` for source, `3` for reading tests, or `null` for material excluded from this variant's route.

Initial instruction files also need `loading: verified` and source `evidence` to appear as verified startup reads. Otherwise they remain in “Loading unverified”. Planned guide/code/test reads remain illustrative even when startup loading has been verified.

The interaction shows cumulative reads, future reads, excluded material, and loading uncertainty. Changing the component/variant resets the illustration. “Read tests” does not execute them. This is a reading plan, not a measured trace, a model context snapshot, or a token-savings claim. Use the side panel for these explanations.

## Terms and decisions

Glossary entries can include `term`, `definition`, `scope`, `aliases`, `deviation`, `status`, and `evidence`. Decisions can include `title`, existing record `path`, `status`, `choice`, recorded `rationale`, `evidence`, and proposed next `action`. Keep unknown acceptance and dates explicit. Task routes are optional, later verification material.

## Generate and open

```bash
node <skill-dir>/scripts/proposal-report.mjs <proposal.json> <report.html> <repo>
```

Set `revision` to the recorded starting commit. Code and test snippets are read from that revision, syntax-highlighted during generation, and embedded in the report. Use repository-relative paths and inclusive ranges of at most 60 lines. Highlighting formats code; it does not type-check or validate it.

The default export loads only DaisyUI CSS from a pinned CDN. Layout styles, interactions, the process guide, and snippets are embedded. To use bundled component CSS with no network dependencies:

```bash
node <skill-dir>/scripts/proposal-report.mjs <proposal.json> <report.html> <repo> --offline
```

Keep private proposal inputs and generated HTML outside the public skill repository. Open the report in the maintainer's browser. Both export modes use `assets/process-guide.html`; update that template rather than maintaining a separate explainer page. Collect feedback and decisions in the conversation. The report has no review forms, approval selectors, or note fields; its controls only explore material or navigate the document.
