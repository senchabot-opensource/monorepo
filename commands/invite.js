const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Senchabot invite url."),
  execute(interaction) {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENTID}&permissions=302058496&scope=bot%20applications.commands`;

    interaction.reply({ content: url, ephemeral: true });
  },
};
