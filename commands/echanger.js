import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from "discord.js";
import {
  createTrade, getTrade, updateTradeStatus,
  setTradeMessage, getPendingTradesFor, TRADE_TTL, cleanExpired,
} from "../utils/trades.js";
import { getInventory, removeAura, addAura } from "../utils/inventory.js";
import { getBalance, editBalance, getCurrencySymbol, isConfigured } from "../utils/unb.js";
import { RARITY_META } from "../data/auras.js";

// ── Helpers ───────────────────────────────────────────────────────────

function auraLine(aura, symbol) {
  const meta = RARITY_META[aura.rarity] || RARITY_META["Commun"];
  return `${aura.emoji}  **${aura.name}**  ${meta.stars}  \`${aura.sellPrice.toLocaleString()} ${symbol}\``;
}

function inventoryBlock(auras, symbol, title) {
  if (!auras.length) return `**${title}** — *Aucune formule*`;
  const lines = auras.slice(0, 15).map((a, i) => {
    const meta = RARITY_META[a.rarity] || RARITY_META["Commun"];
    return `\`${String(i + 1).padStart(2, "0")}\`  ${a.emoji}  **${a.name}**  ${meta.stars}  \`${a.sellPrice.toLocaleString()} ${symbol}\``;
  });
  if (auras.length > 15) lines.push(`*…${auras.length - 15} de plus*`);
  return `**${title}**\n${lines.join("\n")}`;
}

function buildTradeEmbed(trade, offererName, targetName, offAuras, tgtAuras, symbol) {
  const offSide = [
    ...offAuras.map((a) => auraLine(a, symbol)),
    trade.offerer.extraCash > 0 ? `🪙 **+${trade.offerer.extraCash.toLocaleString()} ${symbol}**` : null,
  ].filter(Boolean).join("\n") || "*Rien*";

  const tgtSide = [
    ...tgtAuras.map((a) => auraLine(a, symbol)),
    trade.target.extraCash > 0 ? `🪙 **+${trade.target.extraCash.toLocaleString()} ${symbol}**` : null,
  ].filter(Boolean).join("\n") || "*Rien*";

  const expiresIn = Math.max(0, Math.round((trade.expiresAt - Date.now()) / 1000));
  const colors = { pending:0xFFD700, accepted:0x57F287, declined:0x607D8B, cancelled:0x607D8B, expired:0x607D8B };

  return new EmbedBuilder()
    .setColor(colors[trade.status] || 0xFFD700)
    .setTitle("🔄 Proposition de Trade")
    .addFields(
      { name: `📤 ${offererName} propose`, value: offSide, inline: true },
      { name: `📥 ${targetName} donne`,   value: tgtSide, inline: true },
    )
    .setFooter({
      text: trade.status === "pending"
        ? `ID : ${trade.id}  •  Expire dans ${expiresIn}s`
        : `ID : ${trade.id}  •  ${trade.status}`,
    });
}

async function executeTrade(trade, client, symbol) {
  const offInv   = getInventory(trade.offerer.userId);
  const tgtInv   = getInventory(trade.target.userId);
  const offAuras = trade.offerer.auraUids.map((uid) => offInv.auras.find((a) => a.uid === uid)).filter(Boolean);
  const tgtAuras = trade.target.auraUids.map((uid) => tgtInv.auras.find((a) => a.uid === uid)).filter(Boolean);

  if (offAuras.length !== trade.offerer.auraUids.length)
    return { ok: false, reason: "Une des formules de l'offrant n'existe plus." };
  if (tgtAuras.length !== trade.target.auraUids.length)
    return { ok: false, reason: "Une des formules demandées n'est plus dans l'inventaire." };

  if (isConfigured()) {
    if (trade.offerer.extraCash > 0) {
      const bal = await getBalance(trade.offerer.userId);
      if (!bal || bal.cash < trade.offerer.extraCash)
        return { ok: false, reason: `L'offrant n'a plus assez de pièces (besoin : ${trade.offerer.extraCash.toLocaleString()} ${symbol}).` };
    }
    if (trade.target.extraCash > 0) {
      const bal = await getBalance(trade.target.userId);
      if (!bal || bal.cash < trade.target.extraCash)
        return { ok: false, reason: `Tu n'as pas assez de pièces (besoin : ${trade.target.extraCash.toLocaleString()} ${symbol}).` };
    }
  }

  for (const uid of trade.offerer.auraUids) removeAura(trade.offerer.userId, uid);
  for (const uid of trade.target.auraUids)  removeAura(trade.target.userId,  uid);
  for (const a of offAuras) addAura(trade.target.userId,  a);
  for (const a of tgtAuras) addAura(trade.offerer.userId, a);

  if (isConfigured()) {
    if (trade.offerer.extraCash > 0) {
      await editBalance(trade.offerer.userId, -trade.offerer.extraCash, `Trade ${trade.id}`);
      await editBalance(trade.target.userId,  +trade.offerer.extraCash, `Trade ${trade.id}`);
    }
    if (trade.target.extraCash > 0) {
      await editBalance(trade.target.userId,  -trade.target.extraCash,  `Trade ${trade.id}`);
      await editBalance(trade.offerer.userId, +trade.target.extraCash,  `Trade ${trade.id}`);
    }
  }

  updateTradeStatus(trade.id, "accepted");
  return { ok: true, offAuras, tgtAuras };
}

// ── Définition commande ───────────────────────────────────────────────

export const data = new SlashCommandBuilder()
  .setName("trade")
  .setDescription("🔄 Trading de formules entre joueurs")
  .addSubcommand((s) =>
    s.setName("propose")
      .setDescription("Proposer un trade — affiche d'abord les inventaires si aucun argument")
      .addUserOption((o) => o.setName("joueur").setDescription("Le joueur cible").setRequired(true))
      .addStringOption((o) => o.setName("offre").setDescription("Tes numéros de formules à offrir, séparés par virgules (ex: 1,3)").setRequired(false))
      .addIntegerOption((o) => o.setName("pieces_offre").setDescription("Pièces supplémentaires que tu donnes").setRequired(false).setMinValue(1))
      .addStringOption((o) => o.setName("demande").setDescription("Numéros des formules que tu veux (ex: 2)").setRequired(false))
      .addIntegerOption((o) => o.setName("pieces_demande").setDescription("Pièces que tu demandes en retour").setRequired(false).setMinValue(1))
  )
  .addSubcommand((s) =>
    s.setName("accept")
      .setDescription("Accepter un trade reçu")
      .addStringOption((o) => o.setName("id").setDescription("ID du trade").setRequired(true))
  )
  .addSubcommand((s) =>
    s.setName("decline")
      .setDescription("Refuser un trade")
      .addStringOption((o) => o.setName("id").setDescription("ID du trade").setRequired(true))
  )
  .addSubcommand((s) =>
    s.setName("cancel")
      .setDescription("Annuler un trade que tu as proposé")
      .addStringOption((o) => o.setName("id").setDescription("ID du trade").setRequired(true))
  )
  .addSubcommand((s) =>
    s.setName("list").setDescription("Voir tes trades en attente")
  );

// ── Exécution ─────────────────────────────────────────────────────────

export async function execute(interaction) {
  const sub    = interaction.options.getSubcommand();
  const userId = interaction.user.id;
  const symbol = await getCurrencySymbol();

  // ── /echanger propose ─────────────────────────────────────────────
  if (sub === "propose") {
    const targetUser   = interaction.options.getUser("joueur");
    const offreStr     = interaction.options.getString("offre")          || "";
    const demandeStr   = interaction.options.getString("demande")         || "";
    const pieceOffre   = interaction.options.getInteger("pieces_offre")   || 0;
    const pieceDemande = interaction.options.getInteger("pieces_demande") || 0;

    if (targetUser.id === userId)
      return interaction.reply({ content: "❌ Tu ne peux pas trader avec toi-même.", flags: MessageFlags.Ephemeral });
    if (targetUser.bot)
      return interaction.reply({ content: "❌ Tu ne peux pas trader avec un bot.", flags: MessageFlags.Ephemeral });

    const myInv     = getInventory(userId);
    const mySorted  = [...myInv.auras].sort((a, b) => b.sellPrice - a.sellPrice);
    const tgtInv    = getInventory(targetUser.id);
    const tgtSorted = [...tgtInv.auras].sort((a, b) => b.sellPrice - a.sellPrice);

    // ── Pas d'argument → afficher les deux inventaires pour aider ────
    if (!offreStr && !demandeStr && !pieceOffre && !pieceDemande) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`🔄 Trade avec ${targetUser.displayName}`)
            .setDescription([
              inventoryBlock(mySorted, symbol, `📤 Ton inventaire (${interaction.user.displayName})`),
              "",
              inventoryBlock(tgtSorted, symbol, `📥 Inventaire de ${targetUser.displayName}`),
              "",
              "➡️  Relance avec les numéros :",
              `\`/echanger propose joueur:@${targetUser.username} offre:1,2 demande:3\`",`,
            ].join("\n")),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    // ── Résoudre les auras offertes ───────────────────────────────────
    const offererAuraUids = [];
    if (offreStr) {
      for (const part of offreStr.split(",")) {
        const num = parseInt(part.trim());
        if (isNaN(num) || num < 1 || num > mySorted.length)
          return interaction.reply({ content: `❌ Formule n°**${part.trim()}** introuvable dans ton inventaire.`, flags: MessageFlags.Ephemeral });
        const uid = mySorted[num - 1].uid;
        if (!offererAuraUids.includes(uid)) offererAuraUids.push(uid);
      }
    }

    if (pieceOffre > 0 && isConfigured()) {
      const bal = await getBalance(userId);
      if (!bal || bal.cash < pieceOffre)
        return interaction.reply({ content: `❌ Solde insuffisant (${bal?.cash?.toLocaleString() ?? "?"} / ${pieceOffre.toLocaleString()} ${symbol}).`, flags: MessageFlags.Ephemeral });
    }

    // ── Résoudre les auras demandées ──────────────────────────────────
    const targetAuraUids = [];
    if (demandeStr) {
      for (const part of demandeStr.split(",")) {
        const num = parseInt(part.trim());
        if (isNaN(num) || num < 1 || num > tgtSorted.length)
          return interaction.reply({ content: `❌ Formule n°**${part.trim()}** introuvable dans l'inventaire de ${targetUser.username}.`, flags: MessageFlags.Ephemeral });
        const uid = tgtSorted[num - 1].uid;
        if (!targetAuraUids.includes(uid)) targetAuraUids.push(uid);
      }
    }

    const trade    = createTrade({ offererId:userId, targetId:targetUser.id, offererAuraUids, targetAuraUids, offererExtraCash:pieceOffre, targetExtraCash:pieceDemande });
    const offAuras = offererAuraUids.map((uid) => mySorted.find((a) => a.uid === uid)).filter(Boolean);
    const tgtAuras = targetAuraUids.map((uid) => tgtSorted.find((a) => a.uid === uid)).filter(Boolean);
    const embed    = buildTradeEmbed(trade, interaction.member?.displayName || interaction.user.username, targetUser.username, offAuras, tgtAuras, symbol);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`trade_accept_${trade.id}`).setLabel("✅ Accepter").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`trade_decline_${trade.id}`).setLabel("❌ Refuser").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`trade_cancel_${trade.id}`).setLabel("🚫 Annuler").setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({
      content: `${targetUser} — ${interaction.user} te propose un trade ! Tu as **${TRADE_TTL / 60000} min** pour répondre.`,
      embeds: [embed],
      components: [row],
    });

    const msg = await interaction.fetchReply();
    setTradeMessage(trade.id, msg.id, msg.channelId);
    return;
  }

  // ── /echanger accept ──────────────────────────────────────────────
  if (sub === "accept") {
    const tradeId = interaction.options.getString("id").trim();
    const trade   = getTrade(tradeId);
    if (!trade)                          return interaction.reply({ content: "❌ Trade introuvable.", flags: MessageFlags.Ephemeral });
    if (trade.status !== "pending")      return interaction.reply({ content: `❌ Ce trade est déjà **${trade.status}**.`, flags: MessageFlags.Ephemeral });
    if (trade.expiresAt < Date.now())    { updateTradeStatus(tradeId, "expired"); return interaction.reply({ content: "❌ Ce trade a expiré.", flags: MessageFlags.Ephemeral }); }
    if (trade.target.userId !== userId)  return interaction.reply({ content: "❌ Ce trade ne t'est pas destiné.", flags: MessageFlags.Ephemeral });

    const result = await executeTrade(trade, interaction.client, symbol);
    if (!result.ok) return interaction.reply({ content: `❌ ${result.reason}`, flags: MessageFlags.Ephemeral });

    const offUser = await interaction.client.users.fetch(trade.offerer.userId).catch(() => null);
    const lines = [
      `**${offUser?.username ?? "Offrant"}** ↔ **${interaction.user.username}**`,
      result.offAuras.length ? `📤 ${offUser?.username ?? "Offrant"} a donné : ${result.offAuras.map((a) => `${a.emoji} ${a.name}`).join(", ")}` : null,
      trade.offerer.extraCash > 0 ? `   + ${trade.offerer.extraCash.toLocaleString()} ${symbol}` : null,
      result.tgtAuras.length  ? `📥 ${interaction.user.username} a donné : ${result.tgtAuras.map((a) => `${a.emoji} ${a.name}`).join(", ")}` : null,
      trade.target.extraCash  > 0 ? `   + ${trade.target.extraCash.toLocaleString()} ${symbol}` : null,
    ].filter(Boolean).join("\n");

    await interaction.reply({ embeds: [new EmbedBuilder().setColor(0x57F287).setTitle("✅ Trade effectué !").setDescription(lines).setTimestamp()] });

    try {
      const ch  = await interaction.client.channels.fetch(trade.channelId);
      const msg = await ch.messages.fetch(trade.messageId);
      await msg.edit({ content: `✅ Trade accepté par ${interaction.user} via /echanger accept.`, components: [] });
    } catch {}
    return;
  }

  // ── /echanger decline ─────────────────────────────────────────────
  if (sub === "decline") {
    const tradeId = interaction.options.getString("id").trim();
    const trade   = getTrade(tradeId);
    if (!trade)                        return interaction.reply({ content: "❌ Trade introuvable.", flags: MessageFlags.Ephemeral });
    if (trade.status !== "pending")    return interaction.reply({ content: `❌ Ce trade est déjà **${trade.status}**.`, flags: MessageFlags.Ephemeral });
    if (trade.target.userId !== userId && trade.offerer.userId !== userId)
      return interaction.reply({ content: "❌ Tu n'es pas concerné par ce trade.", flags: MessageFlags.Ephemeral });
    updateTradeStatus(tradeId, "declined");
    try { const ch = await interaction.client.channels.fetch(trade.channelId); const msg = await ch.messages.fetch(trade.messageId); await msg.edit({ content: `❌ Trade refusé par ${interaction.user}.`, components: [] }); } catch {}
    return interaction.reply({ content: "✅ Trade refusé.", flags: MessageFlags.Ephemeral });
  }

  // ── /echanger cancel ──────────────────────────────────────────────
  if (sub === "cancel") {
    const tradeId = interaction.options.getString("id").trim();
    const trade   = getTrade(tradeId);
    if (!trade)                          return interaction.reply({ content: "❌ Trade introuvable.", flags: MessageFlags.Ephemeral });
    if (trade.status !== "pending")      return interaction.reply({ content: `❌ Ce trade est déjà **${trade.status}**.`, flags: MessageFlags.Ephemeral });
    if (trade.offerer.userId !== userId) return interaction.reply({ content: "❌ Seul l'offrant peut annuler ce trade.", flags: MessageFlags.Ephemeral });
    updateTradeStatus(tradeId, "cancelled");
    try { const ch = await interaction.client.channels.fetch(trade.channelId); const msg = await ch.messages.fetch(trade.messageId); await msg.edit({ content: `🚫 Trade annulé par ${interaction.user}.`, components: [] }); } catch {}
    return interaction.reply({ content: "✅ Trade annulé.", flags: MessageFlags.Ephemeral });
  }

  // ── /echanger list ────────────────────────────────────────────────
  if (sub === "list") {
    cleanExpired();
    const pending = getPendingTradesFor(userId);
    if (!pending.length)
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x607D8B).setDescription("🔄 Aucun trade en attente.")], flags: MessageFlags.Ephemeral });

    const lines = await Promise.all(pending.map(async (t) => {
      const isOff  = t.offerer.userId === userId;
      const other  = await interaction.client.users.fetch(isOff ? t.target.userId : t.offerer.userId).catch(() => null);
      const name   = other?.username ?? "?";
      const exp    = Math.max(0, Math.round((t.expiresAt - Date.now()) / 1000));
      const myN    = (isOff ? t.offerer : t.target).auraUids.length;
      const itsN   = (isOff ? t.target : t.offerer).auraUids.length;
      return `\`${t.id}\`  ${isOff ? `→ ${name}` : `← ${name}`}  ·  tu donnes **${myN}**  ·  tu reçois **${itsN}**  ·  ⏳ ${exp}s`;
    }));

    return interaction.reply({
      embeds: [new EmbedBuilder().setColor(0xFFD700).setTitle("🔄 Tes trades en attente").setDescription(lines.join("\n")).setFooter({ text: "Utilise /echanger accept <id> ou /echanger decline <id>" })],
      flags: MessageFlags.Ephemeral,
    });
  }
}
