import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

export default async (client: Client) => {
  console.log("INITIALIZING EVENT HANDLER");

  const eventsPath = join(__dirname, "../events");
  const eventFiles = readdirSync(eventsPath);

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = await import(filePath);

    if (event.default) {
      if (event.default.once) {
        client.once(event.default.name, (...args: any[]) =>
          event.default.execute(...args),
        );
      } else {
        client.on(event.default.name, (...args: any[]) =>
          event.default.execute(...args, client),
        );
      }
      console.log("[SUCCESS]", file, "event file loaded.");
    } else {
      console.log("[ERROR]", file, "event file is not loaded.");
      continue;
    }
  }

  console.log("EVENTS ARE READY!");
};
