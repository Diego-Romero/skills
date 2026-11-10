Skills live in bucket folders under `skills/`. Create a bucket only when a skill needs it:

- `engineering/`: daily code work
- `productivity/`: daily non-code workflow tools
- `in-progress/`: public on purpose, feedback wanted, not shipped in the plugin
- `deprecated/`: no longer used

A skill in `engineering/` or `productivity/` ships, so it needs all three:

- an entry in `.claude-plugin/plugin.json`'s `skills` array (the plugin ships exactly that list)
- a reference in the top-level `README.md`, under User-invoked or Model-invoked, linking its `SKILL.md`
- a docs page at `docs/<bucket>/<skill-name>.md` with four sections: What it does, When to reach for it, Common questions, It's working if

Skills in `in-progress/` and `deprecated/` appear in none of these.

Versions come from changesets: add one with `npm run changeset`, and the release workflow opens the version PR. `npm run check-plugin-version` fails if `plugin.json` and `package.json` disagree. Run `claude plugin validate . --strict` after touching either manifest.

`scripts/link-skills.sh` symlinks every skill into `~/.claude/skills` and `~/.agents/skills` for local use.

Files adapted from [mattpocock/skills](https://github.com/mattpocock/skills) carry a header saying so. Keep his copyright line in `LICENSE`.
