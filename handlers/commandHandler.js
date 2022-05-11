const fs = require("node:fs");

module.exports = (client) => {
  console.log("INITIALIZING COMMAND HANDLER");

  const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);

    if (command.data) {
      client.commands.set(command.data.name, command);
      console.log("[SUCCESS]", file, "command file loaded.");
    } else {
      console.log("[ERROR]", file, "command file is not loaded.");
      continue;
    }
  }

  console.log("COMMANDS ARE READY!\n");
};
