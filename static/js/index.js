document.addEventListener('DOMContentLoaded', () => {
  const relatedDropdown = document.querySelector('.research-dropdown');
  if (!relatedDropdown) return;

  relatedDropdown.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      relatedDropdown.open = false;
    });
  });

  document.addEventListener('click', (event) => {
    if (relatedDropdown.open && !relatedDropdown.contains(event.target)) {
      relatedDropdown.open = false;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && relatedDropdown.open) {
      relatedDropdown.open = false;
      relatedDropdown.querySelector('summary')?.focus();
    }
  });
});
