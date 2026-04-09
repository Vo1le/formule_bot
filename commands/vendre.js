import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from "discord.js";
import { getInventory, removeAura } from "../utils/inventory.js";
import { editBalance, getCurrencySymbol, isConfigured } from "../utils/unb.js";
import { RARITY_META } from "../data/auras.js";

const PAGE_SIZE = 10;

export const data = new SlashCommandBuilder()
  .setName("sell")
  .setDescription("💸 Revendre une formule de ton inventaire")
  .addStringOption((o) =>
    o.setName("formule")
      .setDescription("Numéro de la formule (voir ta liste ci-dessous — ex: 3)")
      .setRequired(false)
  );

export async function execute(interaction) {
  const userId = interaction.user.id;
  const symbol = await getCurrencySymbol();
  const inv    = getInventory(userId);
  const input  = interaction.options.getString("formule")?.trim() ?? null;

  if (!inv.auras.length) {
    return interaction.reply({
      embeds: [err("Ton inventaire est vide. Ouvre une case avec `/ouvrir` !")],
      flags: MessageFlags.Ephemeral,
    });
  }

  const sorted = [...inv.auras].sort((a, b) => b.sellPrice - a.sellPrice);

  // ── Pas de numéro fourni → afficher la liste ─────────────────────────
  if (!input) {
    const totalValue = sorted.reduce((s, a) => s + a.sellPrice, 0);

    const listLines = sorted.slice(0, PAGE_SIZE).map((a, i) => {
      const meta = RARITY_META[a.rarity] || RARITY_META["Commun"];
      return `\`${String(i + 1).padStart(2, "0")}\`  ${a.emoji}  **${a.name}**  ${meta.stars}  \`${a.sellPrice.toLocaleString()} ${symbol}\``;
    }).join("\n");

    const more = sorted.length > PAGE_SIZE
      ? `\n*…et ${sorted.length - PAGE_SIZE} autres. Utilise \`/inventaire\` pour tout voir.*`
      : "";

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x5865F2)
          .setAuthor({
            name: `💸 Vendre une formule — ${interaction.user.displayName}`,
            iconURL: interaction.user.displayAvatarURL()
          })
          .setDescription([
            `**${sorted.length}** formules  ·  valeur totale **${totalValue.toLocaleString()} ${symbol}**\n`,
            listLines,
            more,
            `\n➡️  Relance la commande avec le numéro : \`/vendre formule:3\``,
          ].join("\n")),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }

  // ── Résolution de la formule ─────────────────────────────────────────
  let target = sorted.find((a) => a.uid === input);

  if (!target) {
    const num = parseInt(input);
    if (!isNaN(num) && num >= 1 && num <= sorted.length) {
      target = sorted[num - 1];
    } else {
      target = sorted.find((a) => a.name.toLowerCase() === input.toLowerCase());
    }
  }

  if (!target) {
    return interaction.reply({
      embeds: [err(`Formule \`${input}\` introuvable.\nUtilise \`/vendre\` sans argument pour voir ta liste.`)],
      flags: MessageFlags.Ephemeral,
    });
  }

  const meta = RARITY_META[target.rarity] || RARITY_META["Commun"];

  // ── Embed confirmation ───────────────────────────────────────────────
  const confirmEmbed = new EmbedBuilder()
    .setColor(target.color ?? 0x5865F2)
    .setTitle(`💸 Confirmer la vente`)
    .setDescription([
      `${target.emoji}  **${target.name}**`,
      `${meta.stars}  ${target.rarity}  ·  *${target.chapter ?? ""}*`,
      ``,
      `\`\`\``,
      target.display,
      `\`\`\``,
      `> ${target.description}`,
      ``,
      `Valeur de revente : **${target.sellPrice.toLocaleString()} ${symbol}**`,
      !isConfigured() ? `\n-# ⚠️ Mode démo — aucun vrai crédit ne sera effectué.` : "",
    ].join("\n"))
    .setImage(latexUrl(target.latex));

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`sell_confirm_${target.uid}`)
      .setLabel(`✅ Vendre — ${target.sellPrice.toLocaleString()} ${symbol}`)
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("sell_cancel")
      .setLabel("❌ Annuler")
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.reply({
    embeds: [confirmEmbed],
    components: [row],
    flags: MessageFlags.Ephemeral
  });

  // ✅ FIX : collector sur le message uniquement
  const msg = await interaction.fetchReply();

  const col = msg.createMessageComponentCollector({
    filter: (i) =>
      i.user.id === userId &&
      (i.customId === `sell_confirm_${target.uid}` || i.customId === "sell_cancel"),
    time: 30_000,
    max: 1,
  });

  col.on("collect", async (btn) => {
    // ✅ protection anti double réponse
    if (btn.replied || btn.deferred) return;

    if (btn.customId === "sell_cancel") {
      return btn.update({
        embeds: [ok("Vente annulée.")],
        components: []
      });
    }

    const removed = removeAura(userId, target.uid);

    if (!removed) {
      return btn.update({
        embeds: [err("Formule introuvable (déjà vendue ?).")],
        components: []
      });
    }

    let newBal = null;
    if (isConfigured()) {
      const res = await editBalance(userId, target.sellPrice, `Vente ${target.name}`);
      newBal = res?.cash ?? null;
    }

    await btn.update({
      embeds: [
        new EmbedBuilder()
          .setColor(0x57F287)
          .setDescription([
            `${target.emoji}  **${target.name}**  vendu avec succès !`,
            ``,
            `+\`${target.sellPrice.toLocaleString()} ${symbol}\`${newBal !== null
              ? `  ·  Nouveau solde : \`${newBal.toLocaleString()} ${symbol}\``
              : ""}`,
          ].join("\n")),
      ],
      components: [],
    });
  });

  col.on("end", (c) => {
    if (!c.size) {
      interaction.editReply({ components: [] }).catch(() => {});
    }
  });
}

// ── Helpers ───────────────────────────────────────────────────────────
function err(msg) {
  return new EmbedBuilder()
    .setColor(0xFF5252)
    .setDescription(`❌  ${msg}`);
}

function ok(msg) {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setDescription(msg);
}

function latexUrl(latex) {
  if (!latex) return null;
  return `https://latex.codecogs.com/png.image?\\dpi{120}\\bg{black}\\color{white}${encodeURIComponent(latex)}`;
}