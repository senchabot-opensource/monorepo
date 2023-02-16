import dotenv from "dotenv";
dotenv.config();

const path = require("node:path");
const { Client, Collection, Partials } = require("discord.js");
const { GatewayIntentBits } = require("discord-api-types/v10");

const client = new Client({
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

client.commands = new Collection();

const handlersPath = path.join(__dirname, "handlers");
["commandHandler", "eventHandler"].forEach((handlerFile) => {
  const filePath = path.join(handlersPath, handlerFile);
  require(filePath)(client);
});

client.login(process.env.TOKEN);
