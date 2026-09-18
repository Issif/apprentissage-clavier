/**
 * Progression du joueur : étoiles, niveau atteint, meilleures stats.
 * localStorage peut etre indisponible (navigation privée, ouverture en file://
 * sur certains navigateurs) : on retombe alors silencieusement sur la mémoire.
 */

const KEY = 'clavier-classroom:progress';

const DEFAULTS = {
  levelIndex: 0,
  stars: 0,
  streak: 0,
  bestStreak: 0,
  sequencesDone: 0,
  bestWpm: 0,
  sound: true,
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export class Progress {
  constructor() {
    this.state = read();
  }

  save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.state));
    } catch {
      // Pas de persistance disponible : la partie en cours reste jouable.
    }
  }

  /** Une séquence terminée : étoiles gagnées selon la propreté de la frappe. */
  completeSequence({ perfect, wpm }) {
    const s = this.state;
    s.sequencesDone += 1;
    s.stars += perfect ? 3 : 1;
    s.streak = perfect ? s.streak + 1 : 0;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
    s.bestWpm = Math.max(s.bestWpm, wpm);
    this.save();
    return s;
  }

  setLevel(index) {
    this.state.levelIndex = index;
    this.save();
  }

  toggleSound() {
    this.state.sound = !this.state.sound;
    this.save();
    return this.state.sound;
  }

  reset() {
    this.state = { ...DEFAULTS, sound: this.state.sound };
    this.save();
  }
}
