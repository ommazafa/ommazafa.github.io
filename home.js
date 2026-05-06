/* ============================================
   OAK CREATIONS — Home Page JS
   Projects, Filtering, Modal
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {

  const data = await loadOAKData();

  // ── Hero Tagline ──
  const heroTagline = document.getElementById('heroTagline');
  if (heroTagline && data.site?.tagline) {
    heroTagline.textContent = data.site.tagline;
  }

  // ── Render Projects ──
  const grid = document.getElementById('projectsGrid');
  const loading = document.getElementById('projectsLoading');
  const empty = document.getElementById('projectsEmpty');
  const projects = data.projects || [];

  if (loading) loading.remove();

  if (projects.length === 0) {
    if (empty) empty.classList.remove('hidden');
  } else {
    renderProjects(projects, 'all');
  }

  // ── Filter Bar ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderProjects(projects, filter);
    });
  });

  // ── Modal ──
  const overlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
  }
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

});

// ── Render Projects ──
function renderProjects(projects, filter) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.type === filter);

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="projects-empty">No ${filter} projects yet.</div>`;
    return;
  }

  filtered.forEach((project, i) => {
    const card = createProjectCard(project, i);
    grid.appendChild(card);
  });
}

// ── Create Card ──
function createProjectCard(project, index) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.style.animationDelay = `${index * 0.07}s`;

  const typeLabel = {
    website: 'Website',
    app: 'App',
    other: 'Project',
  }[project.type] || 'Project';

  const thumb = project.thumbnail
    ? `<img src="${escHtml(project.thumbnail)}" alt="${escHtml(project.name)}" loading="lazy" />`
    : `<div class="card-thumb-placeholder"><img src="assets/oak-tree.png" alt="" /></div>`;

  const websiteBtn = project.websiteUrl
    ? `<a href="${escHtml(project.websiteUrl)}" target="_blank" rel="noopener" class="card-btn card-btn-primary">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5H11.5M6.5 1.5L11.5 6.5L6.5 11.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Visit
       </a>`
    : '';

  const appBtn = project.appStoreUrl
    ? `<a href="${escHtml(project.appStoreUrl)}" target="_blank" rel="noopener" class="card-btn card-btn-secondary">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8.5 5H12L9 7.5L10 11.5L6.5 9L3 11.5L4 7.5L1 5H4.5L6.5 1Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
        App Store
       </a>`
    : '';

  const moreBtn = `<button class="card-btn card-btn-secondary" onclick="openModal(${escHtml(JSON.stringify(project))})">Details</button>`;

  card.innerHTML = `
    <div class="card-thumb">
      ${thumb}
      <span class="card-type-badge">${typeLabel}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${escHtml(project.name)}</h3>
      ${project.description ? `<p class="card-desc">${escHtml(project.description)}</p>` : ''}
      <div class="card-actions">
        ${websiteBtn}
        ${appBtn}
        ${moreBtn}
      </div>
    </div>
  `;

  return card;
}

// ── Open Modal ──
function openModal(project) {
  const overlay = document.getElementById('modalOverlay');
  const inner = document.getElementById('modalInner');
  if (!overlay || !inner) return;

  const typeLabel = {
    website: 'Website',
    app: 'App',
    other: 'Project',
  }[project.type] || 'Project';

  const thumb = project.thumbnail
    ? `<img src="${escHtml(project.thumbnail)}" alt="${escHtml(project.name)}" class="modal-project-thumb" />`
    : `<div class="modal-project-thumb-placeholder"><img src="assets/oak-tree.png" alt="" /></div>`;

  const links = [
    project.websiteUrl
      ? `<a href="${escHtml(project.websiteUrl)}" target="_blank" rel="noopener" class="modal-link-btn modal-link-btn-primary">
           Visit Website
           <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M7 2L12 7L7 12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
         </a>`
      : '',
    project.appStoreUrl
      ? `<a href="${escHtml(project.appStoreUrl)}" target="_blank" rel="noopener" class="modal-link-btn modal-link-btn-secondary">App Store</a>`
      : '',
    project.playStoreUrl
      ? `<a href="${escHtml(project.playStoreUrl)}" target="_blank" rel="noopener" class="modal-link-btn modal-link-btn-secondary">Play Store</a>`
      : '',
  ].filter(Boolean).join('');

  inner.innerHTML = `
    ${thumb}
    <span class="modal-project-badge">${typeLabel}</span>
    <h2 class="modal-project-title">${escHtml(project.name)}</h2>
    ${project.description ? `<p class="modal-project-desc">${escHtml(project.description)}</p>` : ''}
    ${links ? `<div class="modal-project-links">${links}</div>` : ''}
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── Close Modal ──
function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Escape HTML ──
function escHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
