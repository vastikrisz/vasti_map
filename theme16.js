/* Public, account-independent light/dark map toggle. */
(() => {
  'use strict';
  const key = 'vmMapTheme';
  const controls = [...document.querySelectorAll('.vm-theme-control')];
  let theme = localStorage.getItem(key) === 'dark' ? 'dark' : 'light';
  function apply(next) {
    theme = next === 'dark' ? 'dark' : 'light';
    localStorage.setItem(key, theme);
    window.vmSetMapTheme?.(theme);
    controls.forEach(control => {
      const trigger = control.querySelector('.vm-theme-trigger');
      if (!trigger) return;
      const label = theme === 'dark' ? 'Váltás világos térképre' : 'Váltás sötét térképre';
      trigger.title = label;
      trigger.setAttribute('aria-label', label);
      trigger.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  }
  controls.forEach(control => {
    control.querySelector('.vm-theme-trigger')?.addEventListener('click', () => {
      apply(theme === 'dark' ? 'light' : 'dark');
    });
  });
  apply(theme);
})();
