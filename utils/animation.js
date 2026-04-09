import { EmbedBuilder } from "discord.js";
import { RARITY_META, CASES, latexImageUrl } from "../data/auras.js";

const DELAY = (ms) => new Promise((r) => setTimeout(r, ms));

const SPINNERS = {
  "Commun":     ["○", "◌", "◎", "●"],
  "Peu Commun": ["◇", "◈", "◆", "✦"],
  "Rare":       ["▷", "▶", "◀", "◁"],
  "Épique":     ["✧", "✦", "★", "✩"],
  "Légendaire": ["✦", "⬡", "⬢", "✦"],
  "Secret":     ["⠋", "⠙", "⠹", "⠸"],
};

/**
 * Animation ~1.8s puis embed final avec image LaTeX.
 * Phase 1 : spinner  5 × 150ms = 750ms
 * Phase 2 : révélation  3 × 180ms = 540ms
 * Phase 3 : embed final avec image LaTeX
 */
export async function playOpeningAnimation(interaction, aura, caseId, newBalance, symbol) {
  const caseData   = CASES[caseId];
  const rarityMeta = RARITY_META[aura.rarity] || RARITY_META["Commun"];
  const spinner    = SPINNERS[aura.rarity] || SPINNERS["Commun"];

  // Phase 1 — spinner
  for (let i = 0; i < 5; i++) {
    const s = spinner[i % spinner.length];
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(i < 3 ? caseData.color : aura.color)
          .setDescription(`-# ${caseData.emoji} ${caseData.name}\n\n## ${s}  —  \`?\`  —  ${s}`)
          .setFooter({ text: "Tirage en cours…" }),
      ],
    });
    await DELAY(150);
  }

  // Phase 2 — révélation du nom
  const half = Math.ceil(aura.name.length / 2);
  const steps = [
    `## ${aura.emoji}  —  \`${aura.name[0]}${"?".repeat(aura.name.length - 1)}\``,
    `## ${aura.emoji}  —  \`${aura.name.slice(0, half)}${"?".repeat(aura.name.length - half)}\``,
    `## ${aura.emoji}  —  \`${aura.name}\``,
  ];
  for (const step of steps) {
    await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(aura.color).setDescription(`-# ${caseData.emoji} ${caseData.name}\n\n${step}`)],
    });
    await DELAY(180);
  }

  // Phase 3 — embed final avec LaTeX
  const isHigh  = ["Légendaire", "Secret", "Épique"].includes(aura.rarity);
  const balLine = newBalance !== null ? `\n-# Solde : ${newBalance.toLocaleString()} ${symbol}` : "";

  // Description : affichage texte de la formule + info cours
  const desc = [
    `## ${aura.emoji}  ${aura.name}`,
    ``,
    `${rarityMeta.stars}  **${aura.rarity}**  ·  1/${aura.chance.toLocaleString()}  ·  *${aura.chapter}*`,
    ``,
    // Formule en bloc code pour ressembler à du LaTeX texte
    "```",
    aura.display,
    "```",
    `> ${aura.description}`,
    ``,
    `\`${aura.sellPrice.toLocaleString()} ${symbol}\` valeur de revente`,
    balLine,
  ].join("\n");

  // Générer l'URL de l'image LaTeX via codecogs
  const imgUrl = latexImageUrl(aura.latex);

  const finalEmbed = new EmbedBuilder()
    .setColor(aura.color)
    .setDescription(desc)
    .setImage(imgUrl)   // Image LaTeX rendue en PNG
    .setTimestamp();

  await interaction.editReply({
    content: isHigh ? buildAnnouncement(aura) : null,
    embeds:  [finalEmbed],
  });
}

function buildAnnouncement(aura) {
  const map = {
    "Épique":     `### ${aura.emoji}  ${aura.name}  —  Épique`,
    "Légendaire": `### ${aura.emoji}  ${aura.name}  —  Légendaire`,
    "Secret":     `### ${aura.emoji}  ${aura.name}  —  Secret  ·  1/${aura.chance.toLocaleString()}`,
  };
  return map[aura.rarity] ?? null;
}
