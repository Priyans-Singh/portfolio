'use strict';
const themeButton = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeButton.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
  themeButton.querySelector('.theme-text').textContent = dark ? 'Light' : 'Dark';
  themeColor.content = dark ? '#121c28' : '#edf1f5';
}
syncThemeButton();
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('portfolio-theme', next); } catch {}
  syncThemeButton();
});
const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('#copy-status');
let clearStatus;
copyButton.addEventListener('click', async () => {
  clearTimeout(clearStatus);
  try {
    await navigator.clipboard.writeText('priyanscsingh@gmail.com');
    copyStatus.textContent = 'Email copied.';
  } catch {
    copyStatus.textContent = 'Please select and copy the email address above.';
  }
  clearStatus = setTimeout(() => { copyStatus.textContent = ''; }, 6000);
});
document.querySelectorAll('.project details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    const summary = detail.querySelector('summary');
    summary.firstChild.textContent = detail.open ? 'Hide technical details' : 'Read technical details';
    summary.querySelector('span').textContent = detail.open ? '−' : '+';
  });
});

// Keep document flow stable when the original header becomes a floating bar.
const siteHeader = document.querySelector('.site-header');
const headerSpace = document.createElement('div');
headerSpace.className = 'header-space';
headerSpace.setAttribute('aria-hidden', 'true');
siteHeader.before(headerSpace);
let headerHeight = siteHeader.offsetHeight;
let headerThreshold = siteHeader.offsetTop + headerHeight;
let headerTicking = false;
function updateFloatingHeader() {
  const floating = window.scrollY > headerThreshold + 8;
  siteHeader.classList.toggle('is-floating', floating);
  headerSpace.style.display = floating ? 'block' : 'none';
  headerSpace.style.height = `${headerHeight}px`;
  headerTicking = false;
}
addEventListener('scroll', () => {
  if (!headerTicking) { headerTicking = true; requestAnimationFrame(updateFloatingHeader); }
}, { passive: true });
addEventListener('resize', () => {
  siteHeader.classList.remove('is-floating');
  headerSpace.style.display = 'none';
  headerHeight = siteHeader.offsetHeight;
  headerThreshold = siteHeader.offsetTop + headerHeight;
  updateFloatingHeader();
});
updateFloatingHeader();
// One shared tooltip avoids clipped bubbles inside project cards.
const tagTooltip = document.createElement('div');
tagTooltip.className = 'tag-tooltip';
tagTooltip.id = 'project-tag-explanation';
tagTooltip.setAttribute('role', 'tooltip');
tagTooltip.hidden = true;
document.body.append(tagTooltip);
let activeTag = null;
let dismissTagTimer;
function closeTagExplanation() {
  if (activeTag) {
    activeTag.removeAttribute('aria-describedby');
    activeTag.setAttribute('aria-expanded', 'false');
  }
  activeTag = null;
  tagTooltip.hidden = true;
}
function showTagExplanation(button) {
  clearTimeout(dismissTagTimer);
  closeTagExplanation();
  activeTag = button;
  button.setAttribute('aria-describedby', tagTooltip.id);
  button.setAttribute('aria-expanded', 'true');
  tagTooltip.textContent = button.dataset.explanation;
  tagTooltip.style.maxWidth = `${Math.min(310, innerWidth - 24)}px`;
  tagTooltip.hidden = false;
  const target = button.getBoundingClientRect();
  const bubble = tagTooltip.getBoundingClientRect();
  tagTooltip.style.left = `${Math.max(12, Math.min(target.left, innerWidth - bubble.width - 12))}px`;
  tagTooltip.style.top = `${Math.max(12, target.bottom + bubble.height + 12 > innerHeight ? target.top - bubble.height - 8 : target.bottom + 8)}px`;
}
function deferTagDismissal() {
  dismissTagTimer = setTimeout(() => {
    if (activeTag && document.activeElement !== activeTag) closeTagExplanation();
  }, 120);
}
document.querySelectorAll('.tag-info').forEach(button => {
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('pointerenter', () => showTagExplanation(button));
  button.addEventListener('pointerleave', deferTagDismissal);
  button.addEventListener('focus', () => showTagExplanation(button));
  button.addEventListener('blur', () => { if (activeTag === button) closeTagExplanation(); });
  button.addEventListener('click', () => showTagExplanation(button));
});
tagTooltip.addEventListener('pointerenter', () => clearTimeout(dismissTagTimer));
tagTooltip.addEventListener('pointerleave', deferTagDismissal);
addEventListener('keydown', event => { if (event.key === 'Escape') closeTagExplanation(); });
addEventListener('scroll', () => {
  if (activeTag && document.activeElement === activeTag) showTagExplanation(activeTag);
  else closeTagExplanation();
}, { passive: true });
addEventListener('resize', closeTagExplanation);
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.tag-info,.tag-tooltip')) closeTagExplanation();
});

// Device preference takes priority; visitors can also stop automatic motion here.
const motionButton = document.querySelector('.motion-toggle');
const deviceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
try { userPaused = localStorage.getItem('portfolio-motion') === 'paused'; } catch {}
function syncMotion() {
  const paused = deviceMotion.matches || userPaused;
  document.documentElement.dataset.motion = paused ? 'paused' : 'auto';
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.disabled = deviceMotion.matches;
  motionButton.textContent = deviceMotion.matches ? 'Reduced motion' : paused ? 'Motion paused' : 'Pause motion';
  motionButton.title = deviceMotion.matches ? 'Reduced motion is enabled in your device settings.' : 'Stop tool scrolling and automatic walkthrough previews';
  document.querySelectorAll('.tech-marquee-viewport').forEach((row, index) => {
    row.tabIndex = paused ? 0 : -1;
    if (paused) {
      row.setAttribute('role', 'region');
      row.setAttribute('aria-label', `Tools row ${index + 1}. Scroll horizontally to explore.`);
    } else {
      row.removeAttribute('role');
      row.removeAttribute('aria-label');
    }
  });
  document.dispatchEvent(new Event('portfolio:motionchange'));
}
motionButton.addEventListener('click', () => {
  userPaused = !userPaused;
  try { localStorage.setItem('portfolio-motion', userPaused ? 'paused' : 'auto'); } catch {}
  syncMotion();
});
deviceMotion.addEventListener('change', syncMotion);
syncMotion();
