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
  sound: true,
  help: 'high',
  theme: 'auto',
  seenIntro: false,
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
  completeSequence({ perfect }) {
    const s = this.state;
    s.sequencesDone += 1;
    s.stars += perfect ? 3 : 1;
    s.streak = perfect ? s.streak + 1 : 0;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
    this.save();
    return s;
  }

  markIntroSeen() {
    this.state.seenIntro = true;
    this.save();
  }

  setTheme(id) {
    this.state.theme = id;
    this.save();
  }

  setHelp(id) {
    this.state.help = id;
    this.save();
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
    // Les reglages et l'intro deja vue ne sont pas de la progression : on les garde.
    this.state = {
      ...DEFAULTS,
      sound: this.state.sound,
      help: this.state.help,
      theme: this.state.theme,
      seenIntro: this.state.seenIntro,
    };
    this.save();
  }
}
