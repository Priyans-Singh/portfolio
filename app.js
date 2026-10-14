'use strict';
const themeButton = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeButton.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
  themeButton.querySelector('.theme-text').textContent = dark ? 'Light' : 'Dark';
  themeColor.content = dark ? '#111a18' : '#f5f4ef';
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
    summary.firstChild.textContent = detail.open ? 'Show less' : 'Read full description';
    summary.querySelector('span').textContent = detail.open ? '−' : '+';
  });
});
