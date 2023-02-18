import "dotenv/config";

import { GatewayIntentBits, Partials } from "discord.js";
import { join } from "path";
import { readdirSync } from "fs";

import DiscordClient from "./client";

const client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    // GatewayIntentBits.GuildScheduledEvents,
    // GatewayIntentBits.GuildInvites,
    // GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    // GatewayIntentBits.GuildMessageTyping,
    // GatewayIntentBits.DirectMessages,
    // GatewayIntentBits.DirectMessageReactions,
    // GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [
    Partials.Message,
    //   Partials.Channel, // Required to receive DMs
    Partials.Reaction, // Required to receive Reactions
  ],
});

const handlersPath = join(__dirname, "handlers");
const handlerFiles = readdirSync(handlersPath).filter((file) =>
  file.endsWith("Handler.ts")
);
handlerFiles.forEach((handlerFile: any) => {
  const filePath = join(handlersPath, handlerFile);
  import(filePath).then((handler) => handler.default(client));
});

client.login(process.env.TOKEN);
