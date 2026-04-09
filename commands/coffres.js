import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { CASES, AURAS, RARITY_META } from "../data/auras.js";
import { getDisplayChance } from "../utils/rollAura.js";
import { getCurrencySymbol } from "../utils/unb.js";

export const data = new SlashCommandBuilder()
  .setName("cases")
  .setDescription("📦 Voir les cases disponibles et leurs probabilités")
  .addStringOption((opt) =>
    opt.setName("case")
      .setDescription("Détails d'une case spécifique")
      .setRequired(false)
      .addChoices(
        { name: "Case Basique 📦 (100 pièces)", value: "basic" },
        { name: "Case Prépa 📚 (500 pièces)", value: "premium" },
        { name: "Case Normalien 🎓(2000 pièces)", value: "legendary" }
      )
  );

export async function execute(interaction) {
  const caseId = interaction.options.getString("case");
  const symbol = await getCurrencySymbol();

  if (!caseId) {
    // Vue d'ensemble de toutes les cases
    const embed = new EmbedBuilder()
      .setColor(0x9C27B0)
      .setTitle("📦 Cases disponibles")
      .setDescription("Utilise `/open <case>` pour ouvrir une case.\nUtilise `/cases <case>` pour voir les probabilités détaillées.")
      .addFields(
        Object.values(CASES).map((c) => ({
          name: `${c.emoji} ${c.name}`,
          value: `Prix : **${c.price.toLocaleString()} ${symbol}**\n${c.description}`,
          inline: true,
        }))
      )
      .setFooter({ text: "Les probabilités varient selon le type de case" });

    return interaction.reply({ embeds: [embed] });
  }

  // Détails d'une case : tableau de probabilités
  const caseData = CASES[caseId];
  const rarityOrder = ["Secret","Légendaire","Épique","Rare","Peu Commun","Commun"];

  // Regrouper les auras par rareté
  const byRarity = {};
  for (const rarity of rarityOrder) {
    const auras = AURAS.filter((a) => a.rarity === rarity);
    if (!auras.length) continue;

    // Pour la case légendaire, sauter Commun et Peu Commun
    if (caseData.minRarity === "Rare" && ["Commun","Peu Commun"].includes(rarity)) continue;

    byRarity[rarity] = auras;
  }

  const embed = new EmbedBuilder()
    .setColor(caseData.color)
    .setTitle(`${caseData.emoji} ${caseData.name} — Probabilités`)
    .setDescription(`> ${caseData.description}\n> Prix : **${caseData.price.toLocaleString()} ${symbol}**`);

  for (const [rarity, auras] of Object.entries(byRarity)) {
    const meta  = RARITY_META[rarity];
    const lines = auras.map((a) =>
      `${a.emoji} **${a.name}** — ${getDisplayChance(a, caseId)} *(revente: ${a.sellPrice.toLocaleString()} ${symbol})*`
    ).join("\n");

    embed.addFields({
      name: `${meta.stars} ${rarity}`,
      value: lines,
      inline: false,
    });
  }

  embed.setFooter({ text: "Les chances sont approximatives et peuvent légèrement varier" });
  await interaction.reply({ embeds: [embed] });
}
