import "dotenv/config";
import { REST, Routes } from "discord.js";
import * as cmdOuvrir     from "./commands/ouvrir.js";
import * as cmdInventaire from "./commands/inventaire.js";
import * as cmdVendre     from "./commands/vendre.js";
import * as cmdCoffres    from "./commands/coffres.js";
import * as cmdSolde      from "./commands/solde.js";
import * as cmdClassement from "./commands/classement.js";
import * as cmdEchanger   from "./commands/echanger.js";

const commands = [cmdOuvrir, cmdInventaire, cmdVendre, cmdCoffres, cmdSolde, cmdClassement, cmdEchanger]
  .map((c) => c.data.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
console.log(`📤 Enregistrement de ${commands.length} commandes…`);
try {
  const data = await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log(`✅ ${data.length} commandes enregistrées :`);
  commands.forEach((c) => console.log(`   /${c.name} — ${c.description}`));
} catch (err) {
  console.error("❌", err);
}
