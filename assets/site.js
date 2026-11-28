const button = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

document.querySelectorAll('.region-tabs').forEach((tabGroup) => {
  const tabs = [...tabGroup.querySelectorAll('[role="tab"]')];
  const panels = [...tabGroup.querySelectorAll('[role="tabpanel"]')];

  function activateRegionTab(tab, moveFocus = false) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateRegionTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex !== undefined) {
        event.preventDefault();
        activateRegionTab(tabs[nextIndex], true);
      }
    });
  });
});

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
  gallery.innerHTML = `<h2 id="field-images-title" class="sr-only">Field image gallery</h2><div class="gallery-browser"><div class="gallery-thumbnails" aria-label="Select an image"><div class="gallery-thumbnails-inner"></div></div><figure class="gallery-stage"><button type="button" class="gallery-stage-image" aria-label="Open image full screen"><img alt=""></button><figcaption><button type="button" class="gallery-previous" aria-label="Previous image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button><span class="gallery-position" aria-live="polite"></span><button type="button" class="gallery-next" aria-label="Next image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button></figcaption></figure></div><dialog class="gallery-lightbox" aria-label="Expanded gallery image"><button type="button" class="gallery-lightbox-close" aria-label="Close expanded image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button><img alt=""></dialog>`;

  const placeholderObservations = [
    ['Habitat study', 4, 3, '#51635a', '#b2a88e'],
    ['Profile', 3, 4, '#665c50', '#b88c70'],
    ['Group behaviour', 1, 1, '#344b43', '#8f9e87'],
    ['Seasonal range', 16, 9, '#77745e', '#c8aa7d'],
    ['Anatomy detail', 4, 5, '#3e514d', '#b6aa91'],
    ['Movement study', 3, 2, '#6f5e50', '#a99178'],
    ['Juvenile', 4, 3, '#657266', '#c6b896'],
    ['Field scale', 2, 3, '#455853', '#8d7f69'],
    ['Feeding', 1, 1, '#6c766b', '#b48269'],
    ['Shelter', 16, 10, '#34473f', '#a69a7f'],
    ['Close observation', 3, 4, '#7a6557', '#b1a489'],
    ['Environmental context', 4, 3, '#50615a', '#c39b76']
  ].map(([label, width, height, dark, light]) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width * 240} ${height * 240}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${dark}"/><stop offset="1" stop-color="${light}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="${width * 150}" cy="${height * 82}" r="${Math.min(width, height) * 35}" fill="#f2f0e9" opacity=".16"/><path d="M0 ${height * 190} Q ${width * 90} ${height * 115} ${width * 240} ${height * 175} V ${height * 240} H0Z" fill="#172d26" opacity=".24"/></svg>`;
    return { label, src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, placeholder: true };
  });

  const tharvenObservations = [
    { label: 'Tharven in autumn forest, rear three-quarter view', src: '../assets/images/tharven-field-note.webp' },
    { label: 'Tharven seen from the forest canopy', src: '../assets/images/tharven-canopy-view.webp' },
    { label: 'Head and shield detail', src: '../assets/images/tharven-gallery-headshot.webp' },
    { label: 'Adult pair in the Orran highlands', src: '../assets/images/tharven-article-hero.webp' },
    { label: 'Profile of the protective neck shield', src: '../assets/images/tharven-gallery-profile.webp' },
    { label: 'Tharven breathing in highland mist', src: '../assets/images/tharven-gallery-mist.webp' },
    { label: 'Ward grazing on an upland plateau', src: '../assets/images/tharven-gallery-panorama-03.webp' },
    { label: 'Resting adult above the waterfall country', src: '../assets/images/tharven-gallery-panorama-04.webp' }
  ];

  const observations = (window.location.pathname.endsWith('/articles/tharven.html') ? tharvenObservations : placeholderObservations)
    .map((observation, index) => ({ ...observation, index }));

  const thumbnailList = gallery.querySelector('.gallery-thumbnails-inner');
  const stageButton = gallery.querySelector('.gallery-stage-image');
  const stageImage = gallery.querySelector('.gallery-stage-image img');
  const position = gallery.querySelector('.gallery-position');
  const lightbox = gallery.querySelector('.gallery-lightbox');
  const lightboxImage = lightbox.querySelector('img');
  let lightboxScrollPosition = 0;
  const thumbnailButtons = observations.map((observation) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'gallery-thumb';
    item.setAttribute('aria-label', `View ${observation.label}`);
    item.innerHTML = `<img src="${observation.src}" alt="">`;
    thumbnailList.append(item);
    return item;
  });

  let selectedImage = 0;
  function showGalleryImage(index, focusThumbnail = false) {
    selectedImage = (index + observations.length) % observations.length;
    const observation = observations[selectedImage];
    stageImage.src = observation.src;
    stageImage.alt = observation.placeholder ? `${observation.label} placeholder` : observation.label;
    if (lightbox.open) {
      lightboxImage.src = stageImage.src;
      lightboxImage.alt = stageImage.alt;
    }
    position.textContent = `${String(selectedImage + 1).padStart(2, '0')} / ${String(observations.length).padStart(2, '0')}`;
    thumbnailButtons.forEach((item, itemIndex) => item.setAttribute('aria-pressed', String(itemIndex === selectedImage)));
    if (focusThumbnail) thumbnailButtons[selectedImage].focus({ preventScroll: true });
  }

  thumbnailButtons.forEach((item, index) => item.addEventListener('click', () => showGalleryImage(index)));
  gallery.querySelector('.gallery-previous').addEventListener('click', () => showGalleryImage(selectedImage - 1, true));
  gallery.querySelector('.gallery-next').addEventListener('click', () => showGalleryImage(selectedImage + 1, true));
  stageButton.addEventListener('click', () => {
    lightboxImage.src = stageImage.src;
    lightboxImage.alt = stageImage.alt;
    lightboxScrollPosition = window.scrollY;
    document.body.style.top = `-${lightboxScrollPosition}px`;
    document.body.classList.add('gallery-lightbox-open');
    lightbox.showModal();
  });
  gallery.querySelector('.gallery-lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showGalleryImage(selectedImage + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  lightbox.addEventListener('close', () => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    document.body.classList.remove('gallery-lightbox-open');
    document.body.style.top = '';
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, lightboxScrollPosition);
    requestAnimationFrame(() => { root.style.scrollBehavior = previousScrollBehavior; });
  });
  showGalleryImage(0);

  if (lede) {
    const introduction = document.createElement('section');
    introduction.className = 'article-introduction';
    introduction.append(lede);
    creatureHero.after(introduction, gallery);
  } else {
    creatureHero.after(gallery);
  }
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
