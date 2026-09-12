const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const navigationLinks = document.querySelectorAll('.site-nav a');
const topicLinks = document.querySelectorAll('[data-topic]');
const topicSelect = document.querySelector('[data-topic-select]');
const contactForm = document.querySelector('[data-contact-form]');
const formFeedback = document.querySelector('.form-feedback');

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = 'Menu openen';
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.querySelector('.sr-only').textContent = willOpen ? 'Menu sluiten' : 'Menu openen';
    navigation.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });

  navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

topicLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const topic = link.dataset.topic;
    if (!topicSelect || !topic) return;

    const hasMatchingOption = Array.from(topicSelect.options).some((option) => option.value === topic);
    topicSelect.value = hasMatchingOption ? topic : 'Anders';
  });
});

if (contactForm && formFeedback) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    formFeedback.hidden = false;
    formFeedback.textContent = 'Dank je. Dit demonstratieformulier verstuurt geen gegevens.';
    formFeedback.focus?.();
  });
}

const observedSections = document.querySelectorAll('main section[id]');
const navMap = new Map(
  Array.from(navigationLinks)
    .map((link) => [link.getAttribute('href')?.replace('#', ''), link])
    .filter(([id]) => id)
);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;
      navigationLinks.forEach((link) => link.removeAttribute('aria-current'));
      navMap.get(visibleEntry.target.id)?.setAttribute('aria-current', 'true');
    },
    { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.3, 0.6] }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
