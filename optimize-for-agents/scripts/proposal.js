const guide = document.getElementById('process-guide');
const guideToggle = document.getElementById('open-guide');
const guideExpand = document.getElementById('expand-guide');
const guideTitle = document.getElementById('guide-title');
const proposalTitle = document.title;
const guideClose = document.getElementById('close-guide');
let guideOpener = guideToggle;
const narrowScreen = matchMedia('(max-width: 760px)');
const reportShell = document.querySelector('.report-shell');
let documentationPage = false;
function updateGuideMode() {
  const modal = !documentationPage && !guide.hidden && narrowScreen.matches;
  reportShell.inert = modal;
  if (modal) { guide.setAttribute('role', 'dialog'); guide.setAttribute('aria-modal', 'true'); }
  else { guide.removeAttribute('role'); guide.removeAttribute('aria-modal'); }
}
narrowScreen.addEventListener('change', updateGuideMode);

function applyDocumentationPage(enabled) {
  documentationPage = enabled;
  document.body.classList.toggle('documentation-page', enabled);
  reportShell.hidden = enabled;
  guide.hidden = !enabled;
  guideExpand.hidden = enabled;
  guideClose.textContent = enabled ? '← Proposal' : 'Close ✕';
  guideClose.setAttribute('aria-label', enabled ? 'Back to proposal' : 'Close documentation');
  if (enabled) guideTitle.setAttribute('aria-level', '1');
  else guideTitle.removeAttribute('aria-level');
  document.title = enabled ? 'Optimise for agents · Documentation' : proposalTitle;
  document.body.classList.toggle('docs-open', enabled);
  guideToggle.setAttribute('aria-expanded', String(enabled));
  updateGuideMode();
}
function changeDocumentationPage(enabled, target, replace = false) {
  const url = new URL(location.href);
  if (enabled) url.searchParams.set('view', 'docs');
  else url.searchParams.delete('view');
  url.hash = target;
  history[replace ? 'replaceState' : 'pushState'](null, '', url);
  applyDocumentationPage(enabled);
  if (enabled) openGuide(target);
  else {
    const destination = document.getElementById(target) || guideToggle;
    destination.scrollIntoView({ block: 'start' });
    destination.focus({ preventScroll: true });
  }
}
guideExpand.addEventListener('click', () => changeDocumentationPage(true, 'guide-skill'));
window.addEventListener('popstate', () => {
  applyDocumentationPage(new URLSearchParams(location.search).get('view') === 'docs');
  followHash();
});

function openGuide(target = 'guide-audit', opener = guideToggle) {
  guideOpener = opener;
  guide.hidden = false;
  updateGuideMode();
  document.body.classList.add('docs-open');
  guideToggle.setAttribute('aria-expanded', 'true');
  const section = document.getElementById(target);
  if (section && guide.contains(section)) {
    if (section.tagName === 'DETAILS') section.open = true;
    section.scrollIntoView({ block: 'start' });
    section.focus({ preventScroll: true });
  } else {
    guideClose.focus();
  }
}

function closeGuide() {
  if (documentationPage) { changeDocumentationPage(false, 'proposal-content'); return; }
  guide.hidden = true;
  updateGuideMode();
  document.body.classList.remove('docs-open');
  guideToggle.setAttribute('aria-expanded', 'false');
  const opener = guideOpener?.getClientRects().length ? guideOpener : guideToggle;
  opener.focus({ preventScroll: true });
}

for (const button of document.querySelectorAll('[data-guide]')) {
  button.addEventListener('click', () => {
    if (button === guideToggle && !guide.hidden) closeGuide();
    else openGuide(button.dataset.guide, button);
  });
}
guideClose.addEventListener('click', closeGuide);
document.addEventListener('keydown', event => {
  if (event.key === 'Tab' && !documentationPage && !guide.hidden && narrowScreen.matches) {
    const items = [...guide.querySelectorAll('button, a[href], summary, [tabindex="0"]')]
      .filter(element => element.getClientRects().length);
    const first = items[0], last = items.at(-1);
    if (!items.includes(document.activeElement) || (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  }
  if (event.key === 'Escape' && !guide.hidden) {
    event.preventDefault();
    closeGuide();
  }
});

function followHash() {
  const target = document.getElementById(location.hash.slice(1));
  if (target?.closest('#process-guide')) { openGuide(target.id); return; }
  if (target) {
    if (documentationPage) { changeDocumentationPage(false, target.id, true); return; }
    if (!guide.hidden && narrowScreen.matches) closeGuide();
    target.scrollIntoView({ block: 'start' });
    target.focus({ preventScroll: true });
  }
}
window.addEventListener('hashchange', followHash);
applyDocumentationPage(new URLSearchParams(location.search).get('view') === 'docs');
followHash();
if (documentationPage && !location.hash) openGuide('guide-skill');
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link && link.getAttribute('href') === location.hash) followHash();
});

document.getElementById('changes-only').addEventListener('change', event => {
  for (const row of document.querySelectorAll('.tree-line[data-unchanged="true"]')) row.hidden = event.target.checked;
});

const sectionIndex = document.querySelector('.section-index');
new ResizeObserver(entries => {
  document.documentElement.style.setProperty('--section-offset', `${entries[0].contentRect.height + 50}px`);
}).observe(sectionIndex);

const contextChoice = document.getElementById('context-choice');
const stages = [...document.querySelectorAll('[data-stage]')];
const scenarios = [...document.querySelectorAll('.context-scenario')];
let readingStage = 0;
function updateReadingPlan() {
  if (!contextChoice) return;
  const selected = scenarios[Number(contextChoice.value)];
  for (const scenario of scenarios) scenario.hidden = scenario !== selected;
  for (const file of selected.querySelectorAll('.context-file')) {
    const phase = file.dataset.phase;
    const bucket = phase === 'unknown' ? 'unknown' : phase === 'excluded' ? 'excluded' : Number(phase) <= readingStage ? 'encountered' : 'later';
    selected.querySelector(`[data-bucket="${bucket}"] .context-files`).append(file);
  }
  for (const bucket of selected.querySelectorAll('[data-bucket]')) {
    bucket.querySelector('.bucket-count').textContent = bucket.querySelectorAll('.context-file').length;
  }
  for (const button of stages) {
    const active = Number(button.dataset.stage) === readingStage;
    button.classList.toggle('btn-primary', active);
    button.setAttribute('aria-pressed', String(active));
  }
  const count = selected.querySelector('[data-bucket="encountered"] .bucket-count').textContent;
  document.getElementById('context-status').textContent = `${stages[readingStage].textContent.trim()}: ${count} files in the illustrated reading plan.`;
}
contextChoice?.addEventListener('change', () => { readingStage = 0; updateReadingPlan(); });
for (const button of stages) button.addEventListener('click', () => { readingStage = Number(button.dataset.stage); updateReadingPlan(); });
for (const button of document.querySelectorAll('[data-context]')) button.addEventListener('click', () => {
  const option = [...contextChoice.options].find(item => item.dataset.pattern === button.dataset.context);
  if (!option) return;
  contextChoice.value = option.value;
  readingStage = 0;
  updateReadingPlan();
  document.getElementById('context').scrollIntoView({ block: 'start' });
  contextChoice.focus({ preventScroll: true });
});
updateReadingPlan();
