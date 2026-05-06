/* oak.js */
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadOAKData();
  const c = data.creator || {};

  const nameEl = document.getElementById('creatorName');
  if (nameEl && c.name) nameEl.textContent = c.name;

  const photoWrap = document.getElementById('oakPhotoWrap');
  if (photoWrap && c.photo) {
    photoWrap.innerHTML = `<img src="${c.photo}" alt="${c.name || 'OAK'}" class="oak-photo" />`;
  }

  const bioEl = document.getElementById('oakBio');
  if (bioEl) {
    bioEl.innerHTML = `
      <h2 class="oak-name">${c.name || 'OAK'}</h2>
      <span class="oak-title-label">${c.title || 'Creator'}</span>
      <div class="oak-divider"></div>
      <div class="inner-prose">${c.bio || '<p>Coming soon.</p>'}</div>
    `;
  }

  const tagsEl = document.getElementById('creatorTags');
  if (tagsEl && c.tags?.length) {
    tagsEl.innerHTML = c.tags.map(t => `<span class="creator-tag">${t}</span>`).join('');
  }
});
