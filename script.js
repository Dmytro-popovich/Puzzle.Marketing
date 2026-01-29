/* Puzzle Marketing — script.js */
(function () {
  const burger = document.getElementById('burger');
  const header = document.querySelector('.header');
  const mobileNav = document.getElementById('mobileNav');

  burger?.addEventListener('click', () => {
    const open = header.classList.toggle('mobile-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('mobile-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // FAQ accordion
  document.querySelectorAll('.qa').forEach(qa => {
    const btn = qa.querySelector('button');
    btn?.addEventListener('click', () => {
      const isOpen = qa.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.qa').forEach(x => x.setAttribute('aria-expanded', 'false'));
      qa.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Form (demo submit)
  const form = document.getElementById('leadForm');
  const successBox = document.getElementById('successBox');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const contact = document.getElementById('contactField');

    if (!name.value.trim() || !contact.value.trim()) {
      alert('Будь ласка, заповніть Імʼя та Контакт.');
      return;
    }

    // TODO: Connect real sending (Formspree / Google Forms / backend).
    successBox.style.display = 'block';
    form.reset();
    setTimeout(() => { successBox.style.display = 'none'; }, 7000);
  });

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
