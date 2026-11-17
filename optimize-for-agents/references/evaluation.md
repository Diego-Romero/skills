# Checking whether agents find the right facts

Use this reference after choosing common tasks and before making paid calls. The bundled script asks questions using Claude Code and checks the answers. For a different agent, agree on how to run the same kind of check; these results only describe the agent used.

## Prepare the questions

Copy `scripts/run.mjs` and `scripts/eval-report.mjs` from the skill into `evals/agents/` in the target repository. Use `scripts/questions.example.json` as the shape for `evals/agents/questions.json`:

- `id`: unique lowercase identifier with hyphens.
- `question`: a question about the repository, unchanged between the two versions.
- `cwd`: existing repository-relative working directory, defaulting to `.`.
- `answerIn`: `instructions`, `code`, or `docs`, describing the source of the answer.
- `required`: text patterns called regular expressions (regexes), one per required fact. Capitalization is ignored. Every pattern must match for the answer to pass.

Check each answer against the starting revision's source and review the evidence with the maintainer. Write patterns that accept equivalent correct answers. Check them against a plausible wrong answer as well. A regex match can accept a negated or contradictory statement, so inspect the actual answers before interpreting the scores.

Keep generated `evals/agents/results/` out of version control: results include answers and tool paths. Keep private questions and source evidence in the target repository or private pilot directory, never in the public skill repository.

## Confirm instruction loading

Check `claude --version`; native `AGENTS.md` support requires 2.1.277 or newer. A compatible version and an instruction-size estimate do not prove that the files loaded.

Create a small example repository, separate from the real one, with `AGENTS.md` files at its root and in a subfolder. Put a different test fact in each file. Start the agent in the subfolder and ask for each fact without using tools. Make a second commit that changes only one fact, keeping the original answer patterns. With the same script and model settings, verify:

- Both facts pass in the first revision, with no tool calls.
- The unchanged fact passes in the second revision.
- The changed fact fails its original grader, and the report flags the regression.
- Temporary worktrees are removed after the run.

If this check fails, find out why instructions did not load or answers were scored incorrectly before testing the real repository. Keep these example results separate from the real repository's scores. Repeat the check when command-line options or instruction-loading settings change.

The runner enables project settings for native instruction discovery, disables hooks, skills and auto-memory, and confines its read-only tools to its working directories. Review the target revision's project settings before running it. `--restricted` prevented native instruction discovery in the tested CLI invocation; do not add it without repeating the control.

The runner selects Claude's default `claude-md-or-agents-md` behavior. An applicable `CLAUDE.md` can take precedence over native `AGENTS.md`. Check instruction files in the working directory and its ancestors; do not assume a nested file loads merely because it exists.

## Preview and run

Run commands from the target repository root. Use the same full model identifier for the first run and both versions in the comparison; the script otherwise defaults to `sonnet`, a name that can point to a different model over time. First preview the calls with `--plan`, which does not call Claude. Then run the questions on the starting commit with a spending limit:

```bash
node evals/agents/run.mjs --after <starting-commit> --model <model-id> --plan
node evals/agents/run.mjs --after <starting-commit> --model <model-id> --budget <usd>
```

Read the first run's answers and check their scores. Use its reported cost to estimate the full comparison, allowing for variation. Preview the calls for both versions:

```bash
node evals/agents/run.mjs --before <starting-commit> --after <revised-commit> --model <model-id> --plan
```

Show the call count and budget cap before replacing `--plan` with `--budget <usd>`. Call count is revisions × questions × repeats. `--budget` is the total run budget, divided among remaining calls. For a larger agreed sample, add `--repeats 3`; use `--only <question-id>` to retest a particular question. Both revisions must be committed. Do not change questions, graders, or model settings between arms.

## Interpret the report

Open the printed `report.html`; each run also saves `results.json`. Report correctness separately from incomplete calls, then compare turns, token usage, and reported cost. Instruction size is an estimate of ancestor `AGENTS.md` bytes at four bytes per token, not a measurement of loaded context. It excludes other instructions, imports, and documents read during the run.

Inspect regressions and representative tool paths. A higher score can reflect a bad grader; a smaller instruction file can still make retrieval worse. Treat a single paired run as an observation, and report variation across repeats when available. Report only factual retrieval and effort on these questions, with the commits, model, sample size, and completed checks.
