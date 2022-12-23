const { SlashCommandBuilder } = require("@discordjs/builders");

const CHANNEL_NAME_OPTION = "channel-name";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voice")
    .setDescription("Create dynamic voice channels.")
    .addStringOption((option) =>
      option
        .setName(CHANNEL_NAME_OPTION)
        .setDescription("A proper channel name")
        .setRequired(true)
    ),
  execute(interaction) {
    const channelName = interaction.options.getString(CHANNEL_NAME_OPTION);

    interaction.reply({
      content: `Channel name: ${channelName}`,
      ephemeral: true,
    });
  },
};
