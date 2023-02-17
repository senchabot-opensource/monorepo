import { readdirSync } from "fs";
import { IDiscordClient } from "../client";

export default (client: IDiscordClient) => {
  console.log("INITIALIZING COMMAND HANDLER");

  const commandFiles = readdirSync("./commands/").filter((file: any) =>
    file.endsWith(".ts")
  );

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);

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
