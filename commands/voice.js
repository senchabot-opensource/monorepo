const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits, ChannelType } = require("discord-api-types/v10");
const { checkBotPermission } = require("../utils/botFunctions");
const { dynamicVoice } = require("../utils/dynamicVoice");

const CHANNEL_NAME_OPTION = "channel-name";

const manageChannelsPermFlag = PermissionFlagsBits.ManageChannels;

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
    const guild = interaction.guild;

    if (!checkBotPermission(guild, manageChannelsPermFlag)) {
      console.log('BOT DOES NOT HAVE "MANAGE CHANNELS" PERMISSION.');
      return;
    }

    const userId = interaction.user.id;

    if (dynamicVoice.userHasChannels(userId)) {
      interaction.reply({
        content: "You have already created a channel.",
        ephemeral: true,
      });
      return;
    }

    const channelName = interaction.options.getString(CHANNEL_NAME_OPTION);

    if (dynamicVoice.channelNameInUse(channelName)) {
      interaction.reply({
        content: "This channel name is already in use.",
        ephemeral: true,
      });
      return;
    }

    guild.channels
      .create({
        name: channelName,
        type: ChannelType.GuildVoice,
      })
      .then((channel) => {
        dynamicVoice.addChannel({
          channelId: channel.id,
          channelName: channelName,
          ownerId: userId,
        });

        interaction.reply({
          content: `You have created a dynamic voice channel called "${channelName}".`,
          ephemeral: true,
        });
      })
      .catch((e) => {
        interaction.reply({
          content: `There was an error while creating voice channel "${channelName}". Error: ${e}`,
          ephemeral: true,
        });
      });
  },
};
