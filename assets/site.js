const button = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

const hero = document.querySelector('.hero');
const featureSection = document.querySelector('.feature');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactLayout = window.matchMedia('(max-width: 800px)');
let parallaxFrame;

function updateHeroParallax() {
  parallaxFrame = undefined;
  if (reducedMotion.matches || compactLayout.matches) {
    hero?.style.setProperty('--hero-text-y', '0px');
    hero?.style.setProperty('--hero-image-y', '0px');
    hero?.style.setProperty('--hero-image-blur', '0px');
    featureSection?.style.setProperty('--feature-image-blur', '0px');
    return;
  }

  if (hero) {
    const travel = Math.min(Math.max(window.scrollY, 0), hero.offsetHeight * 1.25);
    const blurProgress = Math.min(travel / hero.offsetHeight, 1);
    hero.style.setProperty('--hero-text-y', `${travel * -0.14}px`);
    hero.style.setProperty('--hero-image-y', `${travel * -(1 / 12)}px`);
    hero.style.setProperty('--hero-image-blur', `${blurProgress * 6}px`);
  }

  if (featureSection) {
    const rect = featureSection.getBoundingClientRect();
    const headerOffset = document.querySelector('.site-header')?.offsetHeight ?? 0;
    const focusDistance = window.innerHeight * 0.45;
    const entering = Math.min(Math.max((window.innerHeight - rect.top) / focusDistance, 0), 1);
    const leaving = Math.min(Math.max((rect.bottom - headerOffset) / focusDistance, 0), 1);
    const clarity = Math.min(entering, leaving);
    featureSection.style.setProperty('--feature-image-blur', `${(1 - clarity) * 6}px`);
  }
}

function requestHeroParallax() {
  if (parallaxFrame === undefined) {
    parallaxFrame = requestAnimationFrame(updateHeroParallax);
  }
}

if (hero || featureSection) {
  updateHeroParallax();
  window.addEventListener('scroll', requestHeroParallax, { passive: true });
  window.addEventListener('resize', requestHeroParallax);
  reducedMotion.addEventListener('change', requestHeroParallax);
  compactLayout.addEventListener('change', requestHeroParallax);
}

if (button && nav) {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });

  nav.addEventListener('click', () => {
    button.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
}
