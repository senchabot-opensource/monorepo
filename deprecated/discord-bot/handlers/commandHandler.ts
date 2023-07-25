import { readdirSync } from "fs";
import { IDiscordClient } from "../client";
import { join } from "path";

export default async (client: IDiscordClient) => {
  console.log("INITIALIZING COMMAND HANDLER");

  const commandsPath = join(__dirname, "../commands");
  const commandFiles = readdirSync(commandsPath);

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(filePath);

    if (command.default.data) {
      client.commands.set(command.default.data.name, command.default);
      console.log("[SUCCESS]", file, "command file loaded.");
    } else {
      console.log("[ERROR]", file, "command file is not loaded.");
      continue;
    }
  }

  console.log("COMMANDS ARE READY!\n");
};
