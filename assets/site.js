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
  const letters = [...heading.textContent].filter(character => /\p{L}/u.test(character));
  if (!letters.length) return;

  const state = { value: headingSeed(heading.textContent) || 1 };
  const selected = new Set();

  for (let start = 0; start < letters.length; start += 8) {
    const groupSize = Math.min(8, letters.length - start);
    selected.add(start + Math.floor(nextRandom(state) * groupSize));
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
