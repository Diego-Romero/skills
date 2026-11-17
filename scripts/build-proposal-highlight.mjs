import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
await build({
  entryPoints: ['optimize-for-agents/scripts/highlight.entry.mjs'],
  outfile: 'optimize-for-agents/scripts/vendor/highlight.mjs',
  bundle: true, platform: 'node', format: 'esm', minify: true,
  banner: { js: '// Bundled highlight.js. See highlight.LICENSE for its BSD-3-Clause license.' },
});
writeFileSync('optimize-for-agents/scripts/vendor/highlight.LICENSE', readFileSync('node_modules/highlight.js/LICENSE'));
