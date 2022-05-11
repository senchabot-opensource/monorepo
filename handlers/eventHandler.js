const fs = require("node:fs"); // , readdir

module.exports = (client) => {
  console.log("INITIALIZING EVENT HANDLER");

  const eventFiles = fs
    .readdirSync("./events/")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);

    if (event) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      console.log("[SUCCESS]", file, "event file loaded.");
    } else {
      console.log("[ERROR]", file, "event file is not loaded.");
      continue;
    }
  }

  console.log("EVENTS ARE READY!");
};
