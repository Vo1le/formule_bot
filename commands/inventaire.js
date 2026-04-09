import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { getInventory, getStats } from "../utils/inventory.js";
import { RARITY_META } from "../data/auras.js";
import { getCurrencySymbol } from "../utils/unb.js";

const PAGE_SIZE = 10;

// Encodage court des raretés pour les customId (pas d'espaces ou accents)
export const RARITY_CODE = {
  "all":        "a",
  "Commun":     "c",
  "Peu Commun": "p",
  "Rare":       "r",
  "Épique":     "e",
  "Légendaire": "l",
  "Secret":     "s",
};
export const RARITY_DECODE = Object.fromEntries(Object.entries(RARITY_CODE).map(([k,v])=>[v,k]));

const RARITY_COLORS = {
  "Commun":0x9E9E9E,"Peu Commun":0x4CAF50,"Rare":0x2196F3,
  "Épique":0x9C27B0,"Légendaire":0xFFD700,"Secret":0xFF1744,
};

export const data = new SlashCommandBuilder()
  .setName("inventory")
  .setDescription("📚 Voir ton inventaire de formules")
  .addUserOption((o) => o.setName("joueur").setDescription("Voir l'inventaire d'un autre joueur").setRequired(false))
  .addStringOption((o) =>
    o.setName("rareté").setDescription("Filtrer par rareté").setRequired(false)
      .addChoices(
        { name: "Toutes",         value: "all" },
        { name: "⚪ Commun",     value: "Commun" },
        { name: "🟢 Peu Commun", value: "Peu Commun" },
        { name: "🔵 Rare",       value: "Rare" },
        { name: "🟣 Épique",     value: "Épique" },
        { name: "🟡 Légendaire", value: "Légendaire" },
        { name: "⚡ Secret",     value: "Secret" },
      )
  );

export async function execute(interaction) {
  const target  = interaction.options.getUser("joueur") || interaction.user;
  const rarityF = interaction.options.getString("rareté") || "all";
  const symbol  = await getCurrencySymbol();
  await interaction.reply(buildPayload(target, rarityF, 0, symbol));
}

// ── buildPayload : réutilisé par index.js pour la pagination ─────────
export function buildPayload(target, rarityFilter, page, symbol) {
  const inv   = getInventory(target.id);
  const stats = getStats(target.id);

  let auras = [...inv.auras].sort((a, b) => b.sellPrice - a.sellPrice);
  if (rarityFilter !== "all") auras = auras.filter((a) => a.rarity === rarityFilter);

  const total      = auras.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage   = Math.min(Math.max(0, page), totalPages - 1);
  const slice      = auras.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const raritySummary = Object.entries(RARITY_META)
    .map(([r, m]) => stats.byRarity[r] ? `${m.stars} **${stats.byRarity[r]}**` : null)
    .filter(Boolean).join("  ·  ");

  const totalValue = inv.auras.reduce((s, a) => s + a.sellPrice, 0);

  const listLines = slice.length
    ? slice.map((a, i) => {
        const n    = safePage * PAGE_SIZE + i + 1;
        const meta = RARITY_META[a.rarity] || RARITY_META["Commun"];
        return `\`${String(n).padStart(2, "0")}\`  ${a.emoji}  **${a.name}**  ${meta.stars}  \`${a.sellPrice.toLocaleString()} ${symbol}\``;
      }).join("\n")
    : "*Aucune formule dans ce filtre.*";

  const filterLabel = rarityFilter === "all" ? "Toutes raretés" : rarityFilter;
  const rc = RARITY_CODE[rarityFilter] ?? "a";

  const embed = new EmbedBuilder()
    .setColor(rarityFilter !== "all" ? (RARITY_COLORS[rarityFilter] ?? 0x5865F2) : 0x5865F2)
    .setAuthor({ name: `📚 ${target.displayName}`, iconURL: target.displayAvatarURL() })
    .setDescription([
      `🎲 **${inv.totalRolls}** rolls  ·  📐 **${inv.auras.length}** formules  ·  💰 **${totalValue.toLocaleString()}** ${symbol}`,
      raritySummary ? `\n${raritySummary}` : "",
      `\n**${filterLabel}**  ·  page ${safePage + 1} / ${totalPages}\n`,
      listLines,
    ].join("\n"))
    .setFooter({ text: "Utilise /vendre <numéro> pour revendre · /echanger pour trader" });

  // customId format : inv_DIRECTION_USERID_RARITYCODE_PAGE
  // Ex: inv_next_123456789_p_0  (Peu Commun, page 0)
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`inv_prev_${target.id}_${rc}_${safePage}`)
      .setEmoji("◀").setStyle(ButtonStyle.Secondary).setDisabled(safePage === 0),
    new ButtonBuilder()
      .setCustomId(`inv_next_${target.id}_${rc}_${safePage}`)
      .setEmoji("▶").setStyle(ButtonStyle.Secondary).setDisabled(safePage >= totalPages - 1),
  );

  return { embeds: [embed], components: [row] };
}
