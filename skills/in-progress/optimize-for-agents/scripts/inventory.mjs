import { execFileSync } from 'node:child_process';

function git(directory, args) {
  return execFileSync('git', ['-C', directory, ...args], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function inventory(directory) {
  const root = git(directory, ['rev-parse', '--show-toplevel']).trimEnd();
  const revision = git(root, ['rev-parse', '--verify', 'HEAD']).trim();
  const status = git(root, ['status', '--porcelain=v1', '-z']);
  const markdownFiles = git(root, ['ls-files', '-z'])
    .split('\0')
    .filter((file) => /\.md$/i.test(file));

  return {
    root,
    revision,
    hasUncommittedChanges: status.length > 0,
    instructionFiles: markdownFiles.filter((file) => /(^|\/)(AGENTS|CLAUDE)\.md$/.test(file)),
    markdownFiles,
  };
}

try {
  if (process.argv.length > 3) {
    throw new Error('Usage: node inventory.mjs [repo-directory]');
  }
  console.log(JSON.stringify(inventory(process.argv[2] ?? process.cwd()), null, 2));
} catch (error) {
  console.error(error.stderr?.trim() || error.message);
  process.exitCode = 1;
}
