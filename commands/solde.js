import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import { getBalance, getCurrencySymbol, isConfigured } from "../utils/unb.js";
import { getStats } from "../utils/inventory.js";

export const data = new SlashCommandBuilder()
  .setName("solde")
  .setDescription("💰 Voir ton solde UnbelievaBoat")
  .addUserOption((opt) =>
    opt.setName("joueur").setDescription("Voir le solde d'un autre joueur").setRequired(false)
  );

export async function execute(interaction) {
  const target = interaction.options.getUser("joueur") || interaction.user;
  const symbol = await getCurrencySymbol();

  if (!isConfigured()) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xFF9800)
          .setTitle("⚠️ UNB non configuré")
          .setDescription("UnbelievaBoat n'est pas configuré. Configure `UNB_TOKEN` et `GUILD_ID` dans le `.env`."),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }

  await interaction.deferReply();

  const bal   = await getBalance(target.id);
  const stats = getStats(target.id);

  if (!bal) {
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xFF5252)
          .setTitle("❌ Erreur")
          .setDescription("Impossible de récupérer le solde. Réessaie dans quelques secondes."),
      ],
    });
  }


  const totalAuraValue = (getStats(target.id).totalAuras > 0)
    ? ` *(+ ~${(stats.totalAuras * 100).toLocaleString()} ${symbol} estimés en auras)*`
    : "";
  

  const embed = new EmbedBuilder()
    .setColor(0x4CAF50)
    .setTitle(`💰 Solde de ${target.displayName}`)
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: `${symbol} Cash`,   value: `**${bal.cash.toLocaleString() }**`,  inline: true },
      { name: `🏦 Banque`,        value: `**${bal.bank.toLocaleString()}**`,  inline: true },
      { name: `📊 Total`,         value: `**${bal.total.toLocaleString()}**`, inline: true },
      { name: `🎲 Rolls effectués`, value: `**${stats.totalRolls}**`, inline: true },
      { name: `🃏 Formules possédées`, value: `**${stats.totalAuras}**`, inline: true },
    )
    .setFooter({ text: `Solde en temps réel via UnbelievaBoat` })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}
