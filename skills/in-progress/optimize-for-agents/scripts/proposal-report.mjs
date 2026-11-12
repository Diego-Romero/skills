import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => entities[character]);

function git(repo, ...args) {
  return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function source(repo, revision, { path, start, end }) {
  if (typeof path !== 'string' || path.startsWith('/') || path.split('/').includes('..') ||
      !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start || end - start >= 60) {
    throw new Error('Use a repo-relative source path and an inclusive range of up to 60 lines.');
  }
  const lines = git(repo, 'show', `${revision}:${path}`).replace(/\r?\n$/, '').split(/\r?\n/);
  if (end > lines.length) throw new Error(`Source range exceeds the length of ${path}.`);
  return `<figure><figcaption><code>${escape(path)}:${start}–${end}</code></figcaption>
    <pre class="snippet"><code>${lines.slice(start - 1, end).map((line, index) =>
      `<span class="line"><span class="line-number" aria-hidden="true">${start + index}</span>${escape(line)}</span>`).join('\n')}</code></pre></figure>`;
}

function render(repo, data) {
  const revision = git(repo, 'rev-parse', '--verify', '--end-of-options', `${data.revision}^{commit}`).trim();
  const css = readFileSync(new URL('proposal.css', import.meta.url), 'utf8');
  const patterns = new Map(data.patterns.map((pattern, index) => [pattern.path, index + 1]));
  if (patterns.size !== data.patterns.length) throw new Error('Pattern paths must be unique.');

  const tasks = data.tasks.map(({ title, cwd, steps, pattern }, index) => {
    const patternId = patterns.get(pattern);
    if (!patternId) throw new Error(`Unknown pattern path in task "${title}": ${pattern}`);
    return `<details class="collapse collapse-arrow panel"${index === 0 ? ' open' : ''}>
      <summary class="collapse-title">${escape(title)}</summary>
      <div class="collapse-content"><p>Start in <code>${escape(cwd)}</code></p>
        <ol>${steps.map(({ path, note }) => `<li><code>${escape(path)}</code><p>${escape(note)}</p></li>`).join('')}</ol>
        <a class="btn btn-sm btn-primary" href="#pattern-${patternId}">Open proposed pattern</a>
      </div></details>`;
  }).join('');

  const guides = data.patterns.map(({ path, title, recommendation, examples }) =>
    `<article class="panel guide" id="pattern-${patterns.get(path)}" tabindex="-1">
      <h3>${escape(title)}</h3><p><code>${escape(path)}</code></p><p>${escape(recommendation)}</p>
      ${examples.map((example) => source(repo, revision, example)).join('')}
    </article>`).join('');

  const glossary = data.glossary.map(({ term, definition, evidence }) =>
    `<dt>${escape(term)}</dt><dd>${escape(definition)} <code>${escape(evidence)}</code></dd>`).join('');
  const decisions = data.decisions.map(({ title, path }) =>
    `<li>${escape(title)} · <code>${escape(path)}</code></li>`).join('');
  const questions = data.reviewQuestions.map((question) => `<li>${escape(question)}</li>`).join('');

  return `<!doctype html>
<html lang="en" data-theme="light">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>${escape(data.repository)} · Agent guidance proposal</title>
<style>${css}</style></head>
<body><main>
<header><h1>${escape(data.repository)} · Agent guidance proposal</h1>
<p>${escape(data.scope)}</p><p>Starting revision <code>${revision}</code></p></header>
<nav aria-label="Report sections"><a href="#layout">File layout</a><a href="#walkthroughs">Task walkthroughs</a><a href="#patterns">Patterns</a><a href="#glossary">Glossary and decisions</a><a href="#review">Review</a></nav>
<section id="layout"><h2>File layout</h2><p>${escape(data.layout.rationale)}</p>
<div class="trees"><div class="panel guide"><h3>Current</h3><pre>${escape(data.layout.current.join('\n'))}</pre></div>
<div class="panel guide"><h3>Proposed</h3><pre>${escape(data.layout.proposed.join('\n'))}</pre></div></div></section>
<section id="walkthroughs"><h2>Task walkthroughs</h2>${tasks}</section>
<section id="patterns"><h2>Proposed patterns</h2>${guides}</section>
<section id="glossary"><h2>Glossary and decisions</h2>
${glossary ? `<dl>${glossary}</dl>` : '<p>Glossary proposals are empty.</p>'}
<h3>Existing architecture decision records</h3>
${decisions ? `<ul>${decisions}</ul>` : '<p>No existing ADRs identified in this review.</p>'}</section>
<section id="review"><h2>Review with the maintainer</h2><ul>${questions}</ul></section>
</main></body></html>\n`;
}

try {
  const [input, output, directory = '.', ...extra] = process.argv.slice(2);
  if (!input || !output || extra.length) throw new Error('Usage: node proposal-report.mjs <proposal.json> <report.html> [repo]');
  const repo = git(resolve(directory), 'rev-parse', '--show-toplevel').trimEnd();
  const report = render(repo, JSON.parse(readFileSync(input, 'utf8')));
  writeFileSync(output, report, { mode: 0o600 });
  console.log(resolve(output));
} catch (error) {
  console.error(error.stderr?.trim() || error.message);
  process.exitCode = 1;
}
