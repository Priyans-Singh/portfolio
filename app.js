'use strict';
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
    detail.querySelector('summary span').textContent = detail.open ? '−' : '+';
  });
});
