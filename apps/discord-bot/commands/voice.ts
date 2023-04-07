import {
  ChannelType,
  ChatInputCommandInteraction,
  Guild,
  GuildChannel,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { CatchClause } from "typescript";
import { dynamicVoice, IChannel } from "../utils/dynamicVoice";
import checkBotPermission from "../utils/botFunctions";
import { selectByIdCallback } from "../utils/helpers";
import { env } from "../utils/env";

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
  execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;

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

    const channelName = interaction.options.getString(
      CHANNEL_NAME_OPTION
    ) as string;

    if (dynamicVoice.channelNameInUse(channelName)) {
      interaction.reply({
        content: "This channel name is already in use.",
        ephemeral: true,
      });
      return;
    }

    const dynamicVoiceChannelCategoryCh = guild.channels.cache.find(
      selectByIdCallback(env.DYNAMIC_VOICE_CATEGORY_ID)
    );

    if (!dynamicVoiceChannelCategoryCh) {
      interaction.reply({
        content: `Dynamic voice channels' category not found.`,
        ephemeral: true,
      });
      return;
    }

    guild.channels
      .create({
        name: channelName,
        type: ChannelType.GuildVoice,
        parent: dynamicVoiceChannelCategoryCh.id,
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
        console.log(
          `There was an error while creating dynamic voice channel "${channelName}". Error: ${e}`
        );
        interaction.reply({
          content: `There was an error while creating dynamic voice channel "${channelName}".`,
          ephemeral: true,
        });
      });
  },
};
