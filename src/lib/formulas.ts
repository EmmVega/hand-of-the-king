import { House, ReinforceOutput } from '../types/game';

/* =====================================================================
   FORMULAS — reinforce computation
   ===================================================================== */

export function computeReinforce(h: House): ReinforceOutput {
  const tc = h.territories + h.castles;
  const raw = Math.floor(tc / 3);
  const baseArmies = Math.max(3, Math.min(13, raw));
  const armies = baseArmies + (h.bonusArmies || 0);
  const gold = (armies + h.ports) * 100;
  return { baseArmies, armies, gold };
}

export function computeTotal(h: House): number {
  return h.territories + h.castles + h.ports;
}
