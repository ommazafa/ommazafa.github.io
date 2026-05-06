/* about.js */
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadOAKData();
  const body = document.getElementById('aboutBody');
  if (body && data.about?.body) {
    body.innerHTML = data.about.body;
    body.classList.add('inner-prose');
  }
});
