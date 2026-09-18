/** Assemblage : boucle de jeu, rendu de la séquence, interface. */

import { LEVELS, nextSequence } from './sequences.js';
import { Engine, CORRECT, WRONG, COMPLETE } from './engine.js';
import { VirtualKeyboard, renderLegend } from './keyboard.js';
import { Progress } from './progress.js';
import { sounds } from './audio.js';

const SEQUENCES_PER_LEVEL = 5;

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
  wpm: $('#wpm'),
  accuracy: $('#accuracy'),
  mascot: $('#mascot'),
  bubble: $('#bubble'),
  confetti: $('#confetti'),
  levelSelect: $('#level-select'),
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
  el.wpm.textContent = engine.wpm() || s.bestWpm;
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
  keyboard.highlight(engine.expected);
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
  const wpm = engine.wpm();
  progress.completeSequence({ perfect, wpm });
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
  keyboard.highlight(engine.expected);
  renderHud();

  if (result === COMPLETE) onSequenceComplete();
}

/* -------------------------------------------------------------- événements */

window.addEventListener('keydown', (event) => {
  // AltGr est signale differemment selon les systemes : AltGraph sous Linux et
  // macOS, Ctrl+Alt sous Windows. On laisse donc passer ces combinaisons.
  const altGraph = typeof event.getModifierState === 'function'
    && (event.getModifierState('AltGraph') || (event.ctrlKey && event.altKey));
  if (!altGraph && (event.ctrlKey || event.altKey || event.metaKey)) return;
  if (event.target.tagName === 'SELECT') return;

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

el.levelSelect.addEventListener('change', (e) => goToLevel(Number(e.target.value), { announce: false }));

el.soundBtn.addEventListener('click', () => {
  const on = progress.toggleSound();
  el.soundBtn.textContent = on ? '🔊' : '🔇';
  el.soundBtn.setAttribute('aria-label', on ? 'Couper le son' : 'Activer le son');
});

el.resetBtn.addEventListener('click', () => {
  if (!confirm('Effacer les étoiles et recommencer au niveau 1 ?')) return;
  progress.reset();
  goToLevel(0, { announce: false });
});

/* ------------------------------------------------------------- demarrage */

LEVELS.forEach((lv, i) => {
  const option = document.createElement('option');
  option.value = String(i);
  option.textContent = `${lv.id}. ${lv.name}`;
  el.levelSelect.appendChild(option);
});

renderLegend(el.legend);
el.soundBtn.textContent = progress.state.sound ? '🔊' : '🔇';
newSequence();
mascot('happy', 'Pose tes doigts et c’est parti !');
