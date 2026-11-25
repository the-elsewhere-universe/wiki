const button = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

const articleHeader = document.querySelector('.article-page .article-hero');
const articleLead = document.querySelector('.article-page .article-lead');
let creatureHero;

if (articleHeader && articleLead) {
  creatureHero = document.createElement('section');
  creatureHero.className = 'creature-hero';
  creatureHero.setAttribute('aria-label', `${articleHeader.querySelector('h1')?.textContent || 'Creature'} overview`);
  articleHeader.before(creatureHero);
  creatureHero.append(articleLead, articleHeader);

  const lede = document.querySelector('.article-prose .lede');
  const status = articleHeader.querySelector('.record-status');
  if (lede) {
    const summary = document.createElement('p');
    summary.className = 'creature-summary';
    summary.textContent = lede.textContent;
    if (status) status.before(summary);
    else articleHeader.firstElementChild?.append(summary);
  }

  const gallery = document.createElement('section');
  gallery.className = 'article-gallery';
  gallery.setAttribute('aria-labelledby', 'field-images-title');
  gallery.innerHTML = `<div class="article-gallery-heading"><p>Field images</p><h2 id="field-images-title">Further observations</h2></div><div class="article-gallery-grid"><figure><div class="gallery-placeholder gallery-placeholder--habitat" role="img" aria-label="Habitat study image forthcoming"></div><figcaption>01 · Habitat study</figcaption></figure><figure><div class="gallery-placeholder gallery-placeholder--behaviour" role="img" aria-label="Behaviour sequence image forthcoming"></div><figcaption>02 · Behaviour sequence</figcaption></figure><figure><div class="gallery-placeholder gallery-placeholder--detail" role="img" aria-label="Anatomy detail image forthcoming"></div><figcaption>03 · Anatomy detail</figcaption></figure></div>`;
  creatureHero.after(gallery);
}

const hero = document.querySelector('.hero');
const regionHero = document.querySelector('.region-hero');
const featureSection = document.querySelector('.feature');
const featureImage = document.querySelector('.feature-image');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactLayout = window.matchMedia('(max-width: 800px)');
let parallaxFrame;

function isLandingPage(url) {
  const pathname = new URL(url, window.location.href).pathname;
  return pathname === '/' || pathname.endsWith('/index.html');
}

function isTharvenArticle(url) {
  return new URL(url, window.location.href).pathname.endsWith('/articles/tharven.html');
}

function isLandingToTharven(fromUrl, toUrl) {
  return isLandingPage(fromUrl) && isTharvenArticle(toUrl);
}

function placeSlug(url) {
  return new URL(url, window.location.href).pathname.match(/\/places\/(orra|taqer|namarain)\.html$/)?.[1];
}

function isLandingPlaceTransition(fromUrl, toUrl) {
  return (isLandingPage(fromUrl) && Boolean(placeSlug(toUrl))) ||
    (Boolean(placeSlug(fromUrl)) && isLandingPage(toUrl));
}

function isAllowedTransition(fromUrl, toUrl) {
  return isLandingToTharven(fromUrl, toUrl) || isLandingPlaceTransition(fromUrl, toUrl);
}

window.addEventListener('pageswap', (event) => {
  const destination = event.activation?.entry?.url;
  if (event.viewTransition && (!destination || !isAllowedTransition(window.location.href, destination))) {
    event.viewTransition.skipTransition();
  }
});

window.addEventListener('pagereveal', (event) => {
  const source = window.navigation?.activation?.from?.url;
  if (event.viewTransition && (!source || !isAllowedTransition(source, window.location.href))) {
    event.viewTransition.skipTransition();
  }
});

function updateHeroParallax() {
  parallaxFrame = undefined;
  if (reducedMotion.matches || compactLayout.matches) {
    hero?.style.setProperty('--hero-text-y', '0px');
    hero?.style.setProperty('--hero-image-y', '0px');
    hero?.style.setProperty('--hero-image-blur', '0px');
    regionHero?.style.setProperty('--region-text-y', '0px');
    regionHero?.style.setProperty('--region-image-y', '0px');
    regionHero?.style.setProperty('--region-image-blur', '0px');
    creatureHero?.style.setProperty('--creature-text-y', '0px');
    creatureHero?.style.setProperty('--creature-image-y', '0px');
    creatureHero?.style.setProperty('--creature-image-blur', '0px');
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

  if (regionHero) {
    const travel = Math.min(Math.max(window.scrollY, 0), regionHero.offsetHeight * 1.25);
    const blurProgress = Math.min(travel / regionHero.offsetHeight, 1);
    regionHero.style.setProperty('--region-text-y', `${travel * -0.14}px`);
    regionHero.style.setProperty('--region-image-y', `${travel * -(1 / 12)}px`);
    regionHero.style.setProperty('--region-image-blur', `${blurProgress * 6}px`);
  }

  if (creatureHero) {
    const travel = Math.min(Math.max(window.scrollY, 0), creatureHero.offsetHeight * 1.25);
    const blurProgress = Math.min(travel / creatureHero.offsetHeight, 1);
    creatureHero.style.setProperty('--creature-text-y', `${travel * -0.14}px`);
    creatureHero.style.setProperty('--creature-image-y', `${travel * -(1 / 12)}px`);
    creatureHero.style.setProperty('--creature-image-blur', `${blurProgress * 6}px`);
  }

  if (featureSection && featureImage) {
    const rect = featureImage.getBoundingClientRect();
    const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    const visibleRatio = Math.min(visibleHeight / rect.height, 1);
    featureSection.style.setProperty('--feature-image-blur', `${(1 - visibleRatio) * 6}px`);
  }
}

function requestHeroParallax() {
  if (parallaxFrame === undefined) {
    parallaxFrame = requestAnimationFrame(updateHeroParallax);
  }
}

if (hero || regionHero || creatureHero || featureSection) {
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
