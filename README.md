# Skills

The agent skills I use every day. This collection is in beta.

## Install

These are the planned beta install commands. Pick one route per agent.

### Claude Code

```bash
claude plugin marketplace add Diego-Romero/skills
claude plugin install diego-romero-skills@diego-romero
```

### Other supported agents

```bash
npx skills@latest add Diego-Romero/skills
```

## Skills

### [`optimize-for-agents`](optimize-for-agents/SKILL.md)

“Optimise for agents proposal” is one visual page with a file-tree diff, component and testing cards, and interactive reading plans. Its documentation opens in a side panel or a full-page reader, covering the anatomy of the skill and its outputs, shared testing/CI, and proposed guidance checks. See the [report guide](optimize-for-agents/references/proposal.md) for the input format and export commands.

Make repository-specific knowledge easier for coding agents to find. Start a clean, detached worktree from the latest remote main. Establish the repository's purpose and stack, then delegate audits of its instruction structure, building blocks and variants, terminology, and documented decisions. Prepare editable draft files in the target worktree, review their summaries and proposed layout, then refine and activate the agreed guidance.

Use real tasks afterward to check that the links and routes work. Optional before-and-after evals measure factual retrieval and effort on chosen questions.

### [`record-adr`](record-adr/SKILL.md)

Turn an architectural decision you've made into a short record of what you chose, why, and what it means for the codebase.

## User-invoked

### [`task-driver`](task-driver/SKILL.md) — draft

Drive one task from context gathering and shared understanding to an approved spec, implementation, review, retrospective and closure. Planning and implementation compose pinned Matt Pocock procedures directly, starting with the `grill-with-docs` approach; no separate task-plan or execute-task wrappers are needed. See the [draft guide](docs/task-driver.md). Code-review and the final task-retro (retro plus verification/cleanup) are authored drafts; the full lifecycle is not yet runtime-verified and the general ledger recorder is not implemented. These skills are not included in the plugin's shipping list.

### [`code-review`](code-review/SKILL.md) — draft

Run Matt Pocock's independent Standards/Spec baseline first, then the project's and user's configured review workflow. Keep and reuse project-provided review-branch and review-pr-comments as separate skills. Prepare complete review targets and the PR, verify and present findings, and automatically repair confirmed high/medium issues within approved scope before required follow-up checks/review. See the [review guide](docs/code-review.md). This authored draft has not been exercised against a live reviewer/PR repair loop or added to the plugin's shipping list.

### [`task-retro`](task-retro/SKILL.md) — draft

After required review, offer an optional retrospective before merge with its potential benefits, then complete final verification, authorized integration and safe cleanup. Accepted retrospectives combine Matt's analysis, ledger evidence and our optimize-for-agents documentation process; agreed improvements can use the current PR. A decline skips analysis and continues closure. A retrospective-only request remains analysis-only. See the [guide](docs/task-retro.md). This authored draft is available for user review, not yet live-tested, installed in the project checkouts or included in the plugin's shipping list.

## Credits

The structure of this repo and much of the thinking come from [mattpocock/skills](https://github.com/mattpocock/skills), especially `writing-for-agents`, `domain-modeling` and `codebase-design`.

## Contributing

Read [SCOPE.md](./SCOPE.md) first. An issue stays open only if it describes something that went wrong in a real run.

## License

MIT
