import {
  ChatInputCommandInteraction,
  Guild,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { checkMemberPermission } from "../utils/memberFunctions";
import {
  addAnnouncementChannel,
  findAnnouncementChannel,
} from "../db/functions";
import { announcementChannels } from "..";

const manageEventsPermFlag = PermissionFlagsBits.ManageEvents;

const purgeCommand = new SlashCommandSubcommandBuilder()
  .setName("purge")
  .setDescription("Purge scheduled guild events");

const addConfiguringAutoEventsCommand = new SlashCommandSubcommandBuilder()
  .setName("configuring_auto_events")
  .setDescription("Configuring Auto Scheduled Events")
  .addChannelOption((option: SlashCommandChannelOption) =>
    option
      .setName("announcement_channel")
      .setDescription(
        "Add an announcement channel to be monitored to create Discord scheduled events",
      )
      .setRequired(true),
  );

export default {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Manage guild events")
    .addSubcommand(addConfiguringAutoEventsCommand)
    .addSubcommand(purgeCommand)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;

    switch (interaction.options.getSubcommand()) {
      case "configuring_auto_events":
        const announcementChannel = interaction.options.getChannel(
          "announcement_channel",
        );
        if (!announcementChannel) return;

        const channel = await guild.channels.fetch(announcementChannel.id);
        if (!channel) return;

        if (channel.type != 0 && channel.type != 5) {
          await interaction.reply({
            content: "The channel must be a text or announcement channel.",
            ephemeral: true,
          });
          return;
        }

        const foundChannel = await findAnnouncementChannel({
          serverId: channel.guildId,
          channelId: channel.id,
        });
        if (foundChannel) {
          await interaction.reply({
            content: "This channel is already added",
            ephemeral: true,
          });
          return;
        }

        addAnnouncementChannel({
          serverId: channel.guildId,
          channelId: channel.id,
          createdBy: interaction.user.username,
        });

        announcementChannels.push(channel.id);

        await interaction.reply({
          content: "The channel added.",
          ephemeral: true,
        });
        break;
      case "purge":
        const events = await guild.scheduledEvents.fetch();
        events?.forEach(event => event.delete());

        await interaction.reply({
          content: "All scheduled events deleted.",
          ephemeral: true,
        });
        break;
    }
  },
};
