/** Assemblage : boucle de jeu, rendu de la séquence, interface. */

import { LEVELS, nextSequence } from './sequences.js';
import { Engine, CORRECT, WRONG, COMPLETE } from './engine.js';
import { VirtualKeyboard, renderLegend } from './keyboard.js';
import { Progress } from './progress.js';
import { sounds } from './audio.js';

const SEQUENCES_PER_LEVEL = 5;

const FOCUSABLE_CONTROLS = ['SELECT', 'BUTTON', 'INPUT', 'TEXTAREA'];

/**
 * Niveaux d'aide. `threshold` est le nombre d'erreurs sur le caractère courant
 * a partir duquel la touche (et son modificateur) est montrée sur le clavier.
 * Le compteur repart a zéro des que l'enfant passe au caractère suivant.
 */
const HELP_LEVELS = [
  { id: 'none', label: 'Aucune aide', threshold: Infinity },
  { id: 'high', label: 'Élevée — après 1 erreur', threshold: 1 },
  { id: 'medium', label: 'Moyenne — après 3 erreurs', threshold: 3 },
  { id: 'low', label: 'Faible — après 5 erreurs', threshold: 5 },
];

const THEME_IDS = ['auto', 'light', 'dark'];

/** Preference systeme, qui sert de position de depart a l'interrupteur. */
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

const $ = (sel) => document.querySelector(sel);

const el = {
  sequence: $('#sequence'),
  hint: $('#level-hint'),
  fingerHint: $('#finger-hint'),
  keyboard: $('#keyboard'),
  levelName: $('#level-name'),
  levelBar: $('#level-bar'),
  seqBar: $('#seq-bar'),
  stars: $('#stars'),
  streak: $('#streak'),
  accuracy: $('#accuracy'),
  mascot: $('#mascot'),
  bubble: $('#bubble'),
  confetti: $('#confetti'),
  levelSelect: $('#level-select'),
  helpSelect: $('#help-select'),
  themeToggle: $('#theme-toggle'),
  intro: $('#intro'),
  introClose: $('#intro-close'),
  introBtn: $('#intro-btn'),
  soundBtn: $('#sound-btn'),
  resetBtn: $('#reset-btn'),
  warning: $('#layout-warning'),
  legend: $('#legend'),
};

const progress = new Progress();
const engine = new Engine();
const keyboard = new VirtualKeyboard(el.keyboard, el.fingerHint);

let level = LEVELS[Math.min(progress.state.levelIndex, LEVELS.length - 1)];
let doneInLevel = progress.state.levelDone || 0;
let consecutiveErrors = 0;
let locked = false;
/* Tant que l'overlay est ouvert, aucune frappe ne doit compter comme une reponse. */
let introOpen = false;

const helpLevel = () => HELP_LEVELS.find((h) => h.id === progress.state.help) ?? HELP_LEVELS[1];

const themeId = () => (THEME_IDS.includes(progress.state.theme) ? progress.state.theme : 'auto');

function applyTheme(id) {
  if (id === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = id;
}

/** Position de l'interrupteur : le theme reellement affiche, systeme compris. */
const isDark = () => (themeId() === 'auto' ? systemDark.matches : themeId() === 'dark');

/** Montre la touche attendue uniquement si le niveau d'aide le permet. */
function refreshHighlight() {
  const revealed = engine.wrongOnCurrent >= helpLevel().threshold;
  keyboard.highlight(revealed ? engine.expected : null);
}

/* --------------------------------------------------------------- affichage */

function renderSequence() {
  el.sequence.textContent = '';
  [...engine.target].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    if (char === ' ') span.classList.add('is-space');
    span.textContent = char === ' ' ? ' ' : char;
    if (engine.statuses[i] === CORRECT) span.classList.add('is-ok');
    if (engine.statuses[i] === WRONG) span.classList.add('is-ko');
    if (i === engine.index) span.classList.add('is-current');
    el.sequence.appendChild(span);
  });
  el.seqBar.style.width = `${Math.round(engine.progress * 100)}%`;
}

function renderHud() {
  const s = progress.state;
  el.stars.textContent = s.stars;
  el.streak.textContent = s.streak;
  el.accuracy.textContent = `${engine.accuracy()}%`;
  el.levelName.textContent = `Niveau ${level.id} — ${level.name}`;
  el.hint.textContent = level.hint;
  el.levelBar.style.width = `${Math.round((doneInLevel / SEQUENCES_PER_LEVEL) * 100)}%`;
  el.levelSelect.value = String(LEVELS.indexOf(level));
}

function mascot(mood, text) {
  el.mascot.dataset.mood = mood;
  if (text) {
    el.bubble.textContent = text;
    el.bubble.classList.add('is-visible');
    clearTimeout(mascot.timer);
    mascot.timer = setTimeout(() => el.bubble.classList.remove('is-visible'), 2200);
  }
}

function confetti() {
  const colors = ['#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#f78c6b'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('i');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    piece.style.setProperty('--spin', `${Math.random() * 720 - 360}deg`);
    el.confetti.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove(), { once: true });
  }
}

/* ------------------------------------------------------------ boucle de jeu */

function newSequence() {
  engine.load(nextSequence(level));
  renderSequence();
  refreshHighlight();
  renderHud();
}

function goToLevel(index, { announce = true } = {}) {
  level = LEVELS[Math.max(0, Math.min(index, LEVELS.length - 1))];
  doneInLevel = 0;
  progress.setLevel(LEVELS.indexOf(level));
  progress.state.levelDone = 0;
  progress.save();
  if (announce) {
    mascot('happy', `Niveau ${level.id} : ${level.name} !`);
    if (progress.state.sound) sounds.levelUp();
  }
  newSequence();
}

function onSequenceComplete() {
  const perfect = engine.errorsAt.size === 0;
  progress.completeSequence({ perfect });
  doneInLevel += 1;
  progress.state.levelDone = doneInLevel;
  progress.save();

  if (progress.state.sound) sounds.win();
  confetti();
  mascot('cheer', perfect ? 'Parfait, sans aucune faute !' : 'Bravo, séquence terminée !');
  renderHud();

  locked = true;
  setTimeout(() => {
    locked = false;
    const index = LEVELS.indexOf(level);
    if (doneInLevel >= SEQUENCES_PER_LEVEL && index < LEVELS.length - 1) {
      goToLevel(index + 1);
    } else {
      if (doneInLevel >= SEQUENCES_PER_LEVEL) doneInLevel = 0;
      newSequence();
    }
    mascot('idle');
  }, 1200);
}

function onChar(char) {
  const { result, index } = engine.press(char);

  if (result === WRONG) {
    consecutiveErrors += 1;
    if (progress.state.sound) sounds.ko();
    keyboard.flash(char, false);
    renderSequence();
    el.sequence.children[index]?.classList.add('shake');
    refreshHighlight();
    mascot('oops');
    if (consecutiveErrors >= 8) el.warning.hidden = false;
    renderHud();
    return;
  }

  consecutiveErrors = 0;
  el.warning.hidden = true;
  if (progress.state.sound) sounds.ok();
  keyboard.flash(char, true);
  renderSequence();
  refreshHighlight();
  renderHud();

  if (result === COMPLETE) onSequenceComplete();
}

/* -------------------------------------------------------------- événements */

/**
 * @param {boolean} first true a la toute premiere visite, false pour une
 *   relecture demandee via le bouton « ? ». Seul le libelle du bouton change :
 *   « C'est parti ! » n'a plus de sens quand on revient lire les regles.
 */
function openIntro(first) {
  introOpen = true;
  el.introClose.textContent = first ? 'C’est parti !' : 'Fermer';
  el.intro.hidden = false;
  el.introClose.focus();
}

function closeIntro() {
  if (!introOpen) return;
  introOpen = false;
  el.intro.hidden = true;
  progress.markIntroSeen();
  // On ne rend PAS le focus au bouton declencheur : un <button> focalise avale
  // les frappes (voir FOCUSABLE_CONTROLS) et le jeu resterait sourd.
  el.introClose.blur();
}

window.addEventListener('keydown', (event) => {
  // L'overlay capte le clavier : Echap le ferme, le reste est ignore par le jeu.
  if (introOpen) {
    if (event.key === 'Escape') { event.preventDefault(); closeIntro(); }
    return;
  }

  // AltGr est signale differemment selon les systemes : AltGraph sous Linux et
  // macOS, Ctrl+Alt sous Windows. On laisse donc passer ces combinaisons.
  const altGraph = typeof event.getModifierState === 'function'
    && (event.getModifierState('AltGraph') || (event.ctrlKey && event.altKey));
  if (!altGraph && (event.ctrlKey || event.altKey || event.metaKey)) return;
  // Un controle garde le focus : on le laisse recevoir la frappe.
  if (FOCUSABLE_CONTROLS.includes(event.target.tagName)) return;

  if (event.key === 'Tab' || event.key === 'Backspace' || event.key === ' ') {
    event.preventDefault();
  }
  if (event.key === 'Dead') {
    event.preventDefault();
    mascot('oops', 'Cette touche attend un accent, ce n’est pas celle-ci.');
    return;
  }
  if (locked || event.key.length !== 1) return;

  event.preventDefault();
  onChar(event.key);
});

/**
 * Un reglage garde le focus apres avoir ete actionne : les frappes suivantes
 * iraient au <select> ou au bouton au lieu d'aller au jeu. On rend donc la main
 * au document des que le reglage est pris en compte.
 */
function releaseFocus(element) {
  element.blur();
}

el.levelSelect.addEventListener('change', (e) => {
  goToLevel(Number(e.target.value), { announce: false });
  releaseFocus(e.target);
});

el.introClose.addEventListener('click', closeIntro);
el.introBtn.addEventListener('click', (e) => { releaseFocus(e.currentTarget); openIntro(false); });

// Un clic en dehors de la carte ferme aussi l'overlay.
el.intro.addEventListener('click', (e) => { if (e.target === el.intro) closeIntro(); });

el.themeToggle.addEventListener('change', (e) => {
  // Le premier basculement quitte « auto » pour un choix explicite, qui tiendra
  // meme si le systeme change d'avis ensuite.
  const id = e.target.checked ? 'dark' : 'light';
  progress.setTheme(id);
  applyTheme(id);
  releaseFocus(e.target);
});

// Tant qu'aucun choix explicite n'a ete fait, on suit le systeme en direct.
systemDark.addEventListener('change', () => {
  if (themeId() === 'auto') el.themeToggle.checked = systemDark.matches;
});

el.helpSelect.addEventListener('change', (e) => {
  progress.setHelp(e.target.value);
  refreshHighlight();
  releaseFocus(e.target);
});

el.soundBtn.addEventListener('click', (e) => {
  const on = progress.toggleSound();
  el.soundBtn.textContent = on ? '🔊' : '🔇';
  el.soundBtn.setAttribute('aria-label', on ? 'Couper le son' : 'Activer le son');
  releaseFocus(e.currentTarget);
});

el.resetBtn.addEventListener('click', (e) => {
  releaseFocus(e.currentTarget);
  if (!confirm('Effacer les étoiles et recommencer au niveau 1 ?')) return;
  progress.reset();
  el.helpSelect.value = helpLevel().id;
  goToLevel(0, { announce: false });
});

/* ------------------------------------------------------------- demarrage */

LEVELS.forEach((lv, i) => {
  const option = document.createElement('option');
  option.value = String(i);
  option.textContent = `${lv.id}. ${lv.name}`;
  el.levelSelect.appendChild(option);
});

HELP_LEVELS.forEach((help) => {
  const option = document.createElement('option');
  option.value = help.id;
  option.textContent = help.label;
  el.helpSelect.appendChild(option);
});
el.helpSelect.value = helpLevel().id;

el.themeToggle.checked = isDark();
applyTheme(themeId());

if (!progress.state.seenIntro) openIntro(true);

renderLegend(el.legend);
el.soundBtn.textContent = progress.state.sound ? '🔊' : '🔇';
newSequence();
mascot('happy', 'Pose tes doigts et c’est parti !');
