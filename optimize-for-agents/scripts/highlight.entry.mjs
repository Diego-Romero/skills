import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';
import css from 'highlight.js/lib/languages/css';
import swift from 'highlight.js/lib/languages/swift';
for (const [name, language] of Object.entries({ javascript, typescript, json, bash, markdown, css, swift })) hljs.registerLanguage(name, language);
const extensions = { js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript', ts: 'typescript', tsx: 'typescript', json: 'json', sh: 'bash', md: 'markdown', css: 'css', swift: 'swift' };
export function highlight(code, path) {
  const language = extensions[path.split('.').pop()] || 'plaintext';
  const value = language === 'plaintext' ? code.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
    : hljs.highlight(code, { language, ignoreIllegals: true }).value;
  return { language, value };
}
