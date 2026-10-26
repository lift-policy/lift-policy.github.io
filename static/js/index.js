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

  const relatedMenu = document.querySelector('.related-research-menu');
  const relatedToggle = relatedMenu?.querySelector('.related-research-toggle');

  function setRelatedOpen(open) {
    if (!relatedMenu || !relatedToggle) return;
    relatedMenu.classList.toggle('is-active', open);
    relatedToggle.setAttribute('aria-expanded', String(open));
  }

  if (relatedMenu && relatedToggle) {
    relatedToggle.addEventListener('click', () => {
      setRelatedOpen(relatedToggle.getAttribute('aria-expanded') !== 'true');
    });

    relatedMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setRelatedOpen(false));
    });

    document.addEventListener('click', (event) => {
      if (!relatedMenu.contains(event.target)) setRelatedOpen(false);
    });
  }

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
    if (event.key === 'Escape' && relatedToggle?.getAttribute('aria-expanded') === 'true') {
      setRelatedOpen(false);
      relatedToggle.focus();
    }
  });
});
