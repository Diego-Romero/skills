import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, realpathSync, statSync } from 'node:fs';
import { resolve, relative, dirname, sep } from 'node:path';
import { highlight } from './vendor/highlight.mjs';

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => entities[character]);
const cdn = 'https://cdn.jsdelivr.net/npm/daisyui@5.7.50/daisyui.css';
const badge = (value, tone = '') => `<span class="badge badge-outline ${tone}">${escape(value)}</span>`;
const chips = values => `<div class="chips">${values.map(value => badge(value)).join('')}</div>`;
const fields = entries => `<dl class="field-grid">${entries.filter(([, value]) => value !== undefined && value !== '').map(([name, value]) => `<div class="field"><dt>${escape(name)}</dt><dd>${Array.isArray(value) ? chips(value) : escape(value)}</dd></div>`).join('')}</dl>`;
const empty = state => `<div class="empty">${badge(state)}</div>`;
const card = (title, status, body, attributes = '') => `<article class="card component-card" ${attributes}><div class="card-body"><header class="component-header"><h3>${escape(title)}</h3>${status ? badge(status) : ''}</header>${body}</div></article>`;

function git(repo, ...args) {
  return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function source(repo, revision, { path, start, end }, open = true) {
  if (typeof path !== 'string' || path.startsWith('/') || path.split('/').includes('..') ||
      !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start || end - start >= 60) {
    throw new Error('Use a repo-relative source path and an inclusive range of up to 60 lines.');
  }
  const lines = git(repo, 'show', `${revision}:${path}`).replace(/\r?\n$/, '').split(/\r?\n/);
  if (end > lines.length) throw new Error(`Source range exceeds the length of ${path}.`);
  const { value, language } = highlight(lines.slice(start - 1, end).join('\n'), path);
  return `<details class="evidence"${open ? ' open' : ''}><summary><code>${escape(path)}:${start}–${end}</code>${badge(language)}</summary><div class="snippet"><pre class="line-numbers" aria-hidden="true">${Array.from({ length: end - start + 1 }, (_, i) => start + i).join('\n')}</pre><pre><code class="language-${language}">${value}</code></pre></div></details>`;
}

// File-level changes when supplied; line-level tree diff for older proposal inputs.
function structureDiff(layout, draftLink) {
  if (!layout.entries) {
    const before = layout.current ?? [], after = layout.proposed ?? [];
    const lengths = Array.from({ length: before.length + 1 }, () => new Uint32Array(after.length + 1));
    for (let i = before.length - 1; i >= 0; i--) for (let j = after.length - 1; j >= 0; j--) {
      lengths[i][j] = before[i] === after[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
    }
    const rows = [];
    let i = 0, j = 0;
    while (i < before.length || j < after.length) {
      if (i < before.length && j < after.length && before[i] === after[j]) { rows.push(['unchanged', before[i]]); i++; j++; }
      else if (i < before.length && (j >= after.length || lengths[i + 1][j] >= lengths[i][j + 1])) rows.push(['removed', before[i++]]);
      else rows.push(['added', after[j++]]);
    }
    return rows.map(([status, line]) => `<div class="tree-line change-${status}" data-unchanged="${status === 'unchanged'}"><span class="diff-mark">${status === 'added' ? '+' : status === 'removed' ? '−' : '·'}</span><code>${escape(line)}</code></div>`).join('');
  }
  const root = { children: new Map() };
  const allowed = new Set(['added', 'modified', 'removed', 'moved', 'unchanged']);
  for (const entry of layout.entries) {
    if (!allowed.has(entry.status) || typeof entry.path !== 'string') throw new Error('File diff entries require a path and added/modified/removed/moved/unchanged status.');
    const parts = entry.path.split('/').filter(Boolean);
    let node = root;
    parts.forEach((part, index) => {
      if (!node.children.has(part)) node.children.set(part, { name: part, children: new Map() });
      node = node.children.get(part);
      if (index === parts.length - 1) {
        if (node.entry) throw new Error(`Duplicate file diff entry: ${entry.path}`);
        node.entry = entry;
      }
    });
  }
  const changed = node => node.entry?.status !== 'unchanged' && !!node.entry || [...node.children.values()].some(changed);
  function rows(node, depth = 0, parentPath = '') {
    return [...node.children.values()].map(child => {
      const entry = child.entry;
      const path = parentPath ? `${parentPath}/${child.name}` : child.name;
      const purpose = entry?.purpose ?? (child.children.size ? layout.folders?.[path] : undefined);
      const status = entry?.status ?? 'folder';
      const mark = { added: '+', modified: '~', removed: '−', moved: '↔', unchanged: '·', folder: ' ' }[status];
      return `<div class="tree-line change-${status}" data-unchanged="${!changed(child)}"><span class="diff-mark">${mark}</span><code class="tree-path" style="padding-left:${depth * 18}px"${entry ? ` title="${escape(entry.path)}"` : ''}>${entry?.draftPath ? draftLink(entry.draftPath, child.name, 'file-draft-link') : escape(child.name)}${child.children.size ? '/' : ''}</code>${entry && status !== 'unchanged' ? badge(status) : ''}${entry?.from ? `<code class="muted previous-path">← ${escape(entry.from)}</code>` : ''}${purpose ? `<span class="file-purpose">${escape(purpose)}</span>` : ''}</div>${rows(child, depth + 1, path)}`;
    }).join('');
  }
  return rows(root);
}

function render(repo, data, offline, output) {
  const revision = git(repo, 'rev-parse', '--verify', '--end-of-options', `${data.revision}^{commit}`).trim();
  const css = readFileSync(new URL(offline ? 'proposal.css' : 'proposal-layout.css', import.meta.url), 'utf8');
  const script = readFileSync(new URL('proposal.js', import.meta.url), 'utf8');
  let guide = readFileSync(new URL('../assets/process-guide.html', import.meta.url), 'utf8');
  const scriptHash = createHash('sha256').update(script).digest('base64');
  const patterns = new Map(data.patterns.map((pattern, index) => [pattern.path, index + 1]));
  if (patterns.size !== data.patterns.length) throw new Error('Pattern paths must be unique.');
  const tasks = data.tasks ?? [], glossary = data.glossary ?? [], decisions = data.decisions ?? [];
  const scenarios = data.context?.scenarios ?? [];
  const evidence = (examples, open = true) => (examples ?? []).map(example => source(repo, revision, example, open)).join('');
  const help = target => `<button type="button" class="btn btn-ghost btn-sm section-help" data-guide="${target}" aria-controls="process-guide" aria-label="Open documentation" title="Documentation">?</button>`;
  let sectionNumber = 0;
  const heading = (title, target) => `<header class="section-heading"><h2><span class="section-number">${String(++sectionNumber).padStart(2, '0')}</span>${title}</h2>${help(target)}</header>`;

  function draftLink(path, label = 'Open draft', className = 'btn btn-sm') {
    if (typeof path !== 'string' || path.startsWith('/') || path.split('/').includes('..') || !/\.md$/i.test(path)) throw new Error('Drafts need a repository-relative Markdown path.');
    const root = realpathSync(repo);
    const target = realpathSync(resolve(repo, path));
    if (!target.startsWith(root + sep) || !statSync(target).isFile()) throw new Error('Draft links must point to files inside the target repository.');
    const file = relative(dirname(resolve(output)), target).split(sep).map(encodeURIComponent).join('/');
    return `<a class="${className}" href="${escape(file.startsWith('.') ? file : './' + file)}" target="_blank" rel="noopener" title="${escape(path)}">${escape(label)}</a>`;
  }
  function testState(test) {
    test ??= { status: 'not-inspected' };
    const status = { found: 'Tests found', 'none-found': 'None found', 'not-inspected': 'Not inspected' }[test.status];
    if (!status) throw new Error('Testing status must be found, none-found, or not-inspected.');
    const execution = test.execution ?? { status: 'not-run' };
    if (execution.status !== 'not-run' && (!execution.command || !execution.revision)) throw new Error('Executed test results require the exact command and revision.');
    return { test, status, execution };
  }
  const guides = data.patterns.map(pattern => {
    const { test, status, execution } = testState(pattern.testing);
    const variants = pattern.variants ?? [];
    const references = [...(pattern.examples ?? []), ...variants.flatMap(variant => variant.examples ?? []), ...(test.cases ?? []).flatMap(item => item.examples ?? [])];
    const rows = variants.map(variant => {
      const variantState = testState(variant.testing ?? pattern.testing);
      const cases = (variantState.test.cases ?? []).filter(item => variant.testing || item.variants?.includes(variant.name));
      const tests = cases.length ? cases.map(item => item.name) : [variantState.test.status === 'found' ? 'No case mapped' : variantState.status];
      references.push(...(variant.testing?.cases ?? []).flatMap(item => item.examples ?? []));
      return `<tr><th scope="row">${escape(variant.name)}</th><td>${escape(variant.when)}</td><td>${chips(tests)}</td></tr>`;
    }).join('');
    return card(pattern.title, pattern.status, `
      <div class="component-toolbar"><code class="guide-path">${escape(pattern.path)}</code><div class="chips">${pattern.draftPath ? draftLink(pattern.draftPath) : badge('Draft not written')}${scenarios.some(item => item.pattern === pattern.path) ? `<button type="button" class="btn btn-sm btn-ghost" data-context="${escape(pattern.path)}">Reading plan ↓</button>` : ''}</div></div>
      ${fields([['Base', pattern.rules?.length ? pattern.rules : pattern.recommendation]])}
      ${rows ? `<div class="table-scroll"><table class="table variant-summary"><thead><tr><th>Variant</th><th>Use when</th><th>Existing test cases</th></tr></thead><tbody>${rows}</tbody></table></div>` : ''}
      <div class="testing-summary"><h4>Testing</h4><div class="chips">${badge(status)}${test.framework ? badge(test.framework) : ''}${test.cases?.length ? badge(`${test.cases.length} ${test.cases.length === 1 ? 'case' : 'cases'}`) : ''}${badge(execution.status === 'not-run' ? 'Not executed' : execution.status)}${test.gaps?.length ? badge(`${test.gaps.length} ${test.gaps.length === 1 ? 'gap' : 'gaps'}`) : ''}</div></div>
      ${references.length ? `<details class="pattern-references"><summary>Source references</summary>${evidence(references, false)}</details>` : ''}
    `, `id="pattern-${patterns.get(pattern.path)}" tabindex="-1"`);
  }).join('');

  const bucketNames = { encountered: 'Read by this step', later: 'Read later', excluded: 'Not selected', unknown: 'Loading unverified' };
  const contextCards = scenarios.map((scenario, index) => {
    if (!patterns.has(scenario.pattern)) throw new Error(`Unknown pattern in reading plan: ${scenario.pattern}`);
    const seen = new Set();
    const grouped = { encountered: [], later: [], excluded: [], unknown: [] };
    for (const file of scenario.files) {
      if (seen.has(file.path)) throw new Error(`Duplicate reading-plan file: ${file.path}`);
      seen.add(file.path);
      if (file.phase !== null && ![0, 1, 2, 3].includes(file.phase)) throw new Error('Reading-plan file phases must be 0–3 or null.');
      const phase = file.phase === 0 && (file.loading !== 'verified' || !file.evidence) ? 'unknown' : file.phase === null ? 'excluded' : file.phase;
      const bucket = phase === 'unknown' ? 'unknown' : phase === 'excluded' ? 'excluded' : phase === 0 ? 'encountered' : 'later';
      grouped[bucket].push(`<div class="context-file" data-phase="${phase}"><span class="file-kind">${escape(file.kind ?? 'file')}</span><code>${escape(file.path)}</code>${file.proposed ? badge('Proposed') : ''}${file.evidence ? `<span class="small muted">${escape(file.evidence)}</span>` : ''}</div>`);
    }
    return `<article class="context-scenario" data-index="${index}"${index ? ' hidden' : ''}>${fields([['Component', data.patterns.find(item => item.path === scenario.pattern).title], ['Variant', scenario.variant ?? scenario.title], ['Start directory', scenario.cwd ?? '.']])}<div class="context-board">${Object.entries(grouped).map(([bucket, files]) => `<section class="context-bucket bucket-${bucket}" data-bucket="${bucket}"><h4>${bucketNames[bucket]} <span class="bucket-count">${files.length}</span></h4><div class="context-files">${files.join('')}</div></section>`).join('')}</div></article>`;
  }).join('');
  const context = contextCards ? `<div class="card"><div class="card-body"><div class="context-controls"><label class="feedback-label" for="context-choice">Component / variant<select class="select" id="context-choice">${scenarios.map((item, index) => `<option value="${index}" data-pattern="${escape(item.pattern)}">${escape(data.patterns.find(pattern => pattern.path === item.pattern).title)} · ${escape(item.variant ?? item.title)}</option>`).join('')}</select></label>${badge('Illustrative plan · not a live trace')}</div><div class="read-stages" role="group" aria-label="Reading stage">${['Start', 'Read guide', 'Read code', 'Read tests'].map((label, index) => `<button type="button" class="btn btn-sm${index === 0 ? ' btn-primary' : ''}" data-stage="${index}" aria-pressed="${index === 0}"><span class="stage-number">${index + 1}</span>${label}</button>`).join('')}</div><output id="context-status" class="visually-hidden" aria-live="polite"></output>${contextCards}</div></div>` : empty('Reading plan not mapped');

  const terms = glossary.map(term => card(term.term, term.status, fields([['Definition', term.definition], ['Scope', term.scope], ['Aliases', term.aliases], ['Naming difference', term.deviation], ['Evidence', term.evidence]]))).join('');
  const records = decisions.map(decision => card(decision.title, decision.status ?? 'Existing record', (decision.draftPath ? draftLink(decision.draftPath) : '') + fields([['Record', decision.path], ['Choice', decision.choice], ['Recorded rationale', decision.rationale], ['Evidence', decision.evidence], ['Next action', decision.action]]))).join('');
  const taskCards = tasks.map(({ title, cwd, steps, pattern, scenario, outcome, confirmed }) => {
    const id = patterns.get(pattern);
    if (!id) throw new Error(`Unknown pattern path in task "${title}": ${pattern}`);
    return card(title, confirmed ? 'Confirmed task' : 'Suggested task', fields([['Start directory', cwd], ['Scenario', scenario], ['Ready when', outcome]]) + `<div class="mini-route">${steps.map(step => `<code>${escape(step.path)}</code><span aria-hidden="true">→</span>`).join('')}<a href="#pattern-${id}"><code>${escape(pattern)}</code></a></div>`);
  }).join('');
  const testingCi = data.testingCi;
  const suites = (testingCi?.suites ?? []).map(suite => card(suite.name, suite.level, fields([
    ['Framework', suite.framework], ['Scope', suite.scope], ['Working directory', suite.cwd], ['Local command', suite.command], ['Shared setup', suite.setup], ['CI job', suite.ciJob], ['Evidence', suite.evidence]
  ]) + (suite.components?.length ? `<div class="chips">${suite.components.map(path => patterns.has(path) ? `<a class="badge badge-outline" href="#pattern-${patterns.get(path)}">${escape(path)}</a>` : badge(path)).join('')}</div>` : '') + evidence(suite.examples))).join('');
  const workflows = (testingCi?.workflows ?? []).map(workflow => card(workflow.name, workflow.status ?? 'Configured · run not observed', fields([
    ['Workflow', workflow.path], ['Triggers', workflow.triggers], ['Filters / matrix', workflow.filters], ['Required merge check', workflow.required ?? 'Unknown'], ['Required-check evidence', workflow.requiredEvidence], ['Observed run', workflow.run ?? 'Not inspected']
  ]) + `<div class="ci-pipeline">${(workflow.jobs ?? []).map(job => `<section class="ci-job"><h5>${escape(job.name)}</h5>${fields([['Depends on', job.needs?.length ? job.needs : ['No job dependency']], ['Commands', job.commands], ['Artifacts', job.artifacts]])}</section>`).join('')}</div>` + evidence(workflow.examples, false))).join('');
  const testingMaterial = testingCi ? card('Shared testing setup', testingCi.status ?? 'Not inspected', (testingCi.draftPath ? draftLink(testingCi.draftPath) : '') + fields([['Shared setup', testingCi.sharedSetup], ['Observed gaps / unknowns', testingCi.gaps]])) + suites + workflows : empty('Testing and CI not inspected');
  const checks = data.guidanceChecks ?? [];
  const checkCards = checks.map(check => card(check.title, check.status, fields([
    ['Signal', check.signal], ['Mechanism', check.mechanism], ['Scope', check.scope], ['Command / config', check.command], ['Failure policy', check.policy], ['Budget / exceptions', check.limits], ['Rollout', check.rollout], ['Evidence / result', check.evidence]
  ]) + evidence(check.examples, false))).join('');
  guide = guide.replace('<!-- REPO_TESTING_OVERVIEW -->', testingCi ? fields([
    ['Audit status', testingCi.status ?? 'Not inspected'], ['Suites', (testingCi.suites ?? []).map(item => item.name)], ['Configured workflows', (testingCi.workflows ?? []).map(item => item.name)], ['Shared setup', testingCi.sharedSetup], ['Gaps / unknowns', testingCi.gaps]
  ]) : empty('Repository testing / CI not inspected'));
  guide = guide.replace('<!-- GUIDANCE_CHECKS_OVERVIEW -->', checks.length ? `<div class="guide-check-status">${checks.map(check => `<div><strong>${escape(check.title)}</strong>${badge(check.status)}</div>`).join('')}</div>` : empty('No repository check plan recorded'));
  const stylesheet = offline ? '' : `<link rel="stylesheet" href="${cdn}" referrerpolicy="no-referrer">`;
  const sections = [['layout', 'Structure'], ['patterns', 'Components'], ['testing-ci', 'Testing & CI'], ['context', 'Reading plan'], ['glossary', 'Glossary'], ['decisions', 'Decisions'], ['guidance-checks', 'Guidance checks'], ...(tasks.length ? [['walkthroughs', 'Task routes']] : [])];
  return `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'${offline ? '' : ' https://cdn.jsdelivr.net'}; script-src 'sha256-${scriptHash}'; img-src data:; base-uri 'none'; form-action 'none'">
<title>Optimise for agents proposal · ${escape(data.repository)}</title>${stylesheet}<style>${css}</style></head><body><a class="skip-link" href="#proposal-content">Skip to proposal</a><div class="report-shell"><main id="proposal-content" tabindex="-1">
<header class="report-header"><div><div class="eyebrow">${escape(data.repository)}</div><h1>Optimise for agents proposal</h1></div><div class="header-actions">${badge(data.synthetic ? 'Example · not your repository' : 'Local draft')}<button type="button" class="btn btn-sm" id="open-guide" data-guide="guide-review" aria-controls="process-guide" aria-expanded="false">Documentation ↗</button></div></header>
<div class="report-meta">${badge(`${patterns.size} components`)}${badge(`${glossary.length} terms`)}${badge(`${decisions.length} decisions`)}<code title="${revision}">${revision.slice(0, 7)}</code></div>
<nav class="section-index" aria-label="Proposal contents">${sections.map(([id, label]) => `<a href="#${id}">${label} ↓</a>`).join('')}</nav>
<section class="proposal-section" id="layout" tabindex="-1">${heading('Proposed file structure', 'guide-review')}<div class="card"><div class="card-body"><header class="component-header"><h3>Current → Proposed</h3><label class="filter-label"><input type="checkbox" id="changes-only"> Changes only</label></header><div class="diff-legend">${badge('+ added', 'tone-added')}${badge('~ modified', 'tone-modified')}${badge('− removed', 'tone-removed')}${badge('↔ moved')}${badge('· unchanged')}</div><div class="file-diff">${structureDiff(data.layout, draftLink)}</div></div></div></section>
<section class="proposal-section" id="patterns" tabindex="-1">${heading('Patterns at a glance', 'guide-anatomy')}${guides || empty('No component findings')}</section>
<section class="proposal-section" id="testing-ci" tabindex="-1">${heading('Testing & CI', 'guide-testing')}${testingMaterial}</section>
<section class="proposal-section" id="context" tabindex="-1">${heading('Reading plan', 'guide-context')}${context}</section>
<section class="proposal-section" id="glossary" tabindex="-1">${heading('Glossary', 'guide-audit')}${data.glossaryDraftPath ? draftLink(data.glossaryDraftPath) : ''}${terms || empty('No proposed terms')}</section>
<section class="proposal-section" id="decisions" tabindex="-1">${heading('Documented decisions', 'guide-audit')}${records || empty('No documented decisions')}</section>
<section class="proposal-section" id="guidance-checks" tabindex="-1">${heading('Guidance checks', 'guide-maintenance')}${data.guidanceDraftPath ? draftLink(data.guidanceDraftPath) : ''}${checkCards || empty('Documentation checks not inspected')}</section>
${tasks.length ? `<section class="proposal-section" id="walkthroughs" tabindex="-1">${heading('Task routes · later verification', 'guide-check')}${taskCards}</section>` : ''}

<footer><details><summary>Source revision & scope</summary>${fields([['Revision', revision], ['Scope', data.scope]])}</details></footer></main></div>
<aside class="docs-panel" id="process-guide" aria-labelledby="guide-title" hidden><header class="docs-header"><h2 id="guide-title">Documentation</h2><div class="docs-actions"><button type="button" class="btn btn-sm btn-ghost" id="close-guide" aria-label="Close documentation">Close ✕</button><button type="button" class="btn btn-sm" id="expand-guide">Read as page ↗</button></div></header><div class="docs-content">${guide}</div></aside><script>${script}</script></body></html>\n`;
}

try {
  const args = process.argv.slice(2);
  const offline = args.at(-1) === '--offline';
  if (offline) args.pop();
  const [input, output, directory = '.', ...extra] = args;
  if (!input || !output || extra.length) throw new Error('Usage: node proposal-report.mjs <proposal.json> <report.html> [repo] [--offline]');
  const repo = git(resolve(directory), 'rev-parse', '--show-toplevel').trimEnd();
  writeFileSync(output, render(repo, JSON.parse(readFileSync(input, 'utf8')), offline, output), { mode: 0o600 });
  console.log(resolve(output));
} catch (error) {
  console.error(error.stderr?.trim() || error.message);
  process.exitCode = 1;
}
