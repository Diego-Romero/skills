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

### `optimize-for-agents`

For a walkthrough of how the skill works and why it’s structured this way, see the [Optimize for Agents explainer](https://diego-romero.github.io/skills/) (GitHub Pages launch pending).

Optimise your codebase for agents by giving them just enough context to do the job. Most codebases I've seen have oversized `AGENTS.md` files. Agents load guidance they rarely need and still spend time searching for the information that matters. Keeping context lean can make agents faster, cheaper to run, and more likely to produce good results.

The skill helps you identify recurring code patterns, trim `AGENTS.md` into short instructions and pointers, and set up a glossary and architecture decision records (ADRs). Review the proposed changes in a local report, then run before-and-after evals to see whether agents find the right answers and how much effort it takes.

### `record-adr`

Turn an architectural decision you've made into a short record of what you chose, why, and what it means for the codebase.

## Credits

The structure of this repo and much of the thinking come from [mattpocock/skills](https://github.com/mattpocock/skills), especially `writing-for-agents`, `domain-modeling` and `codebase-design`.

## Contributing

Read [SCOPE.md](./SCOPE.md) first. An issue stays open only if it describes something that went wrong in a real run.

## License

MIT
