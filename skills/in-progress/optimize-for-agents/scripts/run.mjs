import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { renderEvalReport } from './eval-report.mjs';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));

function git(cwd, ...args) {
  return execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
    cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  }).trimEnd();
}

function loadQuestions(path) {
  const questions = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('The question file must contain a nonempty array.');
  }
  const ids = new Set();
  return questions.map(({ id, question, cwd = '.', answerIn, required }) => {
    if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id) || ids.has(id)) {
      throw new Error('Each question needs a unique lowercase, hyphenated id.');
    }
    ids.add(id);
    if (typeof question !== 'string' || !question.trim() ||
        typeof cwd !== 'string' || !cwd || isAbsolute(cwd) || cwd.split(/[\\/]/).includes('..') ||
        !['instructions', 'code', 'docs'].includes(answerIn) ||
        !Array.isArray(required) || !required.length ||
        required.some((pattern) => typeof pattern !== 'string' || !pattern.trim())) {
      throw new Error(`Invalid question fields for ${id}.`);
    }
    return { id, question, cwd, answerIn, required, patterns: required.map((pattern) => new RegExp(pattern, 'i')) };
  });
}

function runQuestion(cwd, root, task, model, budget) {
  const result = spawnSync('claude', [
    '--print', '--verbose', '--output-format', 'stream-json',
    '--restricted', '--strict-mcp-config', '--no-session-persistence',
    '--permission-mode', 'dontAsk', '--tools', 'Read,Glob,Grep',
    '--add-dir', root, '--model', model, '--max-budget-usd', String(budget), '--', task.question,
  ], { cwd, encoding: 'utf8', timeout: 300_000, maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  const events = result.stdout.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
  const summary = events.findLast((event) => event.type === 'result');
  if (!summary || !Number.isFinite(summary.total_cost_usd) || summary.total_cost_usd < 0) {
    throw new Error(`Claude did not return a result with cost data for ${task.id} (exit ${result.status}).`);
  }

  const answer = summary.result ?? '';
  const matched = task.patterns.map((pattern) => pattern.test(answer));
  const tools = events.filter((event) => event.type === 'assistant')
    .flatMap((event) => event.message?.content ?? [])
    .filter((block) => block.type === 'tool_use')
    .map(({ name, input }) => ({
      name,
      path: (input?.file_path ?? input?.path ?? cwd).replace(root + sep, '').replace(root, '.'),
      pattern: input?.pattern,
    }));
  return {
    id: task.id, answerIn: task.answerIn, answer, matched, tools,
    status: result.status !== 0 || summary.is_error ? (summary.subtype === 'success' ? 'error' : summary.subtype ?? 'error')
      : matched.every(Boolean) ? 'correct' : 'incorrect',
    turns: summary.num_turns, usage: summary.usage, modelUsage: summary.modelUsage,
    costUsd: summary.total_cost_usd,
    durationMs: summary.duration_ms,
  };
}

function estimateAgentsFiles(root, cwd) {
  const files = [];
  for (let directory = cwd; ; directory = dirname(directory)) {
    const path = join(directory, 'AGENTS.md');
    const info = statSync(path, { throwIfNoEntry: false });
    if (info?.isFile()) files.unshift({ path: relative(root, path), bytes: info.size });
    if (directory === root) break;
  }
  return { files, estimatedTokens: Math.ceil(files.reduce((sum, file) => sum + file.bytes, 0) / 4) };
}

function main() {
  const { values } = parseArgs({
    options: {
      before: { type: 'string' }, after: { type: 'string', default: 'HEAD' },
      tasks: { type: 'string', default: join(scriptDirectory, 'questions.json') },
      only: { type: 'string', multiple: true }, plan: { type: 'boolean' },
      budget: { type: 'string' }, repeats: { type: 'string', default: '1' },
      model: { type: 'string', default: 'sonnet' },
    },
  });
  const root = git(process.cwd(), 'rev-parse', '--show-toplevel');
  const repeats = Number(values.repeats);
  const budget = Number(values.budget);
  if (!Number.isSafeInteger(repeats) || repeats < 1) throw new Error('--repeats must be a positive integer.');
  if ((!values.plan || values.budget !== undefined) && (!Number.isFinite(budget) || budget <= 0)) {
    throw new Error('Pass a positive --budget in USD for a live run.');
  }

  const arms = Object.fromEntries(Object.entries(values.before
    ? { before: values.before, after: values.after }
    : { baseline: values.after }).map(([arm, ref]) => [
    arm, git(root, 'rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`),
  ]));
  const allQuestions = loadQuestions(resolve(values.tasks));
  const questions = values.only ? allQuestions.filter(({ id }) => values.only.includes(id)) : allQuestions;
  if (values.only?.some((id) => !questions.some((task) => task.id === id))) {
    throw new Error('Each --only value must name an existing question.');
  }
  const callCount = Object.keys(arms).length * questions.length * repeats;
  const plan = {
    arms, repeats, model: values.model, calls: callCount,
    budgetUsd: Number.isFinite(budget) ? budget : null,
    questions: questions.map(({ patterns, ...task }) => task),
  };
  console.log(JSON.stringify(plan, null, 2));
  if (values.plan) return;

  const version = execFileSync('claude', ['--version'], { encoding: 'utf8' }).trim();
  const parts = version.match(/^(\d+)\.(\d+)\.(\d+)/)?.slice(1).map(Number);
  if (!parts || (parts[0] < 2 || parts[0] === 2 && (parts[1] < 1 || parts[1] === 1 && parts[2] < 277))) {
    throw new Error(`Claude Code 2.1.277 or newer is required for AGENTS.md support. Found ${version}.`);
  }

  const temporary = mkdtempSync(join(tmpdir(), 'optimize-for-agents-'));
  const worktrees = [];
  const jobs = [];
  const runs = [];
  const instructionSizes = [];
  let costUsd = 0;
  try {
    for (const [arm, revision] of Object.entries(arms)) {
      const checkout = join(temporary, arm);
      git(root, 'worktree', 'add', '--detach', checkout, revision);
      worktrees.push(checkout);
      const checkoutRoot = realpathSync(checkout);
      for (const question of questions) {
        const cwd = realpathSync(resolve(checkoutRoot, question.cwd));
        const fromRoot = relative(checkoutRoot, cwd);
        if (fromRoot === '..' || fromRoot.startsWith('..' + sep) || !statSync(cwd).isDirectory()) {
          throw new Error(`Working directory for ${question.id} must be inside ${arm}.`);
        }
        jobs.push({ arm, checkoutRoot, cwd, question });
      }
    }

    const resultsRoot = join(scriptDirectory, 'results');
    for (const arm of Object.keys(arms)) {
      const directories = new Map(jobs.filter((job) => job.arm === arm)
        .map((job) => [job.cwd, job.checkoutRoot]));
      for (const [cwd, checkoutRoot] of directories) {
        instructionSizes.push({ arm, cwd: relative(checkoutRoot, cwd) || '.', ...estimateAgentsFiles(checkoutRoot, cwd) });
      }
    }
    mkdirSync(resultsRoot, { recursive: true });
    const output = join(mkdtempSync(join(resultsRoot, 'run-')), 'results.json');
    try {
      for (let attempt = 1; attempt <= repeats; attempt += 1) {
        for (const { arm, checkoutRoot, cwd, question } of jobs) {
          const remaining = budget - costUsd;
          if (remaining <= 0) throw new Error('The run reached its budget.');
          const perCall = remaining / (callCount - runs.length);
          const run = runQuestion(cwd, checkoutRoot, question, values.model, perCall);
          runs.push({ arm, attempt, ...run });
          costUsd += run.costUsd;
          console.log(`${arm}/${question.id} #${attempt}: ${run.status}`);
        }
      }
    } finally {
      const evaluation = { ...plan, version, costUsd, instructionSizes, runs };
      writeFileSync(output, JSON.stringify(evaluation, null, 2) + '\n', { mode: 0o600 });
      const report = join(dirname(output), 'report.html');
      writeFileSync(report, renderEvalReport(evaluation), { mode: 0o600 });
      console.log(report);
    }
    if (runs.some(({ status }) => status !== 'correct' && status !== 'incorrect')) process.exitCode = 1;
  } finally {
    for (const checkout of worktrees) git(root, 'worktree', 'remove', '--force', checkout);
    rmSync(temporary, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(error.stderr?.trim() || error.message);
  process.exitCode = 1;
}
