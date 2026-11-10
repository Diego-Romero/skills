# Skills

My agent skills for real engineering work. One repo, MIT licensed.

They are small, composable and meant to be edited. The set starts with one skill and grows as I find failures worth fixing.

> **Status: work in progress.** No skill has landed yet, so there is nothing to install. The install routes below are the plan, not working commands.

## Install

A plugin updates itself. skills.sh copies editable files into your project, and you update them by hand. Pick one per agent: installing both gives you every skill twice.

### Claude Code

```bash
claude plugin marketplace add Diego-Romero/skills
claude plugin install diego-romero-skills@diego-romero
```

### Any other agent (editable files, manual updates)

```bash
npx skills@latest add Diego-Romero/skills
```

## Why these skills exist

Each skill starts from one failure I saw in a real session.

### #1: The agent reads too much before it starts

An always-loaded `AGENTS.md` that grows by accretion costs tokens on every turn and buries what matters. `context-diet` will restructure instruction files into short pointers, then measure whether the restructure helped or hurt. Results to follow once they are cleared for publishing.

## Reference

**User-invoked** (you type them)

- `context-diet`: audit an instruction chain, take a baseline, restructure into pointers, re-measure, compare. _Coming soon._

**Model-invoked** (the agent reaches for them)

- None yet.

## Credits

The structure of this repo and much of the thinking come from [mattpocock/skills](https://github.com/mattpocock/skills), especially `writing-for-agents`, `domain-modeling` and `codebase-design`.

## Contributing

Read [SCOPE.md](./SCOPE.md) first. An issue stays open only if it describes something that went wrong in a real run.

## License

MIT
