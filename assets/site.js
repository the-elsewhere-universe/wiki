const button = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

function headingSeed(text) {
  let seed = 2166136261;
  for (const character of text) {
    seed ^= character.codePointAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return seed >>> 0;
}

function nextRandom(state) {
  state.value ^= state.value << 13;
  state.value ^= state.value >>> 17;
  state.value ^= state.value << 5;
  return (state.value >>> 0) / 4294967296;
}

function addHeadingItalics(heading) {
  const characters = [...heading.textContent];
  const letters = characters.filter(character => /\p{L}/u.test(character));
  if (!letters.length) return;

  const state = { value: headingSeed(heading.textContent) || 1 };
  const selected = new Set();

  for (let start = 0; start < letters.length; start += 8) {
    const groupSize = Math.min(8, letters.length - start);
    selected.add(start + Math.floor(nextRandom(state) * groupSize));
  }

  const characterToLetter = new Map();
  let mappedLetterIndex = 0;
  characters.forEach((character, characterIndex) => {
    if (/\p{L}/u.test(character)) {
      characterToLetter.set(characterIndex, mappedLetterIndex);
      mappedLetterIndex += 1;
    }
  });

  for (const selectedLetter of [...selected]) {
    const characterIndex = [...characterToLetter.entries()]
      .find(([, letterIndex]) => letterIndex === selectedLetter)?.[0];
    if (characterIndex === undefined) continue;

    const selectedCharacter = characters[characterIndex].toLocaleLowerCase();
    let before = characterIndex - 1;
    let after = characterIndex + 1;

    while (before >= 0 && characters[before].toLocaleLowerCase() === selectedCharacter) {
      selected.add(characterToLetter.get(before));
      before -= 1;
    }

    while (after < characters.length && characters[after].toLocaleLowerCase() === selectedCharacter) {
      selected.add(characterToLetter.get(after));
      after += 1;
    }
  }

  let letterIndex = 0;
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  for (const node of textNodes) {
    const fragment = document.createDocumentFragment();
    for (const character of node.nodeValue) {
      if (/\p{L}/u.test(character)) {
        if (selected.has(letterIndex)) {
          const italic = document.createElement('span');
          italic.className = 'heading-italic';
          italic.textContent = character;
          fragment.appendChild(italic);
        } else {
          fragment.appendChild(document.createTextNode(character));
        }
        letterIndex += 1;
      } else {
        fragment.appendChild(document.createTextNode(character));
      }
    }
    node.replaceWith(fragment);
  }
}

document.querySelectorAll('h1, h2, h3').forEach(addHeadingItalics);

const hero = document.querySelector('.hero');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactLayout = window.matchMedia('(max-width: 800px)');
let parallaxFrame;

function updateHeroParallax() {
  parallaxFrame = undefined;
  if (!hero || reducedMotion.matches || compactLayout.matches) {
    hero?.style.setProperty('--hero-text-y', '0px');
    hero?.style.setProperty('--hero-image-y', '0px');
    hero?.style.setProperty('--hero-image-blur', '0px');
    return;
  }

  const travel = Math.min(Math.max(window.scrollY, 0), hero.offsetHeight * 1.25);
  const blurProgress = Math.min(travel / hero.offsetHeight, 1);
  hero.style.setProperty('--hero-text-y', `${travel * -0.14}px`);
  hero.style.setProperty('--hero-image-y', `${travel * -(1 / 12)}px`);
  hero.style.setProperty('--hero-image-blur', `${blurProgress * 6}px`);
}

function requestHeroParallax() {
  if (parallaxFrame === undefined) {
    parallaxFrame = requestAnimationFrame(updateHeroParallax);
  }
}

if (hero) {
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
