// ═══════════════════════════════════════════════════════════════════════
// Système de trading — propositions et confirmations
// ═══════════════════════════════════════════════════════════════════════
import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const TRADE_FILE = path.join(__dirname, "../data/trades.json");

// Structure : { [tradeId]: TradeOffer }
// TradeOffer : {
//   id, status, createdAt, expiresAt,
//   offerer: { userId, auraUids: [], extraCash: 0 },
//   target:  { userId, auraUids: [], extraCash: 0 },
//   messageId, channelId
// }
let db = {};
try {
  if (fs.existsSync(TRADE_FILE)) db = JSON.parse(fs.readFileSync(TRADE_FILE, "utf8"));
} catch {}

function save() {
  try { fs.writeFileSync(TRADE_FILE, JSON.stringify(db, null, 2)); } catch {}
}

function genId() {
  return `trade_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const TRADE_TTL = 5 * 60 * 1000; // 5 minutes

/** Créer une nouvelle offre de trade */
export function createTrade({ offererId, targetId, offererAuraUids, targetAuraUids, offererExtraCash, targetExtraCash }) {
  const id = genId();
  db[id] = {
    id,
    status:     "pending",   // pending | accepted | declined | cancelled | expired
    createdAt:  Date.now(),
    expiresAt:  Date.now() + TRADE_TTL,
    offerer: { userId: offererId, auraUids: offererAuraUids || [], extraCash: offererExtraCash || 0 },
    target:  { userId: targetId,  auraUids: targetAuraUids  || [], extraCash: targetExtraCash  || 0 },
    messageId:  null,
    channelId:  null,
  };
  save();
  return db[id];
}

export function getTrade(id) { return db[id] || null; }

export function updateTradeStatus(id, status) {
  if (!db[id]) return null;
  db[id].status = status;
  save();
  return db[id];
}

export function setTradeMessage(id, messageId, channelId) {
  if (!db[id]) return;
  db[id].messageId = messageId;
  db[id].channelId = channelId;
  save();
}

/** Nettoyer les trades expirés */
export function cleanExpired() {
  const now = Date.now();
  let changed = false;
  for (const [id, trade] of Object.entries(db)) {
    if (trade.status === "pending" && trade.expiresAt < now) {
      db[id].status = "expired";
      changed = true;
    }
  }
  if (changed) save();
}

/** Trades en attente impliquant un joueur */
export function getPendingTradesFor(userId) {
  cleanExpired();
  return Object.values(db).filter(
    (t) => t.status === "pending" && (t.offerer.userId === userId || t.target.userId === userId)
  );
}
