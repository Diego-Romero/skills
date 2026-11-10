#!/usr/bin/env bash
set -euo pipefail

# Adapted from mattpocock/skills (MIT), https://github.com/mattpocock/skills
#
# Dev-only: links every skill in this repo into the local skill directories
# used by each agent harness, so a `git pull` keeps installed skills current.
#   - ~/.claude/skills: Claude Code
#   - ~/.agents/skills: Codex and other Agent Skills-compatible harnesses
# Each entry is a symlink into this repo. Re-run after adding, removing or
# renaming a skill. It is not a supported installer for other people.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DESTS=("$HOME/.claude/skills" "$HOME/.agents/skills")

names=()
srcs=()
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  names+=("$(basename "$src")")
  srcs+=("$src")
done < <(find "$REPO/skills" -name SKILL.md -not -path '*/node_modules/*' -not -path '*/deprecated/*' -print0 2>/dev/null)

if [ "${#names[@]}" -eq 0 ]; then
  echo "no skills found under $REPO/skills, nothing to link"
  exit 0
fi

for DEST in "${DESTS[@]}"; do
  # If $DEST is a symlink that resolves into this repo, writing per-skill
  # symlinks would pollute the working copy. Stop instead.
  if [ -L "$DEST" ]; then
    resolved="$(readlink -f "$DEST")"
    case "$resolved" in
      "$REPO"|"$REPO"/*)
        echo "error: $DEST is a symlink into this repo ($resolved)." >&2
        echo "Remove it (rm \"$DEST\") and re-run; the script will recreate it as a real dir." >&2
        exit 1
        ;;
    esac
  fi

  mkdir -p "$DEST"

  for i in "${!names[@]}"; do
    name="${names[$i]}"
    src="${srcs[$i]}"
    target="$DEST/$name"

    if [ -e "$target" ] && [ ! -L "$target" ]; then
      rm -rf "$target"
    fi

    ln -sfn "$src" "$target"
    echo "linked $name -> $src ($DEST)"
  done
done
