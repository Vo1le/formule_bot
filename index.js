// ═══════════════════════════════════════════════════════════════════════
// AURA BOT MPI — index.js
// ═══════════════════════════════════════════════════════════════════════
import "dotenv/config";
import {
  Client, GatewayIntentBits, Collection, Events,
  EmbedBuilder, MessageFlags,
} from "discord.js";

import * as cmdOuvrir     from "./commands/ouvrir.js";
import * as cmdInventaire from "./commands/inventaire.js";
import * as cmdVendre     from "./commands/vendre.js";
import * as cmdCoffres    from "./commands/coffres.js";
import * as cmdSolde      from "./commands/solde.js";
import * as cmdClassement from "./commands/classement.js";
import * as cmdEchanger   from "./commands/echanger.js";

import { getTrade, updateTradeStatus }       from "./utils/trades.js";
import { getInventory, removeAura, addAura } from "./utils/inventory.js";
import { getBalance, editBalance, getCurrencySymbol, isConfigured } from "./utils/unb.js";
import { buildPayload, RARITY_DECODE }       from "./commands/inventaire.js";

const COMMANDS = [cmdOuvrir, cmdInventaire, cmdVendre, cmdCoffres, cmdSolde, cmdClassement, cmdEchanger];

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();
for (const cmd of COMMANDS) client.commands.set(cmd.data.name, cmd);

// ── Ready ────────────────────────────────────────────────────────────
client.once(Events.ClientReady, (c) => {
  console.log(`✅ ${c.user.tag} — ${client.commands.size} commandes`);
  console.log(`   UNB : ${process.env.UNB_TOKEN ? "✅ configuré" : "⚠️  mode démo"}`);
  c.user.setActivity("📐 /open pour des formules !", { type: 0 });
});

// ── Interactions ─────────────────────────────────────────────────────
client.on(Events.InteractionCreate, async (interaction) => {

  // ── Slash commands ───────────────────────────────────────────────
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (err) {
      console.error(`[CMD /${interaction.commandName}]`, err);
      const opts = { content: "❌ Une erreur s'est produite.", flags: MessageFlags.Ephemeral };
      if (interaction.replied || interaction.deferred) await interaction.followUp(opts).catch(() => {});
      else await interaction.reply(opts).catch(() => {});
    }
    return;
  }

  // ── Autocomplete ─────────────────────────────────────────────────
  if (interaction.isAutocomplete()) {
    const cmd = client.commands.get(interaction.commandName);
    if (cmd?.autocomplete) await cmd.autocomplete(interaction).catch((e) => console.error("[AC]", e));
    return;
  }

  if (!interaction.isButton()) return;
  const id = interaction.customId;

  // ════════════════════════════════════════════════════════════════
  // TRADE BUTTONS — format : trade_<action>_<tradeId>
  // ════════════════════════════════════════════════════════════════
  if (id.startsWith("trade_")) {
    const idx1    = id.indexOf("_");
    const idx2    = id.indexOf("_", idx1 + 1);
    const action  = id.slice(idx1 + 1, idx2);
    const tradeId = id.slice(idx2 + 1);

    const userId = interaction.user.id;
    const symbol = await getCurrencySymbol();
    const trade  = getTrade(tradeId);

    if (!trade)                     return interaction.update({ content: "❌ Trade introuvable ou expiré.", components: [] });
    if (trade.status !== "pending") return interaction.update({ content: `❌ Ce trade est déjà **${trade.status}**.`, components: [] });
    if (trade.expiresAt < Date.now()) {
      updateTradeStatus(tradeId, "expired");
      return interaction.update({ content: "⏰ Ce trade a expiré.", components: [] });
    }

    if (action === "accept") {
      if (trade.target.userId !== userId)
        return interaction.reply({ content: "❌ Seul le joueur ciblé peut accepter.", flags: MessageFlags.Ephemeral });

      await interaction.update({ content: "⏳ Exécution du trade…", components: [] });

      const offInv   = getInventory(trade.offerer.userId);
      const tgtInv   = getInventory(trade.target.userId);
      const offAuras = trade.offerer.auraUids.map((uid) => offInv.auras.find((a) => a.uid === uid)).filter(Boolean);
      const tgtAuras = trade.target.auraUids.map((uid) => tgtInv.auras.find((a) => a.uid === uid)).filter(Boolean);

      if (offAuras.length !== trade.offerer.auraUids.length)
        return interaction.followUp({ content: "❌ Une formule de l'offrant n'existe plus.", flags: MessageFlags.Ephemeral });
      if (tgtAuras.length !== trade.target.auraUids.length)
        return interaction.followUp({ content: "❌ Une formule demandée n'est plus dans ton inventaire.", flags: MessageFlags.Ephemeral });

      if (isConfigured()) {
        if (trade.offerer.extraCash > 0) {
          const bal = await getBalance(trade.offerer.userId);
          if (!bal || bal.cash < trade.offerer.extraCash)
            return interaction.followUp({ content: "❌ L'offrant n'a plus assez de pièces.", flags: MessageFlags.Ephemeral });
        }
        if (trade.target.extraCash > 0) {
          const bal = await getBalance(trade.target.userId);
          if (!bal || bal.cash < trade.target.extraCash)
            return interaction.followUp({ content: `❌ Tu n'as pas assez de pièces.`, flags: MessageFlags.Ephemeral });
        }
      }

      for (const uid of trade.offerer.auraUids) removeAura(trade.offerer.userId, uid);
      for (const uid of trade.target.auraUids)  removeAura(trade.target.userId,  uid);
      for (const a of offAuras) addAura(trade.target.userId,  a);
      for (const a of tgtAuras) addAura(trade.offerer.userId, a);

      if (isConfigured()) {
        if (trade.offerer.extraCash > 0) {
          await editBalance(trade.offerer.userId, -trade.offerer.extraCash, `Trade ${tradeId}`);
          await editBalance(trade.target.userId,  +trade.offerer.extraCash, `Trade ${tradeId}`);
        }
        if (trade.target.extraCash > 0) {
          await editBalance(trade.target.userId,  -trade.target.extraCash,  `Trade ${tradeId}`);
          await editBalance(trade.offerer.userId, +trade.target.extraCash,  `Trade ${tradeId}`);
        }
      }

      updateTradeStatus(tradeId, "accepted");

      const offUser = await client.users.fetch(trade.offerer.userId).catch(() => null);
      const lines   = [
        `**${offUser?.username ?? "Offrant"}** ↔ **${interaction.user.username}**`,
        offAuras.length             ? `📤 ${offUser?.username ?? "Offrant"} a donné : ${offAuras.map((a) => `${a.emoji} ${a.name}`).join(", ")}` : null,
        trade.offerer.extraCash > 0 ? `   + ${trade.offerer.extraCash.toLocaleString()} ${symbol}` : null,
        tgtAuras.length             ? `📥 ${interaction.user.username} a donné : ${tgtAuras.map((a) => `${a.emoji} ${a.name}`).join(", ")}` : null,
        trade.target.extraCash  > 0 ? `   + ${trade.target.extraCash.toLocaleString()} ${symbol}` : null,
      ].filter(Boolean).join("\n");

      return interaction.followUp({
        embeds: [new EmbedBuilder().setColor(0x57F287).setTitle("✅ Trade effectué !").setDescription(lines).setTimestamp()],
      });
    }

    if (action === "decline") {
      if (trade.target.userId !== userId && trade.offerer.userId !== userId)
        return interaction.reply({ content: "❌ Tu n'es pas concerné.", flags: MessageFlags.Ephemeral });
      updateTradeStatus(tradeId, "declined");
      return interaction.update({ content: `❌ Trade refusé par ${interaction.user}.`, components: [] });
    }

    if (action === "cancel") {
      if (trade.offerer.userId !== userId)
        return interaction.reply({ content: "❌ Seul l'offrant peut annuler.", flags: MessageFlags.Ephemeral });
      updateTradeStatus(tradeId, "cancelled");
      return interaction.update({ content: `🚫 Trade annulé par ${interaction.user}.`, components: [] });
    }
  }

  // ════════════════════════════════════════════════════════════════
  // INVENTAIRE PAGINATION — format : inv_prev_<userId>_<rc>_<page>
  // rc = code de rareté 1 lettre (a/c/p/r/e/l/s)
  // ════════════════════════════════════════════════════════════════
  if (id.startsWith("inv_prev_") || id.startsWith("inv_next_")) {
    try {
      const isNext  = id.startsWith("inv_next_");
      const prefix  = isNext ? "inv_next_" : "inv_prev_";
      const rest    = id.slice(prefix.length); // "<userId>_<rc>_<page>"
      const parts   = rest.split("_");

      // userId = parts[0] (18-20 chiffres)
      // rc     = parts[1] (1 lettre)
      // page   = parts[2]
      const targetId    = parts[0];
      const rc          = parts[1];
      const curPage     = parseInt(parts[2]);
      const rarityFilter = RARITY_DECODE[rc] ?? "all";
      const newPage     = curPage + (isNext ? 1 : -1);

      const target = await client.users.fetch(targetId).catch(() => null);
      if (!target) return interaction.update({ components: [] });

      const symbol  = await getCurrencySymbol();
      const payload = buildPayload(target, rarityFilter, newPage, symbol);
      await interaction.update(payload);
    } catch (e) {
      console.error("[BTN inv pagination]", e);
      await interaction.update({ components: [] }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
