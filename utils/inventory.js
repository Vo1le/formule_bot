import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "../data/inventory.json");

function load() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (e) { console.error("[Inventory] Lecture:", e.message); }
  return {};
}

function save(data) {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }
  catch (e) { console.error("[Inventory] Écriture:", e.message); }
}

let db = load();

// Set des UIDs réservés (en mémoire seulement, reset au redémarrage = OK)
// Structure: Set<"userId:auraUid">
const reserved = new Set();

// ─────────────────────────────────────────────────────────────────────
// CRUD auras
// ─────────────────────────────────────────────────────────────────────
export function addAura(userId, aura) {
  if (!db[userId]) db[userId] = { auras: [], totalRolls: 0 };
  db[userId].totalRolls++;
  db[userId].auras.push({
    uid:        `${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    id:         aura.id,
    name:       aura.name,
    emoji:      aura.emoji,
    rarity:     aura.rarity,
    sellPrice:  aura.sellPrice,
    color:      aura.color,
    obtainedAt: Date.now(),
  });
  save(db);
}

export function getInventory(userId) {
  return db[userId] || { auras: [], totalRolls: 0 };
}

export function removeAura(userId, auraUid) {
  const inv = db[userId]; if (!inv) return null;
  const idx = inv.auras.findIndex((a) => a.uid === auraUid);
  if (idx === -1) return null;
  const [removed] = inv.auras.splice(idx, 1);
  reserved.delete(`${userId}:${auraUid}`);
  save(db);
  return removed;
}

// ─────────────────────────────────────────────────────────────────────
// Réservation (pour le trade — empêche revente simultanée)
// ─────────────────────────────────────────────────────────────────────
export function reserveAura(userId, auraUid) {
  reserved.add(`${userId}:${auraUid}`);
}

export function unreserveAura(userId, auraUid) {
  reserved.delete(`${userId}:${auraUid}`);
}

export function isReserved(userId, auraUid) {
  return reserved.has(`${userId}:${auraUid}`);
}

// ─────────────────────────────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────────────────────────────
export function getStats(userId) {
  const inv = db[userId] || { auras: [], totalRolls: 0 };
  const counts = {};
  for (const a of inv.auras) counts[a.rarity] = (counts[a.rarity] || 0) + 1;
  return {
    totalRolls: inv.totalRolls,
    totalAuras: inv.auras.length,
    byRarity:   counts,
    rarest:     inv.auras.reduce((b, a) => (!b || a.sellPrice > b.sellPrice ? a : b), null),
  };
}

export function getTopAuras(userId, limit = 5) {
  const inv = db[userId] || { auras: [] };
  return [...inv.auras].sort((a, b) => b.sellPrice - a.sellPrice).slice(0, limit);
}

// Exposer db brut pour le leaderboard
export function getAllData() { return db; }
