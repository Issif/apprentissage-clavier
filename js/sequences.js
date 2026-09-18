/**
 * Génération des séquences a reproduire.
 *
 * Progression pédagogique classique du doigté :
 *   1-2  rangée de repos, puis ses extensions (index qui s'étirent)
 *   3-4  rangée du haut, puis rangée du bas
 *   5-6  vrais mots francais, d'abord sans puis avec accents
 *   7    phrases avec majuscules et ponctuation
 *
 * Les niveaux "words" et "phrases" filtrent le vocabulaire sur les lettres
 * déjà apprises : on ne demande jamais une touche qui n'a pas ete travaillée.
 */

const WORDS = [
  'ami', 'ane', 'arbre', 'balle', 'banc', 'bateau', 'bille', 'blanc', 'bleu', 'boite',
  'bonbon', 'bouche', 'branche', 'bras', 'bruit', 'cadeau', 'canard', 'carte', 'chat',
  'chaud', 'chien', 'ciel', 'classe', 'clou', 'coeur', 'copain', 'corde', 'cour', 'craie',
  'cube', 'dent', 'dessin', 'doigt', 'dos', 'eau', 'ecole', 'encre', 'enfant', 'ferme',
  'feu', 'feuille', 'fleur', 'foret', 'fraise', 'frere', 'fruit', 'gant', 'gateau', 'glace',
  'gomme', 'grand', 'herbe', 'hibou', 'histoire', 'hiver', 'image', 'jardin', 'jaune',
  'jeu', 'joue', 'jour', 'jupe', 'lac', 'lait', 'lampe', 'lapin', 'lettre', 'lion', 'livre',
  'loup', 'lune', 'main', 'maison', 'manteau', 'mer', 'midi', 'miel', 'mot', 'mouton',
  'mur', 'neige', 'nid', 'nuage', 'nuit', 'oeuf', 'oiseau', 'ombre', 'orange', 'ours',
  'page', 'pain', 'panier', 'papier', 'parc', 'patte', 'peau', 'phrase', 'piano', 'pied',
  'pierre', 'pluie', 'poisson', 'pomme', 'pont', 'porte', 'poule', 'prince', 'quatre',
  'radio', 'raisin', 'renard', 'rire', 'robe', 'roi', 'rouge', 'route', 'ruban', 'sable',
  'salade', 'sapin', 'saut', 'savon', 'seau', 'soleil', 'soir', 'souris', 'sucre', 'table',
  'tapis', 'tasse', 'temps', 'terre', 'tete', 'tigre', 'toit', 'train', 'trois', 'tulipe',
  'vache', 'vent', 'verre', 'vert', 'ville', 'voiture', 'vue', 'wagon', 'zebre',
];

const WORDS_ACCENTS = [
  'école', 'éléphant', 'étoile', 'écran', 'échelle', 'éponge', 'épée', 'étage',
  'fée', 'clé', 'café', 'bébé', 'thé', 'été', 'idée', 'blé', 'pré', 'télé',
  'père', 'mère', 'frère', 'règle', 'zèbre', 'flèche', 'chèvre', 'lumière',
  'là', 'déjà', 'garçon', 'leçon', 'français', 'glaçon', 'balançoire',
];

/* Mots composes : les seuls ou l'apostrophe et le trait d'union sont naturels. */
const COMPOSED = [
  "l'ami", "l'oiseau", "l'école", "c'est", "d'accord", "aujourd'hui",
  'sous-bois', 'arc-en-ciel', 'grand-père', 'après-midi', 'porte-clé', 'chauve-souris',
];

/* Signes simples (colles au mot) et signes doubles (precedes d'une espace,
   comme le veut la typographie francaise). */
const SIGNS_SIMPLE = ['.', ','];
const SIGNS_DOUBLE = [';', ':', '!', '?'];

const PHRASES = [
  'Le chat dort sur le tapis.',
  'Mon frère joue dans le jardin.',
  'La lune brille dans la nuit.',
  'Le renard court dans la neige.',
  'Un oiseau chante sur la branche.',
  'Nous mangeons une pomme rouge.',
  'Le petit lapin mange une carotte.',
  'La pluie tombe sur la ville.',
  'Papa prépare une tarte au chocolat.',
  'Les enfants jouent à la balle.',
  'Le soleil se lève sur la mer.',
  "Ma cousine lit un livre d'images.",
];

const NUMBER_PHRASES = [
  "J'ai 8 ans et 3 chats.",
  'Le train part à 7 h 15.',
  'Il y a 24 élèves dans la classe.',
  'Mon record : 120 mots par minute !',
  "2 + 3 = 5, c'est facile.",
  'Papa a 40 ans, maman en a 38.',
  'Combien font 9 x 6 ? 54 !',
  'Rendez-vous le 14 juillet à 20 h.',
  "Le code est 4-7-2-9, ne l'oublie pas !",
  'La récré dure 15 minutes, pas 30 !',
];

/* Symboles AltGr retenus. Les touches mortes du troisieme niveau (~ ` ^) sont
   ecartees : elles demandent deux frappes et ne sont pas au programme. */
const ALTGR = ['@', '#', '{', '}', '[', ']', '|', '\\', '€'];

const SYMBOL_PHRASES = [
  'louis.martin@exemple.fr',
  'Ce jeu vaut 12 €.',
  'Mon dossier : C:\\jeux\\mario',
  '5 € + 3 € = 8 €',
  '[1] [2] [3] on y va !',
  '{ début } et { fin }',
  'papa@maison.fr et moi@ecole.fr',
  '|--- le mur ---|',
  '# canal : bricolage',
  'Le prix est de 100 € [promo].',
];

export const LEVELS = [
  {
    id: 1, name: 'La rangée de repos', mode: 'letters',
    chars: 'qsdfjklm', hint: 'Pose tes doigts sur q s d f et j k l m. Ne les bouge pas !',
  },
  {
    id: 2, name: 'Les index s’étirent', mode: 'letters',
    chars: 'qsdfghjklm', hint: 'Les index vont chercher g et h, puis reviennent à leur place.',
  },
  {
    id: 3, name: 'La rangée du haut', mode: 'letters',
    chars: 'azertyuiopqsdfghjklm', hint: 'Monte les doigts vers a z e r t y u i o p, puis redescends.',
  },
  {
    id: 4, name: 'La rangée du bas', mode: 'letters',
    chars: 'azertyuiopqsdfghjklmwxcvbn', hint: 'Toutes les lettres sont là ! Descends vers w x c v b n.',
  },
  {
    id: 5, name: 'De vrais mots', mode: 'words', source: WORDS,
    chars: 'abcdefghijklmnopqrstuvwxyz ', hint: 'Des mots entiers. Le pouce frappe la barre d’espace.',
  },
  {
    id: 6, name: 'Les accents', mode: 'words', source: WORDS_ACCENTS,
    chars: 'abcdefghijklmnopqrstuvwxyzéèàç ', hint: 'Les touches accentuées sont sur la rangée des chiffres.',
  },
  {
    id: 7, name: 'La ponctuation', mode: 'punct',
    chars: null, hint: 'Le point et le point d’interrogation demandent la touche Maj.',
  },
  {
    id: 8, name: 'Les chiffres', mode: 'digits',
    chars: null, hint: 'Sur un clavier AZERTY, les chiffres se tapent avec Maj.',
  },
  {
    id: 9, name: 'Des phrases', mode: 'phrases', source: PHRASES,
    chars: null, hint: 'Majuscules avec Maj (Shift) de la main opposée, et point final !',
  },
  {
    id: 10, name: 'Phrases et nombres', mode: 'phrases', source: NUMBER_PHRASES,
    chars: null, hint: 'On mélange tout : lettres, chiffres et ponctuation.',
  },
  {
    id: 11, name: 'Les touches AltGr', mode: 'altgr',
    chars: null, hint: 'Garde AltGr (à droite de la barre d’espace) enfoncé avec le pouce droit.',
  },
  {
    id: 12, name: 'Comme un pro', mode: 'phrases', source: SYMBOL_PHRASES,
    chars: null, hint: 'Adresses e-mail, prix et accolades : tout le clavier y passe !',
  },
];

const pick = (list) => list[Math.floor(Math.random() * list.length)];

/** Suites de lettres groupées, faciles à lire pour un enfant : "fjfj djdj kfkd". */
function letterSequence(chars, groups = 3, size = 4) {
  const out = [];
  for (let g = 0; g < groups; g++) {
    let group = '';
    let previous = '';
    for (let i = 0; i < size; i++) {
      let c;
      do { c = pick(chars.split('')); } while (c === previous && chars.length > 2);
      previous = c;
      group += c;
    }
    out.push(group);
  }
  return out.join(' ');
}

const fits = (text, chars) => !chars || [...text.toLowerCase()].every((c) => chars.includes(c));

/** Mots suivis d'un signe de ponctuation : "lune, sel. l'ami !" */
function punctSequence(groups = 3) {
  const out = [];
  for (let g = 0; g < groups; g++) {
    const word = Math.random() < 0.35 ? pick(COMPOSED) : pick(WORDS);
    out.push(Math.random() < 0.5
      ? word + pick(SIGNS_SIMPLE)
      : `${word} ${pick(SIGNS_DOUBLE)}`);
  }
  return out.join(' ');
}

/** Groupes de chiffres de longueur variable : "47 1250 803" */
function digitSequence(groups = 3) {
  const out = [];
  for (let g = 0; g < groups; g++) {
    const size = 2 + Math.floor(Math.random() * 3);
    let group = '';
    for (let i = 0; i < size; i++) group += String(Math.floor(Math.random() * 10));
    out.push(group);
  }
  return out.join(' ');
}

/** Groupes de symboles AltGr : "@# [] €| {}" */
function altgrSequence(groups = 4, size = 2) {
  const out = [];
  for (let g = 0; g < groups; g++) {
    let group = '';
    for (let i = 0; i < size; i++) group += pick(ALTGR);
    out.push(group);
  }
  return out.join(' ');
}

export function nextSequence(level) {
  if (level.mode === 'letters') return letterSequence(level.chars);
  if (level.mode === 'altgr') return altgrSequence();
  if (level.mode === 'punct') return punctSequence();
  if (level.mode === 'digits') return digitSequence();

  if (level.mode === 'words') {
    const usable = level.source.filter((w) => fits(w, level.chars));
    const words = [];
    while (words.length < 3) {
      const w = pick(usable);
      if (!words.includes(w)) words.push(w);
    }
    return words.join(' ');
  }

  return pick(level.source.filter((p) => fits(p, level.chars)));
}
