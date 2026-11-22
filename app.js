const contacts = { whatsapp: '', instagram: '' };
const pizzas = [
  ['Margherita Classica','Muçarela, tomate, manjericão fresco e molho artesanal.','59,90','trad','margherita'],
  ['Pepperoni Speciale','Pepperoni, muçarela especial e molho de tomate.','69,90','trad','pepperoni'],
  ['Quattro Formaggi','Muçarela, gorgonzola, parmesão e provolone.','74,90','special','cheese'],
  ['Burrata Premium','Burrata cremosa, tomate-cereja e pesto.','84,90','special','burrata'],
  ['Calabresa della Casa','Calabresa artesanal, cebola-roxa e muçarela.','64,90','trad','calabresa'],
  ['Chocolate & Morango','Chocolate cremoso e morangos frescos.','54,90','sweet','dessert']
];
const grid = document.querySelector('#pizzas');
grid.innerHTML = pizzas.map(([name, description, price, category, image]) => `<article class="pizza" data-category="${category}"><img src="assets/${image}.jpg" alt="" loading="lazy"><div class="pizza-copy"><h3>${name}</h3><p>${description}</p><strong>R$ ${price}</strong></div></article>`).join('');
const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  for (const pizza of grid.children) {
    pizza.hidden = button.dataset.filter !== 'all' && pizza.dataset.category !== button.dataset.filter;
    if (!pizza.hidden) count++;
  }
  document.querySelector('#count').textContent = count === 1 ? '1 sabor encontrado' : `${count} sabores encontrados`;
}));
const toggle = document.querySelector('.toggle');
const setMenu = open => toggle.setAttribute('aria-expanded', String(open));
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') === 'false'));
document.querySelectorAll('#nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});
const dialog = document.querySelector('#contact-dialog');
for (const link of document.querySelectorAll('[data-social]')) {
  const channel = link.dataset.social;
  if (contacts[channel]) {
    link.href = contacts[channel];
  } else {
    link.addEventListener('click', event => {
      event.preventDefault();
      document.querySelector('#contact-title').textContent = channel === 'whatsapp' ? 'WhatsApp' : 'Instagram';
      dialog.showModal();
    });
  }
}
const motion = document.querySelector('#motion');
motion.addEventListener('click', () => {
  const paused = motion.parentElement.classList.toggle('paused');
  motion.setAttribute('aria-pressed', String(paused));
  motion.textContent = paused ? 'Retomar animação' : 'Pausar animação';
});

const story = document.querySelector('#historia');
const storyScene = story.querySelector('.story-scene');
const storyMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');
let storyFrame = 0;
const clamp = value => Math.max(0, Math.min(1, value));

function paintStory() {
  storyFrame = 0;
  if (!storyMotion.matches) {
    storyScene.removeAttribute('style');
    return;
  }
  const bounds = story.getBoundingClientRect();
  const viewport = window.innerHeight;
  const sticky = bounds.height > viewport && window.innerWidth > 760 && viewport >= 620;
  const scene = storyScene.getBoundingClientRect();
  const progress = sticky
    ? clamp(-bounds.top / (bounds.height - viewport))
    : clamp((viewport - scene.top) / (viewport * .65));
  const travel = clamp((progress - .07) / .65);
  const eased = travel * travel * (3 - 2 * travel);

  storyScene.style.setProperty('--pie-x', `${-36 * (1 - eased)}%`);
  storyScene.style.setProperty('--pie-y', `${14 * (1 - eased)}%`);
  storyScene.style.setProperty('--pie-scale', `${.27 + .73 * eased}`);
  storyScene.style.setProperty('--pie-opacity', `${clamp((progress - .04) / .12)}`);
  storyScene.style.setProperty('--pie-turn', `${-22 + 230 * progress}deg`);
  storyScene.style.setProperty('--oven-opacity', `${1 - .67 * eased}`);
}

function queueStoryPaint() {
  if (!storyFrame) storyFrame = requestAnimationFrame(paintStory);
}

function syncStoryMotion() {
  story.classList.toggle('is-animated', storyMotion.matches);
  queueStoryPaint();
}

storyMotion.addEventListener('change', syncStoryMotion);
window.addEventListener('scroll', queueStoryPaint, { passive: true });
window.addEventListener('resize', queueStoryPaint);
syncStoryMotion();
