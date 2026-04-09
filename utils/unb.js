// ═══════════════════════════════════════════════════════════════════════
// UnbelievaBoat API Wrapper
// Auth: header "Authorization: <token>" sans préfixe
// ═══════════════════════════════════════════════════════════════════════
import fetch from "node-fetch";

const BASE = "https://unbelievaboat.com/api/v1";
const TOKEN = process.env.UNB_TOKEN;
const GUILD  = process.env.GUILD_ID;

function headers() {
  return { "Authorization": TOKEN, "Content-Type": "application/json" };
}

/** Récupère le solde cash + bank d'un utilisateur */
export async function getBalance(userId) {
  if (!TOKEN || !GUILD) return null;
  try {
    const res = await fetch(`${BASE}/guilds/${GUILD}/users/${userId}`, {
      headers: headers(),
    });
    if (!res.ok) {
      console.error(`[UNB] getBalance ${userId} → ${res.status}`, await res.text());
      return null;
    }
    return res.json(); // { user_id, cash, bank, total }
  } catch (e) {
    console.error("[UNB] getBalance exception:", e.message);
    return null;
  }
}

/**
 * Modifie le solde d'un utilisateur par un delta.
 * cashDelta positif = ajouter, négatif = retirer.
 * @returns {object|null} Nouveau solde ou null si erreur
 */
export async function editBalance(userId, cashDelta, reason = "Aura Bot") {
  if (!TOKEN || !GUILD) return null;
  try {
    const res = await fetch(`${BASE}/guilds/${GUILD}/users/${userId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ cash: cashDelta, reason }),
    });
    if (!res.ok) {
      console.error(`[UNB] editBalance ${userId} Δ${cashDelta} → ${res.status}`, await res.text());
      return null;
    }
    return res.json();
  } catch (e) {
    console.error("[UNB] editBalance exception:", e.message);
    return null;
  }
}

/** Vérifie si UNB est configuré */
export function isConfigured() {
  return Boolean(TOKEN && GUILD);
}

/** Symbole monétaire du serveur (récupère une fois, met en cache) */
let _symbol = null;
export async function getCurrencySymbol() {
  if (_symbol) return _symbol;
  if (!TOKEN || !GUILD) return "💰";
  try {
    const res = await fetch(`${BASE}/guilds/${GUILD}`, { headers: headers() });
    if (!res.ok) return "💰";
    const data = await res.json();
    _symbol = data.currency_symbol || data.currencySymbol || "💰";
    return _symbol;
  } catch {
    return "💰";
  }
}
