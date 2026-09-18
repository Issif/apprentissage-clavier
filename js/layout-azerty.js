/**
 * Description du clavier AZERTY français (variante fr-latin9 / fr-oss).
 *
 * Chaque touche porte :
 *  - id     : identifiant stable (le caractère non shifté, ou un nom pour les touches spéciales)
 *  - low    : caractère produit sans Shift
 *  - up     : caractère produit avec Shift
 *  - alt    : caractère produit avec AltGr (troisième niveau du clavier)
 *  - finger : doigt qui doit la frapper (voir FINGERS)
 *  - unit   : largeur en unités de touche (1 = touche carrée standard)
 *  - homing : vrai pour F et J, les touches de repère tactile
 */

export const FINGERS = {
  lp: { label: 'Auriculaire gauche', hand: 'gauche' },
  lr: { label: 'Annulaire gauche', hand: 'gauche' },
  lm: { label: 'Majeur gauche', hand: 'gauche' },
  li: { label: 'Index gauche', hand: 'gauche' },
  ri: { label: 'Index droit', hand: 'droite' },
  rm: { label: 'Majeur droit', hand: 'droite' },
  rr: { label: 'Annulaire droit', hand: 'droite' },
  rp: { label: 'Auriculaire droit', hand: 'droite' },
  th: { label: 'Pouce', hand: 'les deux' },
};

const k = (low, up, finger, extra = {}) => ({ id: low, low, up, finger, unit: 1, ...extra });
const special = (id, label, finger, unit) => ({ id, label, finger, unit, special: true });

export const ROWS = [
  [
    k('²', '²', 'lp'),
    k('&', '1', 'lp'), k('é', '2', 'lr', { alt: '~' }), k('"', '3', 'lm', { alt: '#' }),
    k("'", '4', 'li', { alt: '{' }), k('(', '5', 'li', { alt: '[' }), k('-', '6', 'ri', { alt: '|' }),
    k('è', '7', 'ri', { alt: '`' }), k('_', '8', 'rm', { alt: '\\' }), k('ç', '9', 'rr', { alt: '^' }),
    k('à', '0', 'rp', { alt: '@' }), k(')', '°', 'rp', { alt: ']' }), k('=', '+', 'rp', { alt: '}' }),
    special('Backspace', '←', 'rp', 2),
  ],
  [
    special('Tab', 'Tab', 'lp', 1.5),
    k('a', 'A', 'lp'), k('z', 'Z', 'lr'), k('e', 'E', 'lm', { alt: '€' }), k('r', 'R', 'li'), k('t', 'T', 'li'),
    k('y', 'Y', 'ri'), k('u', 'U', 'ri'), k('i', 'I', 'rm'), k('o', 'O', 'rr'), k('p', 'P', 'rp'),
    k('^', '¨', 'rp'), k('$', '£', 'rp', { alt: '¤' }),
  ],
  [
    special('CapsLock', '⇪', 'lp', 1.75),
    k('q', 'Q', 'lp'), k('s', 'S', 'lr'), k('d', 'D', 'lm'), k('f', 'F', 'li', { homing: true }),
    k('g', 'G', 'li'), k('h', 'H', 'ri'), k('j', 'J', 'ri', { homing: true }), k('k', 'K', 'rm'),
    k('l', 'L', 'rr'), k('m', 'M', 'rp'), k('ù', '%', 'rp'), k('*', 'µ', 'rp'),
    special('Enter', '↵', 'rp', 1.5),
  ],
  [
    special('ShiftLeft', '⇧', 'lp', 1.25),
    k('<', '>', 'lp'),
    k('w', 'W', 'lp'), k('x', 'X', 'lr'), k('c', 'C', 'lm'), k('v', 'V', 'li'), k('b', 'B', 'li'),
    k('n', 'N', 'ri'), k(',', '?', 'ri'), k(';', '.', 'rm'), k(':', '/', 'rr'), k('!', '§', 'rp'),
    special('ShiftRight', '⇧', 'rp', 2.75),
  ],
  [
    special('ControlLeft', 'Ctrl', 'lp', 1.5),
    special('MetaLeft', 'Super', 'lp', 1.25),
    special('AltLeft', 'Alt', 'th', 1.25),
    special('Space', 'Barre d’espace', 'th', 6.5),
    special('AltGraph', 'AltGr', 'th', 1.5),
    special('MetaRight', 'Super', 'rp', 1.25),
    special('ControlRight', 'Ctrl', 'rp', 1.5),
  ],
];

/** La barre d'espace, retrouvée par son identifiant plutôt que par sa position. */
const SPACE_KEY = ROWS.flat().find((key) => key.id === 'Space');

/** Table caractère -> { key, shift } pour savoir quelle touche éclairer. */
export const CHAR_TO_KEY = (() => {
  const map = new Map();
  for (const row of ROWS) {
    for (const key of row) {
      if (key.special) continue;
      if (!map.has(key.low)) map.set(key.low, { key, shift: false });
      if (key.up && !map.has(key.up)) map.set(key.up, { key, shift: true });
      if (key.alt && !map.has(key.alt)) map.set(key.alt, { key, altgr: true });
    }
  }
  map.set(' ', { key: SPACE_KEY, shift: false });
  return map;
})();

/** La touche Shift a utiliser : celle de la main opposée au doigt qui frappe. */
export function shiftKeyFor(finger) {
  if (finger === 'th') return null;
  return FINGERS[finger].hand === 'gauche' ? 'ShiftRight' : 'ShiftLeft';
}
