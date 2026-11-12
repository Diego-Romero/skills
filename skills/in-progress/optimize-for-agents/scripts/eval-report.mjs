const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function html(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => entities[character]);
}

function summarize(runs) {
  if (!runs.length) return ['—', '—', '—', '—'];
  const answered = runs.filter(({ status }) => ['correct', 'incorrect'].includes(status));
  const correct = answered.filter(({ status }) => status === 'correct').length;
  const turns = answered.map((run) => run.turns).filter(Number.isFinite);
  const tokens = runs.map(({ usage }) => usage && [
    usage.input_tokens, usage.cache_creation_input_tokens, usage.cache_read_input_tokens, usage.output_tokens,
  ].reduce((sum, count) => sum + (count ?? 0), 0));
  return [
    `${correct}/${answered.length} (${runs.length - answered.length} incomplete)`,
    turns.length ? (turns.reduce((sum, count) => sum + count, 0) / turns.length).toFixed(1) : '—',
    tokens.every(Number.isFinite) ? tokens.reduce((sum, count) => sum + count, 0).toLocaleString('en-US') : '—',
    '$' + runs.reduce((sum, run) => sum + run.costUsd, 0).toFixed(3),
  ];
}

export function renderEvalReport({ arms, questions, runs, model, calls, instructionSizes }) {
  const kinds = ['instructions', 'code', 'docs'];
  const rows = Object.keys(arms).flatMap((arm) => kinds
    .filter((kind) => questions.some(({ answerIn }) => answerIn === kind))
    .map((kind) => {
      const cells = summarize(runs.filter((run) => run.arm === arm && run.answerIn === kind));
      return `<tr><th scope="row">${arm}</th><td>${kind}</td>${cells.map((cell) => `<td>${html(cell)}</td>`).join('')}</tr>`;
    }));
  const details = questions.map(({ id, question, required }) => {
    const attempts = runs.filter((run) => run.id === id);
    const before = attempts.filter((run) => run.arm === 'before');
    const after = attempts.filter((run) => run.arm === 'after');
    const counts = (items) => items.filter((run) => run.status === 'correct').length;
    const regressed = before.length === after.length && counts(before) > counts(after);
    return `<details${regressed ? ' open' : ''}>
      <summary>${html(question)}${regressed ? ' · Fewer correct answers' : ''}</summary>
      <p>Required patterns: <code>${html(required.join(', '))}</code></p>
      ${attempts.map((run) => `<section><h3>${run.arm} · attempt ${run.attempt} · ${html(run.status)}</h3>
        <pre>${html(run.answer)}</pre>
        ${run.tools.length ? `<ul>${run.tools.map((tool) =>
          `<li><code>${html([tool.name, tool.path, tool.pattern].filter(Boolean).join(' '))}</code></li>`).join('')}</ul>` : ''}
      </section>`).join('')}
    </details>`;
  });

  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Optimize for Agents eval</title>
<style>
  body { font: 1rem/1.55 system-ui, sans-serif; max-width: 70rem; margin: 2rem auto; padding: 0 1rem; }
  .table { overflow-x: auto; } table { border-collapse: collapse; width: 100%; }
  th, td { text-align: left; border-bottom: 1px solid #aaa; padding: .5rem; }
  details { border-bottom: 1px solid #aaa; padding: .75rem 0; } summary { cursor: pointer; }
  pre { white-space: pre-wrap; overflow-wrap: anywhere; } code { overflow-wrap: anywhere; }
</style>
<main>
<h1>Optimize for Agents eval</h1>
<p>${html(model)} · ${runs.length} of ${calls} calls recorded</p>
<ul>${Object.entries(arms).map(([arm, revision]) => `<li>${arm} <code>${html(revision)}</code></li>`).join('')}</ul>
<h2>Estimated AGENTS.md size</h2>
<p>Tracked ancestor AGENTS.md files, estimated at four bytes per token. Actual loaded context depends on the CLI configuration, imports, and other instructions.</p>
<div class="table"><table><thead><tr><th>Revision</th><th>Working directory</th><th>Files</th><th>Estimated tokens</th></tr></thead>
<tbody>${instructionSizes.map(({ arm, cwd, files, estimatedTokens }) =>
  `<tr><th scope="row">${arm}</th><td>${html(cwd)}</td><td>${html(files.map(({ path }) => path).join(', '))}</td><td>${estimatedTokens}</td></tr>`).join('')}</tbody></table></div>
<h2>Results by question type</h2>
<div class="table"><table><thead><tr><th>Revision</th><th>Answer source</th><th>Correct</th><th>Mean turns</th><th>Total tokens</th><th>Estimated cost</th></tr></thead>
<tbody>${rows.join('')}</tbody></table></div>
<h2>Answers and tool calls</h2>
${details.join('')}
</main>
</html>\n`;
}
