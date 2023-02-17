import {
  ChannelType,
  GuildChannel,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { CatchClause } from "typescript";
import { dynamicVoice, IChannel } from "../utils/dynamicVoice";
import checkBotPermission from "../utils/botFunctions";

const CHANNEL_NAME_OPTION = "channel-name";

const manageChannelsPermFlag = PermissionFlagsBits.ManageChannels;

export default {
  data: new SlashCommandBuilder()
    .setName("voice")
    .setDescription("Create dynamic voice channels.")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName(CHANNEL_NAME_OPTION)
        .setDescription("A proper channel name")
        .setRequired(true)
    ),
  execute(interaction: any) {
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
      .then((channel: GuildChannel) => {
        const channelData: IChannel = {
          channelId: channel.id,
          channelName: channelName,
          ownerId: userId,
          createdAt: Date.now(),
        };
        dynamicVoice.addChannel(channelData);

        interaction.reply({
          content: `You have created a dynamic voice channel called "${channelName}".`,
          ephemeral: true,
        });
      })
      .catch((e: CatchClause) => {
        interaction.reply({
          content: `There was an error while creating voice channel "${channelName}". Error: ${e}`,
          ephemeral: true,
        });
      });
  },
};
