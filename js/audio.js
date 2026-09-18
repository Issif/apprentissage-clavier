/**
 * Retours sonores générés a la volée en WebAudio : aucun fichier a télécharger,
 * et le contexte n'est créé qu'a la première frappe (les navigateurs bloquent
 * l'audio tant qu'il n'y a pas eu d'interaction utilisateur).
 */

let ctx = null;

function context() {
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function blip(frequency, duration, type = 'sine', gain = 0.06) {
  const ac = context();
  if (!ac) return;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ac.currentTime);
  vol.gain.setValueAtTime(gain, ac.currentTime);
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(vol).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
}

export const sounds = {
  ok: () => blip(880, 0.08, 'sine'),
  ko: () => blip(180, 0.16, 'square', 0.05),
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.16, 'triangle', 0.07), i * 90));
  },
  levelUp: () => {
    [523, 784, 1047, 1319].forEach((f, i) => setTimeout(() => blip(f, 0.24, 'triangle', 0.08), i * 130));
  },
};
