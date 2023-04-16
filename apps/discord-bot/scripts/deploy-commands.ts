import { readdirSync } from "fs";
import { join } from "path";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "../utils/env";

const TOKEN = env.TOKEN as string;
const CLIENTID = env.CLIENTID as string;
const GUILDID = env.GUILDID as string;

const commands: any[] = [];
const commandsPath = join(__dirname, "../commands");
const commandFiles = readdirSync(commandsPath);

(async () => {
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(filePath);
    commands.push(command.default.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  rest
    .put(Routes.applicationGuildCommands(CLIENTID, GUILDID), {
      body: commands,
    })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
})();
