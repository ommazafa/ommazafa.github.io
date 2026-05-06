/* credits.js */
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadOAKData();
  const cr = data.credits || {};

  const body = document.getElementById('creditsBody');
  if (body) {
    let html = '';
    if (cr.body) html += `<div class="inner-prose">${cr.body}</div>`;
    if (cr.items?.length) {
      html += `<div class="credits-grid">` +
        cr.items.map(item => `
          <div class="credit-item">
            <div class="credit-item-name">${item.name || ''}</div>
            ${item.role ? `<div class="credit-item-role">${item.role}</div>` : ''}
            ${item.note ? `<div class="credit-item-note">${item.note}</div>` : ''}
          </div>
        `).join('') +
        `</div>`;
    }
    body.innerHTML = html;
  }
});
