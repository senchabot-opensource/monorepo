import { GatewayIntentBits, Partials } from "discord.js";
import { join } from "path";
import { readdirSync } from "fs";

import DiscordClient from "./client";
import { env } from "./utils/env";
import { checkScheduledEvents } from "./utils/scheduledEventFunctions";
import { getAnnouncementChannels } from "./db/functions";

const client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildScheduledEvents,
    // GatewayIntentBits.GuildInvites,
    // GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    // GatewayIntentBits.GuildMessageTyping,
    // GatewayIntentBits.DirectMessages,
    // GatewayIntentBits.DirectMessageReactions,
    // GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Message,
    //   Partials.Channel, // Required to receive DMs
    Partials.Reaction, // Required to receive Reactions
  ],
});

const handlersPath = join(__dirname, "handlers");
const handlerFiles = readdirSync(handlersPath);
handlerFiles.forEach((handlerFile: any) => {
  const filePath = join(handlersPath, handlerFile);
  import(filePath).then(handler => handler.default(client));
});

// Init Scheduled Event Announcement Channels
export const announcementChannels: string[] = [];

const channels = getAnnouncementChannels();
channels.then(chs =>
  chs.forEach(channel => announcementChannels.push(channel.channelId)),
);

checkScheduledEvents(client.guilds);

client.login(env.TOKEN);
