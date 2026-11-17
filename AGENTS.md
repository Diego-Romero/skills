Skills live in their own folders at the repository root, each with a `SKILL.md` entry point.

A skill ships when it is included in `.claude-plugin/plugin.json`'s `skills` array (the plugin ships exactly that list). Before shipping a skill, add all three:

- an entry in `.claude-plugin/plugin.json`'s `skills` array (the plugin ships exactly that list)
- a reference in the top-level `README.md`, under User-invoked or Model-invoked, linking its `SKILL.md`
- a docs page at `docs/<skill-name>.md` with four sections: What it does, When to reach for it, Common questions, It's working if

Versions come from changesets: add one with `npm run changeset`, and the release workflow opens the version PR. `npm run check-plugin-version` fails if `plugin.json` and `package.json` disagree. Run `claude plugin validate . --strict` after touching either manifest.

`scripts/link-skills.sh` symlinks every skill into `~/.claude/skills` and `~/.agents/skills` for local use.

Files adapted from [mattpocock/skills](https://github.com/mattpocock/skills) carry a header saying so. Keep his copyright line in `LICENSE`.
