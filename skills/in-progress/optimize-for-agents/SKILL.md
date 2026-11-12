---
name: optimize-for-agents
description: Propose repo-specific pattern guides, glossary entries, and AGENTS.md pointers, then compare how a coding agent navigates the repo before and after the changes. Use when a maintainer wants to improve or evaluate a repository's agent instructions.
---

# Optimize for agents

Work in the repository the maintainer names. Record the starting commit and check for uncommitted changes. If existing edits matter to the baseline, agree with the maintainer on a revision that captures them.

## Review the guidance

Run `node <skill-dir>/scripts/inventory.mjs <repo>` for the starting revision and tracked Markdown files. Read the relevant code and docs to find recurring tasks and terms. For each proposed guide, show when it applies, the recommendation, and a concrete example with a repo-relative path and lines. Show competing patterns where the codebase uses more than one. For each glossary entry, show the proposed definition and evidence of how the term is used.

Ask the maintainer which proposals to keep, change, or drop before writing the guidance. Link existing ADRs and surface open decisions as questions. The maintainer can use `record-adr` to document decisions they have made.

## Review the structure

Show the current and proposed trees and explain why each proposed instruction file sits where it does. For representative tasks, show the working directory, applicable instruction files, the pointer to follow, and the pattern it leads to. Keep repo-wide rules and verification commands near the root, and put area-specific guidance near the code it governs.

Use `references/proposal.example.json` as the shape for the proposal. Set `revision` to the recorded commit and use repo-relative paths and inclusive line numbers for examples. Generate the offline report with `node <skill-dir>/scripts/proposal-report.mjs <proposal.json> <report.html> <repo>`. Keep both outputs local because they may contain repository details and source.

Share the report and ask the maintainer how they want the tree organized. Apply their choices and verify that the pointers resolve.

## Verify the change

Draft factual questions with a working directory, required facts, and where the answer lives (instructions, code, or docs). Review the questions with the maintainer and check they are answerable at the starting revision. Compare the same questions under the same agent and model settings at the two revisions. Show the planned calls and estimated cost before running, and use a budget cap.

Copy `scripts/run.mjs` and `scripts/eval-report.mjs` into `evals/agents/` in the target repo. Use `scripts/questions.example.json` as the format for `evals/agents/questions.json`. The `required` array contains case-insensitive regexes, one per fact. Keep generated `evals/agents/results/` out of version control because it contains answers and tool calls.

- Preview a baseline smoke run with `node evals/agents/run.mjs --after <starting-revision> --plan`. For a live run, replace `--plan` with `--budget <usd>`. Resolve questionable prompts and graders before comparing revisions.
- Compare committed revisions with `node evals/agents/run.mjs --before <starting-revision> --after <revised-revision> --budget <usd>`. Add `--repeats 3` for a larger sample or `--only <question-id>` to retest a question. Use the smoke run's reported cost as the basis for estimating the larger run.
- Open the `report.html` path printed by the runner. Each run saves its own HTML report and JSON results. The runner needs Claude Code 2.1.277 or newer to evaluate native `AGENTS.md` loading.

Report estimated instruction size by directory and compare correctness, turns, tokens, and cost. Inspect regressed answers and the paths the agent searched. Fix pointers or restore important guidance where the agent needs it, then rerun affected questions. Report which checks or runs actually completed.

## Protect the structure

Propose CI checks for file-size growth, broken links or anchors, and guides without an incoming pointer. Use the repo's existing linters and tests for rules they can enforce. Review the proposed checks with the maintainer and put the verification commands where agents can find them.
