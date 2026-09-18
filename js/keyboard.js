/** Rendu du clavier AZERTY a l'ecran et mise en évidence de la touche a frapper. */

import { ROWS, CHAR_TO_KEY, FINGERS, shiftKeyFor } from './layout-azerty.js';

/** Legende des couleurs, construite depuis la table des doigts. */
export function renderLegend(root) {
  root.textContent = '';
  for (const [id, finger] of Object.entries(FINGERS)) {
    const li = document.createElement('li');
    li.innerHTML = `<i data-finger="${id}"></i>${finger.label}`;
    root.appendChild(li);
  }
}

export class VirtualKeyboard {
  /**
   * @param {HTMLElement} root conteneur du clavier
   * @param {HTMLElement} fingerHint élément de texte "quel doigt"
   */
  constructor(root, fingerHint) {
    this.root = root;
    this.fingerHint = fingerHint;
    this.keyElements = new Map();
    this.active = [];
    this.render();
  }

  render() {
    this.root.textContent = '';
    for (const row of ROWS) {
      const rowEl = document.createElement('div');
      rowEl.className = 'kb-row';
      for (const key of row) {
        const el = document.createElement('div');
        el.className = 'kb-key';
        el.dataset.finger = key.finger;
        el.style.setProperty('--unit', key.unit);
        if (key.special) el.classList.add('is-special');
        if (key.homing) el.classList.add('is-homing');

        if (key.special) {
          el.innerHTML = `<span class="kb-main">${key.label}</span>`;
        } else {
          const up = key.up && key.up !== key.low ? `<span class="kb-shifted">${key.up}</span>` : '';
          const alt = key.alt ? `<span class="kb-altgr">${key.alt}</span>` : '';
          el.innerHTML = `${up}<span class="kb-main">${key.low}</span>${alt}`;
        }

        this.keyElements.set(key.id, el);
        rowEl.appendChild(el);
      }
      this.root.appendChild(rowEl);
    }
  }

  clear() {
    for (const el of this.active) el.classList.remove('is-next', 'is-modifier');
    this.active = [];
  }

  /** Eclaire la touche (et la touche Maj si le caractère l'exige). */
  highlight(char) {
    this.clear();
    if (char === null || char === undefined) {
      this.fingerHint.textContent = '';
      return;
    }

    const entry = CHAR_TO_KEY.get(char);
    if (!entry) {
      this.fingerHint.textContent = 'Cette touche n’est pas sur le clavier AZERTY.';
      return;
    }

    const keyEl = this.keyElements.get(entry.key.id);
    if (keyEl) {
      keyEl.classList.add('is-next');
      this.active.push(keyEl);
    }

    let hint = FINGERS[entry.key.finger].label;

    if (entry.altgr) {
      const altEl = this.keyElements.get('AltGraph');
      if (altEl) {
        altEl.classList.add('is-modifier');
        this.active.push(altEl);
      }
      hint += ' + AltGr (pouce droit)';
    }

    if (entry.shift) {
      const shiftId = shiftKeyFor(entry.key.finger);
      const shiftEl = shiftId && this.keyElements.get(shiftId);
      if (shiftEl) {
        shiftEl.classList.add('is-modifier');
        this.active.push(shiftEl);
      }
      hint += ' + Maj de l’autre main';
    }
    this.fingerHint.textContent = hint;
  }

  /** Petit retour visuel sur la touche réellement frappée. */
  flash(char, ok) {
    const entry = CHAR_TO_KEY.get(char);
    const el = entry && this.keyElements.get(entry.key.id);
    if (!el) return;
    const cls = ok ? 'flash-ok' : 'flash-ko';
    el.classList.remove(cls);
    void el.offsetWidth; // force le redemarrage de l'animation
    el.classList.add(cls);
    el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
  }
}
