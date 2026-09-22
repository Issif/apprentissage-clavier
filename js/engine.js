/**
 * Moteur de frappe : suit la position dans la séquence et valide chaque caractère.
 *
 * Choix pédagogique : en cas d'erreur le curseur N'AVANCE PAS. L'enfant doit
 * trouver la bonne touche avant de continuer, plutot que d'accumuler des fautes.
 */

export const CORRECT = 'correct';
export const WRONG = 'wrong';
export const COMPLETE = 'complete';

export class Engine {
  constructor() {
    this.target = '';
    this.index = 0;
    this.statuses = [];
    this.errorsAt = new Set();
    this.wrongOnCurrent = 0;
    this.stats = { typed: 0, errors: 0 };
  }

  load(sequence) {
    this.target = sequence;
    this.index = 0;
    this.statuses = new Array(sequence.length).fill(null);
    this.errorsAt = new Set();
    this.wrongOnCurrent = 0;
  }

  get expected() {
    return this.target[this.index] ?? null;
  }

  get done() {
    return this.index >= this.target.length;
  }

  get progress() {
    return this.target.length ? this.index / this.target.length : 0;
  }

  /** Nombre de caractères réussis du premier coup sur la séquence courante. */
  get cleanCount() {
    return this.target.length - this.errorsAt.size;
  }

  /**
   * @param {string} char caractère produit par la frappe
   * @returns {{result: string, index: number}} résultat pour l'affichage
   */
  press(char) {
    if (this.done) return { result: COMPLETE, index: this.index };

    const at = this.index;
    this.stats.typed += 1;

    if (char !== this.expected) {
      this.stats.errors += 1;
      this.errorsAt.add(at);
      this.wrongOnCurrent += 1;
      this.statuses[at] = WRONG;
      return { result: WRONG, index: at };
    }

    // Une case corrigée reste marquee comme rattrapée, pas comme parfaite.
    this.statuses[at] = CORRECT;
    this.wrongOnCurrent = 0;
    this.index += 1;
    return { result: this.done ? COMPLETE : CORRECT, index: at };
  }

  accuracy() {
    if (!this.stats.typed) return 100;
    return Math.round(((this.stats.typed - this.stats.errors) / this.stats.typed) * 100);
  }
}
