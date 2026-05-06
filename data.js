/* ============================================
   OAK CREATIONS — Data Layer
   Fetches all site content from GitHub Gist
   ============================================ */

const OAK_CONFIG = {
  // Fill this in after creating your Gist
  // It's a public Gist so no auth needed to read
  GIST_ID: 'YOUR_GIST_ID_HERE',
  GIST_FILE: 'oakcreations-data.json',
};

const GIST_URL = `https://api.github.com/gists/${OAK_CONFIG.GIST_ID}`;

// ── Default / Fallback Data ──
// This is shown if the Gist hasn't been set up yet
const DEFAULT_DATA = {
  site: {
    tagline: 'A collection of carefully crafted digital experiences.',
    footerCopy: '© 2025 OAK Creations. All rights reserved.',
  },
  about: {
    body: '<p>OAK Creations is a studio of one — driven by curiosity, built with care. This space will be updated soon.</p>',
  },
  creator: {
    name: 'OAK',
    title: 'Creator & Developer',
    bio: '<p>The creator behind OAK Creations. This section will be updated soon.</p>',
    photo: '',
    tags: [],
  },
  credits: {
    body: '<p>Credits and acknowledgements coming soon.</p>',
    items: [],
  },
  projects: [],
};

// ── Data Store ──
window.OAK_DATA = null;

// ── Fetch from Gist ──
async function loadOAKData() {
  // If Gist ID not set, use defaults
  if (!OAK_CONFIG.GIST_ID || OAK_CONFIG.GIST_ID === 'YOUR_GIST_ID_HERE') {
    window.OAK_DATA = DEFAULT_DATA;
    return DEFAULT_DATA;
  }

  try {
    const res = await fetch(GIST_URL, {
      headers: { 'Accept': 'application/vnd.github+json' }
    });

    if (!res.ok) throw new Error('Gist fetch failed');

    const gist = await res.json();
    const file = gist.files[OAK_CONFIG.GIST_FILE];

    if (!file) throw new Error('Data file not found in Gist');

    const data = JSON.parse(file.content);
    window.OAK_DATA = data;
    return data;

  } catch (err) {
    console.warn('[OAK] Could not load remote data, using defaults.', err.message);
    window.OAK_DATA = DEFAULT_DATA;
    return DEFAULT_DATA;
  }
}

// ── Helper: safely get nested value ──
function oakGet(obj, path, fallback = '') {
  return path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : fallback), obj);
}
