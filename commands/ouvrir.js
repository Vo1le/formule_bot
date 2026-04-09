import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { CASES } from "../data/auras.js";
import { rollAura } from "../utils/rollAura.js";
import { addAura } from "../utils/inventory.js";
import { getBalance, editBalance, getCurrencySymbol, isConfigured } from "../utils/unb.js";
import { playOpeningAnimation } from "../utils/animation.js";

export const data = new SlashCommandBuilder()
  .setName("open")
  .setDescription("🎲 Ouvrir une case pour obtenir une aura")
  .addStringOption((opt) =>
    opt.setName("case")
      .setDescription("Type de case à ouvrir")
      .setRequired(true)
      .addChoices(
        { name: "Case Basique 📦 (100 pièces)", value: "basic" },
        { name: "Case Prépa 📚 (500 pièces)", value: "premium" },
        { name: "Case Normalien 🎓(2000 pièces)", value: "legendary" }
      )
  );

export async function execute(interaction) {
  const caseId   = interaction.options.getString("case");
  const caseData = CASES[caseId];
  const userId   = interaction.user.id;
  const symbol   = await getCurrencySymbol();

  // ── Déférer la réponse (l'animation prend du temps) ─────────────────
  await interaction.deferReply();

  // ── Vérification et débit UNB ────────────────────────────────────────
  let newBalance = null;

  if (isConfigured()) {
    const bal = await getBalance(userId);

    if (!bal) {
      return interaction.editReply({
        embeds: [errorEmbed("Impossible de lire ton solde UnbelievaBoat. Réessaie dans quelques secondes.")],
      });
    }

    if (bal.cash < caseData.price) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFF5252)
            .setTitle("❌ Solde insuffisant")
            .setDescription(
              `Il te faut **${caseData.price.toLocaleString()} ${symbol}** pour ouvrir cette case.\n` +
              `Tu as actuellement **${bal.cash.toLocaleString()} ${symbol}**.\n\n` +
              `Manque : **${(caseData.price - bal.cash).toLocaleString()} ${symbol}**`
            ),
        ],
      });
    }

    // Débiter les pièces
    const deducted = await editBalance(userId, -caseData.price, `Case ${caseData.name}`);
    if (!deducted) {
      return interaction.editReply({
        embeds: [errorEmbed("Erreur lors du débit UNB. Ton solde n'a pas été modifié.")],
      });
    }
    newBalance = deducted.cash;
  } else {
    // Mode démo — pas de débit
    console.log(`[DEMO] ${interaction.user.tag} ouvre ${caseId} sans UNB`);
  }

  // ── Tirer l'aura ─────────────────────────────────────────────────────
  const aura = rollAura(caseId);

  // ── Enregistrer dans l'inventaire ────────────────────────────────────
  addAura(userId, aura);

  // ── Jouer l'animation ─────────────────────────────────────────────────
  await playOpeningAnimation(interaction, aura, caseId, newBalance, symbol);
}

function errorEmbed(msg) {
  return new EmbedBuilder().setColor(0xFF5252).setTitle("❌ Erreur").setDescription(msg);
}
