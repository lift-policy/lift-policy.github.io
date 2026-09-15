document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.navbar-burger');
  const menu = document.getElementById('main-menu');
  if (!toggle || !menu) return;

  function setMenuOpen(open) {
    toggle.classList.toggle('is-active', open);
    menu.classList.toggle('is-active', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
  });
});
