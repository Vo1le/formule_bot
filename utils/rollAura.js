import { AURAS, RARITY_META, CASES } from "../data/auras.js";

/**
 * Tire une aura en tenant compte des boosts de la case.
 * @param {string} caseId - "basic" | "premium" | "legendary"
 */
export function rollAura(caseId = "basic") {
  const caseData = CASES[caseId] || CASES.basic;

  // Construire la table de poids avec éventuels boosts
  const table = AURAS.map((aura) => {
    let weight = Math.floor(1_000_000 / aura.chance);
    if (caseData.rarityBoost?.[aura.rarity] !== undefined) {
      weight = Math.floor(weight * caseData.rarityBoost[aura.rarity]);
    }
    // Case légendaire : exclure Commun et Peu Commun
    if (caseData.minRarity === "Rare" && ["Commun","Peu Commun"].includes(aura.rarity)) {
      weight = 0;
    }
    return { ...aura, weight: Math.max(0, weight) };
  }).filter((a) => a.weight > 0);

  const totalWeight = table.reduce((s, a) => s + a.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const aura of table) {
    roll -= aura.weight;
    if (roll <= 0) return aura;
  }
  return table[0];
}

/**
 * Calcule la probabilité affichable d'une aura pour une case donnée.
 */
export function getDisplayChance(aura, caseId = "basic") {
  const caseData = CASES[caseId] || CASES.basic;
  const table = AURAS.map((a) => {
    let weight = Math.floor(1_000_000 / a.chance);
    if (caseData.rarityBoost?.[a.rarity] !== undefined) weight = Math.floor(weight * caseData.rarityBoost[a.rarity]);
    if (caseData.minRarity === "Rare" && ["Commun","Peu Commun"].includes(a.rarity)) weight = 0;
    return { ...a, weight: Math.max(0, weight) };
  }).filter((a) => a.weight > 0);

  const total = table.reduce((s, a) => s + a.weight, 0);
  const w     = table.find((a) => a.id === aura.id)?.weight || 0;
  const pct   = (w / total) * 100;
  return pct < 0.01 ? `1/${aura.chance.toLocaleString()}` : `${pct.toFixed(2)}%`;
}
