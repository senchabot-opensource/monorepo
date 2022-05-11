require("dotenv").config();

const path = require("node:path");
const { Client, Collection } = require("discord.js");

const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    // "GUILD_SCHEDULED_EVENTS",
    // "GUILD_INVITES",
    // "GUILD_PRESENCES",
    // "GUILD_VOICE_STATES",
    "GUILD_MESSAGES",
    // "GUILD_MESSAGE_REACTIONS",
    // "GUILD_MESSAGE_TYPING",
    // "DIRECT_MESSAGES",
    // "DIRECT_MESSAGE_REACTIONS",
    // "DIRECT_MESSAGE_TYPING",
  ],
  // partials: [
  //   "MESSAGE",
  //   "CHANNEL", // Required to receive DMs
  //   "REACTION", // Required to receive Reactions
  // ],
});

client.commands = new Collection();

const handlersPath = path.join(__dirname, "handlers");
["commandHandler", "eventHandler"].forEach((handlerFile) => {
  const filePath = path.join(handlersPath, handlerFile);
  require(filePath)(client);
});

client.login(process.env.TOKEN);
