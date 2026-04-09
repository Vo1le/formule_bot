import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getCurrencySymbol } from "../utils/unb.js";
import { getAllData, getStats } from "../utils/inventory.js";
import { RARITY_META } from "../data/auras.js";

export const data = new SlashCommandBuilder()
  .setName("leader_roll")
  .setDescription("🏆 Classement des meilleurs joueurs")
  .addStringOption((opt) =>
    opt.setName("tri")
      .setDescription("Trier par…")
      .setRequired(false)
      .addChoices(
        { name: "🎲 Rolls totaux",     value: "rolls" },
        { name: "🃏 Formules possédées",  value: "auras" },
        { name: "💰 Valeur inventaire",value: "value" },
        { name: "⭐ Aura la plus rare", value: "rarest" },
      )
  );

export async function execute(interaction) {
  const sortBy = interaction.options.getString("tri") || "rolls";
  const symbol = await getCurrencySymbol();

  await interaction.deferReply();

  const allData = getAllData();

  const entries = Object.entries(allData).map(([userId, data]) => {
    const totalValue = data.auras.reduce((s, a) => s + (a.sellPrice || 0), 0);
    const rarest     = data.auras.reduce((best, a) => (!best || a.sellPrice > best.sellPrice ? a : best), null);
    return { userId, totalRolls: data.totalRolls || 0, totalAuras: data.auras.length, totalValue, rarest };
  });

  // Trier
  entries.sort((a, b) => {
    if (sortBy === "rolls")   return b.totalRolls - a.totalRolls;
    if (sortBy === "auras")   return b.totalAuras - a.totalAuras;
    if (sortBy === "value")   return b.totalValue - a.totalValue;
    if (sortBy === "rarest")  return (b.rarest?.sellPrice || 0) - (a.rarest?.sellPrice || 0);
    return b.totalRolls - a.totalRolls;
  });

  const top = entries.slice(0, 10);

  if (top.length === 0) {
    return interaction.editReply({
      embeds: [new EmbedBuilder().setColor(0x607D8B).setDescription("Aucun joueur enregistré pour l'instant.")],
    });
  }

  const medals = ["🥇","🥈","🥉"];
  const sortLabels = { rolls:"🎲 Rolls", auras:"🃏 Auras", value:"💰 Valeur", rarest:"⭐ Aura rare" };

  // Résoudre les pseudo Discord
  const lines = await Promise.all(top.map(async (e, i) => {
    let name = `<@${e.userId}>`;
    try {
      const member = await interaction.guild.members.fetch(e.userId).catch(() => null);
      if (member) name = member.displayName;
    } catch {}

    const medal = medals[i] || `\`${i + 1}\``;
    let stat = "";
    if (sortBy === "rolls")  stat = `${e.totalRolls.toLocaleString()} rolls`;
    if (sortBy === "auras")  stat = `${e.totalAuras.toLocaleString()} auras`;
    if (sortBy === "value")  stat = `${e.totalValue.toLocaleString()} ${symbol}`;
    if (sortBy === "rarest") stat = e.rarest ? `${e.rarest.emoji} ${e.rarest.name}` : "—";

    return `${medal} **${name}** — ${stat}`;
  }));

  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle(`🏆 Leaderboard — ${sortLabels[sortBy]}`)
    .setDescription(lines.join("\n"))
    .setFooter({ text: `Trié par : ${sortLabels[sortBy]}  •  Top 10` })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}
